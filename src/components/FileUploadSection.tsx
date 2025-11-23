import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, X, Loader2, CheckCircle2, AlertCircle, Download, BarChart3, Eye, LayoutDashboard, FileSpreadsheet } from "lucide-react";
import { processFile, downloadFile, type ProcessFileResponse, API_BASE_URL } from "../services/api";
import { getFileValidationError, formatFileSize } from "../utils/fileUtils";

export function FileUploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessFileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setResult(null);
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
      setResult(null);
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
      // Preview is shown automatically - no auto-download
    } catch (err: any) {
      setError(err.message || "Failed to process file. Please try again.");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadChart = async () => {
    if (result?.chart_url) {
      const filename = result.chart_url.split('/').pop() || 'chart.png';
      await downloadFile(`${API_BASE_URL}${result.chart_url}`, filename);
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
    <div className="space-y-6">
      {/* File Upload Area */}
      <div>
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
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#00A878] transition-colors bg-gradient-to-br from-white to-gray-50 cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2 font-medium">Drop your Excel file here</p>
            <p className="text-gray-500 text-sm">or click to browse</p>
            <p className="text-gray-400 text-xs mt-2">Supports: CSV, XLSX, XLS (Max 50MB)</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-gray-900 font-semibold">{selectedFile.name}</p>
                  <p className="text-gray-500 text-sm">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button
                onClick={handleRemoveFile}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-900 font-semibold">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Prompt Input */}
      {selectedFile && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-gray-700 block font-medium">Enter Your Prompt</label>
            <Button
              onClick={() => {
                const currentPrompt = prompt.trim();
                const dashboardKeywords = ['dashboard', 'chart', 'graph', 'visualize', 'visualization'];
                const hasDashboardKeyword = dashboardKeywords.some(keyword => 
                  currentPrompt.toLowerCase().includes(keyword)
                );
                
                if (!currentPrompt) {
                  setPrompt("Create a dashboard with visualizations and charts");
                } else if (hasDashboardKeyword) {
                  // Already has dashboard-related keywords, don't add anything
                  return;
                } else {
                  // Append dashboard request to existing prompt
                  setPrompt(currentPrompt + " and create a dashboard with visualizations and charts");
                }
              }}
              variant="outline"
              size="sm"
              className="bg-white text-[#00A878] border-2 border-[#00A878] hover:bg-[#00A878] hover:text-white hover:border-[#00A878] transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/20 transition-all"
            rows={4}
            placeholder="e.g., Group by Region and sum Revenue, then create a bar chart"
          />
          <Button
            onClick={handleProcessFile}
            disabled={!prompt.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-[#00A878] to-[#00c98c] hover:from-[#008c67] hover:to-[#00A878] text-white rounded-full px-6 mt-4 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing File...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Process File
              </>
            )}
          </Button>
        </div>
      )}

      {/* Results */}
      {result && result.status === "success" && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-green-900 font-bold text-lg">Processing Complete!</h3>
            </div>
            
            {/* Summary */}
            {result.summary && result.summary.length > 0 && (
              <div>
                <p className="text-gray-700 font-medium mb-2 text-sm">Summary:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {result.summary.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                      columns: result.columns
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
                  onClick={() => {
                    const filename = result.processed_file_url!.split('/').pop() || 'processed_file.xlsx';
                    downloadFile(`${API_BASE_URL}${result.processed_file_url!}`, filename);
                  }}
                  variant="outline"
                  className="border-2 border-[#00A878] text-[#00A878] hover:bg-[#00A878] hover:text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-16 flex flex-col items-center justify-center gap-2"
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
                  className="border-2 border-[#00A878] text-[#00A878] hover:bg-[#00A878] hover:text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-16 flex flex-col items-center justify-center gap-2"
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
  );
}

