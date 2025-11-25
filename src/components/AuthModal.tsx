/**
 * Auth Modal Component
 * 
 * Registration and login modal with Google OAuth and Email options
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, Chrome } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('AuthModal render - open:', open);
    if (open) {
      // Check if modal elements exist in DOM after a short delay
      setTimeout(() => {
        const overlay = document.querySelector('[data-slot="dialog-overlay"]');
        const content = document.querySelector('[data-slot="dialog-content"]');
        console.log('Modal DOM check:', {
          overlay: !!overlay,
          content: !!content,
          overlayVisible: overlay ? window.getComputedStyle(overlay as Element).display !== 'none' : false,
          contentVisible: content ? window.getComputedStyle(content as Element).display !== 'none' : false,
        });
      }, 100);
    }
  }, [open]);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = isLogin
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

      if (authError) {
        setError(authError.message);
      } else {
        onSuccess?.();
        onOpenChange(false);
        // Reset form
        setEmail('');
        setPassword('');
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // Note: Google OAuth redirects, so we don't close modal here
      // Don't set loading to false here since we're redirecting
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err?.message || 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  console.log('AuthModal rendering, open:', open);

  if (!open) {
    return null;
  }

  // Force render with explicit styles
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="sm:max-w-md overflow-hidden" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          onOpenChange(false);
        }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          display: 'grid',
          visibility: 'visible',
          opacity: 1,
          pointerEvents: 'auto',
          backgroundColor: 'white',
          padding: 0,
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '28rem',
          width: 'calc(100% - 2rem)',
          border: 'none'
        }}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back!' : 'Get Started'}
            </DialogTitle>
            <DialogDescription className="text-green-50 mt-2">
              {isLogin
                ? 'Sign in to download your processed files and access all features.'
                : 'Create a free account to get started with 200,000 tokens.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-5">
          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Chrome className="mr-2 h-5 w-5 text-blue-500" />
            Continue with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-500 font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-green-600 hover:text-green-700 font-semibold">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

