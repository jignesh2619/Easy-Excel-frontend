import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle2, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export function WelcomePopup({ open, onClose, onGoToDashboard }: WelcomePopupProps) {
  useEffect(() => {
    if (open) {
      // Auto-close after 5 seconds if user doesn't interact
      const timer = setTimeout(() => {
        onGoToDashboard();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, onGoToDashboard]);

  const handleGoToDashboard = () => {
    onClose();
    onGoToDashboard();
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal={true}>
      <DialogContent
        className="sm:max-w-md overflow-hidden p-0 border-0"
        onInteractOutside={(e) => e.preventDefault()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          display: 'grid',
          visibility: 'visible',
          opacity: 1,
          pointerEvents: 'auto',
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '32rem',
          width: 'calc(100% - 2rem)',
        }}
      >
        {/* Animated Gradient Header */}
        <div className="relative bg-gradient-to-br from-[#00A878] via-[#00b887] to-[#00c98c] px-8 pt-8 pb-6 overflow-hidden">
          {/* Decorative animated elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm animate-bounce">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <Sparkles className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <DialogTitle className="text-3xl font-bold text-white text-center drop-shadow-lg">
              Welcome to EasyExcel!
            </DialogTitle>
            <DialogDescription className="text-green-50/95 mt-3 text-center text-lg">
              Your Free Plan is now active
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <Zap className="h-6 w-6 text-[#00A878] flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="font-bold text-gray-900 mb-1">200,000 Free Tokens</div>
                <div className="text-sm text-gray-600">Start processing your Excel files right away!</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-[#00A878]" />
                <span>Unlimited Prompts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-[#00A878]" />
                <span>File Cleaning</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-[#00A878]" />
                <span>Visualizations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-[#00A878]" />
                <span>Dashboards</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleGoToDashboard}
            className="w-full h-12 bg-gradient-to-r from-[#00A878] via-[#00b887] to-[#00c98c] hover:from-[#008c67] hover:via-[#00A878] hover:to-[#00b887] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View My Dashboard</span>
            <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
          </Button>

          {/* Skip option */}
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-[#00A878] transition-colors font-medium"
          >
            I'll explore later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


