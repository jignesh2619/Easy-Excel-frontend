import { ReactNode } from "react";

interface SafariBrowserProps {
  children: ReactNode;
  className?: string;
}

export function SafariBrowser({ children, className = "" }: SafariBrowserProps) {
  return (
    <div className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl ${className}`}>
      {/* Safari-style browser chrome */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex items-center gap-3 relative z-20">
        <div className="flex gap-2 items-center flex-shrink-0 ml-1">
          {/* Red Close Button */}
          <div 
            className="w-3 h-3 rounded-full cursor-pointer"
            style={{ 
              background: 'radial-gradient(circle at 30% 30%, #ff6259, #ff5f57 40%, #e0443e)',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4), 0 0.5px 1px rgba(0,0,0,0.2)'
            }}
            title="Close"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'radial-gradient(circle at 30% 30%, #ff4444, #e0443e 40%, #c6362f)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'radial-gradient(circle at 30% 30%, #ff6259, #ff5f57 40%, #e0443e)';
            }}
          ></div>
          {/* Yellow Minimize Button */}
          <div 
            className="w-3 h-3 rounded-full cursor-pointer"
            style={{ 
              background: 'radial-gradient(circle at 30% 30%, #ffbd2e, #ffb400 40%, #e6a500)',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4), 0 0.5px 1px rgba(0,0,0,0.2)'
            }}
            title="Minimize"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'radial-gradient(circle at 30% 30%, #ffaa00, #e6a500 40%, #cc9500)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'radial-gradient(circle at 30% 30%, #ffbd2e, #ffb400 40%, #e6a500)';
            }}
          ></div>
          {/* Green Maximize Button */}
          <div 
            className="w-3 h-3 rounded-full cursor-pointer"
            style={{ 
              background: 'radial-gradient(circle at 30% 30%, #28cd41, #28c940 40%, #1fb832)',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4), 0 0.5px 1px rgba(0,0,0,0.2)'
            }}
            title="Maximize"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'radial-gradient(circle at 30% 30%, #1fb832, #1a9f2a 40%, #178028)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'radial-gradient(circle at 30% 30%, #28cd41, #28c940 40%, #1fb832)';
            }}
          ></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-md px-4 py-1.5 text-gray-500 text-sm max-w-md w-full text-center">
            easyexcel.com
          </div>
        </div>
      </div>
      {/* Browser content */}
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}

