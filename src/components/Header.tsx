import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

export function Header() {
  const { user, backendUser, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPlanLimit = (plan?: string) => {
    const limits: Record<string, number> = {
      Free: 200000,
      Starter: 2000000,
      Pro: 7000000,
    };
    return limits[plan ?? "Free"] ?? 200000;
  };

  const tokens = useMemo(() => {
    if (!user) return null;
    const plan = backendUser?.plan ?? "Free";
    const limit = backendUser?.tokens_limit ?? getPlanLimit(plan);
    const used = backendUser?.tokens_used ?? 0;
    const remaining = Math.max(limit - used, 0);
    const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
    return { limit, used, remaining, percent, plan };
  }, [backendUser, user]);

  const formatNumber = (value: number) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-6">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection("home")}
              className="hover:scale-110 transition-transform duration-300"
            >
              <img 
                src="/logo.jpg" 
                alt="LazyExcel" 
                className="h-10 w-auto"
              />
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection("home")}
                className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("prompt-tool")}
                className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
              >
                Prompt Tool
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
              >
                Contact
              </button>
            </nav>

            {/* Spacer to push CTA to the right */}
            <div className="flex-1"></div>

            {/* CTA + Auth */}
            <div className="flex items-center gap-3">
              {tokens && (
                <div className="hidden lg:flex flex-col gap-2 px-5 py-3 rounded-2xl border-2 border-[#00A878]/20 shadow-lg bg-gradient-to-br from-white to-[#00A878]/5 backdrop-blur-sm min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#00A878]/10 rounded-lg">
                        <svg className="w-4 h-4 text-[#00A878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00A878]">
                        {tokens.plan} Plan
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      tokens.percent < 50 
                        ? 'bg-green-100 text-green-700' 
                        : tokens.percent < 80 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {tokens.percent}% used
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatNumber(tokens.remaining)}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        tokens left
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(tokens.used)} / {formatNumber(tokens.limit)} used
                    </div>
                  </div>
                  
                  <div className="relative h-2.5 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        tokens.percent < 50 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : tokens.percent < 80 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${tokens.percent}%` }}
                    />
                  </div>
                </div>
              )}

              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-[#00A878] via-[#00b887] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-full px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/30"
                onClick={() => scrollToSection("prompt-tool")}
              >
                <span>Try for Free</span>
              </Button>

              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm text-gray-600">
                    Hi, {user.email?.split("@")[0] || "there"}
                  </span>
                  <Button
                    variant="outline"
                    className="border-[#00A878] text-[#00A878] hover:bg-[#00A878]/10 rounded-full px-4"
                    onClick={handleAuthClick}
                    disabled={loading}
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-[#00A878] text-[#00A878] hover:bg-[#00A878]/10 rounded-full px-4"
                  onClick={handleAuthClick}
                  disabled={loading}
                >
                  Sign in / Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}