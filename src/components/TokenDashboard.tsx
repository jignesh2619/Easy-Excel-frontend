import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, TrendingUp, Award, BarChart3, Sparkles } from 'lucide-react';

export function TokenDashboard() {
  const { user, backendUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedRemaining, setAnimatedRemaining] = useState(0);
  const [animatedUsed, setAnimatedUsed] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Only show for logged-in users
  if (!user || !backendUser) {
    return null;
  }

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const plan = backendUser.plan ?? 'Free';
  const limit = backendUser.tokens_limit ?? 200000;
  const used = backendUser.tokens_used ?? 0;
  const remaining = Math.max(limit - used, 0);
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  // Animate numbers when visible
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const remainingStep = remaining / steps;
      const usedStep = used / steps;
      const percentStep = percent / steps;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setAnimatedRemaining(Math.round(remainingStep * currentStep));
          setAnimatedUsed(Math.round(usedStep * currentStep));
          setAnimatedPercent(Math.round(percentStep * currentStep));
        } else {
          setAnimatedRemaining(remaining);
          setAnimatedUsed(used);
          setAnimatedPercent(percent);
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [isVisible, remaining, used, percent]);

  const formatNumber = (value: number) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Pro':
        return 'from-purple-500 to-pink-500';
      case 'Starter':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-[#00A878] to-[#00c98c]';
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Pro':
        return <Award className="h-6 w-6" />;
      case 'Starter':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="token-dashboard" 
      className={`py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden transform transition-all duration-700 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}>
          {/* Animated Header */}
          <div className={`bg-gradient-to-r ${getPlanColor(plan)} px-8 py-8 text-white relative overflow-hidden`}>
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse delay-300"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 bg-white/20 rounded-xl backdrop-blur-sm transform transition-all duration-500 hover:scale-110 hover:rotate-12 ${
                  isVisible ? 'animate-bounce' : ''
                }`}>
                  {getPlanIcon(plan)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 animate-spin" style={{ animationDuration: '3s' }} />
                    Token Usage Dashboard
                  </h2>
                  <p className="text-white/90 mt-2 text-lg">Monitor your AI processing credits in real-time</p>
                </div>
              </div>
              <div className="text-right transform transition-all duration-500 hover:scale-105">
                <div className="text-sm opacity-90 mb-1">Current Plan</div>
                <div className="text-4xl font-bold drop-shadow-lg">{plan}</div>
              </div>
            </div>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {/* Tokens Remaining - Animated */}
            <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl transform transition-all duration-300 hover:rotate-12">
                  <Zap className="h-6 w-6 text-green-600 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                  Available
                </span>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatNumber(animatedRemaining)}
              </div>
              <div className="text-sm text-gray-600 font-medium">tokens remaining</div>
            </div>

            {/* Tokens Used - Animated */}
            <div className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl transform transition-all duration-300 hover:rotate-12">
                  <BarChart3 className="h-6 w-6 text-blue-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  Used
                </span>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {formatNumber(animatedUsed)}
              </div>
              <div className="text-sm text-gray-600 font-medium">of {formatNumber(limit)} tokens</div>
            </div>

            {/* Usage Percentage - Animated */}
            <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl transform transition-all duration-300 hover:rotate-12">
                  <TrendingUp className="h-6 w-6 text-purple-600 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${
                  percent < 50 ? 'text-green-700' : percent < 80 ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  Usage
                </span>
              </div>
              <div className={`text-5xl font-bold mb-2 ${
                percent < 50 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' 
                  : percent < 80 
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'
              }`}>
                {animatedPercent}%
              </div>
              <div className="text-sm text-gray-600 font-medium">of plan limit</div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className={`px-8 pb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}>
            <div className="bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner border-2 border-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-2000 ease-out relative ${
                  percent < 50 
                    ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600' 
                    : percent < 80 
                    ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600' 
                    : 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600'
                }`}
                style={{ 
                  width: isVisible ? `${percent}%` : '0%',
                  boxShadow: `0 0 20px ${percent < 50 ? 'rgba(34, 197, 94, 0.5)' : percent < 80 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                }}
              >
                <div className="h-full bg-white/30 animate-pulse"></div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'shimmer 2s infinite',
                    backgroundSize: '200% 100%',
                    backgroundPosition: '200% 0'
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                0 tokens
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00A878]"></div>
                {formatNumber(limit)} tokens
              </span>
            </div>
          </div>

          {/* Animated Plan Info */}
          <div className={`px-8 pb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '500ms' }}>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <Award className="h-6 w-6 text-[#00A878] animate-bounce" style={{ animationDuration: '2s' }} />
                Plan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#00A878] transition-colors">
                  <div className="p-2 bg-[#00A878]/10 rounded-lg">
                    <svg className="w-5 h-5 text-[#00A878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Email</div>
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#00A878] transition-colors">
                  <div className="p-2 bg-[#00A878]/10 rounded-lg">
                    <svg className="w-5 h-5 text-[#00A878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Status</div>
                    <span className={`text-sm font-bold ${
                      backendUser.subscription_status === 'active' 
                        ? 'text-green-600' 
                        : 'text-gray-600'
                    }`}>
                      {backendUser.subscription_status ?? 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

