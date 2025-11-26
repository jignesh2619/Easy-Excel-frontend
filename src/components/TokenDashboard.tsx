import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, TrendingUp, Award, BarChart3, Sparkles } from 'lucide-react';

export function TokenDashboard() {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const { user, backendUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedRemaining, setAnimatedRemaining] = useState(0);
  const [animatedUsed, setAnimatedUsed] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Animate numbers when visible
  useEffect(() => {
    // Only animate if user is logged in and visible
    if (!user || !backendUser || !isVisible) return;
    
    const plan = backendUser.plan ?? 'Free';
    const limit = backendUser.tokens_limit ?? 200000;
    const used = backendUser.tokens_used ?? 0;
    const remaining = Math.max(limit - used, 0);
    const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
    
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
  }, [isVisible, user, backendUser]);

  // Only show for logged-in users - MUST BE AFTER ALL HOOKS
  if (!user || !backendUser) {
    return null;
  }

  const plan = backendUser.plan ?? 'Free';
  const limit = backendUser.tokens_limit ?? 200000;
  const used = backendUser.tokens_used ?? 0;
  const remaining = Math.max(limit - used, 0);
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

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
      className={`py-16 mb-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}>
          {/* Animated Header */}
          <div className={`bg-gradient-to-r ${getPlanColor(plan)} px-8 py-8 text-white relative overflow-hidden`}>
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 bg-white/20 rounded-xl backdrop-blur-sm transform transition-all duration-500 hover:scale-110 hover:rotate-12 relative ${
                  isVisible ? 'animate-bounce' : ''
                }`} style={{ animationDuration: '2s' }}>
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping opacity-50"></div>
                  <div className="relative z-10">{getPlanIcon(plan)}</div>
                </div>
                <div className={`transform transition-all duration-700 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                }`}>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 animate-spin" style={{ animationDuration: '3s' }} />
                    Token Usage Dashboard
                  </h2>
                  <p className="text-white/90 mt-2 text-lg">Monitor your AI processing credits in real-time</p>
                </div>
              </div>
              <div className={`text-right transform transition-all duration-700 hover:scale-110 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
              }`} style={{ transitionDelay: '0.2s' }}>
                <div className="text-sm opacity-90 mb-1 animate-fade-in">Current Plan</div>
                <div className="text-4xl font-bold drop-shadow-lg transform transition-all duration-300 hover:scale-110">{plan}</div>
              </div>
            </div>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {/* Tokens Remaining - Animated */}
            <div className={`relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg transform transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-3'
            }`}
            style={{ transitionDelay: '100ms' }}>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl transform transition-all duration-500 hover:rotate-180 hover:scale-125 relative">
                  <div className="absolute inset-0 bg-green-400/30 rounded-xl animate-ping opacity-75"></div>
                  <Zap className="h-6 w-6 text-green-600 relative z-10 animate-pulse" style={{ animationDuration: '2s' }} />
                </div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide animate-fade-in">
                  Available
                </span>
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2 transform transition-all duration-300 hover:scale-110" style={{
                textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                animation: isVisible ? 'numberPop 0.5s ease-out' : 'none'
              }}>
                {formatNumber(animatedRemaining)}
              </div>
              <div className="text-sm text-gray-600 font-medium animate-fade-in">tokens remaining</div>
            </div>

            {/* Tokens Used - Animated */}
            <div className={`relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg transform transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 -rotate-3'
            }`}
            style={{ transitionDelay: '200ms' }}>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl transform transition-all duration-500 hover:rotate-180 hover:scale-125 relative">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-xl animate-ping opacity-75" style={{ animationDelay: '0.3s' }}></div>
                  <BarChart3 className="h-6 w-6 text-blue-600 relative z-10 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
                </div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide animate-fade-in">
                  Used
                </span>
              </div>
              <div className="text-5xl font-bold text-blue-600 mb-2 transform transition-all duration-300 hover:scale-110" style={{
                textShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
                animation: isVisible ? 'numberPop 0.5s ease-out 0.2s both' : 'none'
              }}>
                {formatNumber(animatedUsed)}
              </div>
              <div className="text-sm text-gray-600 font-medium animate-fade-in">of {formatNumber(limit)} tokens</div>
            </div>

            {/* Usage Percentage - Animated */}
            <div className={`relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg transform transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-3'
            }`}
            style={{ transitionDelay: '300ms' }}>
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 ${
                percent < 50 
                  ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20' 
                  : percent < 80 
                  ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20' 
                  : 'bg-gradient-to-r from-red-400/20 to-pink-400/20'
              }`}></div>
              
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl transform transition-all duration-500 hover:rotate-180 hover:scale-125 relative ${
                  percent < 50 ? 'bg-green-100' : percent < 80 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <div className={`absolute inset-0 rounded-xl animate-ping opacity-75 ${
                    percent < 50 ? 'bg-green-400/30' : percent < 80 ? 'bg-yellow-400/30' : 'bg-red-400/30'
                  }`} style={{ animationDelay: '0.6s' }}></div>
                  <TrendingUp className={`h-6 w-6 relative z-10 animate-pulse ${
                    percent < 50 ? 'text-green-600' : percent < 80 ? 'text-yellow-600' : 'text-red-600'
                  }`} style={{ animationDelay: '1s', animationDuration: '2s' }} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide animate-fade-in ${
                  percent < 50 ? 'text-green-700' : percent < 80 ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  Usage
                </span>
              </div>
              <div className={`text-5xl font-bold mb-2 transform transition-all duration-300 hover:scale-110 ${
                percent < 50 
                  ? 'text-green-600' 
                  : percent < 80 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}
              style={{
                textShadow: percent < 50 
                  ? '0 0 20px rgba(34, 197, 94, 0.3)' 
                  : percent < 80 
                  ? '0 0 20px rgba(234, 179, 8, 0.3)' 
                  : '0 0 20px rgba(239, 68, 68, 0.3)',
                animation: isVisible ? 'numberPop 0.5s ease-out 0.4s both' : 'none'
              }}>
                {animatedPercent}%
              </div>
              <div className="text-sm text-gray-600 font-medium animate-fade-in">of plan limit</div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className={`px-8 pb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '400ms' }}>
            <div className="bg-gray-100 rounded-full h-10 overflow-hidden shadow-inner relative">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              
              <div
                className={`h-full rounded-full transition-all duration-3000 ease-out relative overflow-hidden ${
                  percent < 50 
                    ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600' 
                    : percent < 80 
                    ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600' 
                    : 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600'
                }`}
                style={{ 
                  width: isVisible ? `${percent}%` : '0%',
                  boxShadow: `0 0 30px ${percent < 50 ? 'rgba(34, 197, 94, 0.6)' : percent < 80 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
                  animation: isVisible ? 'progressGlow 2s ease-in-out infinite' : 'none'
                }}
              >
                {/* Pulsing overlay */}
                <div className="h-full bg-white/30 animate-pulse" style={{ animationDuration: '1.5s' }}></div>
                
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    animation: 'shimmer 2s infinite',
                    backgroundSize: '200% 100%',
                    backgroundPosition: '200% 0'
                  }}
                ></div>
                
                {/* Floating particles */}
                {isVisible && (
                  <>
                    <div className="absolute top-1 left-[10%] w-1 h-1 bg-white rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                    <div className="absolute top-2 left-[30%] w-1.5 h-1.5 bg-white/80 rounded-full animate-float" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
                    <div className="absolute top-1 left-[50%] w-1 h-1 bg-white rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '3.5s' }}></div>
                    <div className="absolute top-2 left-[70%] w-1.5 h-1.5 bg-white/80 rounded-full animate-float" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}></div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium animate-fade-in">
              <span className="flex items-center gap-1 transform transition-all duration-300 hover:scale-110">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                0 tokens
              </span>
              <span className="flex items-center gap-1 transform transition-all duration-300 hover:scale-110">
                <div className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                {formatNumber(limit)} tokens
              </span>
            </div>
          </div>

          {/* Animated Plan Info */}
          <div className={`px-8 pb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '500ms' }}>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00A878]/5 via-transparent to-[#00c98c]/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg relative z-10">
                <div className="relative">
                  <Award className="h-6 w-6 text-[#00A878] animate-bounce relative z-10" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-0 bg-[#00A878]/30 rounded-full blur-md animate-ping"></div>
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-[#00A878] bg-clip-text text-transparent">
                  Plan Details
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-1">
                  <div className="p-2 bg-[#00A878]/10 rounded-lg transform transition-all duration-300 hover:rotate-12 hover:scale-110">
                    <svg className="w-5 h-5 text-[#00A878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Email</div>
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-1">
                  <div className="p-2 bg-[#00A878]/10 rounded-lg transform transition-all duration-300 hover:rotate-12 hover:scale-110">
                    <svg className="w-5 h-5 text-[#00A878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Status</div>
                    <span className={`text-sm font-bold transition-all duration-300 ${
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

