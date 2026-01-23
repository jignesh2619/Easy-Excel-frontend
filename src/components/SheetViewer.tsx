import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, EyeOff, AlertTriangle, Filter, ArrowUpDown, Search, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

interface SheetViewerProps {
  data: Record<string, any>[];
  columns: string[];
  rowCount: number;
  onDownload?: () => void;
  highlightDuplicates?: boolean;
  onDataChange?: (rowIndex: number, column: string, value: any) => void;
  formatting_metadata?: any;
  onCellSelect?: (row: number, col: string, value: any) => void;
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

export function SheetViewer({ data, columns, rowCount, onDownload, highlightDuplicates = true, onDataChange, formatting_metadata, onCellSelect }: SheetViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded to show preview
  const [currentPage, setCurrentPage] = useState(1);
  const [showDuplicates, setShowDuplicates] = useState(highlightDuplicates);
  const [editingCell, setEditingCell] = useState<{row: number, col: string} | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [localData, setLocalData] = useState(data);
  
  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  
  const rowsPerPage = 20;

  // Update local data when prop changes
  React.useEffect(() => {
    setLocalData(data);
    // Reset filters when data changes
    setSearchQuery("");
    setFilterColumn("");
    setFilterValue("");
    setSortColumn("");
    setSortDirection(null);
    setCurrentPage(1);
  }, [data]);

  // Apply filters and sorting
  const filteredAndSortedData = useMemo(() => {
    let result = [...localData];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col];
          return value !== null && value !== undefined && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Apply column filter
    if (filterColumn && filterValue.trim()) {
      const filterVal = filterValue.toLowerCase();
      result = result.filter((row) => {
        const value = row[filterColumn];
        return value !== null && value !== undefined && String(value).toLowerCase().includes(filterVal);
      });
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        // Handle null/undefined
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        // Handle numbers
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle strings
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return result;
  }, [localData, searchQuery, filterColumn, filterValue, sortColumn, sortDirection, columns]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  // Get current page data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Detect duplicate rows
  const duplicateRowIndices = useMemo(() => {
    if (!showDuplicates || filteredAndSortedData.length === 0) return new Set<number>();
    
    const seen = new Map<string, number[]>();
    const duplicates = new Set<number>();
    
    filteredAndSortedData.forEach((row, index) => {
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
  }, [filteredAndSortedData, columns, showDuplicates]);

  // Count total duplicates
  const duplicateCount = useMemo(() => {
    return duplicateRowIndices.size;
  }, [duplicateRowIndices]);

  // Handle sort toggle
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn("");
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterColumn("");
    setFilterValue("");
    setSortColumn("");
    setSortDirection(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim() || (filterColumn && filterValue.trim()) || sortColumn;

  // Format cell value for display
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    
    // If it's a number, display without commas
    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        return value.toString();
      } else {
        // For decimals, show up to 6 decimal places, remove trailing zeros
        const formatted = value.toFixed(6).replace(/\.?0+$/, '');
        return formatted;
      }
    }
    
    // If it's a string, check if it's a number with commas and remove them
    if (typeof value === "string") {
      // Remove commas and trim whitespace
      const cleaned = value.replace(/,/g, '').trim();
      
      // Try to parse as number
      const numValue = parseFloat(cleaned);
      
      // If it's a valid number (not NaN and the cleaned string is not empty)
      // and the original string looked like a number (contains digits)
      if (!isNaN(numValue) && cleaned !== '' && /^-?\d*\.?\d+$/.test(cleaned)) {
        if (Number.isInteger(numValue)) {
          return numValue.toString();
        } else {
          // For decimals, show up to 6 decimal places, remove trailing zeros
          const formatted = numValue.toFixed(6).replace(/\.?0+$/, '');
          return formatted;
        }
      }
    }
    
    // For non-numeric strings, return as-is
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
    <div className="h-full w-full bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[#00A878] flex flex-col" style={{ height: '100%', width: '100%' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5" />
          <div>
            <h3 className="font-bold text-lg">Processed Sheet Preview</h3>
            <p className="text-sm text-white/90">
              {filteredAndSortedData.length.toLocaleString()} {filteredAndSortedData.length === 1 ? "row" : "rows"} 
              {filteredAndSortedData.length !== localData.length && ` of ${localData.length.toLocaleString()}`}
              {" • "}{columns.length} {columns.length === 1 ? "column" : "columns"}
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

      {/* Toolbar with Filters and Sort */}
      {isExpanded && (
        <div className="bg-gray-50 border-b border-gray-200 p-3 space-y-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search all columns..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A878] text-sm"
              />
            </div>
            
            {/* Column Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterColumn}
                onChange={(e) => {
                  setFilterColumn(e.target.value);
                  setFilterValue("");
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A878] text-sm bg-white"
              >
                <option value="">Filter by column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              {filterColumn && (
                <input
                  type="text"
                  placeholder="Filter value..."
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A878] text-sm w-40"
                />
              )}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-100"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            {columns.map((col) => (
              <Button
                key={col}
                onClick={() => handleSort(col)}
                variant={sortColumn === col ? "default" : "outline"}
                size="sm"
                className={`${
                  sortColumn === col
                    ? "bg-[#00A878] text-white hover:bg-[#008c67]"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {col}
                {sortColumn === col && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                  </span>
                )}
                {sortColumn !== col && (
                  <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Sheet Content */}
      {isExpanded && (
        <div className="flex-1 overflow-auto relative" style={{ zIndex: 1, minHeight: 0, height: '100%', width: '100%', overflowX: 'auto', overflowY: 'auto' }}>
          <div style={{ display: "inline-block", minWidth: "100%" }}>
            <table className="border-collapse" style={{ width: "max-content", minWidth: "100%", borderSpacing: 0 }}>
              <thead className="bg-gray-50" style={{ zIndex: 1 }}>
                {/* Excel Column Letters Row */}
                <tr>
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-500 border border-black sticky left-0 z-10" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '1px solid black', backgroundColor: '#f3f4f6' }}>
                    {/* Empty cell for row numbers column */}
                  </th>
                  {columns.map((col, idx) => {
                    const isLast = idx === columns.length - 1;
                    return (
                      <th
                        key={`letter-${idx}`}
                        className="px-2 py-1 text-center text-xs font-semibold text-gray-600 border border-black whitespace-nowrap"
                        style={{ 
                          minWidth: '100px', 
                          textAlign: 'center', 
                          borderRight: '2px solid black', 
                          borderBottom: '1px solid black', 
                          borderLeft: idx === 0 ? '2px solid black' : 'none',
                          borderTop: 'none',
                          backgroundColor: '#f9fafb'
                        }}
                      >
                        {getExcelColumnLetter(idx)}
                      </th>
                    );
                  })}
                </tr>
                {/* Actual Column Names Row */}
                <tr>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-black sticky left-0 z-10" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '2px solid black', backgroundColor: '#f3f4f6' }}>
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
                    // Find original index in localData for duplicate detection
                    const originalIndex = localData.findIndex((r) => r === row);
                    const rowNumber = actualIndex + 1; // Excel uses 1-based row numbers
                    const isDuplicate = showDuplicates && duplicateRowIndices.has(originalIndex >= 0 ? originalIndex : actualIndex);
                    return (
                      <tr
                        key={rowIdx}
                        className={`hover:bg-[#00A878]/5 hover:shadow-sm transition-all duration-200 ease-in-out ${
                          isDuplicate ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                        }`}
                      >
                        {/* Row Number Cell */}
                        <td 
                          className="px-2 py-2 text-center text-xs font-semibold text-gray-600 border border-black sticky left-0 z-10"
                          style={{ width: '50px', minWidth: '50px', maxWidth: '50px', textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black', backgroundColor: '#f3f4f6' }}
                        >
                          {rowNumber}
                        </td>
                        {columns.map((col, colIdx) => {
                          const cellStyle = getCellStyle(row, col);
                          const hasFormatting = Object.keys(cellStyle).length > 0;
                          const originalIndex = localData.findIndex((r) => r === row);
                          const isEditing = editingCell?.row === (originalIndex >= 0 ? originalIndex : actualIndex) && editingCell?.col === col;
                          const colWidth = calculateColumnWidth(col);
                          const cellValue = row[col];
                          
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
                              className={`text-sm border border-black transition-colors duration-200 ${
                                !hasFormatting ? 'hover:bg-[#00A878]/10' : ''
                              } ${
                                isDuplicate && !hasFormatting
                                  ? 'text-yellow-900 font-medium bg-yellow-50' 
                                  : hasFormatting ? '' : 'text-gray-700'
                              }`}
                                  onDoubleClick={() => handleCellEditStart(originalIndex >= 0 ? originalIndex : actualIndex, col, cellValue)}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={() => handleCellEditSave(originalIndex >= 0 ? originalIndex : actualIndex, col)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleCellEditSave(originalIndex >= 0 ? originalIndex : actualIndex, col);
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
                  <th className="px-2 py-1 text-center text-xs font-semibold text-gray-500 border border-black" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '1px solid black', backgroundColor: '#f3f4f6' }}>
                    {/* Empty cell for row numbers */}
                  </th>
                  {columns.slice(0, 5).map((col, idx) => {
                    const colWidth = calculateColumnWidth(col);
                    return (
                      <th
                        key={`letter-${idx}`}
                        className="px-2 py-1 text-center text-xs font-semibold text-gray-600 border border-black"
                        style={{ width: `${colWidth}px`, minWidth: `${colWidth}px`, maxWidth: `${colWidth}px`, textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black', borderLeft: idx === 0 ? '2px solid black' : 'none', backgroundColor: '#f9fafb' }}
                      >
                        {getExcelColumnLetter(idx)}
                      </th>
                    );
                  })}
                  {columns.length > 5 && (
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-500 border border-black" style={{ minWidth: '100px', textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black', backgroundColor: '#f9fafb' }}>
                      ...
                    </th>
                  )}
                </tr>
                {/* Actual Column Names Row */}
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-black" style={{ width: '50px', minWidth: '50px', maxWidth: '50px', borderRight: '2px solid black', borderBottom: '2px solid black', backgroundColor: '#f3f4f6' }}>
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
                        className="px-2 py-2 text-center text-xs font-semibold text-gray-600 border border-black"
                        style={{ width: '50px', minWidth: '50px', maxWidth: '50px', textAlign: 'center', borderRight: '2px solid black', borderBottom: '1px solid black', backgroundColor: '#f3f4f6' }}
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
                            onClick={() => onCellSelect && onCellSelect(rowIdx, col, cellValue)}
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} rows
            {filteredAndSortedData.length !== localData.length && ` (filtered from ${localData.length} total)`}
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

