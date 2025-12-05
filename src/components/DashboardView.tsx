import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { AIChatbot } from "./AIChatbot";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter
} from "recharts";

interface ChartConfig {
  chart_type: string;
  x_column: string;
  y_column: string;
  title?: string;
  description?: string;
}

interface DashboardData {
  id: string;
  title: string;
  charts: ChartConfig[];
  data: Record<string, any>[];
  columns: string[];
  createdAt: Date;
}

interface DashboardViewProps {
  onClose: () => void;
}

const DASHBOARD_STORAGE_KEY = 'dashboard-data';

export function DashboardView({ onClose }: DashboardViewProps) {
  const [dashboards, setDashboards] = useState<DashboardData[]>([]);
  const [currentDashboardIndex, setCurrentDashboardIndex] = useState(0);
  const [isChatbotOpen] = useState(true);
  const [currentData, setCurrentData] = useState<Record<string, any>[]>([]);
  const [currentColumns, setCurrentColumns] = useState<string[]>([]);

  // Load dashboards from sessionStorage
  // Load dashboards from sessionStorage
  useEffect(() => {
    const loadDashboards = () => {
      try {
        const stored = sessionStorage.getItem(DASHBOARD_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const dashboardsWithDates = parsed.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt),
          }));
          setDashboards(dashboardsWithDates);
          if (dashboardsWithDates.length > 0) {
            setCurrentDashboardIndex(0);
            setCurrentData(dashboardsWithDates[0].data);
            setCurrentColumns(dashboardsWithDates[0].columns);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading dashboards:', error);
      }

      // Also try to load preview data for chatbot if no dashboard data exists
      try {
        const previewDataStr = sessionStorage.getItem('previewData');
        if (previewDataStr) {
          const previewData = JSON.parse(previewDataStr);
          if (previewData.data && previewData.columns) {
            setCurrentData(previewData.data);
            setCurrentColumns(previewData.columns);
          }
        }
      } catch (error) {
        console.error('Error loading preview data:', error);
      }
    };

    loadDashboards();

    // Listen for storage events (when dashboard is created from another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DASHBOARD_STORAGE_KEY) {
        loadDashboards();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update current data when dashboard changes
  useEffect(() => {
    if (currentDashboard) {
      setCurrentData(currentDashboard.data);
      setCurrentColumns(currentDashboard.columns);
    }
  }, [currentDashboardIndex, dashboards]);

  const handleDataUpdate = (newResult: any) => {
    console.log('handleDataUpdate: Received result', {
      hasActionPlan: !!newResult.action_plan,
      hasProcessedData: !!newResult.processed_data,
      hasData: !!newResult.data,
      columns: newResult.columns,
      actionPlan: newResult.action_plan
    });

    // Check if the result contains chart configurations
    const actionPlan = newResult.action_plan;
    if (actionPlan) {
      const chartConfig = actionPlan.chart_config;
      const chartConfigs = actionPlan.chart_configs;
      
      console.log('handleDataUpdate: Chart configs found', {
        hasChartConfig: !!chartConfig,
        hasChartConfigs: !!chartConfigs,
        chartConfig,
        chartConfigs
      });
      
      if (chartConfig || chartConfigs) {
        const charts: ChartConfig[] = chartConfigs 
          ? chartConfigs.map((c: any) => ({
              chart_type: c.chart_type || 'bar',
              x_column: c.x_column,
              y_column: c.y_column,
              title: c.title,
              description: c.description,
            }))
          : chartConfig 
            ? [{
                chart_type: chartConfig.chart_type || 'bar',
                x_column: chartConfig.x_column,
                y_column: chartConfig.y_column,
                title: chartConfig.title,
                description: chartConfig.description,
              }]
            : [];

        console.log('handleDataUpdate: Processed charts', charts);

        if (charts.length > 0) {
          const dashboardData = newResult.processed_data || newResult.data || currentData;
          const dashboardColumns = newResult.columns || currentColumns;
          
          console.log('handleDataUpdate: Creating dashboard', {
            chartsCount: charts.length,
            dataLength: dashboardData?.length,
            columns: dashboardColumns,
            sampleRow: dashboardData?.[0]
          });

          const newDashboard: DashboardData = {
            id: Date.now().toString(),
            title: `Dashboard ${dashboards.length + 1}`,
            charts,
            data: dashboardData,
            columns: dashboardColumns,
            createdAt: new Date(),
          };

          const updatedDashboards = [...dashboards, newDashboard];
          setDashboards(updatedDashboards);
          setCurrentDashboardIndex(updatedDashboards.length - 1);
          setCurrentData(newDashboard.data);
          setCurrentColumns(newDashboard.columns);
          
          // Save to sessionStorage
          sessionStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(updatedDashboards));
          console.log('handleDataUpdate: Dashboard saved to sessionStorage');
        } else {
          console.warn('handleDataUpdate: No valid charts found after processing');
        }
      } else {
        console.log('handleDataUpdate: No chart config found in action plan');
      }
    } else {
      console.log('handleDataUpdate: No action plan in result');
    }

    // Update current data if it changed
    if (newResult.processed_data) {
      setCurrentData(newResult.processed_data);
      setCurrentColumns(newResult.columns || currentColumns);
    }
  };

  const currentDashboard = dashboards[currentDashboardIndex];

  const handlePrevious = () => {
    if (currentDashboardIndex > 0) {
      setCurrentDashboardIndex(currentDashboardIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentDashboardIndex < dashboards.length - 1) {
      setCurrentDashboardIndex(currentDashboardIndex + 1);
    }
  };

  // Prepare chart data from dashboard data
  const prepareChartData = (chart: ChartConfig, data: Record<string, any>[]) => {
    if (!data || data.length === 0) {
      console.warn('prepareChartData: No data provided');
      return [];
    }

    const xCol = chart.x_column;
    const yCol = chart.y_column;

    if (!xCol || !yCol) {
      console.warn('prepareChartData: Missing column names', { xCol, yCol });
      return [];
    }

    // Get actual column names from data (case-insensitive matching)
    const actualColumns = data.length > 0 ? Object.keys(data[0]) : [];
    console.log('prepareChartData: Available columns', actualColumns);
    console.log('prepareChartData: Chart config', { xCol, yCol, chart_type: chart.chart_type });
    console.log('prepareChartData: Sample data row', data.length > 0 ? data[0] : 'No data');

    // Find matching columns (case-insensitive)
    const findColumn = (targetCol: string): string | null => {
      if (!targetCol) return null;
      // Exact match first
      if (actualColumns.includes(targetCol)) return targetCol;
      // Case-insensitive match
      const lowerTarget = targetCol.toLowerCase();
      const found = actualColumns.find(col => col.toLowerCase() === lowerTarget);
      if (found) return found;
      // Partial match (contains)
      const partial = actualColumns.find(col => 
        col.toLowerCase().includes(lowerTarget) || lowerTarget.includes(col.toLowerCase())
      );
      return partial || null;
    };

    const matchedXCol = findColumn(xCol);
    const matchedYCol = findColumn(yCol);

    if (!matchedXCol || !matchedYCol) {
      console.error('prepareChartData: Column mismatch', {
        expected: { xCol, yCol },
        available: actualColumns,
        matched: { matchedXCol, matchedYCol },
        sampleRow: data.length > 0 ? data[0] : null
      });
      // Try to use first two columns as fallback if exact match fails
      if (actualColumns.length >= 2) {
        const fallbackX = matchedXCol || actualColumns[0];
        const fallbackY = matchedYCol || actualColumns[1];
        if (fallbackX && fallbackY && (!matchedXCol || !matchedYCol)) {
          console.warn('prepareChartData: Using fallback columns', {
            fallbackX,
            fallbackY,
            original: { xCol, yCol }
          });
          // Use fallback columns directly instead of recursive call
          const finalXCol = fallbackX;
          const finalYCol = fallbackY;
          
          // Process with fallback columns
          const aggregated: Record<string, number> = {};
          let validRowsCount = 0;
          
          data.forEach(row => {
            const category = normalizeCategory(row[finalXCol]);
            if (!category) return;
            
            let value: number;
            const rawValue = row[finalYCol];
            if (typeof rawValue === 'number') {
              value = rawValue;
            } else if (typeof rawValue === 'string') {
              const cleaned = rawValue.replace(/,/g, '').trim();
              value = parseFloat(cleaned);
            } else {
              value = parseFloat(rawValue);
            }
            
            if (isNaN(value) || !isFinite(value)) return;
            
            validRowsCount++;
            aggregated[category] = (aggregated[category] || 0) + value;
          });
          
          const entries = Object.entries(aggregated);
          const filtered = validRowsCount <= 1 ? entries : entries.filter(([_, value]) => value > 0);
          
          return filtered
            .sort(([_, a], [__, b]) => b - a)
            .map(([category, value]) => {
              const row: Record<string, any> = {};
              row[finalXCol] = category;
              row[finalYCol] = value;
              return row;
            });
        }
      }
      return [];
    }

    console.log('prepareChartData: Using columns', { matchedXCol, matchedYCol });

    // Helper function to check if a value is valid (not NaN, null, undefined, empty string, or "nan")
    const isValidValue = (val: any): boolean => {
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') {
        const trimmed = val.trim().toLowerCase();
        return trimmed !== '' && trimmed !== 'nan' && trimmed !== 'null' && trimmed !== 'undefined';
      }
      if (typeof val === 'number') {
        return !isNaN(val) && isFinite(val);
      }
      return true;
    };

    // Helper function to normalize category names
    const normalizeCategory = (val: any): string | null => {
      if (!isValidValue(val)) return null;
      const str = String(val).trim();
      if (str.toLowerCase() === 'nan' || str.toLowerCase() === 'category') return null;
      return str;
    };

    // For pie charts, aggregate by x_column and sum y_column
    if (chart.chart_type === 'pie') {
      const aggregated: Record<string, number> = {};
      data.forEach(row => {
        const category = normalizeCategory(row[matchedXCol]);
        if (!category) return; // Skip invalid categories
        
        const value = parseFloat(row[matchedYCol]);
        if (isNaN(value) || !isFinite(value)) return; // Skip invalid values
        
        aggregated[category] = (aggregated[category] || 0) + value;
      });
      
      // Filter out entries with zero or negative values and sort by value descending
      return Object.entries(aggregated)
        .filter(([_, value]) => value > 0)
        .sort(([_, a], [__, b]) => b - a)
        .map(([name, value]) => ({
          name,
          value,
        }));
    }

    // For bar, line, area charts - aggregate by x_column
    if (['bar', 'line', 'area'].includes(chart.chart_type)) {
      const aggregated: Record<string, number> = {};
      let validRowsCount = 0;
      
      data.forEach(row => {
        const category = normalizeCategory(row[matchedXCol]);
        if (!category) {
          console.warn('prepareChartData: Skipping row with invalid category', row);
          return; // Skip invalid categories
        }
        
        // Try to parse as number, handle string numbers with multiple formats
        let value: number;
        const rawValue = row[matchedYCol];
        
        if (rawValue === null || rawValue === undefined) {
          console.warn('prepareChartData: Skipping row with null/undefined value', { category });
          return;
        }
        
        if (typeof rawValue === 'number') {
          value = rawValue;
        } else if (typeof rawValue === 'string') {
          // Remove commas, currency symbols, whitespace, then parse
          let cleaned = rawValue
            .replace(/,/g, '')  // Remove commas
            .replace(/\$/g, '')  // Remove dollar signs
            .replace(/€/g, '')    // Remove euro signs
            .replace(/£/g, '')    // Remove pound signs
            .replace(/%/g, '')    // Remove percent signs
            .trim();
          
          // Try to extract number from strings like "5218.00" or "5,218.00" or "$5,218.00"
          const numberMatch = cleaned.match(/[-+]?[\d.]+/);
          if (numberMatch) {
            cleaned = numberMatch[0];
          }
          
          value = parseFloat(cleaned);
        } else if (typeof rawValue === 'boolean') {
          // Convert boolean to number (true = 1, false = 0)
          value = rawValue ? 1 : 0;
        } else {
          // Try to convert to string first, then parse
          const stringValue = String(rawValue).replace(/,/g, '').trim();
          value = parseFloat(stringValue);
        }
        
        if (isNaN(value) || !isFinite(value)) {
          console.warn('prepareChartData: Skipping row with invalid numeric value', { 
            category, 
            rawValue, 
            rawValueType: typeof rawValue,
            parsed: value,
            row: row
          });
          return; // Skip invalid values
        }
        
        validRowsCount++;
        aggregated[category] = (aggregated[category] || 0) + value;
      });
      
      console.log('prepareChartData: Aggregation complete', {
        validRows: validRowsCount,
        totalRows: data.length,
        aggregatedCount: Object.keys(aggregated).length,
        aggregated: aggregated
      });
      
      // Convert to array - allow zero values for single-row datasets
      // Only filter zeros if we have multiple categories (aggregated data)
      const entries = Object.entries(aggregated);
      const filtered = validRowsCount <= 1 
        ? entries  // Don't filter zeros for single-row datasets
        : entries.filter(([_, value]) => value > 0);  // Filter zeros for aggregated data
      
      const result = filtered
        .sort(([_, a], [__, b]) => b - a)
        .map(([category, value]) => {
          const row: Record<string, any> = {};
          row[matchedXCol] = category;
          row[matchedYCol] = value;
          return row;
        });
      
      console.log('prepareChartData: Bar/Line/Area chart result', { 
        chart_type: chart.chart_type, 
        dataPoints: result.length,
        sample: result.slice(0, 3),
        keys: result.length > 0 ? Object.keys(result[0]) : [],
        originalDataLength: data.length
      });
      
      return result;
    }

    // For scatter charts, return data as-is but filter invalid values
    if (chart.chart_type === 'scatter') {
      return data
        .filter(row => {
          const xVal = parseFloat(row[matchedXCol]);
          const yVal = parseFloat(row[matchedYCol]);
          return !isNaN(xVal) && !isNaN(yVal) && isFinite(xVal) && isFinite(yVal);
        })
        .map(row => ({
          [matchedXCol]: parseFloat(row[matchedXCol]),
          [matchedYCol]: parseFloat(row[matchedYCol]),
        }));
    }

    // Default: return filtered data
    return data
      .filter(row => {
        const category = normalizeCategory(row[matchedXCol]);
        const value = parseFloat(row[matchedYCol]);
        return category && !isNaN(value) && isFinite(value);
      })
      .map(row => ({
        [matchedXCol]: normalizeCategory(row[matchedXCol]),
        [matchedYCol]: parseFloat(row[matchedYCol]),
      }));
  };

  const renderChart = (chart: ChartConfig, index: number) => {
    if (!currentDashboard || !currentDashboard.data) {
      console.error('renderChart: No dashboard data available');
      return (
        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{chart.title || `Chart ${index + 1}`}</h3>
          <p className="text-gray-500">No dashboard data available.</p>
        </div>
      );
    }

    const chartData = prepareChartData(chart, currentDashboard.data);
    
    if (chartData.length === 0) {
      console.warn('renderChart: No chart data prepared', {
        chart,
        dataLength: currentDashboard.data.length,
        columns: currentDashboard.columns,
        sampleRow: currentDashboard.data[0]
      });
      return (
        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{chart.title || `Chart ${index + 1}`}</h3>
          <p className="text-gray-500">No data available for this chart.</p>
          <p className="text-xs text-gray-400 mt-2">
            Expected columns: {chart.x_column} (X), {chart.y_column} (Y)
            {currentDashboard.data.length > 0 && (
              <> • Available columns: {Object.keys(currentDashboard.data[0]).join(', ')}</>
            )}
          </p>
        </div>
      );
    }

    // Get the actual keys from the prepared chart data
    const dataKeys = chartData.length > 0 ? Object.keys(chartData[0]) : [];
    const xDataKey = dataKeys[0] || chart.x_column;
    const yDataKey = dataKeys[1] || chart.y_column;

    const colors = ['#00A878', '#00c98c', '#10b981', '#14b8a6', '#22c55e', '#059669'];
    const chartColor = colors[index % colors.length];

    switch (chart.chart_type) {
      case 'bar':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{chart.title || `Bar Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={xDataKey}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey={yDataKey}
                  fill={chartColor}
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{chart.title || `Line Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={xDataKey} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={yDataKey} 
                  stroke={chartColor}
                  strokeWidth={3}
                  dot={{ fill: chartColor, r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{chart.title || `Pie Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    if (percent < 0.01) return ''; // Don't show labels for very small slices
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Value']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string) => {
                    const entry = chartData.find((d: any) => d.name === value);
                    if (!entry || !entry.value) return value;
                    const total = chartData.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
                    if (total === 0) return value;
                    const percent = ((entry.value / total) * 100).toFixed(1);
                    return `${value} (${percent}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{chart.title || `Area Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={xDataKey} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={yDataKey} 
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.6}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{chart.title || `Scatter Chart ${index + 1}`}</h3>
            {chart.description && <p className="text-sm text-gray-600 mb-4">{chart.description}</p>}
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={xDataKey} 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis 
                  dataKey={yDataKey}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Scatter 
                  dataKey={yDataKey} 
                  fill={chartColor}
                  animationDuration={800}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{chart.title || `Chart ${index + 1}`}</h3>
            <p className="text-gray-500">Unsupported chart type: {chart.chart_type}</p>
          </div>
        );
    }
  };

  // Empty state
  if (dashboards.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col" style={{ marginRight: isChatbotOpen ? '420px' : '0' }}>
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
                  <h1 className="text-sm font-medium text-gray-700">Dashboard</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#00A878]/10 to-[#00c98c]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-[#00A878]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Dashboards Yet</h2>
              <p className="text-gray-600 mb-6">
                To create a dashboard, tell the chatbot to create charts or visualizations. 
                For example: "Create a bar chart of revenue by region" or "Create a dashboard with multiple charts".
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm font-semibold text-blue-900 mb-2">Example prompts:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>"Create a bar chart of sales by category"</li>
                  <li>"Show me revenue trends with a line chart"</li>
                  <li>"Create a pie chart showing distribution by region"</li>
                  <li>"Generate a dashboard with multiple charts"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbot */}
        {currentData.length > 0 && (
          <AIChatbot
            initialData={currentData}
            initialColumns={currentColumns}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ marginRight: isChatbotOpen ? '420px' : '0', minWidth: 0 }}>
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
                <h1 className="text-sm font-medium text-gray-700">{currentDashboard.title}</h1>
                <p className="text-xs text-gray-500">
                  Dashboard {currentDashboardIndex + 1} of {dashboards.length} • {currentDashboard.charts.length} chart{currentDashboard.charts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
                disabled={currentDashboardIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                size="sm"
                disabled={currentDashboardIndex === dashboards.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content - Scrollable */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ minWidth: 0 }}>
          <div className="max-w-7xl mx-auto">
            {currentDashboard.charts.map((chart, index) => renderChart(chart, index))}
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {currentData.length > 0 && (
        <AIChatbot
          initialData={currentData}
          initialColumns={currentColumns}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
}

