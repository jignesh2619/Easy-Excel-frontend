import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { getChartDownloadUrl, downloadFile, API_BASE_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

interface DashboardPreviewProps {
  onClose: () => void;
}

export function DashboardPreview({ onClose }: DashboardPreviewProps) {
  const [chartData, setChartData] = useState<{
    chart_url?: string;
    chart_urls?: string[];
    chart_type?: string;
    chart_types?: string[];
  } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    // Load chart data from sessionStorage
    const chartDataStr = sessionStorage.getItem('dashboardData');
    if (chartDataStr) {
      try {
        const data = JSON.parse(chartDataStr);
        setChartData(data);
      } catch (error) {
        console.error('Error parsing dashboard data:', error);
      }
    }
  }, []);

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

  // Determine chart URLs (single or multiple)
  const chartUrls = chartData.chart_urls || (chartData.chart_url ? [chartData.chart_url] : []);
  const chartTypes = chartData.chart_types || (chartData.chart_type ? [chartData.chart_type] : []);

  if (chartUrls.length === 0) {
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
                  {chartUrls.length} {chartUrls.length === 1 ? 'chart' : 'charts'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartUrls.map((chartUrl, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="p-4 bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {chartTypes[index] || `Chart ${index + 1}`}
                    </h3>
                  </div>
                  <Button
                    onClick={() => handleDownloadChart(chartUrl, index)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <img
                    src={`${API_BASE_URL}${chartUrl}`}
                    alt={`Chart ${index + 1}`}
                    className="w-full h-auto rounded"
                    style={{ maxHeight: '600px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
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

