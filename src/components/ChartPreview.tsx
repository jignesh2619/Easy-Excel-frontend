import React, { useState } from "react";
import { Download, Eye, EyeOff, Maximize2, X } from "lucide-react";
import { Button } from "./ui/button";
import { API_BASE_URL } from "../services/api";

interface ChartPreviewProps {
  chartUrl: string;
  chartType?: string;
  onDownload?: () => void;
}

export function ChartPreview({ chartUrl, chartType = "chart", onDownload }: ChartPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullChartUrl = chartUrl.startsWith('http') ? chartUrl : `${API_BASE_URL}${chartUrl}`;

  return (
    <>
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#00A878] hover:scale-[1.01]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-lg">Dashboard Preview</h3>
              <p className="text-sm text-white/90">
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsFullscreen(true)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
              title="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            {onDownload && (
              <Button
                onClick={onDownload}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>

        {/* Chart Content */}
        {isExpanded && (
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-4 shadow-inner border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:border-[#00A878]/30">
              <img
                src={fullChartUrl}
                alt={`${chartType} chart`}
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
        )}

        {/* Collapsed View */}
        {!isExpanded && (
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-2 shadow-inner border border-gray-200">
              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Click "Expand" to view chart</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={() => setIsFullscreen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={fullChartUrl}
              alt={`${chartType} chart - fullscreen`}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const errorDiv = target.nextElementSibling as HTMLElement;
                if (errorDiv) errorDiv.style.display = 'block';
              }}
            />
            <div className="hidden text-center py-8 text-white">
              <p>Failed to load chart image</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

