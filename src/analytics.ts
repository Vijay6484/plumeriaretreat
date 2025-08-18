import { GA4 } from 'react-ga4';

export const initGA = (id: string) => {
  if (process.env.NODE_ENV === 'production' && id) {
    GA4.initialize(id);
  }
};

export const trackPage = (path: string) => {
  GA4.pageview(path);
};

export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  GA4.event(name, params);
};
