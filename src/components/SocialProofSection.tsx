import React from "react";
import { Users, FileCheck, Zap, Shield, TrendingUp } from "lucide-react";

export function SocialProofSection() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users", color: "from-blue-500 to-blue-600" },
    { icon: FileCheck, value: "50,000+", label: "Files Processed", color: "from-green-500 to-green-600" },
    { icon: Zap, value: "99.9%", label: "Uptime", color: "from-yellow-500 to-yellow-600" },
    { icon: TrendingUp, value: "4.8/5", label: "User Rating", color: "from-purple-500 to-purple-600" },
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure & Encrypted" },
    { icon: Zap, text: "No Credit Card Required" },
    { icon: FileCheck, text: "Free Trial Available" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Statistics - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200 text-center animate-fade-in-up hover:shadow-md transition-smooth"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges - Compact */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 hover:border-[#00A878] transition-smooth animate-fade-in text-xs"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <badge.icon className="w-4 h-4 text-[#00A878]" />
              <span className="font-medium text-gray-700">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
