import { NavItem, Testimonial, GalleryImage, Accommodation, MealPlan, Activity, FAQ, NearbyLocation } from '../types';

// Navigation Items
export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Tents', path: '/campsites' },
  { label: 'Cottages', path: '/packages' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

// Nearby Locations
export const nearbyLocations: NearbyLocation[] = [
  {
    id: 1,
    name: 'Tikona Fort',
    distance: 5,
    image: 'https://www.trawell.in/admin/images/upload/080966340Lonavala_Tikona_Fort_Main.jpg',
    description: 'A triangular shaped fort offering panoramic views of the surrounding valleys.'
  },
  {
    id: 2,
    name: 'Satya Sai Temple Hadshi',
    distance: 12,
    image: 'https://www.rsm.ac.uk/media/1912/deccan-gymkhana.jpg?anchor=center&mode=crop&width=540&height=405&rnd=131921931430000000',
    description: 'A peaceful spiritual retreat with beautiful architecture and serene surroundings.'
  },
  {
    id: 3,
    name: 'Tung Fort',
    distance: 24,
    image: 'https://i.pinimg.com/736x/99/39/6b/99396b5f278aff74714b998e3d901b97--trek-fort.jpg',
    description: 'Historic fort with challenging trek and rewarding mountain views.'
  },
  {
    id: 4,
    name: 'Lohagad Fort',
    distance: 16,
    image: 'https://static2.tripoto.com/media/filter/nl/img/423292/TripDocument/1543300164_1.jpg',
    description: 'One of the most popular forts near Lonavala, known for its monsoon beauty.'
  },
  {
    id: 5,
    name: 'Visapur Fort',
    distance: 18,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Visapur_fort_in_monsoon.jpg',
    description: 'Sister fort of Lohagad offering unique historical insights.'
  },
  {
    id: 6,
    name: 'Bedse Caves',
    distance: 10,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bedsa_Caves2.JPG/1200px-Bedsa_Caves2.JPG',
    description: 'Ancient Buddhist caves with intricate carvings and peaceful atmosphere.'
  },
  {
    id: 7,
    name: 'Bhaje Caves',
    distance: 19,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bhaja_Caves_Entrance_Side_View.jpg/1200px-Bhaja_Caves_Entrance_Side_View.jpg',
    description: 'Rock-cut caves featuring Buddhist architecture and stunning valley views.'
  },
  {
    id: 8,
    name: 'Karla Caves',
    distance: 29,
    image: 'https://static2.tripoto.com/media/filter/tst/img/2059001/TripDocument/1625752738_karla_caves.jpg.webp',
    description: 'Largest and best-preserved early Buddhist cave shrines in India.'
  },
  {
    id: 9,
    name: 'Prati Pandharpur Dudhivare',
    distance: 11,
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4noOlbgHbKx0WpDmBY9wrPtbqkYZtUe75lXDGguTqu7BuBfcSzgPY_7HSjWbhJNt6Jh2prKENMiXFA_F0wAfgS_Fon15tcnqOBlIxC9MFh7KkfKLXMqu8iFAu9x3i2kSewyG6NUg=s1360-w1360-h1020-rw',
    description: 'Religious site known for its spiritual significance and peaceful environment.'
  },
  {
    id: 10,
    name: 'Tiger Point',
    distance: 29,
    image: 'https://assets.traveltriangle.com/blog/wp-content/uploads/2018/04/823.jpg',
    description: 'Scenic viewpoint offering spectacular sunset views and valley panoramas.'
  },
  {
    id: 11,
    name: 'Bhushi Dam',
    distance: 25,
    image: 'https://images.tv9marathi.com/wp-content/uploads/2024/07/LONAVALA-1.jpg',
    description: 'Popular waterfall and dam site, perfect for monsoon visits.'
  }
];

// Testimonials
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

// Gallery Images
export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://lh3.googleusercontent.com/p/AF1QipPnxhPxlciPAVnUXFCu9rY6YwyafrgZC7NbTmot=s1360-w1360-h1020-rw',
    alt: 'Lake view at sunset',
    category: 'nature',
    width: 800,
    height: 600,
  },
  {
    id: 2,
    src: 'https://lh3.googleusercontent.com/p/AF1QipOYgIvf1SDqRqhlwBFwmv5h6SCkeBewi6ikDez3=s1360-w1360-h1020-rw',
    alt: 'Luxury cottage interior',
    category: 'accommodation',
    width: 600,
    height: 800,
  },
  {
    id: 3,
    src: 'https://lh3.googleusercontent.com/p/AF1QipMIRwGOOxk8LTWJ_u0q-ddmj-OJaDUIT6yFf1Qc=s1360-w1360-h1020-rw',
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
    src: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nps6lbchOLruyOKGuYfvuplg9OXyR_ZkEzq4fJvocSj6aunRq-bPxL1r47OvPkqRqQBA0G1dq4UPb1ZRaNljCmVcx1TqvbCD0mCKM3aVnBKIQy-7BiilxLviLhKACuw1nM6nX4e9A=s1360-w1360-h1020-rw',
    alt: 'Evening campfire',
    category: 'nature',
    width: 600,
    height: 800,
  },
  {
    id: 6,
    src: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrNuMy2jlAyXxHXB-cBGcX6roj03-5W7AyZWU1Z7GmtLBRDdJNKDKU1dSkOEOuuVY7lRF9g_jPXO8Cgzn7HU-fOr64CNKEcwPw4DUs4E00cMTUyCbZ26V_mZLr8Bs3Uw9BIdGRu=s1360-w1360-h1020-rw',
    alt: 'Forest hiking trail',
    category: 'nature',
    width: 800,
    height: 600,
  },
  {
    id: 7,
    src: 'https://lh3.googleusercontent.com/p/AF1QipNgt2pohwNkw58LE_fghjXX1T1hh6MrStOMWsIh=s1360-w1360-h1020-rw',
    alt: 'Cottage exterior',
    category: 'accommodation',
    width: 800,
    height: 600,
  },
  {
    id: 8,
    src: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nq9QvsNK0CKCpIrn32fqIkX2Zh3RQhmWm0xOAHN8Sm09TNzZR0wF9qNAVdblnKUhiwuMp0oAYVRIi_uVnv2CjtD7jpY3o_B8mABFu5In-x4yUMyCXPUebfUq0PopqUbIq8F_wqzoA=s1360-w1360-h1020-rw',
    alt: 'Boating on the lake',
    category: 'nature',
    width: 600,
    height: 800,
  },
];

// Accommodations (for CampsiteBooking)
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
    features: [
      'Unique triangular design',
      'Comfortable bedding',
      'Shared facilities',
      'Campfire access',
      'Nature immersion'
    ],
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
    features: [
      'Spacious dome design',
      'Family-friendly',
      'Weather resistant',
      'Comfortable sleeping',
      'Group activities'
    ],
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

// Packages (for PackageBooking)
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

// Meal Plans
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

// Activities
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

// FAQs
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

// Payment Constants
export const MAX_ROOMS = 4;
export const MAX_ADULTS_PER_ROOM = 2;
export const MAX_CHILDREN_PER_ROOM = 2;
export const MAX_PEOPLE_PER_ROOM = MAX_ADULTS_PER_ROOM + MAX_CHILDREN_PER_ROOM;
export const PARTIAL_PAYMENT_MIN_PERCENT = 0.3; // 30%
export const VALID_COUPONS: { [key: string]: number } = {
  PLUM10: 0.10,
  WELCOME5: 0.05,
};