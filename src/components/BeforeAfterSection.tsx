import React from "react";
import { ArrowRight } from "lucide-react";

export function BeforeAfterSection() {
  const beforePoints = [
    "8+ Hours Per Report",
    "Overwhelming Data",
    "Basic Excel Skills"
  ];

  const afterPoints = [
    "60 Minutes Per Report",
    "Clean, Professional Output",
    "Advanced Excel + AI Skills"
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#00A878]/20 via-[#00A878]/30 to-[#00c98c]/25 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 
            className="text-gray-900"
            style={{
              fontSize: '30px',
              fontWeight: 600,
              lineHeight: 1.3
            }}
          >
            Clean sheets and build dashboards in seconds
          </h2>
        </div>

        {/* Before/After Comparison */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-start">
            {/* BEFORE Section */}
            <div className="animate-slide-in-left flex flex-col items-center">
              {/* BEFORE Badge */}
              <span 
                className="inline-block mb-5 rounded-full text-xs font-medium uppercase tracking-wide"
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
              
              {/* Laptop Image */}
              <img 
                src="/before.png" 
                alt="Before: Manual Excel dashboard creation"
                className="w-full h-auto hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Text Content */}
              <div className="mt-6 w-full">
                <h3 
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '17px',
                    fontWeight: 600
                  }}
                >
                  Manual Dashboard Creation
                </h3>
                <div className="space-y-2.5">
                  {beforePoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2"
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="text-gray-700" style={{ opacity: index === 0 ? 1 : 0.85 }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AFTER Section */}
            <div className="animate-slide-in-right flex flex-col items-center">
              {/* AFTER Badge */}
              <span 
                className="inline-block mb-5 rounded-full text-xs font-semibold uppercase tracking-wide"
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
              
              {/* Laptop Image */}
              <img 
                src="/after.png" 
                alt="After: AI-powered Excel dashboard"
                className="w-full h-auto hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Text Content */}
              <div className="mt-6 w-full">
                <h3 
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '17px',
                    fontWeight: 600
                  }}
                >
                  AI-Powered Dashboard Building
                </h3>
                <div className="space-y-2.5">
                  {afterPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2"
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      <span className="text-[#10B981] mt-0.5">•</span>
                      <span className="text-gray-700" style={{ opacity: index === 0 ? 1 : 0.85 }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Arrow */}
          <div className="md:hidden flex items-center justify-center my-4">
            <ArrowRight className="w-4 h-4 text-[#00A878] rotate-90 animate-arrow-slide-vertical drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
