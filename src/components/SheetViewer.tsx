import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface SheetViewerProps {
  data: Record<string, any>[];
  columns: string[];
  rowCount: number;
  onDownload?: () => void;
  highlightDuplicates?: boolean;
}

export function SheetViewer({ data, columns, rowCount, onDownload, highlightDuplicates = true }: SheetViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded to show preview
  const [currentPage, setCurrentPage] = useState(1);
  const [showDuplicates, setShowDuplicates] = useState(highlightDuplicates);
  const rowsPerPage = 20;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get current page data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Detect duplicate rows
  const duplicateRowIndices = useMemo(() => {
    if (!showDuplicates || data.length === 0) return new Set<number>();
    
    const seen = new Map<string, number[]>();
    const duplicates = new Set<number>();
    
    data.forEach((row, index) => {
      // Create a key from all column values
      const rowKey = columns.map(col => {
        const val = row[col];
        return val === null || val === undefined ? '' : String(val);
      }).join('|');
      
      if (seen.has(rowKey)) {
        // Mark current row as duplicate
        duplicates.add(index);
        // Mark previously seen row(s) as duplicates
        seen.get(rowKey)!.forEach(idx => duplicates.add(idx));
      } else {
        seen.set(rowKey, [index]);
      }
    });
    
    return duplicates;
  }, [data, columns, showDuplicates]);

  // Count total duplicates
  const duplicateCount = useMemo(() => {
    return duplicateRowIndices.size;
  }, [duplicateRowIndices]);

  // Format cell value for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") {
      // Format numbers with commas
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#00A878] hover:scale-[1.01]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5" />
          <div>
            <h3 className="font-bold text-lg">Processed Sheet Preview</h3>
            <p className="text-sm text-white/90">
              {rowCount.toLocaleString()} {rowCount === 1 ? "row" : "rows"} • {columns.length} {columns.length === 1 ? "column" : "columns"}
              {data.length < rowCount && ` (showing first ${data.length.toLocaleString()})`}
              {duplicateCount > 0 && showDuplicates && (
                <span className="ml-2 inline-flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3 h-3" />
                  {duplicateCount} duplicate{duplicateCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {duplicateCount > 0 && (
            <Button
              onClick={() => setShowDuplicates(!showDuplicates)}
              variant="ghost"
              size="sm"
              className={`text-white hover:bg-white/20 ${showDuplicates ? 'bg-yellow-500/30' : ''}`}
              title={showDuplicates ? "Hide duplicate highlighting" : "Show duplicate highlighting"}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              {showDuplicates ? "Hide" : "Show"} Duplicates
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          {onDownload && (
            <Button
              onClick={onDownload}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Sheet Content */}
      {isExpanded && (
        <div className="overflow-auto max-h-[600px]">
          <div className="min-w-full">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap transition-colors duration-200 hover:bg-[#00A878]/10"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                      No data to display
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, rowIdx) => {
                    const actualIndex = startIndex + rowIdx;
                    const isDuplicate = showDuplicates && duplicateRowIndices.has(actualIndex);
                    return (
                      <tr
                        key={rowIdx}
                        className={`hover:bg-[#00A878]/5 hover:shadow-sm transition-all duration-200 ease-in-out ${
                          isDuplicate ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                        }`}
                      >
                        {columns.map((col, colIdx) => (
                          <td
                            key={colIdx}
                            className={`px-4 py-2 text-sm border-b border-gray-100 whitespace-nowrap transition-colors duration-200 hover:bg-[#00A878]/10 ${
                              isDuplicate 
                                ? 'text-yellow-900 font-medium bg-yellow-50' 
                                : 'text-gray-700'
                            }`}
                          >
                            {formatCellValue(row[col])}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collapsed View - Show first few rows */}
      {!isExpanded && (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {columns.slice(0, 5).map((col, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200"
                    >
                      {col}
                    </th>
                  ))}
                  {columns.length > 5 && (
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                      +{columns.length - 5} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, rowIdx) => {
                  const isDuplicate = showDuplicates && duplicateRowIndices.has(rowIdx);
                  return (
                    <tr 
                      key={rowIdx} 
                      className={`border-b border-gray-100 ${
                        isDuplicate ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                      }`}
                    >
                      {columns.slice(0, 5).map((col, colIdx) => (
                        <td 
                          key={colIdx} 
                          className={`px-3 py-2 ${
                            isDuplicate 
                              ? 'text-yellow-900 font-medium bg-yellow-50' 
                              : 'text-gray-600'
                          }`}
                        >
                          {formatCellValue(row[col])}
                        </td>
                      ))}
                      {columns.length > 5 && (
                        <td className={`px-3 py-2 text-xs ${
                          isDuplicate ? 'text-yellow-700' : 'text-gray-400'
                        }`}>
                          ...
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {data.length > 5 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing first 5 rows. Click "Expand" to see all {data.length.toLocaleString()} rows
            </p>
          )}
        </div>
      )}

      {/* Pagination (only when expanded) */}
      {isExpanded && totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} rows
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="border-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-700 px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="border-gray-300"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

