import { label } from 'framer-motion/client';
import { NavItem, Testimonial, GalleryImage, Accommodation, MealPlan, Activity, FAQ, NearbyLocation } from '../types';

export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Campsites', path: '/campsites' },
  { label: 'Packages', path: '/packages' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const nearbyLocations: NearbyLocation[] = [
  {
    id: 1,
    name: 'Tikona Fort',
    distance: 5,
    image: 'https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg',
    description: 'A triangular shaped fort offering panoramic views of the surrounding valleys.'
  },
  {
    id: 2,
    name: 'Satya Sai Temple Hadshi',
    distance: 12,
    image: 'https://images.pexels.com/photos/5998495/pexels-photo-5998495.jpeg',
    description: 'A peaceful spiritual retreat with beautiful architecture and serene surroundings.'
  },
  {
    id: 3,
    name: 'Tung Fort',
    distance: 24,
    image: 'https://images.pexels.com/photos/2832039/pexels-photo-2832039.jpeg',
    description: 'Historic fort with challenging trek and rewarding mountain views.'
  },
  {
    id: 4,
    name: 'Lohagad Fort',
    distance: 16,
    image: 'https://images.pexels.com/photos/2832051/pexels-photo-2832051.jpeg',
    description: 'One of the most popular forts near Lonavala, known for its monsoon beauty.'
  },
  {
    id: 5,
    name: 'Visapur Fort',
    distance: 18,
    image: 'https://images.pexels.com/photos/2832056/pexels-photo-2832056.jpeg',
    description: 'Sister fort of Lohagad offering unique historical insights.'
  },
  {
    id: 6,
    name: 'Bedse Caves',
    distance: 10,
    image: 'https://images.pexels.com/photos/5998498/pexels-photo-5998498.jpeg',
    description: 'Ancient Buddhist caves with intricate carvings and peaceful atmosphere.'
  },
  {
    id: 7,
    name: 'Bhaje Caves',
    distance: 19,
    image: 'https://images.pexels.com/photos/5998501/pexels-photo-5998501.jpeg',
    description: 'Rock-cut caves featuring Buddhist architecture and stunning valley views.'
  },
  {
    id: 8,
    name: 'Karla Caves',
    distance: 29,
    image: 'https://images.pexels.com/photos/5998504/pexels-photo-5998504.jpeg',
    description: 'Largest and best-preserved early Buddhist cave shrines in India.'
  },
  {
    id: 9,
    name: 'Prati Pandharpur Dudhivare',
    distance: 11,
    image: 'https://images.pexels.com/photos/5998507/pexels-photo-5998507.jpeg',
    description: 'Religious site known for its spiritual significance and peaceful environment.'
  },
  {
    id: 10,
    name: 'Tiger Point',
    distance: 29,
    image: 'https://images.pexels.com/photos/5998510/pexels-photo-5998510.jpeg',
    description: 'Scenic viewpoint offering spectacular sunset views and valley panoramas.'
  },
  {
    id: 11,
    name: 'Bhushi Dam',
    distance: 25,
    image: 'https://images.pexels.com/photos/5998513/pexels-photo-5998513.jpeg',
    description: 'Popular waterfall and dam site, perfect for monsoon visits.'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 5,
    text: 'Our family had the most amazing time at Plumeria Retreat! The lake view from our cottage was breathtaking, and the kids loved the boating activities. Will definitely be back!',
  },
  {
    id: 2,
    name: 'James Wilson',
    location: 'California',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4,
    text: 'Perfect weekend getaway. The luxury tents were surprisingly comfortable and the staff was very accommodating. Highly recommend the sunset paragliding experience!',
  },
  {
    id: 3,
    name: 'Emily Chen',
    location: 'Washington',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 5,
    text: 'The campfire BBQ night was the highlight of our trip. Great amenities, beautiful surroundings, and excellent customer service. A true nature lover\'s paradise.',
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/3045272/pexels-photo-3045272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Lake view at sunset',
    category: 'nature',
    width: 800,
    height: 600,
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/2351287/pexels-photo-2351287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Luxury cottage interior',
    category: 'accommodation',
    width: 600,
    height: 800,
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Paragliding over the lake',
    category: 'nature',
    width: 800,
    height: 600,
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Luxury tent setup',
    category: 'accommodation',
    width: 800,
    height: 600,
  },
  {
    id: 5,
    src: 'https://images.pexels.com/photos/6271620/pexels-photo-6271620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Evening campfire',
    category: 'nature',
    width: 600,
    height: 800,
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/6492397/pexels-photo-6492397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Forest hiking trail',
    category: 'nature',
    width: 800,
    height: 600,
  },
  {
    id: 7,
    src: 'https://images.pexels.com/photos/172872/pexels-photo-172872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Cottage exterior',
    category: 'accommodation',
    width: 800,
    height: 600,
  },
  {
    id: 8,
    src: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Boating on the lake',
    category: 'nature',
    width: 600,
    height: 800,
  },
];

export const accommodations: Accommodation[] = [
  {
    id: 1,
    type: 'AC Cottage',
    title: 'AC Lake View Cottages',
    description: 'Luxurious air-conditioned cottages with stunning lake views, perfect for couples seeking comfort and romance.',
    price: 4500,
    capacity: 2,
    features: [
      '🎸 Live Music Every Saturday',
      '🏠 Separate cottage for couples',
      '❄️ Air conditioning',
      '🌊 Private lake view balcony',
      '📺 Android TV',
      '🛁 Attached toilet & bathroom',
      '🏊‍♂️ Swimming pool access',
      '📶 Free WiFi'
    ],
    image: 'https://images.pexels.com/photos/9144680/pexels-photo-9144680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    hasAC: true,
    hasAttachedBath: true,
    availableRooms: 10,
    detailedInfo: {
      totalCottages: 10,
      meals: {
        included: true,
        description: 'Including evening snacks, dinner, and morning breakfast',
        snacks: 'Tea/coffee, Kanda bhaji',
        dinner: {
          veg: 'Matar paneer, veg kofta, dal, tandoor roti, rice, salad, sweet',
          nonVeg: 'Dry chicken, gravy, tandoor roti, rice, salad'
        },
        breakfast: 'Tea/coffee, poha/upma'
      },
      activities: [
        { name: 'Archery', price: 0 },
        { name: 'Badminton', price: 0 },
        { name: 'Carrom', price: 0 },
        { name: 'Cards', price: 0 },
        { name: 'Paddle boating', price: 100 },
        { name: 'Kayaking', price: 200 },
        { name: 'Motor boating', price: 200 },
        { name: 'Speed boating', price: 300 }
      ]
    }
  },
  {
    id: 2,
    type: 'Triangular Tent',
    title: 'Triangular Adventure Tents',
    description: 'Unique triangular-shaped tents offering an authentic camping experience with modern amenities.',
    price: 2500,
    capacity: 3,
    features: ['Unique triangular design', 'Comfortable bedding', 'Shared facilities', 'Campfire access', 'Nature immersion'],
    image: 'https://images.pexels.com/photos/6640068/pexels-photo-6640068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    hasAC: false,
    hasAttachedBath: false,
    availableRooms: 8,
    detailedInfo: {
      totalCottages: 8,
      meals: {
        included: false,
        description: 'Meals can be arranged separately'
      },
      activities: [
        { name: 'Hiking trails', price: 0 },
        { name: 'Stargazing', price: 0 },
        { name: 'Campfire', price: 0 },
        { name: 'Nature walks', price: 0 }
      ]
    }
  },
  {
    id: 3,
    type: 'U-Shaped Dome',
    title: 'U-Shaped Dome Tents',
    description: 'Spacious U-shaped dome tents designed for families and groups seeking adventure in comfort.',
    price: 3000,
    capacity: 4,
    features: ['Spacious dome design', 'Family-friendly', 'Weather resistant', 'Comfortable sleeping', 'Group activities'],
    image: 'https://images.pexels.com/photos/2526025/pexels-photo-2526025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    hasAC: false,
    hasAttachedBath: false,
    availableRooms: 6,
    detailedInfo: {
      totalCottages: 6,
      meals: {
        included: false,
        description: 'Meals can be arranged separately'
      },
      activities: [
        { name: 'Group games', price: 0 },
        { name: 'Outdoor cooking', price: 0 },
        { name: 'Team building', price: 0 },
        { name: 'Adventure sports', price: 0 }
      ]
    }
  }
];

export const packages: any[] = [
  {
    id: 1,
    name: 'Weekend Getaway Package',
    description: 'Perfect 2-day escape with accommodation, meals, and activities included.',
    price: 8999,
    duration: 2,
    max_guests: 2,
    image_url: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    includes: [
      'AC Lake View Cottage for 2 nights',
      'All meals included',
      'Complimentary activities',
      'Live music on Saturday',
      'Swimming pool access'
    ],
    active: true,
    detailedInfo: {
      accommodation: 'AC Lake View Cottage',
      meals: 'All meals included (breakfast, lunch, dinner, snacks)',
      activities: [
        'Archery',
        'Badminton',
        'Swimming',
        'Boating (extra charges apply)',
        'Live music on Saturday evening'
      ],
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in'
    }
  },
  {
    id: 2,
    name: 'Adventure Camping Package',
    description: 'Thrilling outdoor adventure with tent accommodation and exciting activities.',
    price: 5999,
    duration: 2,
    max_guests: 4,
    image_url: 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    includes: [
      'Dome tent accommodation',
      'Outdoor cooking experience',
      'Adventure activities',
      'Campfire evening',
      'Nature guided tours'
    ],
    active: true,
    detailedInfo: {
      accommodation: 'U-Shaped Dome Tent',
      meals: 'Outdoor cooking experience and campfire meals',
      activities: [
        'Trekking',
        'Rock climbing',
        'Kayaking',
        'Campfire cooking',
        'Stargazing sessions'
      ],
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Free cancellation up to 48 hours before check-in'
    }
  }
];

export const mealPlans: MealPlan[] = [
  {
    id: 1,
    type: 'MEP',
    title: 'Meal Included Plan',
    description: 'Start and end your day with delicious, locally-sourced meals prepared by our skilled chefs. Perfect for guests who want to fully relax.',
    price: 35,
    includes: ['Hearty breakfast', 'Three-course dinner', 'Evening snacks', 'Coffee & tea all day', 'Special diet accommodation'],
  },
  {
    id: 2,
    type: 'EP',
    title: 'No Meal Plan',
    description: 'Perfect for the independent traveler who prefers to self-cater or explore local dining options. Includes access to shared kitchen facilities.',
    price: 0,
    includes: ['Shared kitchen access', 'Refrigerator space', 'BBQ area usage', 'Basic cooking supplies', 'Local restaurant recommendations'],
  },
];

export const activities: Activity[] = [
  {
    id: 1,
    title: 'Boating Adventure',
    description: 'Explore the serene lake waters with our well-maintained boats. Perfect for fishing or simply enjoying the tranquility of nature.',
    price: 25,
    image: 'https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '2 hours',
  },
  {
    id: 2,
    title: 'Paragliding Experience',
    description: 'Soar high above the landscape for breathtaking aerial views of the lake and surrounding forests with our experienced guides.',
    price: 89,
    image: 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '30 minutes',
  },
  {
    id: 3,
    title: 'Campfire BBQ Night',
    description: 'Enjoy an evening of good food, storytelling, and stargazing around a crackling campfire with fellow guests.',
    price: 40,
    image: 'https://images.pexels.com/photos/5767416/pexels-photo-5767416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '3 hours',
  },
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: 'What is your cancellation policy?',
    answer: 'Bookings can be cancelled up to 7 days before arrival for a full refund. Cancellations within 7 days will receive a 50% refund. No refunds for cancellations within 48 hours of check-in.',
  },
  {
    id: 2,
    question: 'Are pets allowed at Plumeria Retreat?',
    answer: 'Yes, we welcome well-behaved pets in certain accommodations for an additional fee of $25 per night. Please inform us at the time of booking if you plan to bring a pet.',
  },
  {
    id: 3,
    question: 'What is the check-in and check-out time?',
    answer: 'Check-in is available from 3:00 PM to 8:00 PM. Check-out is before 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability.',
  },
  {
    id: 4,
    question: 'Is there Wi-Fi available?',
    answer: 'Wi-Fi is available in the main lodge area and AC cottages. Other areas have limited connectivity by design to encourage a digital detox experience.',
  },
  {
    id: 5,
    question: 'What activities are included in the basic stay?',
    answer: 'Your stay includes access to hiking trails, the private beach area, fire pit usage, and board games in the common area. Additional activities like boating and paragliding are available for an extra fee.',
  },
];