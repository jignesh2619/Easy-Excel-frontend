import React from "react";
import { ArrowRight } from "lucide-react";

export function BeforeAfterSection() {
  const beforePoints = [
    "8+ Hours Per Report",
    "Overwhelming Data",
    "Basic Excel Skills",
    "Fear of Looking Incompetent",
    "Stuck in Entry-Level Tasks"
  ];

  const afterPoints = [
    "60 Minutes Per Report",
    "Clean, Professional Output",
    "Advanced Excel + AI Skills",
    "Confidence in Any Meeting",
    "Recognition as the 'Excel Expert'"
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#00A878]/5 to-white relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover How to Build <span className="text-[#00A878]">Excel Dashboards</span> Like This In Minutes!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the transformation from manual work to AI-powered efficiency
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="relative mb-12">
          <div className="grid md:grid-cols-2 gap-4 lg:gap-8 items-center">
            {/* BEFORE Section */}
            <div className="animate-slide-in-left">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-300 shadow-lg hover:shadow-xl transition-smooth relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="inline-block px-4 py-2 bg-red-100 border-2 border-red-300 rounded-lg mb-4">
                      <span className="text-red-700 font-bold text-lg">BEFORE</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-inner mb-4">
                      <img 
                        src="/before.png" 
                        alt="Before: Manual Excel dashboard creation"
                        className="w-full h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Manual Dashboard Creation</h3>
                    {beforePoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-red-500 mt-1 font-bold text-lg">✗</span>
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Arrow - Desktop */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="relative">
                {/* Arrow with animation */}
                <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <ArrowRight 
                    className="w-16 h-16 lg:w-20 lg:h-20 text-[#00A878] animate-arrow-slide drop-shadow-lg"
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-[#00A878] rounded-full blur-2xl opacity-40 animate-pulse"></div>
                </div>
                {/* Moving particles effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-3 bg-[#00A878] rounded-full animate-arrow-particle-1 shadow-lg"></div>
                  <div className="w-3 h-3 bg-[#00c98c] rounded-full animate-arrow-particle-2 shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* AFTER Section */}
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-[#00A878]/10 via-white to-[#00c98c]/10 rounded-2xl p-6 sm:p-8 border-2 border-[#00A878] shadow-xl hover:shadow-2xl transition-smooth relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#00A878] to-[#00c98c] border-2 border-[#00A878] rounded-lg mb-4 shadow-md">
                      <span className="text-white font-bold text-lg">AFTER</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#00A878]/20 shadow-inner mb-4">
                      <img 
                        src="/after.png" 
                        alt="After: AI-powered Excel dashboard"
                        className="w-full h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Dashboard Building</h3>
                    {afterPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 animate-fade-in-up"
                        style={{ animationDelay: `${(index + beforePoints.length) * 0.1}s` }}
                      >
                        <span className="text-[#00A878] mt-1 font-bold text-lg">✓</span>
                        <span className="text-gray-700 font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center justify-center my-6 animate-fade-in">
            <ArrowRight className="w-12 h-12 text-[#00A878] rotate-90 animate-arrow-slide-vertical drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
