import React, { useState } from "react";

export function MessySpreadsheet() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="w-full h-full bg-white overflow-hidden">
      {/* Excel-like toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-1 flex items-center gap-4 text-xs">
        <div className="flex gap-2 items-center">
          <div className="text-emerald-600">Excel</div>
          <div className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">File</div>
          <div className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">Home</div>
          <div className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">Insert</div>
          <div className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">Data</div>
        </div>
      </div>
      
      {/* Excel ribbon */}
      <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-2 text-xs">
        <div className="flex gap-1">
          <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white text-xs hover:bg-gray-100 cursor-pointer transition-all hover:scale-110">B</div>
          <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white text-xs hover:bg-gray-100 cursor-pointer transition-all hover:scale-110">I</div>
          <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white text-xs hover:bg-gray-100 cursor-pointer transition-all hover:scale-110">U</div>
        </div>
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        <div className="flex gap-1">
          <div className="w-16 h-6 border border-gray-300 rounded bg-white px-2 hover:border-emerald-400 cursor-pointer transition-all">Arial</div>
          <div className="w-10 h-6 border border-gray-300 rounded bg-white px-2 hover:border-emerald-400 cursor-pointer transition-all">11</div>
        </div>
      </div>
      
      <div className="p-3">
        {/* Column headers */}
        <div className="grid grid-cols-6 gap-px text-xs mb-px">
          {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
            <div 
              key={col}
              className="bg-gray-200 p-1.5 border border-gray-300 text-center text-gray-600 hover:bg-gray-300 cursor-pointer transition-colors"
            >
              {col}
            </div>
          ))}
        </div>
        
        {/* Data rows with messy formatting */}
        <div className="space-y-px text-xs">
          <div 
            className="grid grid-cols-6 gap-px group"
            onMouseEnter={() => setHoveredRow(0)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="bg-yellow-200 p-1.5 border border-gray-300 hover:bg-yellow-300 cursor-pointer transition-all hover:scale-105">Product</div>
            <div className="bg-white p-1.5 border border-gray-300 hover:bg-blue-50 cursor-pointer transition-all hover:scale-105">sales q1</div>
            <div className="bg-blue-100 p-1.5 border border-gray-300 hover:bg-blue-200 cursor-pointer transition-all hover:scale-105">REVENUE</div>
            <div className="bg-white p-1.5 border border-gray-300 hover:bg-blue-50 cursor-pointer transition-all hover:scale-105">Status</div>
            <div className="bg-pink-100 p-1.5 border border-gray-300 hover:bg-pink-200 cursor-pointer transition-all hover:scale-105">notes</div>
            <div className="bg-white p-1.5 border border-gray-300 hover:bg-blue-50 cursor-pointer transition-all hover:scale-105">2023</div>
          </div>
          
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i} 
              className={`grid grid-cols-6 gap-px transition-all duration-200 ${hoveredRow === i + 1 ? 'bg-blue-100/20' : ''}`}
              onMouseEnter={() => setHoveredRow(i + 1)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div 
                className={`bg-white p-1.5 border border-gray-300 text-gray-700 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-emerald-400 hover:scale-105 hover:shadow-md ${hoveredRow === i + 1 ? 'border-emerald-300' : ''}`}
                onMouseEnter={() => setHoveredCell(`${i}-0`)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {i === 0 ? 'Widget A' : i === 1 ? 'gadget B' : i === 2 ? 'Tool (old)' : i === 3 ? '' : `Item ${i}`}
              </div>
              <div 
                className={`p-1.5 border border-gray-300 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-emerald-400 hover:scale-105 hover:shadow-md ${i === 0 ? 'text-red-600 bg-white' : 'bg-white text-gray-700'} ${hoveredRow === i + 1 ? 'border-emerald-300' : ''}`}
                onMouseEnter={() => setHoveredCell(`${i}-1`)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {i === 3 ? '' : Math.floor(Math.random() * 3000 + 500)}
              </div>
              <div 
                className={`bg-white p-1.5 border border-gray-300 text-gray-700 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-emerald-400 hover:scale-105 hover:shadow-md ${hoveredRow === i + 1 ? 'border-emerald-300' : ''}`}
                onMouseEnter={() => setHoveredCell(`${i}-2`)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {i === 3 ? '$' : i === 1 ? '45000' : `$${Math.floor(Math.random() * 90000 + 10000)}`}
              </div>
              <div 
                className={`p-1.5 border border-gray-300 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${i === 1 ? 'bg-green-200 hover:bg-green-300 hover:border-emerald-400' : i === 4 ? 'bg-red-200 hover:bg-red-300 hover:border-red-400' : 'bg-white hover:bg-blue-50 hover:border-emerald-400'} ${hoveredRow === i + 1 ? 'border-emerald-300' : ''}`}
                onMouseEnter={() => setHoveredCell(`${i}-3`)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {i === 0 ? 'Active' : i === 1 ? 'ACTIVE' : i === 2 ? 'inactive' : i === 4 ? 'Discontinued' : 'Active'}
              </div>
              <div 
                className={`p-1.5 border border-gray-300 text-gray-500 text-xs cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-emerald-400 hover:scale-105 hover:shadow-md ${i === 2 ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-white'} ${hoveredRow === i + 1 ? 'border-emerald-300' : ''}`}
                onMouseEnter={() => setHoveredCell(`${i}-4`)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {i === 0 ? 'check later' : i === 2 ? 'IMPORTANT!' : i === 3 ? 'update' : ''}
              </div>
              <div 
                className={`bg-white p-1.5 border border-gray-300 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-emerald-400 hover:scale-105 hover:shadow-md ${hoveredRow === i + 1 ? 'border-emerald-300' : ''}`}
                onMouseEnter={() => setHoveredCell(`${i}-5`)}
                onMouseLeave={() => setHoveredCell(null)}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



