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
        setLoading(false);
      } else {
        // Wait a bit for backend user to sync before closing modal
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSuccess?.();
        onOpenChange(false);
        // Reset form
        setEmail('');
        setPassword('');
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
        className="sm:max-w-md overflow-hidden border-0 p-0 bg-transparent" 
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
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          padding: 0,
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 168, 120, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          maxWidth: '28rem',
          width: 'calc(100% - 2rem)',
        }}
      >
        {/* Glass Effect Container - Full Glass Design */}
        <div className="relative w-full h-full">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00A878]/20 via-[#00b887]/15 to-[#00c98c]/20 rounded-[24px] opacity-60" />
          
          {/* Decorative glass orbs for visual interest */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00A878]/30 rounded-full -ml-12 -mb-12 blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#00c98c]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          
          {/* Glass content wrapper */}
          <div className="relative backdrop-blur-xl bg-white/10 rounded-[24px] w-full">
            {/* Header Section - Fully Glass */}
            <div className="relative px-6 pt-8 pb-6 overflow-hidden rounded-t-[24px] bg-white/5 backdrop-blur-sm">
              <DialogHeader className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                  <DialogTitle className="text-3xl font-bold text-white drop-shadow-lg">
                    {isLogin ? 'Welcome Back!' : 'Get Started'}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-white/90 mt-2 text-base leading-relaxed text-center font-medium">
                  {isLogin
                    ? 'Sign in to download your processed files and access all features.'
                    : 'Create a free account and get 200,000 tokens to start processing your Excel files instantly.'}
                </DialogDescription>
                
                {!isLogin && (
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/95">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">200K Free Tokens</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Secure & Private</span>
                    </div>
                  </div>
                )}
              </DialogHeader>
            </div>

            {/* Form Section - Fully Glass */}
            <div className="px-6 pb-6 pt-6 space-y-5 bg-white/5 backdrop-blur-sm">
          {/* Glass Effect Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-300 font-semibold text-white shadow-lg hover:shadow-xl group"
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <Chrome className="mr-3 h-5 w-5 text-white group-hover:scale-110 transition-transform drop-shadow-sm" />
            Continue with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 font-medium border border-white/20">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Glass Effect Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5 bg-white/15 backdrop-blur-md p-5 rounded-xl border border-white/30 shadow-lg" style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <Mail className="h-4 w-4 text-white" />
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
                className="h-12 bg-white/30 backdrop-blur-sm border-2 border-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/30 transition-all duration-200 text-base text-white placeholder:text-white/60"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <Shield className="h-4 w-4 text-white" />
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
                className="h-12 bg-white/30 backdrop-blur-sm border-2 border-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/30 transition-all duration-200 text-base text-white placeholder:text-white/60"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
              {!isLogin && (
                <p className="text-xs text-white/70 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-500/30 backdrop-blur-sm border-red-400/50 text-white" style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}>
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#00A878] via-[#00b887] to-[#00c98c] hover:from-[#008c67] hover:via-[#00A878] hover:to-[#00b887] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-white/20" 
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

          {/* Glass Effect Toggle Login/Signup */}
          <div className="text-center pt-3 pb-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-white/90 hover:text-white font-medium transition-colors duration-200 group"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-white font-bold underline decoration-2 underline-offset-2 group-hover:decoration-[#00c98c] transition-all drop-shadow-sm">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

