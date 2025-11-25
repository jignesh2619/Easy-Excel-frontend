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
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection("home")}
              className="text-2xl bg-gradient-to-r from-[#00A878] to-[#00c98c] bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
            >
              EasyExcel
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

            {/* CTA + Auth */}
            <div className="flex items-center gap-3">
              {tokens && (
                <div className="hidden sm:flex flex-col gap-1 px-4 py-2 rounded-xl border border-[#00A878]/30 shadow-sm bg-white/90">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      {tokens.plan}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00A878]/10 text-[#007a5d] font-semibold">
                      {tokens.percent}% used
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      {formatNumber(tokens.remaining)} left
                    </span>
                    <span className="text-xs text-gray-500">
                      of {formatNumber(tokens.limit)} tokens
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00A878] to-[#00c98c]"
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