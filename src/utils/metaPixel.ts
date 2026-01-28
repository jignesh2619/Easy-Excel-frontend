/**
 * Meta Pixel (Facebook Pixel) tracking utility
 * 
 * To get your Pixel ID:
 * 1. Go to https://business.facebook.com/events_manager2
 * 2. Select your Pixel or create a new one
 * 3. Copy the Pixel ID (it's a 15-16 digit number)
 * 4. Add it to your .env file as VITE_META_PIXEL_ID=YOUR_PIXEL_ID
 */

declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, any>
    ) => void;
  }
}

/**
 * Initialize Meta Pixel (called automatically in index.html)
 * This function is for manual initialization if needed
 */
export const initMetaPixel = (pixelId: string) => {
  if (typeof window === 'undefined' || window.fbq) {
    return;
  }

  (function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

/**
 * Track a custom event
 * @param eventName - Name of the event (e.g., 'Lead', 'Purchase', 'SignUp')
 * @param params - Optional parameters for the event
 */
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

/**
 * Track page view
 */
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track when a user signs up
 */
export const trackSignUp = (params?: Record<string, any>) => {
  trackMetaEvent('CompleteRegistration', params);
};

/**
 * Track when a user makes a purchase
 */
export const trackPurchase = (value?: number, currency: string = 'USD', params?: Record<string, any>) => {
  trackMetaEvent('Purchase', {
    value,
    currency,
    ...params,
  });
};

/**
 * Track when a user initiates checkout
 */
export const trackInitiateCheckout = (params?: Record<string, any>) => {
  trackMetaEvent('InitiateCheckout', params);
};

/**
 * Track when a user adds to cart
 */
export const trackAddToCart = (params?: Record<string, any>) => {
  trackMetaEvent('AddToCart', params);
};

/**
 * Track when a user views content
 */
export const trackViewContent = (params?: Record<string, any>) => {
  trackMetaEvent('ViewContent', params);
};

/**
 * Track when a user submits a lead form
 */
export const trackLead = (params?: Record<string, any>) => {
  trackMetaEvent('Lead', params);
};

/**
 * Track when a user starts a free trial
 */
export const trackStartTrial = (params?: Record<string, any>) => {
  trackMetaEvent('StartTrial', params);
};

/**
 * Track when a user subscribes
 */
export const trackSubscribe = (params?: Record<string, any>) => {
  trackMetaEvent('Subscribe', params);
};
