/**
 * Format currency with locale and currency symbol
 */
export const formatCurrency = (amount: number, locale = 'en-IN', currency = 'INR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Create stars display for ratings
 */
export const renderStars = (rating: number, maxStars = 5): string[] => {
  return Array.from({ length: maxStars }, (_, index) => {
    if (index < rating) return 'filled';
    if (index < rating + 0.5) return 'half';
    return 'empty';
  });
};

/**
 * Get current weather data from the API
 */
export const fetchWeather = async (latitude: number, longitude: number): Promise<any> => {
  // This would normally fetch from a real weather API
  // For demo purposes, we're returning mock data
  return {
    temperature: 72,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 5,
    icon: '☀️',
  };
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get responsive image sizes based on screen width
 */
export const getResponsiveImageSize = (baseSize: number, screenWidth: number): number => {
  if (screenWidth < 640) return baseSize * 0.8;
  if (screenWidth < 1024) return baseSize * 0.9;
  return baseSize;
};