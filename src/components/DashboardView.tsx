import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AIChatbot } from "./AIChatbot";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter
} from "recharts";

interface ChartConfig {
  chart_type: string;
  x_column: string;
  y_column: string;
  title?: string;
  description?: string;
}

interface DashboardData {
  id: string;
  title: string;
  charts: ChartConfig[];
  data: Record<string, any>[];
  columns: string[];
  createdAt: Date;
}

interface DashboardViewProps {
  onClose: () => void;
}

const DASHBOARD_STORAGE_KEY = 'dashboard-data';

export function DashboardView({ onClose }: DashboardViewProps) {
  const [dashboards, setDashboards] = useState<DashboardData[]>([]);
  const [currentDashboardIndex, setCurrentDashboardIndex] = useState(0);
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [currentData, setCurrentData] = useState<Record<string, any>[]>([]);
  const [currentColumns, setCurrentColumns] = useState<string[]>([]);

  // Load dashboards from sessionStorage
  // Load dashboards from sessionStorage
  useEffect(() => {
    const loadDashboards = () => {
      try {
        const stored = sessionStorage.getItem(DASHBOARD_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const dashboardsWithDates = parsed.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt),
          }));
          setDashboards(dashboardsWithDates);
          if (dashboardsWithDates.length > 0) {
            setCurrentDashboardIndex(0);
            setCurrentData(dashboardsWithDates[0].data);
            setCurrentColumns(dashboardsWithDates[0].columns);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading dashboards:', error);
      }

      // Also try to load preview data for chatbot if no dashboard data exists
      try {
        const previewDataStr = sessionStorage.getItem('previewData');
        if (previewDataStr) {
          const previewData = JSON.parse(previewDataStr);
          if (previewData.data && previewData.columns) {
            setCurrentData(previewData.data);
            setCurrentColumns(previewData.columns);
          }
        }
      } catch (error) {
        console.error('Error loading preview data:', error);
      }
    };

    loadDashboards();

    // Listen for storage events (when dashboard is created from another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DASHBOARD_STORAGE_KEY) {
        loadDashboards();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update current data when dashboard changes
  useEffect(() => {
    if (currentDashboard) {
      setCurrentData(currentDashboard.data);
      setCurrentColumns(currentDashboard.columns);
    }
  }, [currentDashboardIndex, dashboards]);

  const handleDataUpdate = (newResult: any) => {
    // Check if the result contains chart configurations
    const actionPlan = newResult.action_plan;
    if (actionPlan) {
      const chartConfig = actionPlan.chart_config;
      const chartConfigs = actionPlan.chart_configs;
      
      if (chartConfig || chartConfigs) {
        const charts: ChartConfig[] = chartConfigs 
          ? chartConfigs.map((c: any) => ({
              chart_type: c.chart_type || 'bar',
              x_column: c.x_column,
              y_column: c.y_column,
              title: c.title,
              description: c.description,
            }))
          : chartConfig 
            ? [{
                chart_type: chartConfig.chart_type || 'bar',
                x_column: chartConfig.x_column,
                y_column: chartConfig.y_column,
                title: chartConfig.title,
                description: chartConfig.description,
              }]
            : [];

        if (charts.length > 0) {
          const newDashboard: DashboardData = {
            id: Date.now().toString(),
            title: `Dashboard ${dashboards.length + 1}`,
            charts,
            data: newResult.processed_data || newResult.data || currentData,
            columns: newResult.columns || currentColumns,
            createdAt: new Date(),
          };

          const updatedDashboards = [...dashboards, newDashboard];
          setDashboards(updatedDashboards);
          setCurrentDashboardIndex(updatedDashboards.length - 1);
          setCurrentData(newDashboard.data);
          setCurrentColumns(newDashboard.columns);
          
          // Save to sessionStorage
          sessionStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(updatedDashboards));
        }
      }
    }

    // Update current data if it changed
    if (newResult.processed_data) {
      setCurrentData(newResult.processed_data);
      setCurrentColumns(newResult.columns || currentColumns);
    }
  };

  const currentDashboard = dashboards[currentDashboardIndex];

  const handlePrevious = () => {
    if (currentDashboardIndex > 0) {
      setCurrentDashboardIndex(currentDashboardIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentDashboardIndex < dashboards.length - 1) {
      setCurrentDashboardIndex(currentDashboardIndex + 1);
    }
  };

  // Prepare chart data from dashboard data
  const prepareChartData = (chart: ChartConfig, data: Record<string, any>[]) => {
    if (!data || data.length === 0) return [];

    const xCol = chart.x_column;
    const yCol = chart.y_column;

    if (!xCol || !yCol) return [];

    // For pie charts, aggregate by x_column and sum y_column
    if (chart.chart_type === 'pie') {
      const aggregated: Record<string, number> = {};
      data.forEach(row => {
        const key = String(row[xCol] || '');
        const value = parseFloat(row[yCol]) || 0;
        aggregated[key] = (aggregated[key] || 0) + value;
      });
      return Object.entries(aggregated).map(([name, value]) => ({
        name,
        value,
      }));
    }

    // For other charts, return data as-is (may need aggregation in future)
    return data.map(row => ({
      [xCol]: row[xCol],
      [yCol]: parseFloat(row[yCol]) || 0,
    }));
  };

  const renderChart = (chart: ChartConfig, index: number) => {
    const chartData = prepareChartData(chart, currentDashboard.data);
    
    if (chartData.length === 0) {
      return (
        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{chart.title || `Chart ${index + 1}`}</h3>
          <p className="text-gray-500">No data available for this chart.</p>
        </div>
      );
    }

    const colors = ['#00A878', '#00c98c', '#10b981', '#14b8a6', '#22c55e', '#059669'];
    const chartColor = colors[index % colors.length];

    switch (chart.chart_type) {
      case 'bar':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{chart.title || `Bar Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={chart.x_column} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey={chart.y_column} 
                  fill={chartColor}
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{chart.title || `Line Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={chart.x_column} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={chart.y_column} 
                  stroke={chartColor}
                  strokeWidth={3}
                  dot={{ fill: chartColor, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{chart.title || `Pie Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{chart.title || `Area Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={chart.x_column} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={chart.y_column} 
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.6}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{chart.title || `Scatter Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={chart.x_column} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  dataKey={chart.y_column}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Scatter 
                  dataKey={chart.y_column} 
                  fill={chartColor}
                  animationDuration={800}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{chart.title || `Chart ${index + 1}`}</h3>
            <p className="text-gray-500">Unsupported chart type: {chart.chart_type}</p>
          </div>
        );
    }
  };

  // Empty state
  if (dashboards.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col" style={{ marginRight: isChatbotOpen ? '420px' : '0' }}>
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-sm font-medium text-gray-700">Dashboard</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#00A878]/10 to-[#00c98c]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-[#00A878]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Dashboards Yet</h2>
              <p className="text-gray-600 mb-6">
                To create a dashboard, tell the chatbot to create charts or visualizations. 
                For example: "Create a bar chart of revenue by region" or "Create a dashboard with multiple charts".
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm font-semibold text-blue-900 mb-2">Example prompts:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>"Create a bar chart of sales by category"</li>
                  <li>"Show me revenue trends with a line chart"</li>
                  <li>"Create a pie chart showing distribution by region"</li>
                  <li>"Generate a dashboard with multiple charts"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbot */}
        {currentData.length > 0 && (
          <AIChatbot
            initialData={currentData}
            initialColumns={currentColumns}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ marginRight: isChatbotOpen ? '420px' : '0', minWidth: 0 }}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-sm font-medium text-gray-700">{currentDashboard.title}</h1>
                <p className="text-xs text-gray-500">
                  Dashboard {currentDashboardIndex + 1} of {dashboards.length} • {currentDashboard.charts.length} chart{currentDashboard.charts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
                disabled={currentDashboardIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                size="sm"
                disabled={currentDashboardIndex === dashboards.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content - Scrollable with Horizontal Scroll */}
        <div className="flex-1 p-4 overflow-y-auto overflow-x-auto" style={{ minWidth: 0 }}>
          <div className="max-w-7xl mx-auto space-y-6" style={{ minWidth: 'max-content', width: '100%' }}>
            {currentDashboard.charts.map((chart, index) => renderChart(chart, index))}
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {currentData.length > 0 && (
        <AIChatbot
          initialData={currentData}
          initialColumns={currentColumns}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
}

