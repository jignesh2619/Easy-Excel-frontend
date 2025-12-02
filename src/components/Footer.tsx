import React from "react";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Contact Section */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#00A878]">
            Get in Touch
          </h3>
          <p className="text-gray-400 mb-6">Have questions? We're here to help!</p>
          <a
            href="mailto:jigneshmandana19@gmail.com?subject=EasyExcel Support Request"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>jigneshmandana19@gmail.com</span>
          </a>
        </div>

        <div className="border-t border-gray-700 pt-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo/Brand */}
            <div className="text-2xl font-bold text-[#00A878] hover:scale-110 transition-transform duration-300 cursor-pointer">
              EasyExcel
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8">
              <a href="#privacy" className="text-gray-400 hover:text-[#00A878] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-[#00A878] transition-colors duration-300">
                Terms
              </a>
              <a href="#contact" className="text-gray-400 hover:text-[#00A878] transition-colors duration-300">
                Contact
              </a>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EasyExcel
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
