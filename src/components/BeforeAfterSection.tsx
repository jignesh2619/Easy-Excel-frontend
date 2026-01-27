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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Discover How to Build <span className="text-[#00A878]">Excel Dashboards</span> Like This In Minutes!
          </h2>
        </div>

        {/* Compact Before/After Comparison - No Boxes */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* BEFORE Section */}
            <div className="animate-slide-in-left">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-gray-100 rounded text-sm font-semibold text-gray-700">
                  BEFORE
                </span>
              </div>
              <div className="mb-4">
                <img 
                  src="/before.png" 
                  alt="Before: Manual Excel dashboard creation"
                  className="w-full h-auto rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Manual Dashboard Creation</h3>
                {beforePoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Arrow - Desktop */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <ArrowRight 
                className="w-8 h-8 text-[#00A878] animate-arrow-slide"
              />
            </div>

            {/* AFTER Section */}
            <div className="animate-slide-in-right">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-[#00A878] text-white rounded text-sm font-semibold">
                  AFTER
                </span>
              </div>
              <div className="mb-4">
                <img 
                  src="/after.png" 
                  alt="After: AI-powered Excel dashboard"
                  className="w-full h-auto rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">AI-Powered Dashboard Building</h3>
                {afterPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-[#00A878] mt-0.5">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center justify-center my-4">
            <ArrowRight className="w-6 h-6 text-[#00A878] rotate-90 animate-arrow-slide-vertical" />
          </div>
        </div>
      </div>
    </section>
  );
}
