import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, TrendingUp, Award, BarChart3, Sparkles } from 'lucide-react';

export function TokenDashboard() {
  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const { user, backendUser } = useAuth();

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
      id="token-dashboard" 
      className="py-16 mb-12 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getPlanColor(plan)} px-8 py-8 text-white relative overflow-hidden`}>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  {getPlanIcon(plan)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Token Usage Dashboard
                  </h2>
                  <p className="text-white/90 mt-2 text-lg">Monitor your AI processing credits in real-time</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">Current Plan</div>
                <div className="text-4xl font-bold drop-shadow-lg">{plan}</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {/* Tokens Remaining */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                  Available
                </span>
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {formatNumber(remaining)}
              </div>
              <div className="text-sm text-gray-600 font-medium">tokens remaining</div>
            </div>

            {/* Tokens Used */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  Used
                </span>
              </div>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {formatNumber(used)}
              </div>
              <div className="text-sm text-gray-600 font-medium">of {formatNumber(limit)} tokens</div>
            </div>

            {/* Usage Percentage */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  percent < 50 ? 'bg-green-100' : percent < 80 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <TrendingUp className={`h-6 w-6 ${
                    percent < 50 ? 'text-green-600' : percent < 80 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide ${
                  percent < 50 ? 'text-green-700' : percent < 80 ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  Usage
                </span>
              </div>
              <div className={`text-5xl font-bold mb-2 ${
                percent < 50 
                  ? 'text-green-600' 
                  : percent < 80 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                {percent}%
              </div>
              <div className="text-sm text-gray-600 font-medium">of plan limit</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 pb-8">
            <div className="bg-gray-100 rounded-full h-10 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full ${
                  percent < 50 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : percent < 80 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ 
                  width: `${percent}%`
                }}
              />
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

          {/* Plan Info */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <Award className="h-6 w-6 text-[#00A878]" />
                <span>Plan Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
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
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
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

