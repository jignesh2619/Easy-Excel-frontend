import React from "react";
import { Sparkles, BarChart3, MessageSquare, Download } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "Automated Sheet Cleaning",
      description: "Removes duplicates, fixes errors, and standardizes formatting automatically."
    },
    {
      icon: BarChart3,
      title: "Instant Dashboard Builder",
      description: "Auto-generate charts and insights from your data in seconds."
    },
    {
      icon: MessageSquare,
      title: "AI Prompt Engine",
      description: "Clean or transform any column using natural language commands."
    },
    {
      icon: Download,
      title: "One-Click Download",
      description: "Export clean or processed sheets instantly in your preferred format."
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
            Powerful Features That Save You Time
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to clean, transform, and visualize your data efficiently—all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-4">
                <feature.icon className="w-8 h-8 text-[#00A878] group-hover:text-[#00c98c] group-hover:scale-110 transition-all duration-300" />
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
