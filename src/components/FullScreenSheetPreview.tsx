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
    row_count?: number;
  } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: string} | null>(null);
  const [selectedCellValue, setSelectedCellValue] = useState<string>("");
  const [formulaBarValue, setFormulaBarValue] = useState<string>("");
  const [isEditingFormulaBar, setIsEditingFormulaBar] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const historyRef = useRef<Array<typeof previewData>>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoingRef = useRef<boolean>(false);
  const { user, session } = useAuth();

  const addToHistory = (newState: typeof previewData) => {
    if (!newState || isUndoingRef.current) return;
    const currentState = historyRef.current[historyIndexRef.current];
    if (!currentState || JSON.stringify(currentState) !== JSON.stringify(newState)) {
      // Remove any future history if we're not at the end
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(JSON.parse(JSON.stringify(newState)));
      historyIndexRef.current = historyRef.current.length - 1;
      // Limit history to 50 states
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
        historyIndexRef.current = historyRef.current.length - 1;
      }
      setCanUndo(historyIndexRef.current > 0);
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
      setCanUndo(historyIndexRef.current > 0);
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 0);
    }
  };

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
        setCanUndo(false);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    }
  }, []);

  // Add to history when previewData changes (but not during undo)
  useEffect(() => {
    if (previewData && !isUndoingRef.current) {
      addToHistory(previewData);
    }
  }, [previewData]);

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
        row_count: newResult.row_count,
      };
      setPreviewData(updatedData);
      // Update sessionStorage
      sessionStorage.setItem('previewData', JSON.stringify(updatedData));
      // History will be added via useEffect
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
      // Update formula bar if this is the selected cell
      if (selectedCell && selectedCell.row === rowIndex && selectedCell.col === column) {
        setSelectedCellValue(value ? String(value) : '');
        setFormulaBarValue(value ? String(value) : '');
      }
      // History will be added via useEffect
    }
  };

  const handleDashboardClick = () => {
    // Navigate to dashboard page
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
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
    <div className="h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ marginRight: '420px', minWidth: 0 }}>
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
                <h1 className="text-sm font-medium text-gray-700">processed_data</h1>
                <p className="text-xs text-gray-500">
                  {previewData.data.length.toLocaleString()} rows • {previewData.columns.length} columns
                  {previewData.row_count && previewData.row_count > previewData.data.length && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                      Showing {previewData.data.length.toLocaleString()} preview rows • Changes applied to all {previewData.row_count.toLocaleString()} rows
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleUndo}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={!canUndo}
                title="Undo last change"
              >
                <Undo2 className="w-4 h-4" />
                Undo
              </Button>
              <Button
                onClick={handleDashboardClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                title="Go to Dashboard"
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

        {/* Sheet Container - Windowed View */}
        <div className="flex-1 p-4" style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-300" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
            {/* Spreadsheet Title Bar */}
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700">Processed Data</span>
              </div>
            </div>

            {/* Formula Bar */}
            <div className="bg-gray-50 border-b border-gray-300 px-3 py-1 flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-mono text-gray-600 w-12">
                {selectedCell 
                  ? `${(() => {
                      const colIndex = previewData.columns.indexOf(selectedCell.col);
                      if (colIndex === -1) return selectedCell.col;
                      let result = '';
                      let index = colIndex;
                      index++;
                      while (index > 0) {
                        index--;
                        result = String.fromCharCode(65 + (index % 26)) + result;
                        index = Math.floor(index / 26);
                      }
                      return result;
                    })()}${selectedCell.row + 1}`
                  : 'A1'}
              </span>
              {isEditingFormulaBar && selectedCell ? (
                <input
                  type="text"
                  value={formulaBarValue}
                  onChange={(e) => setFormulaBarValue(e.target.value)}
                  onBlur={() => {
                    if (selectedCell) {
                      handleCellChange(selectedCell.row, selectedCell.col, formulaBarValue);
                      setIsEditingFormulaBar(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (selectedCell) {
                        handleCellChange(selectedCell.row, selectedCell.col, formulaBarValue);
                        setIsEditingFormulaBar(false);
                      }
                    } else if (e.key === 'Escape') {
                      setFormulaBarValue(selectedCellValue);
                      setIsEditingFormulaBar(false);
                    }
                  }}
                  autoFocus
                  className="flex-1 bg-white border border-blue-500 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div 
                  className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 cursor-text hover:border-gray-400 transition-colors"
                  onClick={() => {
                    if (selectedCell) {
                      setIsEditingFormulaBar(true);
                    }
                  }}
                >
                  <span className="text-xs text-gray-700">{selectedCellValue || ''}</span>
                </div>
              )}
            </div>

            {/* Sheet Viewer */}
            <div 
              className="flex-1" 
              style={{ 
                minHeight: 0,
                minWidth: 0,
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'auto'
              }}
            >
              <SheetViewer
                data={previewData.data}
                columns={previewData.columns}
                rowCount={previewData.data.length}
                formatting_metadata={previewData.formatting_metadata}
                onDownload={handleDownload}
                onDataChange={handleCellChange}
                onCellSelect={(row, col, value) => {
                  setSelectedCell({ row, col });
                  const cellValue = value ? String(value) : '';
                  setSelectedCellValue(cellValue);
                  setFormulaBarValue(cellValue);
                  setIsEditingFormulaBar(false);
                }}
              />
            </div>
          </div>
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
