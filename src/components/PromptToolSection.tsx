import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Upload, Sparkles, Loader2, CheckCircle2, AlertCircle, X, Download, Eye, BarChart3, FileSpreadsheet } from "lucide-react";
import { processFile, getFileDownloadUrl, getChartDownloadUrl, downloadFile, API_BASE_URL } from "../services/api";
import { getFileValidationError } from "../utils/fileUtils";
import { SafariBrowser } from "./SafariBrowser";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { useProcessingMessages } from "../hooks/useProcessingMessages";
import { trackViewContent, trackMetaEvent } from "../utils/metaPixel";

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

  const processAndRedirect = async (file: File) => {
    const processingPrompt = prompt.trim() || " ";
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setSelectedFile(file);
    
    // Track file upload event
    trackViewContent({
      content_name: 'Excel File Upload',
      content_type: 'file',
      content_ids: [file.name]
    });
    trackMetaEvent('FileUpload', {
      file_name: file.name,
      file_size: file.size,
      file_type: file.type
    });
    
    try {
      const response = await processFile(file, processingPrompt);
      setResult(response);
      
      if (response.processed_data && response.columns) {
        const previewData = {
          data: response.processed_data,
          columns: response.columns,
          formatting_metadata: response.formatting_metadata,
          processed_file_url: response.processed_file_url,
        };
        sessionStorage.setItem('previewData', JSON.stringify(previewData));
        window.history.pushState({}, '', '/preview');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      
      if (user && refreshBackendUser) {
        setTimeout(() => { refreshBackendUser().catch(console.error); }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process file. Please try again.");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = getFileValidationError(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      processAndRedirect(file);
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
      processAndRedirect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
        {/* Section Header - Compact */}
        <div className="text-center mb-6 animate-fade-in-up" style={{ paddingTop: '48px' }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 animate-bounce-in" style={{ fontWeight: 900, animationDelay: '0.1s' }}>
            Try It <span className="text-[#00A878] animate-scale-in" style={{ animationDelay: '0.2s' }}>Free</span> Right Now
          </h2>
          <p className="text-base md:text-lg font-semibold text-gray-600 max-w-xl mx-auto mb-3 animate-fade-in-up" style={{ fontWeight: 600, animationDelay: '0.3s' }}>
            No sign-up required. Upload your file and see the magic happen in seconds.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-semibold text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <span>✓ No credit card</span>
            <span>•</span>
            <span>✓ Instant results</span>
            <span>•</span>
            <span>✓ 100% free trial</span>
          </div>
        </div>

        {/* Centered and Wider Prompt Area */}
        <div className="max-w-5xl mx-auto p-4">
          {/* Safari Browser Wrapper */}
          <SafariBrowser className="mb-8 hover:shadow-3xl transition-all duration-300 hover:scale-[1.01] animate-fade-in-up">
            {/* Main Prompt UI - Centered and Wider */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A878]/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#00c98c]/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
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
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center hover:border-[#00A878] hover:bg-[#00A878]/5 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white cursor-pointer group hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00A878]/0 via-[#00A878]/5 to-[#00A878]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4 group-hover:text-[#00A878] group-hover:scale-110 transition-all duration-300" />
                        <p className="text-gray-900 mb-2 text-base sm:text-lg font-semibold group-hover:text-[#00A878] transition-colors duration-300">
                          Drop your Excel file here
                        </p>
                        <p className="text-gray-500 text-sm group-hover:text-[#00A878]/80 transition-colors duration-300">
                          or click to browse • CSV, XLSX, XLS supported
                        </p>
                        <p className="text-xs text-gray-400 mt-3">
                          Free trial • No credit card required
                        </p>
                      </div>
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

                {/* Processing State */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[#00A878]" />
                      <p className="text-gray-700 text-lg font-medium">{processingMessage}</p>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto">
                        <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors duration-200">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              
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
                  
                  {/* Action Buttons - Compact 2x2 Grid */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-gray-800 font-semibold text-sm mb-3">Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
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
                          className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-lg shadow-sm hover:shadow-md transition-smooth h-auto py-2.5 px-3 flex flex-col items-center justify-center gap-1"
                        >
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">Preview & Edit</span>
                        </Button>
                      )}

                      {/* Button 2: Preview Dashboard (conditional) */}
                      {result.chart_url && (
                        <Button
                          onClick={handleOpenChartViewer}
                          className="bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-lg shadow-sm hover:shadow-md transition-smooth h-auto py-2.5 px-3 flex flex-col items-center justify-center gap-1"
                        >
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">Preview Dashboard</span>
                        </Button>
                      )}

                      {/* Button 3: Download Excel */}
                      {result.processed_file_url && (
                        <Button
                          onClick={handleDownloadExcel}
                          variant="outline"
                          className="border border-[#00A878] text-[#00A878] hover:bg-[#00A878]/10 rounded-lg shadow-sm hover:shadow-md transition-smooth h-auto py-2.5 px-3 flex flex-col items-center justify-center gap-1"
                        >
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">Download Excel</span>
                        </Button>
                      )}

                      {/* Button 4: Download Dashboard (conditional) */}
                      {result.chart_url && (
                        <Button
                          onClick={handleDownloadChart}
                          variant="outline"
                          className="border border-[#00A878] text-[#00A878] hover:bg-[#00A878]/10 rounded-lg shadow-sm hover:shadow-md transition-smooth h-auto py-2.5 px-3 flex flex-col items-center justify-center gap-1"
                        >
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">Download Dashboard</span>
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