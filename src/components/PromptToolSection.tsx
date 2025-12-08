import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Upload, Sparkles, Loader2, CheckCircle2, AlertCircle, X, Download, Eye, BarChart3, FileSpreadsheet } from "lucide-react";
import { processFile, getFileDownloadUrl, getChartDownloadUrl, downloadFile, API_BASE_URL } from "../services/api";
import { getFileValidationError } from "../utils/fileUtils";
import { SafariBrowser } from "./SafariBrowser";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { useProcessingMessages } from "../hooks/useProcessingMessages";

export function PromptToolSection() {
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load result from localStorage on mount to preserve after auth
  const [result, setResult] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('excel-processing-result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, session, refreshBackendUser } = useAuth();
  const processingMessage = useProcessingMessages(isProcessing);

  // Save result to localStorage whenever it changes
  useEffect(() => {
    if (result) {
      try {
        localStorage.setItem('excel-processing-result', JSON.stringify(result));
      } catch (err) {
        console.error('Failed to save result to localStorage:', err);
      }
    } else {
      localStorage.removeItem('excel-processing-result');
    }
  }, [result]);


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = getFileValidationError(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validationError = getFileValidationError(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleProcessFile = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await processFile(selectedFile, prompt);
      setResult(response);
      
      // Save preview data to sessionStorage and navigate to full-screen preview
      if (response.processed_data && response.columns) {
        const previewData = {
          data: response.processed_data,
          columns: response.columns,
          formatting_metadata: response.formatting_metadata,
          processed_file_url: response.processed_file_url,
        };
        sessionStorage.setItem('previewData', JSON.stringify(previewData));
        
        // Navigate to full-screen preview using history API for SPA behavior
        window.history.pushState({}, '', '/preview');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      
      // Refresh token usage after processing
      if (user && refreshBackendUser) {
        setTimeout(() => {
          refreshBackendUser();
        }, 1000); // Wait 1 second for backend to update
      }
      // Preview is shown automatically - no auto-download
    } catch (err: any) {
      setError(err.message || "Failed to process file. Please try again.");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadChart = async () => {
    if (!user || !session) {
      setShowAuthModal(true);
      return;
    }

    if (result?.chart_url) {
      try {
        const filename = result.chart_url.split('/').pop() || 'chart.png';
        await downloadFile(`${API_BASE_URL}${result.chart_url}`, filename);
      } catch (error: any) {
        if (error.message?.includes('401') || error.message?.includes('Authentication')) {
          setShowAuthModal(true);
        } else {
          setError('Failed to download chart. Please try again.');
        }
      }
    }
  };

  const handleDownloadExcel = async () => {
    console.log('Download clicked - Auth check:', { user: !!user, session: !!session });
    if (!user || !session) {
      console.log('No auth - showing modal');
      // Use setTimeout to prevent blocking
      setTimeout(() => {
        setShowAuthModal(true);
      }, 100);
      return;
    }

    if (result?.processed_file_url) {
      try {
        const filename = result.processed_file_url.split('/').pop() || 'processed.xlsx';
        await downloadFile(`${API_BASE_URL}${result.processed_file_url}`, filename);
      } catch (error: any) {
        if (error.message?.includes('401') || error.message?.includes('Authentication')) {
          setShowAuthModal(true);
        } else {
          setError('Failed to download file. Please try again.');
        }
      }
    }
  };

  const handleOpenChartViewer = () => {
    if (result?.chart_url) {
      // Store chart data in sessionStorage
      const chartData = {
        charts: [{
          chartUrl: result.chart_url,
          chartType: result.action_plan?.chart_type || "chart",
          title: result.action_plan?.chart_type 
            ? `${result.action_plan.chart_type.charAt(0).toUpperCase() + result.action_plan.chart_type.slice(1)} Chart`
            : "Chart"
        }]
      };
      sessionStorage.setItem('chartViewerData', JSON.stringify(chartData));
      // Open chart viewer in new tab
      window.open('/?charts=true', '_blank');
    }
  };

  return (
    <section id="prompt-tool" className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-white to-gray-50 relative overflow-hidden">
      {/* Smooth transition gradient at top - covers full width including left with green tint */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#00c98c]/10 via-[#00A878]/15 to-transparent pointer-events-none z-0"></div>
      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00c98c]/15 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#00A878]/10 to-transparent rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Centered and Wider Prompt Area */}
        <div className="max-w-5xl mx-auto p-4">
          {/* Safari Browser Wrapper */}
          <SafariBrowser className="mb-8 hover:shadow-3xl transition-all duration-300 hover:scale-[1.01]">
            {/* Main Prompt UI - Centered and Wider */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-gray-900 mb-6 font-semibold">Enter Your Prompt</h3>

                {/* File Upload Area */}
                <div className="mb-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                  />
                  {!selectedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#00A878] hover:bg-[#00A878]/5 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white cursor-pointer group hover:scale-[1.02] hover:shadow-lg"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-[#00A878] group-hover:scale-110 transition-all duration-300" />
                      <p className="text-gray-700 mb-1 text-sm group-hover:text-[#00A878] transition-colors duration-300">Drop your Excel file here</p>
                      <p className="text-gray-500 text-xs group-hover:text-[#00A878]/80 transition-colors duration-300">or click to browse</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 hover:border-green-300 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-gray-900 font-medium text-sm">{selectedFile.name}</p>
                            <p className="text-gray-500 text-xs">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              
                <div className="mb-6">
                  <div className="mb-3">
                    <label className="text-gray-700 text-sm font-medium">Enter Your Prompt</label>
                  </div>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-gradient-to-br from-gray-50 to-white border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20 transition-all hover:border-[#00A878]/50 hover:shadow-md duration-300"
                    rows={6}
                    placeholder="e.g., Clean this data, remove duplicates, and create a sales dashboard"
                  />
                </div>

                <div className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors duration-200">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  <Button 
                    onClick={handleProcessFile}
                    disabled={!selectedFile || !prompt.trim() || isProcessing}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {processingMessage}
                      </>
                    ) : (
                      "Process File"
                    )}
                  </Button>
                </div>
              
              {result && (
                <div className="mt-6 space-y-4">
                  {/* Success Message */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="text-green-900 font-semibold">Processing Complete!</h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      {result.summary && result.summary.map((item: string, index: number) => (
                        <div key={index}>• {item}</div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                    <h3 className="text-gray-800 font-bold text-lg mb-4">Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Button 1: Preview & Edit Excel */}
                      {result.processed_data && result.columns && (
                        <Button
                          onClick={() => {
                            sessionStorage.setItem('editorData', JSON.stringify({
                              data: result.processed_data,
                              columns: result.columns,
                              formatting_metadata: result.formatting_metadata
                            }));
                            window.open('/?editor=true', '_blank');
                          }}
                          className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-16 flex flex-col items-center justify-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">Preview & Edit Excel</span>
                        </Button>
                      )}

                      {/* Button 2: Preview Dashboard (conditional) */}
                      {result.chart_url && (
                        <Button
                          onClick={handleOpenChartViewer}
                          className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-16 flex flex-col items-center justify-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">Preview Dashboard</span>
                        </Button>
                      )}

                      {/* Button 3: Download Excel */}
                      {result.processed_file_url && (
                        <Button
                          onClick={handleDownloadExcel}
                          variant="outline"
                          className="border-2 border-[#00A878] text-[#00A878] hover:bg-[#00A878]/10 hover:text-[#007a5d] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-16 flex flex-col items-center justify-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">Download Excel</span>
                        </Button>
                      )}

                      {/* Button 4: Download Dashboard (conditional) */}
                      {result.chart_url && (
                        <Button
                          onClick={handleDownloadChart}
                          variant="outline"
                          className="border-2 border-[#00A878] text-[#00A878] hover:bg-[#00A878]/10 hover:text-[#007a5d] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-16 flex flex-col items-center justify-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">Download Dashboard</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </SafariBrowser>

          {/* Auth Modal */}
          <AuthModal
            open={showAuthModal}
            onOpenChange={(open) => {
              console.log('Modal onOpenChange called:', open);
              setShowAuthModal(open);
            }}
            onSuccess={() => {
              console.log('Auth success');
              setShowAuthModal(false);
            }}
          />

        </div>
      </div>

    </section>
  );
}