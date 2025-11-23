import React from "react";
import { Button } from "./ui/button";

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("home")}
            className="text-2xl bg-gradient-to-r from-[#00A878] to-[#00c98c] bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
          >
            EasyExcel
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("features")}
              className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("prompt-tool")}
              className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
            >
              Prompt Tool
            </button>
            <button 
              onClick={() => scrollToSection("pricing")}
              className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-[#00A878] hover:scale-110 transition-all duration-300"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button */}
          <Button 
            className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-full px-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Try for Free
          </Button>
        </div>
      </div>
    </header>
  );
}