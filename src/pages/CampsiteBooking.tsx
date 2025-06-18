import React, { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { X } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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
  CreditCard
} from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent, CardImage } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Package } from '../types';
import 'react-day-picker/dist/style.css';

const MAX_ROOMS = 5;
const MAX_PEOPLE_PER_ROOM = 4;
const PARTIAL_PAYMENT_MIN_PERCENT = 0.3;
const VALID_COUPONS: { [key: string]: number } = {
  "WELCOME10": 0.1,
  "DISCOUNT15": 0.15,
  "SAVE20": 0.2
};

const API_BASE_URL = 'https://plumeriaretreatback-production.up.railway.app';

// Use this for local development:
// const API_BASE_URL = 'http://localhost:5001';

const CampsiteBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<any>(null);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
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
  const sliderRef = useRef<any>(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accommodations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch accommodation');
        }
        const data = await response.json();
        setAccommodation(data);
        document.title = `${data.title} - Plumeria Retreat`;
      } catch (error) {
        console.error('Error fetching accommodation:', error);
        navigate('/campsites');
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery-images`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImageLinks(data.map((img: any) => img.src));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (id) {
      fetchAccommodation();
      fetchImages();
    }
  }, [id, navigate]);

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
    const subtotal = adultsTotal + childrenTotal;
    return subtotal - discount;
  };

  const totalAmount = calculateTotal();
  const minAdvance = Math.round(totalAmount * PARTIAL_PAYMENT_MIN_PERCENT);

  // Update advanceAmount if totalAmount changes
  useEffect(() => {
    setAdvanceAmount(minAdvance);
  }, [totalAmount]);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      const subtotal = (() => {
        if (!accommodation || !dateRange?.from || !dateRange?.to) return 0;
        const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        const adultsTotal = guests.adults * ADULT_RATE * nights;
        const childrenTotal = guests.children * CHILD_RATE * nights;
        return adultsTotal + childrenTotal;
      })();
      setDiscount(subtotal * VALID_COUPONS[code]);
      setCouponApplied(true);
    } else {
      setDiscount(0);
      setCouponApplied(false);
      alert('Invalid coupon code');
    }
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
  }, [fullscreenImgIdx, imageLinks.length]);

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
              <p className="text-xl md:text-2xl opacity-90">{accommodation?.description}</p>
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
                        {(
  Array.isArray(accommodation.features)
    ? accommodation.features
    : typeof accommodation.features === 'string'
      ? (() => { try { return JSON.parse(accommodation.features); } catch { return []; } })()
      : []
).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="text-green-600 mr-2" size={16} />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meals Information */}
                    {accommodation.detailedInfo.meals?.included && (
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
                    )}

                    {/* Activities */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-800">Activities Available</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accommodation.detailedInfo.activities?.map((activity: any, index: number) => (
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
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Packages Section */}
            {accommodation.packages && accommodation.packages.length > 0 && (
              <Card>
                <CardContent>
                  <h2 className="text-2xl font-bold text-green-800 mb-4">Special Packages</h2>
                  <div className="space-y-6">
                    {accommodation.packages.map((pkg: Package) => (
                      <div key={pkg.id} className="border rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
                        <img src={pkg.image_url} alt={pkg.name} className="w-32 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{pkg.name}</h3>
                          <p className="text-gray-600">{pkg.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-green-700 font-bold">{formatCurrency(pkg.price)}</span>
                            <span className="text-sm text-gray-500">{pkg.duration} Days</span>
                          </div>
                        </div>
                        <Button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          onClick={() => navigate(`/packages?accommodation=${accommodation.id}&package=${pkg.id}`)}
                        >
                          Book Package
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
            {/* Contact Information */}
            <Card className="mt-6">
              <CardContent>
                <h3 className="text-lg font-semibold text-green-800 mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Phone className="text-green-600 mr-2" size={16} />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="text-green-600 mr-2" size={16} />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-green-600 mr-2" size={16} />
                    <span>info@plumeriaretreat.com</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-green-600 mr-2 mt-1" size={16} />
                    <span>Plumeria Retreat, Lakeside Drive, Nature Valley</span>
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
