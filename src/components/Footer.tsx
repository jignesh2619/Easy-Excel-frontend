import React from "react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo/Brand */}
          <div className="text-2xl bg-gradient-to-r from-[#00A878] to-[#00c98c] bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 cursor-pointer">
            EasyExcel
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#privacy" className="text-gray-400 hover:text-[#00A878] hover:scale-110 transition-all duration-300">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-[#00A878] hover:scale-110 transition-all duration-300">
              Terms
            </a>
            <a href="#contact" className="text-gray-400 hover:text-[#00A878] hover:scale-110 transition-all duration-300">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-400">
            © EasyExcel
          </div>
        </div>
      </div>
    </footer>
  );
}
