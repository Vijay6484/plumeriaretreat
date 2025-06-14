export interface NavItem {
  label: string;
  path: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'nature' | 'accommodation';
  width: number;
  height: number;
}

export interface Accommodation {
  id: number;
  type: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  features: string[];
  image: string;
  hasAC: boolean;
  hasAttachedBath: boolean;
  availableRooms: number;
  detailedInfo: any;
  packages?: Package[]; // <-- Add this line
}

export interface MealPlan {
  id: number;
  type: string;
  title: string;
  description: string;
  price: number;
  includes: string[];
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface NearbyLocation {
  id: number;
  name: string;
  distance: number;
  image: string;
  description: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  max_guests: number;
  image_url: string;
  includes: string[];
  active: boolean;
  detailedInfo: {
    accommodation: string;
    meals: string;
    activities: string[];
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}