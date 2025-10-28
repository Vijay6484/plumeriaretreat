import ReactGA from 'react-ga4';

// Google Analytics Measurement ID (G-XXXXXXXXXX)
// Replace this with your actual Google Analytics Tracking ID
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

let isInitialized = false;
let currentTrackingId = '';

/**
 * Initialize Google Analytics
 */
export const initGA = (trackingId?: string): void => {
  const id = trackingId || GA_TRACKING_ID;
  
  if (!id) {
    console.warn('Google Analytics Tracking ID is not configured. Please set VITE_GA_TRACKING_ID environment variable.');
    return;
  }

  if (isInitialized) {
    return;
  }

  try {
    ReactGA.initialize(id, {
      testMode: import.meta.env.DEV, // Disable in development to avoid test data
    });
    currentTrackingId = id;
    isInitialized = true;
    console.log('Google Analytics initialized with ID:', id);
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
  }
};

/**
 * Track page views
 */
export const trackPageView = (page: string, title?: string): void => {
  if (!isInitialized || !currentTrackingId) {
    return;
  }

  try {
    // React GA4 uses gtag config to track page views
    ReactGA.gtag('config', currentTrackingId, {
      page_path: page,
      page_title: title || page,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Track custom events
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  if (!isInitialized) {
    return;
  }

  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
};

