import React from "react";
import { Upload, MessageSquare, Clock, Download } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Upload Your Excel File",
      description: "Simply drag and drop or select your Excel file to get started."
    },
    {
      icon: MessageSquare,
      title: "Type in Plain English",
      description: "Tell us what you want in simple words—no technical jargon needed."
    },
    {
      icon: Clock,
      title: "Wait for a Few Seconds",
      description: "Our AI processes your request and transforms your data in moments."
    },
    {
      icon: Download,
      title: "Export",
      description: "Download your cleaned and processed Excel file instantly."
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-[#00A878] to-gray-900 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your Excel files in just four simple steps—no expertise required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#00A878]/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-center animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00A878]/10 to-[#00c98c]/10 rounded-xl flex items-center justify-center group-hover:from-[#00A878]/20 group-hover:to-[#00c98c]/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-[#00A878] group-hover:text-[#00c98c] group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <h3 className="text-gray-900 mb-2 font-semibold group-hover:text-[#00A878] transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
