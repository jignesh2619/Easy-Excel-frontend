import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
} from "@tanstack/react-table";
import { 
  X, Download, Search, Filter, ArrowUpDown, 
  ArrowUp, ArrowDown, Columns, Save, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

interface InteractiveSheetEditorProps {
  data: Record<string, any>[];
  columns: string[];
  onClose: () => void;
  onSave?: (editedData: Record<string, any>[]) => void;
}

export function InteractiveSheetEditor({ 
  data, 
  columns, 
  onClose,
  onSave 
}: InteractiveSheetEditorProps) {
  const [editedData, setEditedData] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Update editedData when data prop changes
  useEffect(() => {
    setEditedData(data);
  }, [data]);

  // Handle cell edit
  const handleCellEdit = useCallback((rowId: string, columnId: string, value: any) => {
    setEditingCell({ rowId, columnId });
    setEditValue(String(value ?? ""));
  }, []);

  const handleCellSave = useCallback((rowId: string, columnId: string) => {
    const newData = [...editedData];
    const rowIndex = parseInt(rowId);
    if (newData[rowIndex]) {
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: editValue
      };
      setEditedData(newData);
    }
    setEditingCell(null);
    setEditValue("");
  }, [editedData, editValue]);

  // Create column definitions
  const tableColumns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    return columns.map((col) => ({
      id: col,
      accessorKey: col,
      header: col,
      cell: ({ row, column, getValue }) => {
        const initialValue = getValue();
        const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;
        
        return isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellSave(row.id, column.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCellSave(row.id, column.id);
              } else if (e.key === "Escape") {
                setEditingCell(null);
                setEditValue("");
              }
            }}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div
            className="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded min-h-[32px] flex items-center"
            onClick={() => handleCellEdit(row.id, column.id, initialValue)}
          >
            {initialValue !== null && initialValue !== undefined ? String(initialValue) : ""}
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, id, filterValue) => {
        const value = row.getValue(id);
        if (!filterValue) return true;
        const search = String(filterValue).toLowerCase();
        return value !== null && value !== undefined && String(value).toLowerCase().includes(search);
      },
    }));
  }, [columns, editingCell, editValue, handleCellEdit, handleCellSave]);

  // Initialize column visibility
  useEffect(() => {
    const initialVisibility: VisibilityState = {};
    columns.forEach((col) => {
      initialVisibility[col] = true;
    });
    setColumnVisibility(initialVisibility);
  }, [columns]);

  // Create table instance
  const table = useReactTable({
    data: editedData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const search = String(filterValue).toLowerCase();
      return Object.values(row.original).some((value) =>
        value !== null && value !== undefined && String(value).toLowerCase().includes(search)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    manualSorting: false,
    manualFiltering: false,
    enableSorting: true,
    enableColumnFilters: true,
  });

  // Handle export
  const handleExport = () => {
    const visibleCols = table.getVisibleLeafColumns().map(col => col.id);
    const csvContent = [
      visibleCols.join(","),
      ...table.getRowModel().rows.map(row =>
        visibleCols.map(col => {
          const val = row.original[col];
          if (val === null || val === undefined) return "";
          const str = String(val);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `edited_data_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(editedData);
    }
    alert("Changes saved! (Note: This will update the preview data)");
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col p-4">
      <div className="w-full h-full bg-white flex flex-col shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Columns className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-xl">Interactive Sheet Editor</h2>
              <p className="text-sm text-white/90">
                {table.getFilteredRowModel().rows.length} of {data.length} rows • {table.getVisibleLeafColumns().length} of {columns.length} columns visible
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleExport}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex flex-wrap items-center gap-4 p-4 border-b border-gray-200 bg-gray-50">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Columns className="w-4 h-4" /> Columns ({table.getVisibleLeafColumns().length}/{columns.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns()
                .filter(col => col.getCanHide() && col.id !== undefined)
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(!!value);
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Global Search */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search all cells..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="flex-1 max-w-xs"
            />
          </div>

          {/* Clear Filters */}
          {(globalFilter || columnFilters.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGlobalFilter("");
                setColumnFilters([]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-white" style={{ minHeight: "400px" }}>
          {editedData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto h-full">
              <table className="min-w-full border-collapse" style={{ minWidth: "max-content" }}>
                <thead className="bg-gray-100 sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border border-gray-300 px-4 py-2 text-left font-semibold text-sm bg-gray-100"
                          style={{ minWidth: "150px", position: "relative" }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div
                              className="flex-1 cursor-pointer select-none hover:bg-gray-200 rounded px-2 py-1 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (header.column.getCanSort()) {
                                  header.column.toggleSorting();
                                }
                              }}
                              title="Click to sort (Asc → Desc → None)"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <span>
                                  {header.column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="w-4 h-4 text-blue-600 inline" />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="w-4 h-4 text-blue-600 inline" />
                                  ) : (
                                    <ArrowUpDown className="w-4 h-4 text-gray-400 inline" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          {header.column.getCanFilter() && (
                            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                type="text"
                                placeholder={`Filter ${header.column.id}...`}
                                value={(header.column.getFilterValue() as string) ?? ""}
                                onChange={(e) => {
                                  header.column.setFilterValue(e.target.value);
                                }}
                                className="h-7 text-xs"
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 border-b border-gray-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border border-gray-200 px-2 py-1 text-sm"
                          style={{ minWidth: "150px" }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <span className="text-sm text-gray-700">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} rows
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
