/**
 * Auth Context
 * 
 * Manages user authentication state using Supabase Auth
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../services/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  backendUser: BackendUser | null;
  refreshBackendUser: () => Promise<void>;
}

interface BackendUser {
  user_id: string;
  email: string;
  plan: string;
  tokens_used?: number;
  tokens_limit?: number;
  subscription_status?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    // Suppress browser extension errors in console (non-critical)
    const originalError = console.error;
    const filteredConsoleError = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || '';
      // Filter out browser extension polyfill errors
      if (errorMessage.includes('browserPolyfill') || 
          errorMessage.includes('Failed to fetch latest config') ||
          errorMessage.includes('queryFn @ browserPolyfill')) {
        return; // Suppress these non-critical errors
      }
      originalError.apply(console, args);
    };
    console.error = filteredConsoleError;
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - continuing anyway');
        setLoading(false);
        setSupabaseReady(true);
      }
    }, 3000); // 3 second timeout
    
    // Get initial session with timeout
    const initAuth = async () => {
      try {
        // Check if Supabase URL is valid
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
          console.warn('Supabase not configured - auth features disabled');
          setLoading(false);
          setSupabaseReady(false);
          return;
        }
        
        // Get session with error handling
        let session: Session | null = null;
        let error: any = null;
        
        try {
          const sessionResult = await supabase.auth.getSession();
          session = sessionResult.data?.session ?? null;
          error = sessionResult.error ?? null;
        } catch (err: any) {
          // If Supabase is not configured or times out, continue without session
          console.warn('Session check failed (non-critical):', err?.message || err);
          error = err;
          session = null;
        }
        
        if (!mounted) return;
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          setSupabaseReady(true); // Mark as ready even on error
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setSupabaseReady(true);
        
        if (session?.user) {
          // Don't await - let it run in background
          syncBackendUser(session).catch(err => {
            console.error('Error syncing backend user:', err);
          });
        }
        
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        clearTimeout(timeoutId);
        console.error('Failed to get session:', err);
        setLoading(false);
        setSupabaseReady(true); // Mark as ready even on error
      }
    };
    
    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await syncBackendUser(session);
      } else {
        setBackendUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
      // Restore original console.error
      console.error = originalError;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync user with backend
  const syncBackendUser = async (session: Session) => {
    try {
      if (!session?.access_token || !session.user) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/supabase-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: session.access_token,
          user_id: session.user.id,
          email: session.user.email || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBackendUser(data.user);
      }
    } catch (error) {
      console.error('Failed to sync backend user:', error);
    }
  };

  const refreshBackendUser = async () => {
    if (session) {
      await syncBackendUser(session);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setBackendUser(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    backendUser,
    refreshBackendUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

