import React, { useState, useEffect, useRef } from "react";
import { SheetViewer } from "./SheetViewer";
import { AIChatbot } from "./AIChatbot";
import { ArrowLeft, Download, Undo2, LayoutDashboard } from "lucide-react";
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
  const historyRef = useRef<Array<{
    data: Record<string, any>[];
    columns: string[];
    formatting_metadata?: any;
    processed_file_url?: string;
  }>>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoingRef = useRef<boolean>(false);

  useEffect(() => {
    // Load preview data from sessionStorage
    const previewDataStr = sessionStorage.getItem('previewData');
    if (previewDataStr) {
      try {
        const data = JSON.parse(previewDataStr);
        setPreviewData(data);
        // Initialize history with the loaded data
        historyRef.current = [JSON.parse(JSON.stringify(data))];
        historyIndexRef.current = 0;
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
  }, []);

  const addToHistory = (newState: typeof previewData) => {
    if (!newState || isUndoingRef.current) return;
    
    const currentState = historyRef.current[historyIndexRef.current];
    // Only add if state actually changed
    if (JSON.stringify(currentState) !== JSON.stringify(newState)) {
      // Remove any future history if we're not at the end
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      // Add new state (deep copy)
      historyRef.current.push(JSON.parse(JSON.stringify(newState)));
      historyIndexRef.current = historyRef.current.length - 1;
      // Limit history to last 50 states
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
        historyIndexRef.current = historyRef.current.length - 1;
      }
    }
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      isUndoingRef.current = true;
      historyIndexRef.current--;
      const previousState = historyRef.current[historyIndexRef.current];
      const restoredState = JSON.parse(JSON.stringify(previousState));
      setPreviewData(restoredState);
      sessionStorage.setItem('previewData', JSON.stringify(restoredState));
      // Reset flag after state update
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 0);
    }
  };

  const canUndo = historyIndexRef.current > 0;

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
      // Add to history
      addToHistory(updatedData);
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
      // Add to history
      addToHistory(updatedPreviewData);
    }
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
              onClick={() => {
                window.history.pushState({}, '', '/dashboard');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              onClick={handleUndo}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={!canUndo}
            >
              <Undo2 className="w-4 h-4" />
              Undo
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

