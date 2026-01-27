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
    <section className="py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#008c67] via-[#00A878] to-[#006b52] relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 animate-fade-in-up">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Discover How to Build <span className="text-white/90">Excel Dashboards</span> Like This In Minutes!
          </h2>
        </div>

        {/* Compact Before/After Comparison - Aligned */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            {/* BEFORE Section */}
            <div className="animate-slide-in-left">
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs font-semibold text-white border border-white/30">
                  BEFORE
                </span>
              </div>
              <div className="mb-3 overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/before.png" 
                  alt="Before: Manual Excel dashboard creation"
                  className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-white mb-1">Manual Dashboard Creation</h3>
                {beforePoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 text-xs text-white/90"
                  >
                    <span className="text-red-300 mt-0.5">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Arrow - Desktop */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <ArrowRight 
                className="w-6 h-6 text-white drop-shadow-lg animate-arrow-slide"
              />
            </div>

            {/* AFTER Section */}
            <div className="animate-slide-in-right">
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 bg-white text-[#00A878] rounded text-xs font-semibold">
                  AFTER
                </span>
              </div>
              <div className="mb-3 overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/after.png" 
                  alt="After: AI-powered Excel dashboard"
                  className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-white mb-1">AI-Powered Dashboard Building</h3>
                {afterPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 text-xs text-white/90"
                  >
                    <span className="text-green-200 mt-0.5">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center justify-center my-2">
            <ArrowRight className="w-5 h-5 text-white rotate-90 animate-arrow-slide-vertical drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
