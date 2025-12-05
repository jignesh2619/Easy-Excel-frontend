import React, { useState, useEffect } from "react";
import { SheetViewer } from "./SheetViewer";
import { AIChatbot } from "./AIChatbot";
import { ArrowLeft, Download, LayoutDashboard } from "lucide-react";
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
      };
      setPreviewData(updatedData);
      // Update sessionStorage
      sessionStorage.setItem('previewData', JSON.stringify(updatedData));
    }
  };

  const handleCellChange = (rowIndex: number, column: string, value: any) => {
    if (previewData) {
      const updatedData = [...previewData.data];
      if (!updatedData[rowIndex]) {
        updatedData[rowIndex] = {};
      }
      updatedData[rowIndex][column] = value;
      
      const updatedPreviewData = {
        ...previewData,
        data: updatedData,
      };
      setPreviewData(updatedPreviewData);
      // Update sessionStorage
      sessionStorage.setItem('previewData', JSON.stringify(updatedPreviewData));
    }
  };

  const handleDashboardClick = () => {
    // Clear preview data from sessionStorage to ensure we don't show preview on home
    sessionStorage.removeItem('previewData');
    // Navigate to home page
    window.location.href = '/';
  };

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
              <h1 className="text-lg font-semibold text-gray-900">Processed Sheet Preview</h1>
              <p className="text-sm text-gray-500">
                {previewData.data.length.toLocaleString()} rows • {previewData.columns.length} columns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDashboardClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
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

      {/* Sheet Viewer - Full Screen */}
      <div className="flex-1 overflow-hidden" style={{ paddingRight: '420px', zIndex: 1, height: '100%' }}>
        <div className="h-full w-full" style={{ height: '100%', width: '100%' }}>
          <SheetViewer
            data={previewData.data}
            columns={previewData.columns}
            rowCount={previewData.data.length}
            onDownload={handleDownload}
            onDataChange={handleCellChange}
          />
        </div>
      </div>

      {/* AI Chatbot */}
      {previewData.data && (
        <AIChatbot
          initialData={previewData.data}
          initialColumns={previewData.columns}
          onDataUpdate={handleDataUpdate}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
}

