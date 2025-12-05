import React from "react";
import { Button } from "./ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function ProductHuntSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FF6154] via-[#FF6154] to-[#FF8C42] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-white/50">
          <div className="text-center">
            {/* Product Hunt Logo/Badge */}
            <div className="mb-6 flex justify-center">
              <div className="bg-[#FF6154] rounded-full p-4 shadow-lg">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path 
                    d="M12 2L2 7L12 12L22 7L12 2Z" 
                    fill="white"
                  />
                  <path 
                    d="M2 17L12 22L22 17" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M2 12L12 17L22 12" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Love EasyExcel? 🚀
            </h2>
            <p className="text-lg text-gray-700 mb-2 max-w-2xl mx-auto">
              We're live on Product Hunt! Help us reach more people by upvoting.
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Your support means the world to us ❤️
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#FF6154] hover:bg-[#FF4A3A] text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <a 
                  href="https://www.producthunt.com/posts/easyexcel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Upvote on Product Hunt
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-6 rounded-full"
              >
                <a 
                  href="https://www.producthunt.com/posts/easyexcel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View on Product Hunt
                </a>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Join hundreds of users who are already transforming their data workflows
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

