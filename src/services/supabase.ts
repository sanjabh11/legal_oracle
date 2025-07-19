import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.error('You can get these from your Supabase project settings > API');
}

// Validate URL format to prevent construction errors
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Check for placeholder values
if (supabaseUrl === 'https://your-project-ref.supabase.co' || 
    supabaseAnonKey === 'your-anon-key') {
  console.warn('⚠️ Using placeholder Supabase credentials. Please update your .env file with actual values.');
}

// Validate URL format
if (!isValidUrl(supabaseUrl)) {
  console.error(`Invalid Supabase URL format: ${supabaseUrl}`);
  console.error('URL must be in format: https://your-project-ref.supabase.co');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};