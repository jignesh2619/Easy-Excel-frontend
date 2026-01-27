import React from "react";
import { Users, FileCheck, Zap, Shield, Star, TrendingUp } from "lucide-react";

export function SocialProofSection() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users", color: "from-blue-500 to-blue-600" },
    { icon: FileCheck, value: "50,000+", label: "Files Processed", color: "from-green-500 to-green-600" },
    { icon: Zap, value: "99.9%", label: "Uptime", color: "from-yellow-500 to-yellow-600" },
    { icon: TrendingUp, value: "4.8/5", label: "User Rating", color: "from-purple-500 to-purple-600" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Data Analyst",
      company: "TechCorp",
      content: "LazyExcel saved me 10+ hours per week. The AI understands exactly what I need!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Business Manager",
      company: "StartupXYZ",
      content: "From messy spreadsheets to beautiful dashboards in minutes. Game changer!",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Financial Analyst",
      company: "FinancePro",
      content: "The best Excel tool I've used. Clean, fast, and incredibly intuitive.",
      rating: 5,
      avatar: "EJ"
    }
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure & Encrypted" },
    { icon: Zap, text: "No Credit Card Required" },
    { icon: FileCheck, text: "Free Trial Available" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-smooth text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[#00A878] hover:shadow-md transition-smooth animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <badge.icon className="w-5 h-5 text-[#00A878]" />
              <span className="text-sm font-medium text-gray-700">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Loved by <span className="text-[#00A878]">Thousands</span> of Users
            </h2>
            <p className="text-gray-600">See what our users are saying</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:scale-105 transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00A878] to-[#00c98c] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
