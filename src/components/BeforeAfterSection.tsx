import React from "react";
import { ArrowRight, Sparkles, Zap, CheckCircle2, Clock, AlertCircle, X, CheckCircle, Rocket } from "lucide-react";

export function BeforeAfterSection() {
  return (
    <section 
      className="px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ 
        paddingTop: '32px', 
        paddingBottom: '32px',
        backgroundColor: '#f8faf9'
      }}
    >
      {/* Rounded Rectangle Container with Gradient */}
      <div 
        className="mx-auto relative z-10 px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 rounded-[20px] sm:rounded-[24px] md:rounded-[32px]"
        style={{ 
          maxWidth: '1200px',
          background: 'linear-gradient(135deg, rgba(0, 168, 120, 0.15) 0%, rgba(0, 201, 140, 0.12) 50%, rgba(0, 168, 120, 0.08) 100%)',
          border: '1px solid rgba(0, 168, 120, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 168, 120, 0.1)'
        }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Tagline and Supporting Text */}
          <div className="mobile-animate-fade-in-up">
            <h2 
              className="text-gray-900 mb-4 text-4xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight mobile-animate-bounce-in"
              style={{
                margin: 0,
                marginBottom: '16px'
              }}
            >
              <span className="inline-block mobile-animate-slide-in-left" style={{ animationDelay: '0.1s' }}>Clean</span><br />
              <span className="inline-block mobile-animate-slide-in-left" style={{ animationDelay: '0.2s' }}>sheets and</span><br />
              <span className="inline-block mobile-animate-slide-in-left" style={{ animationDelay: '0.3s' }}>build dashboards</span><br />
              <span className="inline-block text-[#00A878] mobile-animate-scale-in" style={{ animationDelay: '0.4s' }}>in seconds</span>
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4">
              <button
                onClick={() => {
                  const element = document.getElementById("prompt-tool");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-fit mobile-animate-bounce-in"
                style={{ 
                  fontSize: '16px',
                  backgroundColor: '#00A878',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '16px 20px',
                  maxWidth: '220px',
                  animationDelay: '0.5s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#008c67';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00A878';
                }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  const element = document.getElementById("features");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center justify-center font-semibold transition-all duration-200 w-full sm:w-fit mobile-animate-bounce-in"
                style={{ 
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  border: '2px solid #00A878',
                  borderRadius: '12px',
                  color: '#00A878',
                  padding: '16px 20px',
                  maxWidth: '220px',
                  animationDelay: '0.6s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00A878';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#00A878';
                }}
              >
                See How It Works
              </button>
            </div>

            {/* CTA Text */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A878]/10 border border-[#00A878]/20 rounded-full mobile-animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <span className="text-[#00A878] font-medium" style={{ fontSize: '15px' }}>
                ✓ Free trial available • No credit card required
              </span>
            </div>
          </div>

          {/* Right Side: Before → Arrow → After Images */}
          <div className="mobile-animate-slide-in-right mt-6 md:mt-0">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
              {/* BEFORE Image */}
              <div className="flex-1 w-full md:w-auto mobile-animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="mb-2">
                  <span 
                    className="inline-block rounded-full text-xs font-medium uppercase tracking-wide mobile-animate-bounce-in"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #1F2937',
                      color: '#1F2937',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      borderRadius: '999px',
                      animationDelay: '0.3s'
                    }}
                  >
                    BEFORE
                  </span>
                </div>
                <div style={{ margin: 0, padding: 0, lineHeight: 0, overflow: 'hidden' }}>
                  <img 
                    src="/before.png" 
                    alt="Before: Manual Excel dashboard creation"
                    className="hover:scale-110 transition-transform duration-300 rounded-lg shadow-md scale-100 md:scale-110 lg:scale-[1.2]"
                    style={{ 
                      margin: 0,
                      padding: 0,
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      verticalAlign: 'top',
                      lineHeight: 0,
                      transformOrigin: 'center center'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-row md:flex-col items-center justify-center rotate-90 md:rotate-0 mobile-animate-bounce-in" style={{ animationDelay: '0.4s' }}>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-[#00A878] animate-arrow-slide-vertical md:animate-arrow-slide drop-shadow-lg" />
              </div>

              {/* AFTER Image */}
              <div className="flex-1 w-full md:w-auto mobile-animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="mb-2">
                  <span 
                    className="inline-block rounded-full text-xs font-semibold uppercase tracking-wide mobile-animate-bounce-in"
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      borderRadius: '999px',
                      animationDelay: '0.6s'
                    }}
                  >
                    AFTER
                  </span>
                </div>
                <div style={{ margin: 0, padding: 0, lineHeight: 0, overflow: 'hidden' }}>
                  <img 
                    src="/after.png" 
                    alt="After: AI-powered Excel dashboard"
                    className="hover:scale-110 transition-transform duration-300 rounded-lg shadow-md scale-100 md:scale-110 lg:scale-[1.2] max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[380px]"
                    style={{ 
                      margin: 0,
                      padding: 0,
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      verticalAlign: 'top',
                      lineHeight: 0,
                      transformOrigin: 'center center'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Comparison Text Below Images - Horizontal Layout */}
            <div className="mt-4 flex flex-col md:flex-row gap-4" style={{ width: '100%' }}>
              {/* First Box - Manual Dashboard Creation */}
              <div 
                className="animate-gentle-pulse animate-breathe transition-all duration-300 cursor-pointer p-4 md:p-6 mobile-animate-slide-in-left"
                style={{ 
                  flex: '1', 
                  minWidth: 0,
                  animationDelay: '0.7s',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  transform: 'scale(1)',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(239, 68, 68, 0.1)',
                  filter: 'drop-shadow(0 4px 12px rgba(239, 68, 68, 0.15))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(239, 68, 68, 0.25), 0 8px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                  e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(239, 68, 68, 0.25))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.filter = 'drop-shadow(0 4px 12px rgba(239, 68, 68, 0.15))';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div 
                    className="transition-all duration-300"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    <X className="w-5 h-5 text-red-500 transition-transform duration-300" />
                  </div>
                  <h3 
                    className="text-gray-900 text-lg sm:text-xl md:text-[22px] font-bold"
                    style={{
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Manual Dashboard Creation
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    className="transition-all duration-300 group text-sm sm:text-base md:text-[17px]"
                    style={{ 
                      color: '#1F2937', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1.2)';
                        icon.style.transition = 'transform 0.3s ease';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Clock className="w-5 h-5 text-red-500" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span className="group-hover:text-red-600 transition-colors duration-300">8+ hours spent per report</span>
                  </div>
                  <div 
                    className="transition-all duration-300 group text-sm sm:text-base md:text-[17px]"
                    style={{ 
                      color: '#1F2937', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1.2)';
                        icon.style.transition = 'transform 0.3s ease';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span className="group-hover:text-red-600 transition-colors duration-300">Messy, unstructured Excel data</span>
                  </div>
                  <div 
                    className="transition-all duration-300 group text-sm sm:text-base md:text-[17px]"
                    style={{ 
                      color: '#1F2937', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1.2)';
                        icon.style.transition = 'transform 0.3s ease';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <X className="w-5 h-5 text-red-500" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span className="group-hover:text-red-600 transition-colors duration-300">Constant fear of errors or mistakes</span>
                  </div>
                </div>
              </div>

              {/* Second Box - AI-Powered Dashboard Building */}
              <div 
                className="animate-gentle-pulse animate-breathe animate-subtle-glow transition-all duration-300 cursor-pointer p-4 md:p-6 mobile-animate-slide-in-right"
                style={{ 
                  flex: '1', 
                  minWidth: 0,
                  animationDelay: '0.8s',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 168, 120, 0.05) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.15)',
                  transform: 'scale(1)',
                  filter: 'drop-shadow(0 4px 16px rgba(16, 185, 129, 0.2))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 48px rgba(16, 185, 129, 0.3), 0 8px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(16, 185, 129, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(0, 168, 120, 0.1) 100%)';
                  e.currentTarget.style.filter = 'drop-shadow(0 8px 24px rgba(16, 185, 129, 0.35))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 168, 120, 0.05) 100%)';
                  e.currentTarget.style.filter = 'drop-shadow(0 4px 16px rgba(16, 185, 129, 0.2))';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div 
                    className="transition-all duration-300"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 168, 120, 0.15) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(0, 168, 120, 0.25) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 168, 120, 0.15) 100%)';
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] transition-transform duration-300" />
                  </div>
                  <h3 
                    className="text-gray-900 text-lg sm:text-xl md:text-[22px] font-bold"
                    style={{
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    AI-Powered Dashboard Building
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    className="transition-all duration-300 group text-sm sm:text-base md:text-[17px]"
                    style={{ 
                      color: '#1F2937', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1.2) rotate(5deg)';
                        icon.style.transition = 'transform 0.3s ease';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Rocket className="w-5 h-5 text-[#10B981]" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span className="group-hover:text-[#10B981] transition-colors duration-300">Dashboards ready in minutes</span>
                  </div>
                  <div 
                    className="transition-all duration-300 group text-sm sm:text-base md:text-[17px]"
                    style={{ 
                      color: '#1F2937', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1.2)';
                        icon.style.transition = 'transform 0.3s ease';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#10B981]" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span className="group-hover:text-[#10B981] transition-colors duration-300">Clean, professional-grade visuals</span>
                  </div>
                  <div 
                    className="transition-all duration-300 group text-sm sm:text-base md:text-[17px]"
                    style={{ 
                      color: '#1F2937', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '14px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1.2) rotate(-5deg)';
                        icon.style.transition = 'transform 0.3s ease';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        icon.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Zap className="w-5 h-5 text-[#10B981]" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span className="group-hover:text-[#10B981] transition-colors duration-300">Zero manual work or Excel expertise needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
