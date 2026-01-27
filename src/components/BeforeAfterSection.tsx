import React from "react";
import { ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react";

export function BeforeAfterSection() {
  return (
    <section 
      className="px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ 
        paddingTop: '48px', 
        paddingBottom: '48px',
        backgroundColor: '#f8faf9'
      }}
    >
      {/* Rounded Rectangle Container with Gradient */}
      <div 
        className="mx-auto relative z-10"
        style={{ 
          maxWidth: '1200px',
          padding: '48px 64px',
          background: 'linear-gradient(135deg, rgba(0, 168, 120, 0.15) 0%, rgba(0, 201, 140, 0.12) 50%, rgba(0, 168, 120, 0.08) 100%)',
          border: '1px solid rgba(0, 168, 120, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 168, 120, 0.1)',
          borderRadius: '32px'
        }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Tagline and Supporting Text */}
          <div className="animate-fade-in-up">
            <h2 
              className="text-gray-900 mb-4"
              style={{
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '16px'
              }}
            >
              Clean<br />
              sheets and<br />
              build dashboards<br />
              <span className="text-[#00A878]">in seconds</span>
            </h2>
            
            <p 
              className="text-gray-600 mb-6"
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                marginBottom: '32px'
              }}
            >
              Transform your messy Excel files into professional dashboards instantly. 
              No coding required, no complex setup—just upload and get results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={() => {
                  const element = document.getElementById("prompt-tool");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                style={{ 
                  fontSize: '16px',
                  backgroundColor: '#00A878',
                  borderRadius: '12px',
                  border: 'none'
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
                className="inline-flex items-center justify-center font-semibold px-6 py-3 transition-all duration-200"
                style={{ 
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  border: '2px solid #00A878',
                  borderRadius: '12px',
                  color: '#00A878'
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A878]/10 border border-[#00A878]/20 rounded-full">
              <span className="text-[#00A878] font-medium" style={{ fontSize: '14px' }}>
                ✓ Free trial available • No credit card required
              </span>
            </div>
          </div>

          {/* Right Side: Before → Arrow → After Images */}
          <div className="animate-slide-in-right">
            <div className="flex items-center gap-4">
              {/* BEFORE Image */}
              <div className="flex-1">
                <div className="mb-2">
                  <span 
                    className="inline-block rounded-full text-xs font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #1F2937',
                      color: '#1F2937',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      borderRadius: '999px'
                    }}
                  >
                    BEFORE
                  </span>
                </div>
                <div style={{ margin: 0, padding: 0, lineHeight: 0 }}>
                  <img 
                    src="/before.png" 
                    alt="Before: Manual Excel dashboard creation"
                    className="hover:scale-105 transition-transform duration-300 rounded-lg shadow-md"
                    style={{ 
                      margin: 0,
                      padding: 0,
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '280px',
                      objectFit: 'contain',
                      verticalAlign: 'top',
                      lineHeight: 0
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center justify-center">
                <ArrowRight className="w-8 h-8 text-[#00A878] animate-arrow-slide drop-shadow-lg" />
              </div>

              {/* AFTER Image */}
              <div className="flex-1">
                <div className="mb-2">
                  <span 
                    className="inline-block rounded-full text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      borderRadius: '999px'
                    }}
                  >
                    AFTER
                  </span>
                </div>
                <div style={{ margin: 0, padding: 0, lineHeight: 0 }}>
                  <img 
                    src="/after.png" 
                    alt="After: AI-powered Excel dashboard"
                    className="hover:scale-105 transition-transform duration-300 rounded-lg shadow-md"
                    style={{ 
                      margin: 0,
                      padding: 0,
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '280px',
                      objectFit: 'contain',
                      verticalAlign: 'top',
                      lineHeight: 0
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Comparison Text Below Images - Horizontal Layout */}
            <div className="mt-4 flex flex-row gap-4" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              {/* First Box - Manual Dashboard Creation */}
              <div style={{ padding: '16px', flex: '1', minWidth: 0 }}>
                <h3 
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '14px',
                    marginTop: 0
                  }}
                >
                  Manual Dashboard Creation
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="text-red-500" style={{ flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>8+ hours spent per report</span>
                  </div>
                  <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="text-red-500" style={{ flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>Messy, unstructured Excel data</span>
                  </div>
                  <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="text-red-500" style={{ flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>Constant fear of errors or mistakes</span>
                  </div>
                </div>
              </div>

              {/* Second Box - AI-Powered Dashboard Building */}
              <div style={{ padding: '16px', flex: '1', minWidth: 0 }}>
                <h3 
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '14px',
                    marginTop: 0
                  }}
                >
                  AI-Powered Dashboard Building
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="text-[#10B981]" style={{ flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>Dashboards ready in minutes</span>
                  </div>
                  <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="text-[#10B981]" style={{ flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>Clean, professional-grade visuals</span>
                  </div>
                  <div style={{ fontSize: '16px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="text-[#10B981]" style={{ flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>Zero manual work or Excel expertise needed</span>
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
