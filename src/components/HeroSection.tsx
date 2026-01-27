import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react";

export function HeroSection() {
  const scrollToPromptTool = () => {
    const element = document.getElementById("prompt-tool");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#00A878]/5 to-white relative overflow-hidden">
      {/* Gradient orbs with animations */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-[#00c98c]/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      {/* Smooth transition gradient at bottom - covers full width including left with green tint */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#00A878]/15 to-[#00c98c]/10 pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-8 animate-fade-in-up">
          {/* Trust Badge - Compact */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00A878]/10 border border-[#00A878]/20 rounded-full mb-4 animate-fade-in text-xs">
            <Sparkles className="w-3 h-3 text-[#00A878]" />
            <span className="font-medium text-[#00A878]">No Credit Card • Free Trial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight animate-fade-in-up">
            Transform Excel Chaos Into
            <br />
            <span className="text-[#00A878]">Professional Dashboards</span>
            <br />
            In Seconds
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Upload your Excel file, describe what you need, and get clean data + beautiful dashboards automatically. 
            <span className="font-medium text-[#00A878]"> No coding required.</span>
          </p>

          {/* Key Benefits - Compact */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs">
              <Clock className="w-3.5 h-3.5 text-[#00A878]" />
              <span className="font-medium text-gray-700">30 seconds</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs">
              <Shield className="w-3.5 h-3.5 text-[#00A878]" />
              <span className="font-medium text-gray-700">Secure</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00A878]" />
              <span className="font-medium text-gray-700">AI-Powered</span>
            </div>
          </div>

          {/* Primary CTA - Smaller */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={scrollToPromptTool}
              className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-lg px-6 py-2.5 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-smooth w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById("features");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="outline"
              className="border border-gray-300 hover:border-[#00A878] text-gray-700 hover:text-[#00A878] rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-[#00A878]/5 hover:scale-105 active:scale-95 transition-smooth w-full sm:w-auto"
            >
              See How It Works
            </Button>
          </div>

          {/* Social Proof */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-sm text-gray-500 mb-2">Trusted by 10,000+ professionals</p>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-700">4.8/5 from 500+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
