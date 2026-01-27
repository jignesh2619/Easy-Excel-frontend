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
    <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#00A878]/20 via-[#00A878]/30 to-[#00c98c]/25 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-3 animate-fade-in-up">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            Discover How to Build <span className="text-[#00A878]">Excel Dashboards</span> Like This In Minutes!
          </h2>
        </div>

        {/* Compact Before/After Comparison - Aligned */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-3 items-center">
            {/* BEFORE Section */}
            <div className="animate-slide-in-left">
              <div className="mb-1.5">
                <span className="inline-block px-2.5 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700">
                  BEFORE
                </span>
              </div>
              <div className="mb-2 overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/before.png" 
                  alt="Before: Manual Excel dashboard creation"
                  className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-0.5">Manual Dashboard Creation</h3>
                {beforePoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 text-xs text-gray-600"
                  >
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curved Separator - Desktop */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-20 pointer-events-none">
              <svg 
                width="60" 
                height="100%" 
                viewBox="0 0 60 200" 
                className="h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 30 0 Q 50 50, 45 100 T 30 200"
                  stroke="#00A878"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-arrow-slide"
                />
                <path
                  d="M 30 0 Q 10 50, 15 100 T 30 200"
                  stroke="#00A878"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-arrow-slide"
                  style={{ animationDelay: '0.2s' }}
                />
                {/* Arrow head at middle */}
                <path
                  d="M 40 95 L 50 100 L 40 105"
                  stroke="#00A878"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* AFTER Section */}
            <div className="animate-slide-in-right">
              <div className="mb-1.5">
                <span className="inline-block px-2.5 py-1 bg-[#00A878] text-white rounded text-xs font-semibold">
                  AFTER
                </span>
              </div>
              <div className="mb-2 overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/after.png" 
                  alt="After: AI-powered Excel dashboard"
                  className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-0.5">AI-Powered Dashboard Building</h3>
                {afterPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 text-xs text-gray-600"
                  >
                    <span className="text-[#00A878] mt-0.5">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center justify-center my-1.5">
            <ArrowRight className="w-4 h-4 text-[#00A878] rotate-90 animate-arrow-slide-vertical drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
