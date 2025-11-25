/// <reference types="vite/client" />

/**
 * Supabase Client
 * 
 * Initialize Supabase client for authentication
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  console.error('Current values:', { 
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING', 
    key: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING' 
  });
}

// Only create client if we have valid credentials
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

