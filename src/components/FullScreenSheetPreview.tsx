import React, { useState, useEffect } from "react";
import { SheetViewer } from "./SheetViewer";
import { AIChatbot } from "./AIChatbot";
import { TokenDisplay } from "./TokenDisplay";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "./ui/button";
import { getFileDownloadUrl, downloadFile } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

interface FullScreenSheetPreviewProps {
  onClose: () => void;
}

export function FullScreenSheetPreview({ onClose }: FullScreenSheetPreviewProps) {
  const [previewData, setPreviewData] = useState<{
    data: Record<string, any>[];
    columns: string[];
    formatting_metadata?: any;
    processed_file_url?: string;
    chart_url?: string;
    chart_urls?: string[];
    chart_type?: string;
    chart_types?: string[];
    tokens_used?: number;
    tokens_limit?: number;
    tokens_remaining?: number;
  } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    // Load preview data from sessionStorage
    const previewDataStr = sessionStorage.getItem('previewData');
    if (previewDataStr) {
      try {
        const data = JSON.parse(previewDataStr);
        setPreviewData(data);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
  }, []);

  const handleDownload = async () => {
    if (!user || !session) {
      setShowAuthModal(true);
      return;
    }

    if (previewData?.processed_file_url) {
      try {
        const filename = previewData.processed_file_url.split('/').pop() || 'processed.xlsx';
        await downloadFile(getFileDownloadUrl(filename), filename);
      } catch (error: any) {
        if (error.message?.includes('401') || error.message?.includes('Authentication')) {
          setShowAuthModal(true);
        } else {
          console.error('Failed to download file:', error);
        }
      }
    }
  };

  const handleDataUpdate = (newResult: any) => {
    // Update preview data when chatbot processes new changes
    if (newResult.processed_data && newResult.columns) {
      const updatedData = {
        data: newResult.processed_data,
        columns: newResult.columns,
        formatting_metadata: newResult.formatting_metadata,
        processed_file_url: newResult.processed_file_url,
        chart_url: newResult.chart_url || previewData?.chart_url,
        chart_urls: newResult.chart_urls || previewData?.chart_urls,
        chart_data: newResult.chart_data || previewData?.chart_data,
        chart_data_list: newResult.chart_data_list || (Array.isArray(newResult.chart_data) ? newResult.chart_data : previewData?.chart_data_list),
        chart_type: newResult.chart_type || previewData?.chart_type,
        chart_types: newResult.chart_types || previewData?.chart_types,
        tokens_used: newResult.tokens_used,
        tokens_limit: newResult.tokens_limit,
        tokens_remaining: newResult.tokens_remaining,
      };
      setPreviewData(updatedData);
      // Update sessionStorage
      sessionStorage.setItem('previewData', JSON.stringify(updatedData));
    }
  };

  const handleDashboardClick = () => {
    // Store dashboard data in sessionStorage
    if (previewData?.chart_url || previewData?.chart_urls || previewData?.chart_data) {
      const dashboardData = {
        chart_url: previewData.chart_url,
        chart_urls: previewData.chart_urls,
        chart_data: previewData.chart_data,
        chart_data_list: Array.isArray(previewData.chart_data) ? previewData.chart_data : (previewData.chart_data ? [previewData.chart_data] : undefined),
        chart_type: previewData.chart_type,
        chart_types: previewData.chart_types,
        data: previewData.data,
        columns: previewData.columns,
      };
      sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
      // Navigate to dashboard preview
      window.history.pushState({}, '', '/preview-dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const hasDashboard = !!(previewData?.chart_url || previewData?.chart_urls || previewData?.chart_data);

  if (!previewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No preview data available</p>
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
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Processed Sheet Preview</h1>
              <p className="text-sm text-gray-500">
                {previewData.data.length.toLocaleString()} rows • {previewData.columns.length} columns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Token Display */}
            <TokenDisplay
              tokensUsed={previewData.tokens_used}
              tokensLimit={previewData.tokens_limit}
              tokensRemaining={previewData.tokens_remaining}
              compact={true}
            />
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Takes Remaining Space */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0, position: 'relative' }}>
        {/* Sheet Viewer - Full Width, Scrollable */}
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
            <SheetViewer
              data={previewData.data}
              columns={previewData.columns}
              rowCount={previewData.data.length}
              onDownload={handleDownload}
              hasDashboard={hasDashboard}
              onDashboardClick={handleDashboardClick}
            />
          </div>
        </div>

        {/* AI Chatbot - Fixed Position Overlay */}
        {previewData.data && (
          <AIChatbot
            initialData={previewData.data}
            initialColumns={previewData.columns}
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
