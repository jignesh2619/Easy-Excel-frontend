/**
 * Google Analytics utility
 * Initializes and tracks page views for the SPA
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = 'G-C5JS59EY8F';

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  // Check if already initialized
  if (window.dataLayer && window.gtag) {
    return;
  }

  // Initialize dataLayer and gtag function (in case HTML script hasn't loaded yet)
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Check if script is already in the DOM (from index.html)
  const existingScript = document.querySelector(`script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`);
  
  if (!existingScript) {
    // Load gtag.js script if not already present
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);
  }

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname + window.location.search,
  });
};

/**
 * Track page view
 */
export const trackPageView = (path: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

/**
 * Track custom event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

