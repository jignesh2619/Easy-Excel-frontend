import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, BarChart3, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { getChartDownloadUrl, downloadFile, API_BASE_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { AIChatbot } from "./AIChatbot";
import { InteractiveChart } from "./InteractiveChart";
import { TokenDisplay } from "./TokenDisplay";

interface DashboardPreviewProps {
  onClose: () => void;
}

export function DashboardPreview({ onClose }: DashboardPreviewProps) {
  const [chartData, setChartData] = useState<{
    chart_url?: string;
    chart_urls?: string[];
    chart_type?: string;
    chart_types?: string[];
    chart_data?: any;  // Single chart data object
    chart_data_list?: any[];  // Array of chart data objects
    data?: Record<string, any>[];
    columns?: string[];
    tokens_used?: number;
    tokens_limit?: number;
    tokens_remaining?: number;
  } | null>(null);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    // Load chart data from sessionStorage
    const chartDataStr = sessionStorage.getItem('dashboardData');
    const previewDataStr = sessionStorage.getItem('previewData');
    
    if (chartDataStr) {
      try {
        const data = JSON.parse(chartDataStr);
        setChartData(data);
      } catch (error) {
        console.error('Error parsing dashboard data:', error);
      }
    }
    
    // Also load preview data for chatbot
    if (previewDataStr) {
      try {
        const previewData = JSON.parse(previewDataStr);
        setChartData(prev => ({
          ...prev,
          data: previewData.data,
          columns: previewData.columns,
        }));
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
  }, []);

  const handleDataUpdate = (newResult: any) => {
    // Update chart data when chatbot processes new changes
    if (newResult.chart_url || newResult.chart_urls || newResult.chart_data) {
      const updatedData = {
        ...chartData,
        chart_url: newResult.chart_url || chartData?.chart_url,
        chart_urls: newResult.chart_urls || chartData?.chart_urls,
        chart_type: newResult.chart_type || chartData?.chart_type,
        chart_types: newResult.chart_types || chartData?.chart_types,
        chart_data: newResult.chart_data || chartData?.chart_data,
        chart_data_list: newResult.chart_data_list || (Array.isArray(newResult.chart_data) ? newResult.chart_data : chartData?.chart_data_list),
        data: newResult.processed_data || chartData?.data,
        columns: newResult.columns || chartData?.columns,
        tokens_used: newResult.tokens_used,
        tokens_limit: newResult.tokens_limit,
        tokens_remaining: newResult.tokens_remaining,
      };
      setChartData(updatedData);
      // Update sessionStorage
      sessionStorage.setItem('dashboardData', JSON.stringify(updatedData));
    }
  };

  const nextChart = () => {
    if (chartData && chartCount > 0) {
      setCurrentChartIndex((prev) => (prev + 1) % chartCount);
    }
  };

  const prevChart = () => {
    if (chartData && chartCount > 0) {
      setCurrentChartIndex((prev) => (prev - 1 + chartCount) % chartCount);
    }
  };

  const handleDownloadChart = async (chartUrl: string, index?: number) => {
    if (!user || !session) {
      setShowAuthModal(true);
      return;
    }

    try {
      const filename = chartUrl.split('/').pop() || `chart-${index || 0}.png`;
      await downloadFile(`${API_BASE_URL}${chartUrl}`, filename);
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('Authentication')) {
        setShowAuthModal(true);
      } else {
        console.error('Failed to download chart:', error);
      }
    }
  };

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No dashboard preview available</p>
          <Button onClick={onClose} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Determine chart data (prefer interactive chart data over image URLs)
  const chartDataList = chartData?.chart_data_list || (chartData?.chart_data ? [chartData.chart_data] : []);
  const chartUrls = chartData?.chart_urls || (chartData?.chart_url ? [chartData.chart_url] : []);
  const chartTypes = chartData?.chart_types || (chartData?.chart_type ? [chartData.chart_type] : []);

  // Use chart_data_list length if available, otherwise fall back to chartUrls
  const chartCount = chartDataList.length > 0 ? chartDataList.length : chartUrls.length;

  if (!chartData || (chartDataList.length === 0 && chartUrls.length === 0)) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex flex-col" style={{ height: '100vh', width: '100vw' }}>
        {/* Top Bar - Fixed Height */}
        <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-40">
          <div className="w-full px-4 py-3 flex items-center justify-between">
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
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00A878]" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Dashboard Preview</h1>
                  <p className="text-sm text-gray-500">No dashboard preview available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No dashboard preview available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentChartUrl = chartUrls[currentChartIndex];
  const currentChartData = chartDataList[currentChartIndex];
  const currentChartType = chartTypes[currentChartIndex] || currentChartData?.chart_type || `Chart ${currentChartIndex + 1}`;

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col" style={{ height: '100vh', width: '100vw' }}>
      {/* Top Bar - Fixed Height */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-40">
        <div className="w-full px-4 py-3 flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#00A878]" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Dashboard Preview</h1>
                <p className="text-sm text-gray-500">
                  Chart {currentChartIndex + 1} of {chartCount}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Token Display */}
            <TokenDisplay
              tokensUsed={chartData.tokens_used}
              tokensLimit={chartData.tokens_limit}
              tokensRemaining={chartData.tokens_remaining}
              compact={true}
            />
            {currentChartUrl && (
              <Button
                onClick={() => handleDownloadChart(currentChartUrl, currentChartIndex)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Chart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Takes Remaining Space */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0, position: 'relative' }}>
        {/* Chart Viewer - Full Width, Scrollable */}
        <div 
          className="h-full w-full overflow-auto" 
          style={{ 
            overflowX: 'auto',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingRight: '0px' // No padding - chatbot will overlay
          }}
        >
          <div className="p-4" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg flex flex-col" style={{ height: '100%', width: '100%' }}>
              {/* Chart Header */}
              <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold text-lg">{currentChartType}</h3>
                    <p className="text-sm text-white/90">
                      {chartCount} {chartCount === 1 ? 'chart' : 'charts'} total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chartCount > 1 && (
                    <>
                      <Button
                        onClick={prevChart}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        disabled={chartCount <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-white/90 px-2">
                        {currentChartIndex + 1} / {chartCount}
                      </span>
                      <Button
                        onClick={nextChart}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        disabled={chartCount <= 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Chart Content - Fixed Size */}
              <div className="flex-1 overflow-auto p-8 flex items-center justify-center" style={{ minHeight: 0 }}>
                <div style={{ width: '100%', maxWidth: '1200px', height: '600px' }}>
                  {currentChartData ? (
                    <InteractiveChart chartData={currentChartData} />
                  ) : currentChartUrl ? (
                    <img
                      src={`${API_BASE_URL}${currentChartUrl}`}
                      alt={currentChartType}
                      className="w-full h-full object-contain rounded"
                      style={{ maxHeight: '600px', maxWidth: '100%' }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No chart data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbot - Fixed Position Overlay */}
        {chartData.data && chartData.columns && (
          <AIChatbot
            initialData={chartData.data}
            initialColumns={chartData.columns}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
}

