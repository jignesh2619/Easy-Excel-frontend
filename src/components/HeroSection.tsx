import React from "react";
import { Sparkles, Star } from "lucide-react";
import { HeroHeadline, HeroSubheadline } from "./typography";

export function HeroSection() {
  const scrollToPromptTool = () => {
    const element = document.getElementById("prompt-tool");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Sketch-like arrow SVG
  const SketchArrow = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
      style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}
    >
      <path 
        d="M3 8h10M10 5l3 3-3 3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ 
          strokeDasharray: '0.5,0.5',
          opacity: 0.9
        }}
      />
    </svg>
  );

  return (
    <section 
      id="home" 
      className="pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#00A878]/5 to-white relative overflow-hidden"
    >
      {/* Gradient orbs with animations */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-[#00c98c]/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Centered content container with max-width */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-[720px] mx-auto">
          
          {/* 1. Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00A878]/10 border border-[#00A878]/20 rounded-full mb-6 animate-fade-in text-sm">
            <Sparkles className="w-4 h-4 text-[#00A878]" />
            <span className="font-medium text-[#00A878]">No Credit Card • Free Trial</span>
          </div>

          {/* 2. Main Headline */}
          <HeroHeadline className="text-gray-900 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Transform Excel Chaos Into
            <br />
            <span className="text-[#00A878]">Professional Dashboards</span>
            <br />
            In Seconds
          </HeroHeadline>
          
          {/* 3. Subheadline */}
          <HeroSubheadline className="text-gray-600 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload your Excel file, describe what you need, and get clean data + beautiful dashboards automatically. 
            <span className="font-medium text-[#00A878]"> No coding required.</span>
          </HeroSubheadline>

          {/* 4. CTA Button Group - Inline-flex, not full-width */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Primary CTA */}
            <button
              onClick={scrollToPromptTool}
              className="inline-flex items-center justify-center gap-2 bg-[#00A878] hover:bg-[#008c67] text-white text-base font-semibold px-7 py-3.5 rounded-[10px] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A878]/20 focus:ring-offset-2 min-h-[48px]"
            >
              Start Free Trial
              <SketchArrow />
            </button>
            
            {/* Secondary CTA */}
            <button
              onClick={scrollToFeatures}
              className="inline-flex items-center justify-center bg-transparent border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-base font-medium px-7 py-3.5 rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300/20 focus:ring-offset-2 min-h-[48px]"
            >
              See How It Works
            </button>
          </div>

          {/* 5. Social Proof */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-gray-500 mb-2">Trusted by 10,000+ professionals</p>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-700">4.8/5 from 500+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
