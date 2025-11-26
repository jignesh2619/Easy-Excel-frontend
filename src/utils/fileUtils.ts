/**
 * File utility functions
 */

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
  ];
  
  const validExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file size (max 50MB)
 */
export function isValidFileSize(file: File, maxSizeMB: number = 50): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Get file validation error message
 */
export function getFileValidationError(file: File): string | null {
  if (!isValidFileType(file)) {
    return 'Invalid file type. Please upload a CSV or Excel file (.csv, .xlsx, .xls)';
  }
  
  if (!isValidFileSize(file)) {
    return `File size exceeds ${formatFileSize(50 * 1024 * 1024)}. Please upload a smaller file.`;
  }
  
  return null;
}










