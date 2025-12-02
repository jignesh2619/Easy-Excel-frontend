import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface SheetViewerProps {
  data: Record<string, any>[];
  columns: string[];
  rowCount: number;
  onDownload?: () => void;
  highlightDuplicates?: boolean;
  onDataChange?: (rowIndex: number, column: string, value: any) => void;
  onCellSelect?: (rowIndex: number, column: string, value: any) => void;
}

// Convert column index to Excel column letter (A, B, C, ..., Z, AA, AB, etc.)
function getExcelColumnLetter(index: number): string {
  let result = '';
  index++; // Convert to 1-based
  while (index > 0) {
    index--;
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
}

export function SheetViewer({ data, columns, rowCount, onDownload, highlightDuplicates = true, onDataChange, onCellSelect }: SheetViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded to show preview
  const [currentPage, setCurrentPage] = useState(1);
  const [showDuplicates, setShowDuplicates] = useState(highlightDuplicates);
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [localData, setLocalData] = useState(data);
  const rowsPerPage = 20;
  const totalPages = Math.ceil(localData.length / rowsPerPage);

  // Update local data when prop changes
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Get current page data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = localData.slice(startIndex, endIndex);

  // Detect duplicate rows
  const duplicateRowIndices = useMemo(() => {
    if (!showDuplicates || localData.length === 0) return new Set<number>();
    
    const seen = new Map<string, number[]>();
    const duplicates = new Set<number>();
    
    localData.forEach((row, index) => {
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
  }, [localData, columns, showDuplicates]);

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

  // Handle cell edit start
  const handleCellEditStart = (rowIndex: number, col: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, col });
    setEditValue(formatCellValue(currentValue));
  };

  // Handle cell edit save
  const handleCellEditSave = (rowIndex: number, col: string) => {
    if (editingCell && editingCell.row === rowIndex && editingCell.col === col) {
      // Update local data
      const updatedData = [...localData];
      if (!updatedData[rowIndex]) {
        updatedData[rowIndex] = {};
      }
      
      // Try to preserve type (number if it was a number)
      const originalValue = updatedData[rowIndex][col];
      let newValue: any = editValue;
      
      if (typeof originalValue === 'number' && !isNaN(Number(editValue))) {
        newValue = Number(editValue.replace(/,/g, ''));
      }
      
      updatedData[rowIndex][col] = newValue;
      setLocalData(updatedData);
      
      // Notify parent component
      if (onDataChange) {
        onDataChange(rowIndex, col, newValue);
      }
      
      setEditingCell(null);
      setEditValue("");
    }
  };

  // Handle cell edit cancel
  const handleCellEditCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Calculate dynamic column width based on content
  const calculateColumnWidth = (col: string): number => {
    let maxWidth = 100; // Minimum width
    const sampleSize = Math.min(50, localData.length); // Check first 50 rows for better accuracy
    
    for (let i = 0; i < sampleSize; i++) {
      if (localData[i]) {
        const value = formatCellValue(localData[i][col]);
        // Calculate width: 8px per character + padding (40px)
        // For very long content, allow more width but cap at reasonable max
        const contentWidth = value.length * 8 + 40;
        const width = Math.max(contentWidth, 100);
        // Cap at 500px for very long content, but allow dynamic sizing
        maxWidth = Math.max(maxWidth, Math.min(width, 500));
      }
    }
    
    // Check header width
    const headerWidth = col.length * 10 + 50;
    maxWidth = Math.max(maxWidth, headerWidth);
    
    return maxWidth;
  };

  // Get cell formatting style from {column}_format field
  const getCellStyle = (row: Record<string, any>, column: string): React.CSSProperties => {
    const formatKey = `${column}_format`;
    const cellFormat = row[formatKey];
    
    if (!cellFormat) return {};
    
    const style: React.CSSProperties = {};
    if (cellFormat.bg_color) {
      style.backgroundColor = cellFormat.bg_color;
    }
    if (cellFormat.text_color || cellFormat.font_color) {
      style.color = cellFormat.text_color || cellFormat.font_color;
    }
    if (cellFormat.bold) {
      style.fontWeight = 'bold';
    }
    if (cellFormat.italic) {
      style.fontStyle = 'italic';
    }
    if (cellFormat.font_size) {
      style.fontSize = `${cellFormat.font_size}px`;
    }
    
    return style;
  };

  return (
    <div className="h-full w-full bg-white flex flex-col" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%' }}>
      {/* Sheet Content */}
      {isExpanded && (
        <div 
          className="flex-1" 
          style={{ 
            zIndex: 1, 
            minHeight: 0,
            minWidth: 0,
            maxWidth: '100%',
            width: '100%',
            height: '100%',
            overflowX: 'auto',
            overflowY: 'auto',
            position: 'relative'
          }}
        >
          <div style={{ display: "inline-block", width: "max-content", minWidth: "100%" }}>
            <table 
              className="border-collapse" 
              style={{ 
                width: "max-content",
                minWidth: "100%",
                borderSpacing: 0,
                tableLayout: 'auto'
              }}
            >
              <thead className="bg-gray-50 sticky top-0" style={{ zIndex: 1 }}>
                {/* Excel Column Letters Row */}
                <tr>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-500 border border-black bg-gray-100 sticky left-0 z-10" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '1px solid black' }}>
                    {/* Empty cell for row numbers column */}
                  </th>
                  {columns.map((col, idx) => {
                    const isLast = idx === columns.length - 1;
                    return (
                      <th
                        key={`letter-${idx}`}
                        className="px-2 py-1 text-center text-xs font-semibold text-gray-600 border border-black whitespace-nowrap bg-gray-50"
                        style={{ 
                          minWidth: '100px', 
                          textAlign: 'center', 
                          borderRight: '2px solid black', 
                          borderBottom: '1px solid black', 
                          borderLeft: idx === 0 ? '2px solid black' : 'none',
                          borderTop: 'none'
                        }}
                      >
                        {getExcelColumnLetter(idx)}
                      </th>
                    );
                  })}
                </tr>
                {/* Actual Column Names Row */}
                <tr>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-black bg-gray-100 sticky left-0 z-10" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '2px solid black' }}>
                    {/* Row number header */}
                  </th>
                  {columns.map((col, idx) => {
                    const colWidth = calculateColumnWidth(col);
                    return (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-black transition-colors duration-200 hover:bg-[#00A878]/10"
                        style={{ 
                          width: `${colWidth}px`,
                          minWidth: `${colWidth}px`,
                          maxWidth: `${colWidth}px`,
                          borderRight: '2px solid black', 
                          borderBottom: '2px solid black', 
                          borderLeft: idx === 0 ? '2px solid black' : 'none',
                          borderTop: 'none'
                        }}
                      >
                        {col}
                      </th>
                    );
                  })}
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
                    const rowNumber = actualIndex + 1; // Excel uses 1-based row numbers
                    const isDuplicate = showDuplicates && duplicateRowIndices.has(actualIndex);
                    return (
                      <tr
                        key={rowIdx}
                        className={`hover:bg-[#00A878]/5 hover:shadow-sm transition-all duration-200 ease-in-out ${
                          isDuplicate ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                        }`}
                      >
                        {/* Row Number Cell */}
                        <td 
                          className="px-2 py-2 text-center text-xs font-semibold text-gray-600 border border-black bg-gray-50 sticky left-0 z-10"
                          style={{ width: '50px', minWidth: '50px', maxWidth: '50px', textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black' }}
                        >
                          {rowNumber}
                        </td>
                        {columns.map((col, colIdx) => {
                          const cellStyle = getCellStyle(row, col);
                          const hasFormatting = Object.keys(cellStyle).length > 0;
                          const isEditing = editingCell?.row === actualIndex && editingCell?.col === col;
                          const colWidth = calculateColumnWidth(col);
                          const cellValue = localData[actualIndex]?.[col];
                          
                          return (
                            <td
                              key={colIdx}
                              style={{ 
                                ...cellStyle, 
                                width: `${colWidth}px`,
                                minWidth: `${colWidth}px`,
                                maxWidth: `${colWidth}px`,
                                borderRight: '2px solid black', 
                                borderBottom: '1px solid black', 
                                borderLeft: colIdx === 0 ? '2px solid black' : 'none',
                                borderTop: 'none',
                                padding: '4px'
                              }}
                              className={`text-sm border border-black transition-colors duration-200 cursor-pointer ${
                                !hasFormatting ? 'hover:bg-[#00A878]/10' : ''
                              } ${
                                isDuplicate && !hasFormatting
                                  ? 'text-yellow-900 font-medium bg-yellow-50' 
                                  : hasFormatting ? '' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                if (onCellSelect) {
                                  onCellSelect(actualIndex, col, cellValue);
                                }
                              }}
                              onDoubleClick={() => handleCellEditStart(actualIndex, col, cellValue)}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={() => handleCellEditSave(actualIndex, col)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleCellEditSave(actualIndex, col);
                                    } else if (e.key === 'Escape') {
                                      handleCellEditCancel();
                                    }
                                  }}
                                  autoFocus
                                  className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  style={{ ...cellStyle, minWidth: `${colWidth - 20}px` }}
                                />
                              ) : (
                                <div 
                                  className="px-2 py-1 break-words" 
                                  style={{ 
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    maxHeight: '100px',
                                    overflowY: 'auto'
                                  }}
                                  title={formatCellValue(cellValue)}
                                >
                                  {formatCellValue(cellValue)}
                                </div>
                              )}
                            </td>
                          );
                        })}
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
            <table className="w-full border-collapse text-sm" style={{ borderSpacing: 0 }}>
              <thead>
                {/* Excel Column Letters Row */}
                <tr className="bg-gray-50">
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-500 border border-black bg-gray-100" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '1px solid black' }}>
                    {/* Empty cell for row numbers */}
                  </th>
                  {columns.slice(0, 5).map((col, idx) => {
                    const colWidth = calculateColumnWidth(col);
                    return (
                      <th
                        key={`letter-${idx}`}
                        className="px-2 py-1 text-center text-xs font-semibold text-gray-600 border border-black bg-gray-50"
                        style={{ width: `${colWidth}px`, minWidth: `${colWidth}px`, maxWidth: `${colWidth}px`, textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black', borderLeft: idx === 0 ? '2px solid black' : 'none' }}
                      >
                        {getExcelColumnLetter(idx)}
                      </th>
                    );
                  })}
                  {columns.length > 5 && (
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-500 border border-black bg-gray-50" style={{ minWidth: '100px', textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black' }}>
                      ...
                    </th>
                  )}
                </tr>
                {/* Actual Column Names Row */}
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-black bg-gray-100" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '2px solid black' }}>
                    {/* Row number header */}
                  </th>
                  {columns.slice(0, 5).map((col, idx) => {
                    const colWidth = calculateColumnWidth(col);
                    return (
                      <th
                        key={idx}
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-black"
                        style={{ width: `${colWidth}px`, minWidth: `${colWidth}px`, maxWidth: `${colWidth}px`, borderRight: '2px solid black', borderBottom: '2px solid black', borderLeft: idx === 0 ? '2px solid black' : 'none' }}
                      >
                        {col}
                      </th>
                    );
                  })}
                  {columns.length > 5 && (
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border border-black" style={{ minWidth: '100px', borderRight: '2px solid black', borderBottom: '2px solid black' }}>
                      +{columns.length - 5} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {localData.slice(0, 5).map((row, rowIdx) => {
                  const rowNumber = rowIdx + 1; // Excel uses 1-based row numbers
                  const isDuplicate = showDuplicates && duplicateRowIndices.has(rowIdx);
                  return (
                    <tr 
                      key={rowIdx} 
                      className={`border-b border-black ${
                        isDuplicate ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                      }`}
                    >
                      {/* Row Number Cell */}
                      <td 
                        className="px-2 py-2 text-center text-xs font-semibold text-gray-600 border border-black bg-gray-50"
                        style={{ width: '50px', minWidth: '50px', maxWidth: '50px', textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black' }}
                      >
                        {rowNumber}
                      </td>
                      {columns.slice(0, 5).map((col, colIdx) => {
                        const cellStyle = getCellStyle(row, col);
                        const hasFormatting = Object.keys(cellStyle).length > 0;
                        const isEditing = editingCell?.row === rowIdx && editingCell?.col === col;
                        const colWidth = calculateColumnWidth(col);
                        const cellValue = localData[rowIdx]?.[col];
                        
                        return (
                          <td 
                            key={colIdx}
                            style={{ 
                              ...cellStyle, 
                              width: `${colWidth}px`,
                              minWidth: `${colWidth}px`,
                              maxWidth: `${colWidth}px`,
                              borderRight: '2px solid black', 
                              borderBottom: '1px solid black', 
                              borderLeft: colIdx === 0 ? '2px solid black' : 'none',
                              padding: '4px'
                            }}
                            className={`border border-black ${
                              isDuplicate && !hasFormatting
                                ? 'text-yellow-900 font-medium bg-yellow-50' 
                                : hasFormatting ? '' : 'text-gray-600'
                            }`}
                            onDoubleClick={() => handleCellEditStart(rowIdx, col, cellValue)}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleCellEditSave(rowIdx, col)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCellEditSave(rowIdx, col);
                                  } else if (e.key === 'Escape') {
                                    handleCellEditCancel();
                                  }
                                }}
                                autoFocus
                                className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ ...cellStyle, minWidth: `${colWidth - 20}px` }}
                              />
                            ) : (
                              <div className="px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis" title={formatCellValue(cellValue)}>
                                {formatCellValue(cellValue)}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      {columns.length > 5 && (
                        <td className={`px-3 py-2 text-xs border border-black ${
                          isDuplicate ? 'text-yellow-700' : 'text-gray-400'
                        }`} style={{ minWidth: '100px', borderRight: '2px solid black', borderBottom: '1px solid black' }}>
                          ...
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {localData.length > 5 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing first 5 rows. Click "Expand" to see all {localData.length.toLocaleString()} rows
            </p>
          )}
        </div>
      )}

      {/* Pagination (only when expanded) */}
      {isExpanded && totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-black">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, localData.length)} of {localData.length} rows
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="border-black"
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
              className="border-black"
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

