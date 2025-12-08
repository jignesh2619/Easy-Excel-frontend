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
import { Loader2, Mail, Chrome, Sparkles, Shield, Zap } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

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
        {/* Enhanced Gradient Header with Icons */}
        <div className="relative bg-gradient-to-br from-[#00A878] via-[#00b887] to-[#00c98c] px-6 pt-8 pb-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <DialogHeader className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold text-white drop-shadow-sm">
                {isLogin ? 'Welcome Back!' : 'Get Started'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-green-50/90 mt-2 text-base leading-relaxed text-center">
              {isLogin
                ? 'Sign in to download your processed files and access all features.'
                : 'Create a free account and get 200,000 tokens to start processing your Excel files instantly.'}
            </DialogDescription>
            
            {!isLogin && (
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span>200K Free Tokens</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span>Secure & Private</span>
                </div>
              </div>
            )}
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-6 space-y-5 bg-gray-50/50">
          {/* Enhanced Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 border-gray-200 hover:border-[#00A878] hover:bg-[#00A878]/5 transition-all duration-300 font-semibold text-gray-700 hover:text-[#00A878] shadow-sm hover:shadow-md group"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Chrome className="mr-3 h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
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

          {/* Enhanced Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00A878]" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 border-2 border-gray-200 focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20 transition-all duration-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#00A878]" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="h-12 border-2 border-gray-200 focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20 transition-all duration-200 text-base"
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#00A878] via-[#00b887] to-[#00c98c] hover:from-[#008c67] hover:via-[#00A878] hover:to-[#00b887] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          {/* Enhanced Toggle Login/Signup */}
          <div className="text-center pt-3 pb-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-gray-600 hover:text-[#00A878] font-medium transition-colors duration-200 group"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-[#00A878] hover:text-[#008c67] font-bold underline decoration-2 underline-offset-2 group-hover:decoration-[#00c98c] transition-all">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

