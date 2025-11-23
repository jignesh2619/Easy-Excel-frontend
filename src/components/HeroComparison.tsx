import React from "react";
import { SafariBrowser } from "./SafariBrowser";
import { MessySpreadsheet } from "./MessySpreadsheet";
import { CleanDashboard } from "./CleanDashboard";
import { ArrowRight } from "lucide-react";

export function HeroComparison() {
  return (
    <div className="relative w-full">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-3xl opacity-20"></div>
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
        {/* Before - Messy Spreadsheet */}
        <div className="relative">
          <SafariBrowser>
            <div className="h-[500px]">
              <MessySpreadsheet />
            </div>
          </SafariBrowser>
        </div>

        {/* Arrow/Transformation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-60"></div>
            {/* Arrow */}
            <div className="relative bg-emerald-500 rounded-full p-6 shadow-2xl">
              <ArrowRight className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Mobile Arrow */}
        <div className="flex justify-center lg:hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-60"></div>
            <div className="relative bg-emerald-500 rounded-full p-4 shadow-2xl rotate-90">
              <ArrowRight className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* After - Clean Dashboard */}
        <div className="relative">
          <SafariBrowser>
            <div className="h-[500px]">
              <CleanDashboard />
            </div>
          </SafariBrowser>
        </div>
      </div>
    </div>
  );
}



