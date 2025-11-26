/**
 * API Service for EasyExcel Backend
 * Handles all communication with the backend API
 */

// Normalize API base URL (remove trailing slash to prevent double slashes)
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE_URL = rawUrl.toString().replace(/\/+$/, '');

export interface ProcessFileResponse {
  status: string;
  processed_file_url?: string;
  chart_url?: string;
  summary: string[];
  action_plan?: any;
  message?: string;
  processed_data?: Record<string, any>[]; // Array of row objects
  columns?: string[]; // Column names
  row_count?: number; // Total number of rows
}

export interface HealthResponse {
  status: string;
  message: string;
}

/**
 * Check if backend is healthy
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Backend not responding');
    }
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}

/**
 * Process Excel/CSV file with a prompt
 */
export async function processFile(
  file: File,
  prompt: string
): Promise<ProcessFileResponse> {
  try {
    // Validate inputs
    if (!file) {
      throw new Error('No file selected');
    }
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt is required');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    // Get auth token for authenticated requests
    const token = await getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make API request
    const response = await fetch(`${API_BASE_URL}/process-file`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('File processing failed:', error);
    throw error;
  }
}

/**
 * Download a processed file
 */
export function getFileDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/download/${filename}`;
}

/**
 * Download a chart image
 */
export function getChartDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/download/charts/${filename}`;
}

/**
 * Get auth token from Supabase session
 * Refreshes session if needed to ensure valid token
 */
async function getAuthToken(): Promise<string | null> {
  try {
    // Import Supabase client dynamically
    const { supabase } = await import('../lib/supabase');
    
    // Get current session
    let { data: { session }, error } = await supabase.auth.getSession();
    
    // If no session or error, try to refresh
    if (!session || error) {
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshedSession && !refreshError) {
        session = refreshedSession;
      }
    }
    
    // Check if session is valid
    if (!session?.access_token) {
      return null;
    }
    
    return session.access_token;
  } catch (e) {
    console.error('Failed to get auth token:', e);
    return null;
  }
}

/**
 * Helper to download a file from URL (requires authentication)
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    let token = await getAuthToken();
    
    // Require authentication - throw error if no token
    if (!token) {
      throw new Error('Authentication required. Please sign in to download files.');
    }
    
    let headers: HeadersInit = {
      'Authorization': `Bearer ${token}`
    };
    
    let response = await fetch(url, {
      headers,
    });
    
    // If 401, try refreshing the session and retry once
    if (response.status === 401) {
      console.log('Token expired, refreshing session...');
      const { supabase } = await import('../lib/supabase');
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshedSession?.access_token && !refreshError) {
        token = refreshedSession.access_token;
        headers = {
          'Authorization': `Bearer ${token}`
        };
        response = await fetch(url, {
          headers,
        });
      }
    }
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication required. Please sign in to download files.');
      }
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

/**
 * PayPal Payment Interfaces
 */
export interface CreateSubscriptionRequest {
  plan_name: string;
  user_email: string;
  user_id: string;
}

export interface SubscriptionResponse {
  status: string;
  subscription_id: string;
  approval_url: string;
  plan_name: string;
}

/**
 * Create a PayPal subscription
 */
export async function createPayPalSubscription(
  planName: string,
  userEmail: string,
  userId: string,
  accessToken?: string
): Promise<SubscriptionResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authentication token if provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/payments/create-subscription`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        plan_name: planName,
        user_email: userEmail,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PayPal subscription creation failed:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(subscriptionId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/subscription/${subscriptionId}`);
    if (!response.ok) {
      throw new Error('Failed to get subscription details');
    }
    return await response.json();
  } catch (error) {
    console.error('Get subscription details failed:', error);
    throw error;
  }
}


