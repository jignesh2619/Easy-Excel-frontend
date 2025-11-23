import { X, Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

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

  const handleDownloadChart = async (chartUrl: string, chartType: string) => {
    const filename = chartUrl.split('/').pop() || `chart_${chartType}.png`;
    const fullUrl = chartUrl.startsWith('http') ? chartUrl : `http://localhost:8000${chartUrl}`;
    
    try {
      const response = await fetch(fullUrl);
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

  const getFullChartUrl = (chartUrl: string) => {
    return chartUrl.startsWith('http') ? chartUrl : `http://localhost:8000${chartUrl}`;
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
                      <img
                        src={getFullChartUrl(charts[expandedChart].chartUrl)}
                        alt={`${charts[expandedChart].chartType} chart ${expandedChart + 1}`}
                        className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const errorDiv = target.nextElementSibling as HTMLElement;
                          if (errorDiv) errorDiv.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-center py-8 text-gray-500">
                        <p>Failed to load chart image</p>
                        <p className="text-sm mt-2">The chart may still be available for download</p>
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
                    <img
                      src={getFullChartUrl(chart.chartUrl)}
                      alt={`${chart.chartType} chart ${index + 1}`}
                      className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = target.nextElementSibling as HTMLElement;
                        if (errorDiv) errorDiv.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center py-8 text-gray-500">
                      <p>Failed to load chart image</p>
                      <p className="text-sm mt-2">The chart may still be available for download</p>
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

