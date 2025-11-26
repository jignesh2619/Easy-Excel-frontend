import React, { useState, useEffect } from "react";
import { X, Download, Maximize2, Minimize2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { API_BASE_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface ChartData {
  chartUrl: string;
  chartType: string;
  title?: string;
}

interface ChartViewerProps {
  charts: ChartData[];
  onClose: () => void;
}

export function ChartViewer({ charts, onClose }: ChartViewerProps) {
  const [expandedChart, setExpandedChart] = useState<number | null>(null);
  const [chartImages, setChartImages] = useState<Map<number, string>>(new Map());
  const { user, session } = useAuth();

  // Load chart images with authentication
  useEffect(() => {
    const loadChartImages = async () => {
      const imageMap = new Map<number, string>();
      
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        const chartUrl = chart.chartUrl.startsWith('http') 
          ? chart.chartUrl 
          : `${API_BASE_URL}${chart.chartUrl}`;
        
        try {
          // Try to load image with authentication if user is logged in
          if (user && session?.access_token) {
            const response = await fetch(chartUrl, {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            });
            
            if (response.ok) {
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              imageMap.set(i, imageUrl);
            } else {
              // Fallback to direct URL
              imageMap.set(i, chartUrl);
            }
          } else {
            // No auth, try direct URL
            imageMap.set(i, chartUrl);
          }
        } catch (error) {
          console.error(`Failed to load chart ${i}:`, error);
          // Fallback to direct URL
          imageMap.set(i, chartUrl);
        }
      }
      
      setChartImages(imageMap);
    };

    if (charts.length > 0) {
      loadChartImages();
    }

    // Cleanup blob URLs on unmount or when charts change
    return () => {
      setChartImages((prevMap) => {
        prevMap.forEach((url) => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        return new Map();
      });
    };
  }, [charts, user, session]);

  const handleDownloadChart = async (chartUrl: string, chartType: string) => {
    const filename = chartUrl.split('/').pop() || `chart_${chartType}.png`;
    const fullUrl = chartUrl.startsWith('http') ? chartUrl : `${API_BASE_URL}${chartUrl}`;
    
    try {
      const headers: HeadersInit = {};
      if (user && session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(fullUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download chart:', error);
      alert('Failed to download chart. Please try again.');
    }
  };

  const getChartImageUrl = (index: number, chartUrl: string): string => {
    // Use loaded image blob URL if available
    const loadedUrl = chartImages.get(index);
    if (loadedUrl) {
      return loadedUrl;
    }
    // Fallback to direct URL (will try to load, may need auth)
    const fullUrl = chartUrl.startsWith('http') ? chartUrl : `${API_BASE_URL}${chartUrl}`;
    return fullUrl;
  };

  if (charts.length === 0) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Charts Available</h2>
          <p className="text-gray-600 mb-6">No charts were generated for this session.</p>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-bold text-xl">Chart Dashboard</h2>
              <p className="text-sm text-white/90">
                {charts.length} chart{charts.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Charts Grid */}
        <div className="p-6">
          {expandedChart !== null ? (
            // Show only expanded chart in full width
            <div className="grid grid-cols-1 gap-6">
              {charts[expandedChart] && (
                <div
                  key={expandedChart}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#00A878] w-full"
                >
                  {/* Chart Header */}
                  <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {charts[expandedChart].title || `${charts[expandedChart].chartType.charAt(0).toUpperCase() + charts[expandedChart].chartType.slice(1)} Chart ${expandedChart + 1}`}
                      </span>
                      <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded">
                        {charts[expandedChart].chartType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setExpandedChart(null)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                        title="Minimize"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDownloadChart(charts[expandedChart].chartUrl, charts[expandedChart].chartType)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                        title="Download chart"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Chart Image - Expanded */}
                  <div className="p-6 bg-white">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:border-[#00A878]/30">
                      {chartImages.has(expandedChart) ? (
                        <img
                          src={getChartImageUrl(expandedChart, charts[expandedChart].chartUrl)}
                          alt={`${charts[expandedChart].chartType} chart ${expandedChart + 1}`}
                          className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const errorDiv = target.nextElementSibling as HTMLElement;
                            if (errorDiv) errorDiv.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-[#00A878]" />
                        </div>
                      )}
                      <div className="hidden text-center py-8 text-gray-500">
                        <p className="font-medium">Failed to load chart image</p>
                        <p className="text-sm mt-2 text-gray-400">The chart may still be available for download</p>
                        <Button
                          onClick={() => handleDownloadChart(charts[expandedChart].chartUrl, charts[expandedChart].chartType)}
                          className="mt-4 bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Chart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show all charts in grid
            <div className={`grid gap-6 ${
              charts.length === 1 
                ? 'grid-cols-1' 
                : charts.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {charts.map((chart, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#00A878] hover:scale-[1.02]"
                >
                {/* Chart Header */}
                <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {chart.title || `${chart.chartType.charAt(0).toUpperCase() + chart.chartType.slice(1)} Chart ${index + 1}`}
                    </span>
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded">
                      {chart.chartType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setExpandedChart(index)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                      title="Expand"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDownloadChart(chart.chartUrl, chart.chartType)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                      title="Download chart"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Chart Image */}
                <div className="p-4 bg-white">
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:border-[#00A878]/30">
                    {chartImages.has(index) ? (
                      <img
                        src={getChartImageUrl(index, chart.chartUrl)}
                        alt={`${chart.chartType} chart ${index + 1}`}
                        className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const errorDiv = target.nextElementSibling as HTMLElement;
                          if (errorDiv) errorDiv.style.display = 'block';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#00A878]" />
                      </div>
                    )}
                    <div className="hidden text-center py-6 text-gray-500">
                      <p className="font-medium">Failed to load chart image</p>
                      <p className="text-sm mt-2 text-gray-400">The chart may still be available for download</p>
                      <Button
                        onClick={() => handleDownloadChart(chart.chartUrl, chart.chartType)}
                        className="mt-3 bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white text-sm"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <strong>Tip:</strong> Click the expand icon to view charts in full size
          </div>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white"
          >
            Close Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

