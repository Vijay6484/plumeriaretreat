import React, { useEffect, useState, useRef, KeyboardEvent} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, isBefore, startOfDay ,isSameDay} from 'date-fns';
import { X } from 'lucide-react';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Gallery.css'
import {
  Calendar, 
  Users, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Music, 
  Waves,
  Target,
  Gamepad2,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  CreditCard,
  MessageCircle,
  Activity
} from 'lucide-react';
import {
  accommodations,
  MAX_ROOMS,
  MAX_PEOPLE_PER_ROOM,
  PARTIAL_PAYMENT_MIN_PERCENT,
  VALID_COUPONS
} from '../data';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent, CardImage } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Package } from '../types';
import 'react-day-picker/dist/style.css';

const API_BASE_URL = 'https://adminplumeria-back.onrender.com'; // Use for local dev

const imageLinks = [
  "https://images.pexels.com/photos/9144680/pexels-photo-9144680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/6640068/pexels-photo-6640068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2526025/pexels-photo-2526025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/3045272/pexels-photo-3045272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2351287/pexels-photo-2351287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
];

// Party effect component
const PartyEffect: React.FC<{ show: boolean; onComplete: () => void }> = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Success message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={24} />
            <span className="text-lg font-bold">Coupon Applied Successfully! 🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CampsiteBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [roomGuests, setRoomGuests] = useState(
    Array.from({ length: MAX_ROOMS }, () => ({ adults: 2, children: 2 }))
  );
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [foodChoice, setFoodChoice] = useState<'veg' | 'nonveg' | 'jain'>('veg');
  const [advanceAmount, setAdvanceAmount] = useState<number | null>(null);
  const [foodCounts, setFoodCounts] = useState({ veg: 0, nonveg: 0, jain: 0 });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTempRange, setCalendarTempRange] = useState<DateRange | undefined>(undefined);
  const [fullscreenImgIdx, setFullscreenImgIdx] = useState<number | null>(null);
  const [showPartyEffect, setShowPartyEffect] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<{[key: string]: boolean}>({});
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [accommodationId, setAccommodationId] = useState<number | null>(
  id ? parseInt(id) : null
  );
  const sliderRef = useRef<any>(null);
  console.log('Accommodation ID:', accommodationId);
  useEffect(() => {
  const fetchAccommodation = async () => {
    try {
      const res = await fetch(`https://plumeriaretreat-back.onrender.com/api/accommodations/${id}`);
      const data = await res.json();
      if (data) {
        const parsed = {
          ...data,
          image: (() => {
            try {
              const imgArr = JSON.parse(data.image);
              return Array.isArray(imgArr) ? imgArr[0] : data.image;
            } catch {
              return data.image;
            }
          })(),
          features: (() => {
            try {
              const featArr = JSON.parse(data.features);
              return Array.isArray(featArr) ? featArr : [];
            } catch {
              return [];
            }
          })(),
          detailedInfo: data.detailed_info ? JSON.parse(data.detailed_info) : {},
          hasAC: data.has_ac === 1,
          hasAttachedBath: data.has_attached_bath === 1,
        };
        setAccommodation(parsed);
      } else {
        navigate('/campsites');
      }
    } catch (err) {
      console.error('Accommodation fetch failed', err);
      navigate('/campsites');
    }
  };
  if (id) fetchAccommodation();
}, [id, navigate]);


  useEffect(() => {
  if (!accommodationId) return;

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/calendar/blocked-dates/id?accommodation_id=${accommodationId}`);
      const json = await res.json();
      console.log('Blocked dates response:', json);
      if (json.success) {
        const dates = json.data.map((d: any) => new Date(d.blocked_date));
        setBlockedDates(dates);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates', error);
    }
  };

  fetchBlockedDates();
}, [accommodationId]);


  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('https://adminplumeria-back.onrender.com/admin/coupons');
        const result = await response.json();
        if (result.success && result.data) {
          const activeCoupons = result.data.filter((coupon: any) => 
            coupon.active && new Date(coupon.expiryDate) > new Date()
          );
          setAvailableCoupons(activeCoupons.slice(0, 3)); // Show only 3 coupons
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  // Set default date range: today and tomorrow
  useEffect(() => {
    if (!dateRange) {
      const today = new Date();
      setDateRange({ from: today, to: addDays(today, 1) });
    }
  }, [dateRange]);

  // Calculate total guests
  const totalAdults = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;

  // Pricing logic
  const ADULT_RATE = accommodation?.price || 0;
  const CHILD_RATE = Math.round(ADULT_RATE * 0.6);

  const calculateTotal = () => {
    if (!accommodation || !dateRange?.from || !dateRange?.to) return 0;
    const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const adultsTotal = totalAdults * ADULT_RATE * nights;
    const childrenTotal = totalChildren * CHILD_RATE * nights;
    
    // Add activity costs
    let activityCost = 0;
    if (accommodation.detailedInfo?.activities) {
      accommodation.detailedInfo.activities.forEach((activity: any) => {
        if (selectedActivities[activity.name] && activity.price > 0) {
          activityCost += activity.price * totalGuests;
        }
      });
    }
    
    const subtotal = adultsTotal + childrenTotal + activityCost;
    return subtotal - discount;
  };

  const totalAmount = calculateTotal();
  const minAdvance = Math.round(totalAmount * PARTIAL_PAYMENT_MIN_PERCENT);

  // Update advanceAmount if totalAmount changes
  useEffect(() => {
    setAdvanceAmount(minAdvance);
  }, [totalAmount]);

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();

    try {
      const res = await fetch(`https://adminplumeria-back.onrender.com/admin/coupons?search=${code}`);
      const result = await res.json();

      if (!res.ok || !result.success || !result.data || result.data.length === 0) {
        throw new Error('Invalid coupon code');
      }

      const couponData = result.data[0];

      // Enforce exact match on code
      if (couponData.code.toUpperCase() !== code) {
        throw new Error('Invalid coupon code');
      }

      // Check expiry
      const now = new Date();
      const expiryDate = new Date(couponData.expiryDate);
      if (expiryDate < now) {
        alert('Coupon has expired');
        return;
      }

      // Calculate subtotal using all rooms
      const subtotal = (() => {
        if (!accommodation || !dateRange?.from || !dateRange?.to) return 0;
        const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        const adultsTotal = totalAdults * ADULT_RATE * nights;
        const childrenTotal = totalChildren * CHILD_RATE * nights;
        return adultsTotal + childrenTotal;
      })();
      
      if (subtotal < parseFloat(couponData.minAmount)) {
        alert(`Minimum amount for this coupon is ₹${couponData.minAmount}`);
        return;
      }

      // Apply discount
      let appliedDiscount = 0;

      if (couponData.discountType === 'fixed') {
        appliedDiscount = parseFloat(couponData.discount);
        if (appliedDiscount > subtotal) {
          alert('Coupon discount cannot exceed total amount');
          return;
        }
      } else if (couponData.discountType === 'percentage') {
        const percent = parseFloat(couponData.discount);
        const maxAllowed = parseFloat(couponData.maxDiscount);
        appliedDiscount = (subtotal * percent) / 100;
        if (appliedDiscount > maxAllowed) {
          appliedDiscount = maxAllowed;
        }
      }

      setDiscount(appliedDiscount);
      setCoupon(code);
      setCouponApplied(true);
      setShowPartyEffect(true);

    } catch (error: any) {
      console.error(error);
      setDiscount(0);
      setCouponApplied(false);
      alert(error.message || 'Failed to apply coupon');
    }
  };

  const handleCouponSelect = (selectedCoupon: any) => {
    setCoupon(selectedCoupon.code);
  };

  const handleActivityToggle = (activityName: string) => {
    setSelectedActivities(prev => ({
      ...prev,
      [activityName]: !prev[activityName]
    }));
  };

  const handleBooking = async () => {
    if (!guestInfo.name || !guestInfo.email || !dateRange?.from || !dateRange?.to) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate booking process
    setTimeout(() => {
      alert('Booking request submitted! We will contact you shortly.');
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  // Room count change
  const handleRoomsChange = (newRooms: number) => {
    setRooms(newRooms);
    setRoomGuests(prev => {
      const updated = [...prev];
      while (updated.length < MAX_ROOMS) updated.push({ adults: 2, children: 0 });
      return updated;
    });
  };

  // Room guest change with max 4 per room
  const handleRoomGuestChange = (roomIdx: number, type: 'adults' | 'children', value: number) => {
    setRoomGuests(prev => {
      const updated = [...prev];
      const otherType = type === 'adults' ? 'children' : 'adults';
      const otherValue = updated[roomIdx][otherType];
      // Ensure sum does not exceed 4
      if (value + otherValue > MAX_PEOPLE_PER_ROOM) {
        updated[roomIdx][type] = MAX_PEOPLE_PER_ROOM - otherValue;
      } else {
        updated[roomIdx][type] = value;
      }
      return updated;
    });
  };

  // Food count change, cannot exceed total guests
  const handleFoodCount = (type: 'veg' | 'nonveg' | 'jain', delta: number) => {
    setFoodCounts(prev => {
      const newValue = Math.max(0, prev[type] + delta);
      const newTotal = Object.values(prev).reduce((sum, v, idx) => sum + (type === Object.keys(prev)[idx] ? newValue : v), 0);
      if (newTotal > totalGuests) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  // Only allow advance to be exactly 30% or 100%
  const handleAdvanceChange = (val: number) => {
    if (val === minAdvance || val === totalAmount) {
      setAdvanceAmount(val);
    }
  };

  const isDateDisabled = (date: Date) => {
    const isPast = isBefore(date, startOfDay(new Date()));

    const isBlocked = blockedDates.some(
      (blockedDate) => isSameDay(date, new Date(blockedDate))
    );

    return isPast || isBlocked;
  };


  // Keyboard navigation for main slider and fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent | KeyboardEventInit) => {
      if (fullscreenImgIdx !== null) {
        if (e.key === 'ArrowRight') {
          setFullscreenImgIdx((prev) => prev !== null ? (prev + 1) % imageLinks.length : 0);
        }
        if (e.key === 'ArrowLeft') {
          setFullscreenImgIdx((prev) => prev !== null ? (prev - 1 + imageLinks.length) % imageLinks.length : 0);
        }
        if (e.key === 'Escape') {
          setFullscreenImgIdx(null);
        }
      } else {
        // Main slider navigation
        if (e.key === 'ArrowRight') sliderRef.current?.slickNext();
        if (e.key === 'ArrowLeft') sliderRef.current?.slickPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [fullscreenImgIdx]);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false,
    ref: sliderRef,
    beforeChange: (_: number, next: number) => {
      // If fullscreen is open, sync with slider
      if (fullscreenImgIdx !== null) setFullscreenImgIdx(next);
    }
  };

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Party Effect */}
      <PartyEffect 
        show={showPartyEffect} 
        onComplete={() => setShowPartyEffect(false)} 
      />

      {/* Image Slider */}
      <div className="relative h-[60vh] overflow-hidden">
        <Slider {...sliderSettings} ref={sliderRef}>
          {imageLinks.map((img, idx) => (
            <div key={idx} className="h-[60vh] flex items-center justify-center bg-black/40">
              <img
                src={img}
                alt={`Campsite ${idx + 1}`}
                className="object-cover w-full h-[60vh] transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => setFullscreenImgIdx(idx)}
                draggable={false}
              />
            </div>
          ))}
        </Slider>
        {/* Fullscreen Modal with slider */}
        {fullscreenImgIdx !== null && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button
              className="absolute top-6 right-6 text-white text-3xl z-50"
              onClick={() => setFullscreenImgIdx(null)}
              aria-label="Close"
            >
              <X size={36} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-50"
              onClick={() => setFullscreenImgIdx((fullscreenImgIdx - 1 + imageLinks.length) % imageLinks.length)}
              aria-label="Previous"
            >
              &#8592;
            </button>
            <img
              src={imageLinks[fullscreenImgIdx]}
              alt="Full screen"
              className="max-h-[90vh] max-w-[95vw] rounded-lg shadow-lg"
              draggable={false}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-50"
              onClick={() => setFullscreenImgIdx((fullscreenImgIdx + 1) % imageLinks.length)}
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>
        )}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{accommodation?.title}</h1>
              <div className="flex items-center mt-4 space-x-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  {accommodation?.type}
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Up to {accommodation?.capacity} guests
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Accommodation Details */}
            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Accommodation Details</h2>
                
                {accommodation.detailedInfo && (
                  <div className="space-y-6">
                    {/* Live Music Feature */}
                    {accommodation.id === 1 && (
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center mb-3">
                          <Music className="text-purple-600 mr-3" size={24} />
                          <h3 className="text-xl font-bold text-purple-800">🎸 EVERY SATURDAY LIVE MUSIC GUITARIST 🎸</h3>
                        </div>
                        <p className="text-purple-700">Enjoy live acoustic performances every Saturday evening by the lakeside!</p>
                      </div>
                    )}

                    {/* Accommodation Features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-800">What's Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accommodation.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="text-green-600 mr-2" size={16} />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meals Information */}
                    {/* {accommodation.detailedInfo.meals.included && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                          <Utensils className="mr-2" size={20} />
                          Meals Included
                        </h3>
                        <p className="text-green-700 mb-4">{accommodation.detailedInfo.meals.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">☕ Evening Snacks</h4>
                            <p className="text-sm text-green-700">{accommodation.detailedInfo.meals.snacks}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">🍽️ Dinner</h4>
                            <div className="text-sm text-green-700">
                              <p><strong>Veg:</strong> {accommodation.detailedInfo.meals.dinner?.veg}</p>
                              <p className="mt-1"><strong>Non-veg:</strong> {accommodation.detailedInfo.meals.dinner?.nonVeg}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">🍴 Breakfast</h4>
                            <p className="text-sm text-green-700">{accommodation.detailedInfo.meals.breakfast}</p>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Activities */}
                    {/* <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-800">Activities Available</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accommodation.detailedInfo.activities.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              {activity.name.toLowerCase().includes('archery') && <Target className="text-green-600 mr-2" size={16} />}
                              {activity.name.toLowerCase().includes('badminton') && <Gamepad2 className="text-green-600 mr-2" size={16} />}
                              {activity.name.toLowerCase().includes('boating') && <Waves className="text-green-600 mr-2" size={16} />}
                              {!activity.name.toLowerCase().includes('archery') && 
                               !activity.name.toLowerCase().includes('badminton') && 
                               !activity.name.toLowerCase().includes('boating') && 
                               <CheckCircle className="text-green-600 mr-2" size={16} />}
                              <span className="text-gray-700 capitalize">{activity.name}</span>
                            </div>
                            <span className="text-green-600 font-semibold">
                              {activity.price === 0 ? 'Free' : `₹${activity.price}/person`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Book Your Stay</h2>
                
                <div className="space-y-6">
                  {/* Guest Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={guestInfo.name}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
          <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              {/* Date input that toggles calendar */}
              <button
                type="button"
                className="w-full px-4 py-2 border rounded-lg bg-white text-left focus:ring-2 focus:ring-green-600"
                onClick={() => {
                  setShowCalendar(true);
                  setCalendarTempRange(undefined); // Calendar opens empty
                }}
              >
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, 'dd MMM yyyy')} to ${format(dateRange.to, 'dd MMM yyyy')}`
                  : 'Select your stay dates'}
              </button>

              {/* Show message when no blocked dates */}
              {blockedDates.length === 0 && (
                <p className="text-sm text-green-600 mt-2">
                  All dates are currently available!
                </p>
              )}

              {showCalendar && (
                <div className="relative z-10 mt-2">
                  <DayPicker
                    mode="range"
                    selected={calendarTempRange}
                    onSelect={setCalendarTempRange}
                    numberOfMonths={1}
                    fromDate={new Date()}
                    toDate={addDays(new Date(), 365)}
                    disabled={isDateDisabled}
                    modifiers={{
                      blocked: blockedDates.map((date) => new Date(date)),
                    }}
                    modifiersClassNames={{
                      blocked: 'bg-red-100 text-gray-400 line-through cursor-not-allowed',
                    }}
                    className="mx-auto bg-white p-2 rounded-lg shadow-lg"
                  />

                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => {
                        if (calendarTempRange?.from && calendarTempRange?.to) {
                          setDateRange(calendarTempRange);
                          setShowCalendar(false);
                        }
                      }}
                      disabled={!calendarTempRange?.from || !calendarTempRange?.to}
                    >
                      Select
                    </button>
                  </div>
                </div>
              )}
            </div>
          <div className="lg:w-64">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <Clock className="mr-2" size={16} />
                Check-in/out Times
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Check-in:</strong> 3:00 PM</p>
                <p><strong>Check-out:</strong> 11:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>


                  {/* Room Selection */}
                 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
  <div className="flex items-center gap-2 mb-2">
    <Button
      type="button"
      onClick={() => setRooms(Math.max(1, rooms - 1))}
      disabled={rooms <= 1}
      className="px-3 py-1 bg-green-700 text-white rounded"
    >-</Button>
    <span className="font-bold text-lg">{rooms}</span>
    <Button
      type="button"
      onClick={() => setRooms(Math.min(MAX_ROOMS, rooms + 1))}
      disabled={rooms >= Math.min(MAX_ROOMS, accommodation?.availableRooms || MAX_ROOMS)}
      className="px-3 py-1 bg-green-700 text-white rounded"
    >+</Button>
    <span className="text-xs text-gray-500">
      {Math.max(0, Math.min(MAX_ROOMS, accommodation?.availableRooms || MAX_ROOMS) - rooms)} rooms remaining
    </span>
  </div>

  <div className="border rounded p-2 bg-gray-50">
    {Array.from({ length: rooms }).map((_, idx) => {
      const adults = roomGuests[idx].adults;
      const children = roomGuests[idx].children;
      const adultRate = Number(accommodation?.price || 0);
      const childRate = Math.round(adultRate * 0.6);
      const roomSubtotal = adults * adultRate + children * childRate;

      return (
        <div key={idx} className="flex flex-col gap-1 mb-2 border-b pb-2 last:border-0">
          <div className="flex items-center gap-4">
            <span className="w-16 font-medium">Room {idx + 1}</span>
            <select
              value={adults}
              onChange={e => handleRoomGuestChange(idx, 'adults', Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(MAX_PEOPLE_PER_ROOM + 1).keys()].map(n =>
                n + children <= MAX_PEOPLE_PER_ROOM && (
                  <option key={n} value={n}>{n} Adults</option>
                )
              )}
            </select>
            <select
              value={children}
              onChange={e => handleRoomGuestChange(idx, 'children', Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(MAX_PEOPLE_PER_ROOM + 1).keys()].map(n =>
                n + adults <= MAX_PEOPLE_PER_ROOM && (
                  <option key={n} value={n}>{n} Children</option>
                )
              )}
            </select>
          </div>

          <div className="text-sm text-gray-700 ml-16">
            {adults} Adults x ₹{adultRate} + {children} Children x ₹{childRate} = <span className="font-semibold">₹{roomSubtotal}</span>
          </div>
        </div>
      );
    })}
  </div>

  <div className="mt-2 text-sm">
    <span className="font-medium">Total:</span> {totalAdults} Adults, {totalChildren} Children
  </div>

  <div className="mt-1 text-sm text-gray-600">
    Adult rate: ₹{accommodation?.price || 0} / night, Child rate: ₹{Math.round((accommodation?.price || 0) * 0.6)} / night
  </div>
                  </div>


                  {/* Food Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Food Preferences</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded border">
                      {(['veg', 'nonveg', 'jain'] as const).map(type => (
                        <div key={type} className="flex items-center gap-4">
                          <span className="w-32 capitalize">{type === 'nonveg' ? 'Non veg' : type} count</span>
                          <Button
                            type="button"
                            onClick={() => handleFoodCount(type, -1)}
                            className="rounded-full bg-gray-200 text-lg w-8 h-8 flex items-center justify-center"
                          >-</Button>
                          <span className="w-6 text-center">{foodCounts[type]}</span>
                          <Button
                            type="button"
                            onClick={() => handleFoodCount(type, 1)}
                            className="rounded-full bg-gray-200 text-lg w-8 h-8 flex items-center justify-center"
                          >+</Button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-2">
                        Total food count: {foodCounts.veg + foodCounts.nonveg + foodCounts.jain} / {totalGuests}
                        {foodCounts.veg + foodCounts.nonveg + foodCounts.jain > totalGuests && (
                          <span className="text-red-600 ml-2">Cannot exceed total guests!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Extra Activities */}
                  {accommodation.detailedInfo?.activities && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Extra Activities (Optional)</h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded border">
                        {accommodation.detailedInfo.activities
                          .filter((activity: any) => ['speed boating', 'motor boating', 'kayaking'].includes(activity.name.toLowerCase()))
                          .map((activity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`activity-${index}`}
                                checked={selectedActivities[activity.name] || false}
                                onChange={() => handleActivityToggle(activity.name)}
                                className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`activity-${index}`} className="flex items-center cursor-pointer">
                                <Activity className="text-green-600 mr-2" size={16} />
                                <span className="text-gray-700 capitalize">{activity.name}</span>
                              </label>
                            </div>
                            <span className="text-green-600 font-semibold">
                              ₹{activity.price}/person
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Important Note */}
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4 text-orange-800 flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  Things to Carry
                </h3>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-orange-700">
                    <li>Always good to carry extra pair of clothes</li>
                    <li>Winter and warm clothes as it will be cold night</li>
                    <li>Toothbrush and paste (toiletries)</li>
                    <li>Any other things you feel necessary</li>
                    <li>Personal medicine if any</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Embedded Google Map */}
            <div className="mb-8 rounded-lg overflow-hidden shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6103.946344270747!2d73.49323289387719!3d18.66382967533796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2a9180b52a2fd%3A0xa5d86c10d8d9846d!2sPlumeria%20Retreat%20%7C%20Pawna%20Lakeside%20Cottages!5e1!3m2!1sen!2sin!4v1749631888045!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Plumeria Retreat Location"
              ></iframe>
            </div>
            <Card>
              <CardContent>
                <h3 className="text-2xl font-bold text-green-800 mb-6">Booking Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Accommodation</span>
                    <span className="text-green-600">{accommodation.title}</span>
                  </div>
                  
                  {dateRange?.from && dateRange?.to && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Dates</span>
                        <span className="text-gray-600">
                          {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Nights</span>
                        <span className="text-gray-600">
                          {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Rooms</span>
                    <span className="text-gray-600">{rooms}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Guests</span>
                    <span className="text-gray-600">
                      {totalAdults} Adults{totalChildren > 0 && `, ${totalChildren} Children`}
                    </span>
                  </div>

                  {/* Available Coupons */}
                  {availableCoupons.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Offers</label>
                      <div className="flex overflow-x-auto space-x-2 mb-3 px-1 sm:flex-wrap sm:space-x-0 sm:gap-2 no-scrollbar">
                        {availableCoupons.map((availableCoupon) => (
                          <button
                            key={availableCoupon.id}
                            onClick={() => handleCouponSelect(availableCoupon)}
                            className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors whitespace-nowrap"
                          >
                            {availableCoupon.code} - {availableCoupon.discountType === 'percentage'
                              ? `${availableCoupon.discount}%`
                              : `₹${availableCoupon.discount}`} OFF
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Coupon Code Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => {
                          setCoupon(e.target.value);
                          setCouponApplied(false);
                          setDiscount(0);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        placeholder="Enter coupon code"
                        disabled={couponApplied}
                      />
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !coupon}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {couponApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                    {couponApplied && discount > 0 && (
                      <p className="text-green-700 text-sm mt-2">
                        Coupon applied! You saved {formatCurrency(discount)}.
                      </p>
                    )}
                  </div>
                  
                  {/* Advance Payment Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance to Pay Now
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={advanceAmount ?? minAdvance}
                        onChange={e => handleAdvanceChange(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      >
                        <option value={minAdvance}>{formatCurrency(minAdvance)} (30%)</option>
                        <option value={totalAmount}>{formatCurrency(totalAmount)} (100%)</option>
                      </select>
                      <span className="text-green-700 font-semibold whitespace-nowrap">
                        / {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Reserve Message */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-center text-blue-700 font-medium flex items-center justify-center">
                      <CheckCircle className="mr-2" size={16} />
                      Reserve to get exciting offer for this property!
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-green-800">
                      <span>Total</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-blue-700 mt-2">
                      <span>Advance</span>
                      <span>{formatCurrency(advanceAmount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Pay at property</span>
                      <span>{formatCurrency(totalAmount - (advanceAmount ?? 0))}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleBooking}
                    disabled={
                      loading ||
                      !dateRange?.from ||
                      !dateRange?.to ||
                      !guestInfo.name ||
                      !guestInfo.email ||
                      !advanceAmount ||
                      (advanceAmount !== minAdvance && advanceAmount !== totalAmount) ||
                      (foodCounts.veg + foodCounts.nonveg + foodCounts.jain > totalGuests)
                    }
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2" size={20} />
                        Book Now
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Secure booking with instant confirmation.<br />
                    Pay {formatCurrency(advanceAmount ?? 0)} now, and the rest at the property.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mt-6">
              <CardContent>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Phone className="text-green-600 mr-2" size={16} />
                    <a href="tel:+919226869678" className="text-gray-700 hover:text-green-600">
                      +91 9226869678
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="text-green-600 mr-2" size={16} />
                    <a 
                      href="https://wa.me/919226869678" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-600"
                    >
                      WhatsApp
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-green-600 mr-2" size={16} />
                    <a 
                      href="mailto:campatpawna@gmail.com" 
                      className="text-gray-700 hover:text-green-600"
                    >
                      campatpawna@gmail.com
                    </a>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-green-600 mr-2 mt-1" size={16} />
                    <a 
                      href="https://maps.google.com/?q=Plumeria+Retreat+Pawna+Lakeside+Cottages" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-600"
                    >
                      Plumeria Retreat, Lakeside Drive, Nature Valley
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampsiteBooking;