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
    <section className="py-0 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#00A878]/20 via-[#00A878]/30 to-[#00c98c]/25 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
          <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight">
            Clean sheets and build dashboards in seconds
          </h2>
        </div>

        {/* Compact Before/After Comparison - Aligned */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-0 items-start">
            {/* BEFORE Section */}
            <div className="animate-slide-in-left flex flex-col items-center">
              {/* BEFORE Badge */}
              <span 
                className="inline-block mb-4 sm:mb-6 rounded-full text-xs font-medium uppercase tracking-wide"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #1F2937',
                  color: '#1F2937',
                  padding: '7px 15px',
                  letterSpacing: '0.04em',
                  fontWeight: 500
                }}
              >
                BEFORE
              </span>
              <img 
                src="/before.png" 
                alt="Before: Manual Excel dashboard creation"
                className="w-full h-auto hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="mt-0">
                <h3 className="text-[10px] font-semibold text-gray-900 leading-tight mt-0">Manual Dashboard Creation</h3>
                {beforePoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-0.5 text-[10px] text-gray-600 leading-tight"
                  >
                    <span className="text-red-500">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER Section */}
            <div className="animate-slide-in-right flex flex-col items-center">
              {/* AFTER Badge */}
              <span 
                className="inline-block mb-4 sm:mb-6 rounded-full text-xs font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  padding: '7px 15px',
                  letterSpacing: '0.04em',
                  fontWeight: 600
                }}
              >
                AFTER
              </span>
              <img 
                src="/after.png" 
                alt="After: AI-powered Excel dashboard"
                className="w-full h-auto hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="mt-0">
                <h3 className="text-[10px] font-semibold text-gray-900 leading-tight mt-0">AI-Powered Dashboard Building</h3>
                {afterPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-0.5 text-[10px] text-gray-600 leading-tight"
                  >
                    <span className="text-[#00A878]">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center justify-center my-0">
            <ArrowRight className="w-2 h-2 text-[#00A878] rotate-90 animate-arrow-slide-vertical drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
