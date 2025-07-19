import React, { useState, useEffect } from 'react';
import { User, Settings, Shield, CreditCard, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || user.isGuest) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        setFormData({
          fullName: data.full_name || '',
          email: data.email || user.email,
          avatarUrl: data.avatar_url || '',
        });
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.isGuest) {
      toast.warning('Guest users cannot update profiles. Please sign up for an account.');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      
      // Update local profile state
      setProfile({
        ...profile,
        full_name: formData.fullName,
        avatar_url: formData.avatarUrl,
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  if (user?.isGuest) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <User className="h-16 w-16 text-gray-400 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Guest Account</h1>
            <p className="text-gray-600 mt-2">
              You're currently using LEGAL ORACLE as a guest ({user.role}).
            </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Limited Functionality</h2>
            <p className="text-blue-700">
              Guest accounts have limited functionality and your data won't be saved between sessions.
              Sign up for a full account to save your cases, strategies, and preferences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Create an Account
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
            <div className="flex items-center space-x-4 mb-8">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.full_name || 'User'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <a
                href="#profile"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700"
              >
                <User className="mr-3 h-5 w-5" />
                Profile Information
              </a>
              <a
                href="#subscription"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Subscription
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {profile?.subscription_tier || 'Free'}
                </span>
              </a>
              <a
                href="#notifications"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </a>
              <a
                href="#security"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Shield className="mr-3 h-5 w-5" />
                Security
              </a>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log Out
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">API Credits</div>
                <div className="text-sm font-medium text-gray-900">{profile?.api_credits || 0}</div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((profile?.api_credits || 0) / 100) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:w-2/3 p-6">
            <div id="profile" className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed. Contact support for assistance.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      id="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a URL to an image for your profile picture
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div id="subscription" className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      Current Plan: {profile?.subscription_tier || 'Free'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {profile?.subscription_tier === 'premium' 
                        ? 'Premium features with unlimited predictions' 
                        : 'Basic features with limited predictions'}
                    </p>
                  </div>
                  {profile?.subscription_tier !== 'premium' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Free</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Basic case outcome predictions
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Limited strategy optimizations
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      10 API credits per month
                    </li>
                  </ul>
                </div>
                
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Premium</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Advanced case outcome predictions
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited strategy optimizations
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited API credits
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="security" className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <button className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    Change Password
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    Account Settings
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}