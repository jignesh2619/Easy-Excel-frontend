import React, { useState } from "react";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const categoryData = [
  { name: 'Electronics', value: 35, color: '#10b981' },
  { name: 'Clothing', value: 25, color: '#14b8a6' },
  { name: 'Home', value: 20, color: '#22c55e' },
  { name: 'Sports', value: 20, color: '#059669' },
];

const performanceData = [
  { metric: 'Sales', value: 85 },
  { metric: 'Quality', value: 92 },
  { metric: 'Speed', value: 78 },
  { metric: 'Support', value: 88 },
  { metric: 'ROI', value: 95 },
];

export function CleanDashboard() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Analytics Overview
            </h3>
            <p className="text-emerald-100 text-xs mt-1">Real-time insights • Updated now</p>
          </div>
          <div className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            Q4 2025
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-4 gap-2">
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-400"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className={`text-gray-900 transition-all duration-300 ${hoveredCard === 0 ? 'text-emerald-600' : ''}`}>
                  $128K
                </div>
                <div className="text-xs text-gray-600 mt-0.5">Revenue</div>
              </div>
              <div className="text-xs text-emerald-600">+23%</div>
            </div>
          </div>
          
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-400"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className={`text-gray-900 transition-all duration-300 ${hoveredCard === 1 ? 'text-emerald-600' : ''}`}>
                  1,247
                </div>
                <div className="text-xs text-gray-600 mt-0.5">Orders</div>
              </div>
              <div className="text-xs text-emerald-600">+18%</div>
            </div>
          </div>
          
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-400"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className={`text-gray-900 transition-all duration-300 ${hoveredCard === 2 ? 'text-emerald-600' : ''}`}>
                  15.2K
                </div>
                <div className="text-xs text-gray-600 mt-0.5">Customers</div>
              </div>
              <div className="text-xs text-emerald-600">+32%</div>
            </div>
          </div>
          
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-400"
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className={`text-gray-900 transition-all duration-300 ${hoveredCard === 3 ? 'text-emerald-600' : ''}`}>
                  +23%
                </div>
                <div className="text-xs text-gray-600 mt-0.5">Growth</div>
              </div>
              <div className="text-xs text-emerald-600">+5.2%</div>
            </div>
          </div>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-200 transition-all duration-300 hover:shadow-lg hover:border-emerald-400 group">
            <div className="text-sm text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              Sales by Category
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-1 text-xs mt-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Radar Chart */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-200 transition-all duration-300 hover:shadow-lg hover:border-emerald-400 group">
            <div className="text-sm text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              Performance Metrics
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#d1fae5" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar 
                  name="Score" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.5}
                  animationDuration={800}
                  className="cursor-pointer"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}



