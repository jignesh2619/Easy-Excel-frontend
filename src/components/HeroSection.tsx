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
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A878]/10 border border-[#00A878]/20 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#00A878]" />
            <span className="text-sm font-medium text-[#00A878]">No Credit Card Required • Free Trial</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-[#00A878] to-gray-900 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in-up">
            Transform Excel Chaos Into
            <br />
            <span className="text-[#00A878]">Professional Dashboards</span>
            <br />
            In Seconds
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-4 font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Stop wasting hours on manual data cleaning. Let AI do the heavy lifting.
          </p>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload your Excel file, describe what you need, and get clean data + beautiful dashboards automatically. 
            <span className="font-semibold text-[#00A878]"> No coding required.</span>
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Clock className="w-4 h-4 text-[#00A878]" />
              <span className="text-sm font-medium text-gray-700">Process in 30 seconds</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Shield className="w-4 h-4 text-[#00A878]" />
              <span className="text-sm font-medium text-gray-700">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#00A878]" />
              <span className="text-sm font-medium text-gray-700">AI-Powered</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={scrollToPromptTool}
              size="lg"
              className="bg-gradient-to-r from-[#00A878] via-[#00b887] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-smooth hover-glow w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById("features");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-[#00A878] text-gray-700 hover:text-[#00A878] rounded-full px-8 py-6 text-lg font-semibold hover:bg-[#00A878]/5 hover:scale-105 active:scale-95 transition-smooth w-full sm:w-auto"
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
