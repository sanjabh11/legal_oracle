import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '../services/supabase';
import { toast } from 'react-toastify';

interface User {
  id: string;
  email: string;
  role: 'individual' | 'lawyer' | 'business' | 'judge' | 'researcher' | 'scholar';
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginAsGuest: (role: User['role']) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // User is logged in with Supabase
          const currentUser = await getCurrentUser();
          
          if (currentUser) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              role: 'individual', // Default role, could be fetched from user metadata
              isGuest: false,
            });
          }
        } else {
          // Check for guest user in localStorage
          const savedUser = localStorage.getItem('legal_oracle_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await getCurrentUser();
          
          if (currentUser) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              role: 'individual', // Default role, could be fetched from user metadata
              isGuest: false,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully! Please check your email for verification.');
      
      // User data should be set by the auth state change listener
      // But we can also set it here for immediate feedback
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: 'individual', // Default role
          isGuest: false,
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Logged in successfully!');
      
      // User data should be set by the auth state change listener
      // But we can also set it here for immediate feedback
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: 'individual', // Default role
          isGuest: false,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Failed to log in';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = (role: User['role']) => {
    setIsLoading(true);
    try {
      const guestUser = {
        id: `guest_${Date.now()}`,
        email: `guest@legal-oracle.ai`,
        role,
        isGuest: true,
      };
      
      localStorage.setItem('legal_oracle_user', JSON.stringify(guestUser));
      setUser(guestUser);
      toast.success(`Logged in as guest (${role})`);
    } catch (error) {
      console.error('Guest login error:', error);
      toast.error('Failed to log in as guest');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Check if user is a guest
      if (user?.isGuest) {
        // Just remove from localStorage
        localStorage.removeItem('legal_oracle_user');
        setUser(null);
        toast.success('Logged out successfully');
      } else {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        setUser(null);
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      const message = error instanceof Error ? error.message : 'Failed to log out';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      loginAsGuest,
      logout,
      isAuthenticated: !!user,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}