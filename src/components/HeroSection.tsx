import React from "react";

export function HeroSection() {
  return (
    <section id="home" className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#00A878]/5 to-white relative overflow-hidden">
      {/* Gradient orbs with animations */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#00A878]/20 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-[#00c98c]/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      {/* Smooth transition gradient at bottom - covers full width including left with green tint */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#00A878]/15 to-[#00c98c]/10 pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-4 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 sm:mb-6 italic animate-gradient">
            Clean Your Sheets & Build Dashboards Instantly.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload your Excel file, enter a prompt, and let LazyExcel clean, format, and visualize your data automatically.
          </p>
        </div>

      </div>
    </section>
  );
}
