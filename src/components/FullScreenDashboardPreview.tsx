import React, { useState, useEffect } from "react";
import { ChartViewer } from "./ChartViewer";
import { AIChatbot } from "./AIChatbot";
import { ArrowLeft, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface FullScreenDashboardPreviewProps {
  onClose: () => void;
}

interface ChartData {
  chartUrl: string;
  chartType: string;
  title?: string;
}

export function FullScreenDashboardPreview({ onClose }: FullScreenDashboardPreviewProps) {
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [previewData, setPreviewData] = useState<{
    data: Record<string, any>[];
    columns: string[];
  } | null>(null);

  useEffect(() => {
    // Load dashboard data from sessionStorage
    const chartViewerDataStr = sessionStorage.getItem('chartViewerData');
    const previewDataStr = sessionStorage.getItem('previewData');
    
    if (chartViewerDataStr) {
      try {
        const data = JSON.parse(chartViewerDataStr);
        if (data.charts && Array.isArray(data.charts) && data.charts.length > 0) {
          setChartData(data.charts);
        }
      } catch (error) {
        console.error('Error parsing chart viewer data:', error);
      }
    }

    // Also load preview data for the chatbot
    if (previewDataStr) {
      try {
        const data = JSON.parse(previewDataStr);
        setPreviewData(data);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
  }, []);

  const handleDataUpdate = (newResult: any) => {
    // Update chart data when chatbot creates new dashboard
    if (newResult.chart_url) {
      const newChart: ChartData = {
        chartUrl: newResult.chart_url,
        chartType: newResult.chart_type || 'chart',
        title: newResult.chart_title,
      };
      
      const updatedCharts = chartData ? [...chartData, newChart] : [newChart];
      setChartData(updatedCharts);
      
      // Save to sessionStorage
      sessionStorage.setItem('chartViewerData', JSON.stringify({
        charts: updatedCharts
      }));
    }

    // Update preview data if available
    if (newResult.processed_data && newResult.columns) {
      const updatedData = {
        data: newResult.processed_data,
        columns: newResult.columns,
      };
      setPreviewData(updatedData);
      sessionStorage.setItem('previewData', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('previewData') || '{}'),
        ...updatedData
      }));
    }
  };

  // No dashboard available - show empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
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
                <h1 className="text-lg font-semibold text-gray-900">Dashboard Preview</h1>
                <p className="text-sm text-gray-500">No dashboard available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center" style={{ paddingRight: '420px' }}>
          <div className="text-center max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00A878]/10 to-[#00c98c]/10 rounded-full flex items-center justify-center">
                <LayoutDashboard className="w-12 h-12 text-[#00A878]" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Dashboard Available</h2>
            <p className="text-gray-600 mb-6">
              You haven't created a dashboard yet. Use the AI Assistant on the right to create one by asking for charts, visualizations, or KPIs.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Try: "Create a dashboard with visualizations"</span>
            </div>
          </div>
        </div>

        {/* AI Chatbot */}
        {previewData && (
          <AIChatbot
            initialData={previewData.data}
            initialColumns={previewData.columns}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </div>
    );
  }

  // Dashboard available - show charts
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
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
              <h1 className="text-lg font-semibold text-gray-900">Dashboard Preview</h1>
              <p className="text-sm text-gray-500">
                {chartData.length} {chartData.length === 1 ? 'chart' : 'charts'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Viewer - Full Screen */}
      <div className="flex-1 overflow-hidden" style={{ paddingRight: '420px', zIndex: 1, height: '100%' }}>
        <div className="h-full w-full" style={{ height: '100%', width: '100%' }}>
          <ChartViewer
            charts={chartData}
            onClose={onClose}
          />
        </div>
      </div>

      {/* AI Chatbot */}
      {previewData && (
        <AIChatbot
          initialData={previewData.data}
          initialColumns={previewData.columns}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
}

