import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format, addDays, isBefore, startOfDay, isSameDay } from 'date-fns';
import { X } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Gallery.css';
import axios from 'axios';
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
  MAX_ROOMS,
  MAX_PEOPLE_PER_ROOM,
  PARTIAL_PAYMENT_MIN_PERCENT,
} from '../data';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent, CardImage } from '../components/ui/Card';
import Button from '../components/ui/Button';
import 'react-day-picker/dist/style.css';

const API_BASE_URL = "https://adminplumeria-back.onrender.com";
const BACKEND_URL = 'https://u.plumeriaretreat.com';

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

interface RoomGuest {
  adults: number;
  children: number;
}

interface FoodCounts {
  veg: number;
  nonveg: number;
  jain: number;
}

interface Activity {
  name: string;
  price: number;
}

interface Accommodation {
  id: number;
  name: string;
  price: number;
  type: string;
  adult_price: number;
  child_price: number;
  capacity: number;
  availableRooms?: number;
  features: string[];
  detailedInfo?: {
    activities?: Activity[];
  };
  image: string | string[];
}

interface Coupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percentage';
  discount: string;
  minAmount: string;
  maxDiscount?: string;
  expiryDate: string;
  active: boolean;
  accommodationType: string;
}

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface BlockedDateInfo {
  date: Date;
  blockedRooms: number;
}

async function getImageLinks(): Promise<string[]> {
  try {
    const response = await fetch("https://u.plumeriaretreat.com/api/accommodations");
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: expected an array');
    }

    const images = data.flatMap(item => {
      try {
        return JSON.parse(item.images);
      } catch (e) {
        console.error('Invalid JSON in images field:', e);
        return [];
      }
    });

    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

let imageLinks: string[] = [];

getImageLinks().then(images => {
  imageLinks = images;
  console.log('Fetched images:', imageLinks);
});

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
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [rooms, setRooms] = useState(1);
  const [fullyBlocked, setFullyBlocked] = useState<Date[]>([]);
  const [partiallyBlocked, setPartiallyBlocked] = useState<Date[]>([]);
  const [roomGuests, setRoomGuests] = useState<RoomGuest[]>([
    { adults: 2, children: 0 }
  ]);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [foodChoice, setFoodChoice] = useState<'veg' | 'nonveg' | 'jain'>('veg');
  const [foodCounts, setFoodCounts] = useState<FoodCounts>({ veg: 0, nonveg: 0, jain: 0 });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTempDate, setCalendarTempDate] = useState<Date | undefined>(undefined);
  const [fullscreenImgIdx, setFullscreenImgIdx] = useState<number | null>(null);
  const [showPartyEffect, setShowPartyEffect] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<{ [key: string]: boolean }>({});
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [allAvailableCoupons, setAllAvailableCoupons] = useState<Coupon[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
  const [maxiRoom, setMaxiRoom] = useState<number>(MAX_ROOMS);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const sliderRef = useRef<any>(null);
  const [maxPeoplePerRoom, setMaxPeoplePerRoom] = useState<number>(MAX_PEOPLE_PER_ROOM);
  const [packageDescription, setPackageDescription] = useState<string>('');
  const [availableRoomsForSelectedDate, setAvailableRoomsForSelectedDate] = useState<number>(0);
  const totalAdults = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;

  // Calculate checkout date as next day
  const checkOutDate = checkInDate ? addDays(checkInDate, 1) : undefined;

  useEffect(() => {
    setFoodCounts(prev => {
      const totalFood = prev.veg + prev.nonveg + prev.jain;

      if (totalFood > totalGuests) {
        const ratio = totalGuests / totalFood;

        let newVeg = Math.max(0, Math.round(prev.veg * ratio));
        let newNonVeg = Math.max(0, Math.round(prev.nonveg * ratio));
        let newJain = Math.max(0, Math.round(prev.jain * ratio));

        const newTotal = newVeg + newNonVeg + newJain;
        if (newTotal < totalGuests) {
          const remaining = totalGuests - newTotal;
          if (prev.veg > 0) newVeg += remaining;
          else if (prev.nonveg > 0) newNonVeg += remaining;
          else if (prev.jain > 0) newJain += remaining;
        }

        return {
          veg: newVeg,
          nonveg: newNonVeg,
          jain: newJain
        };
      }

      const remaining = totalGuests - totalFood;
      if (remaining > 0) {
        return {
          ...prev,
          [foodChoice]: prev[foodChoice] + remaining
        };
      }

      return prev;
    });
  }, [totalGuests, foodChoice]);

  const handleRoomsChange = (newRooms: number) => {
    // Update roomGuests array to match new room count
    setRoomGuests(prev => {
      if (newRooms > prev.length) {
        // Add new rooms with default configuration
        const newEntries = Array.from({ length: newRooms - prev.length }, () => ({
          adults: 2,
          children: 0
        }));
        return [...prev, ...newEntries];
      } else if (newRooms < prev.length) {
        // Remove extra rooms
        return prev.slice(0, newRooms);
      }
      return prev;
    });

    // Calculate new total guests for food adjustment
    const newTotalGuests = roomGuests.slice(0, newRooms)
      .reduce((sum, r) => sum + r.adults + r.children, 0);

    setRooms(newRooms);

    setFoodCounts(prev => {
      const totalFood = prev.veg + prev.nonveg + prev.jain;
      if (totalFood > newTotalGuests) {
        const ratio = newTotalGuests / totalFood;
        return {
          veg: Math.max(0, Math.round(prev.veg * ratio)),
          nonveg: Math.max(0, Math.round(prev.nonveg * ratio)),
          jain: Math.max(0, Math.round(prev.jain * ratio))
        };
      }
      return prev;
    });
  };

  const handleRoomGuestChange = (roomIdx: number, type: 'adults' | 'children', value: number) => {
    setRoomGuests(prev => {
      const updated = [...prev];
      const otherType = type === 'adults' ? 'children' : 'adults';
      const otherValue = updated[roomIdx][otherType];
      if (value + otherValue > maxPeoplePerRoom) {
        updated[roomIdx][type] = maxPeoplePerRoom - otherValue;
      } else {
        updated[roomIdx][type] = value;
      }
      return updated;
    });
  };

  const handleFoodCount = (type: 'veg' | 'nonveg' | 'jain', delta: number) => {
    setFoodCounts(prev => {
      const newValue = Math.max(0, prev[type] + delta);
      const newTotal = Object.values(prev).reduce((sum, v, idx) =>
        sum + (type === Object.keys(prev)[idx] ? newValue : v), 0);
      if (newTotal > totalGuests) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const calculateBlockedDateTypes = () => {
    const today = startOfDay(new Date());
    const fully: Date[] = [];
    const partial: Date[] = [];

    blockedDates.forEach(({ date, blockedRooms }) => {
      if (isBefore(date, today)) return;

      if (blockedRooms >= maxiRoom) {
        fully.push(date);
      } else if (blockedRooms > 0) {
        partial.push(date);
      }
    });

    setFullyBlocked(fully);
    setPartiallyBlocked(partial);
  };
  useEffect(() => {
    calculateBlockedDateTypes();
  }, [blockedDates, maxiRoom]);
  
  const isDateDisabled = (date: Date) => {
    const isPast = isBefore(date, startOfDay(new Date()));
    return isPast || fullyBlocked.some(d => isSameDay(d, date));
  };

  // Calculate available rooms for selected date
  const calculateAvailableRoomsForDate = () => {
    if (!checkInDate) return maxiRoom;

    const date = startOfDay(checkInDate);
    const blockedInfo = blockedDates.find(b => isSameDay(b.date, date));
    const blockedRooms = blockedInfo?.blockedRooms || 0;
    return maxiRoom - blockedRooms;
  };

  // Update available rooms when date changes
  useEffect(() => {
    if (checkInDate) {
      const available = calculateAvailableRoomsForDate();
      setAvailableRoomsForSelectedDate(available);

      // Adjust room count if it exceeds available rooms
      if (rooms > available) {
        setRooms(available);
      }
    }
  }, [checkInDate, blockedDates, maxiRoom]);

  // Validate room availability during booking
  const validateRoomAvailability = () => {
    if (!checkInDate) return true;

    const availableRooms = calculateAvailableRoomsForDate();
    
    if (availableRooms < rooms) {
      setErrors(prev => ({
        ...prev,
        dates: `On ${format(checkInDate, 'dd MMM yyyy')}, only ${availableRooms} room(s) available. Reduce rooms or choose different date.`
      }));
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/accommodations/${id}`);
        const data = await res.json();

        setMaxiRoom(data.rooms);
        console.log('Accommodation data:', data.rooms, data.capacity);
        setMaxPeoplePerRoom(data.capacity || MAX_PEOPLE_PER_ROOM);
        setPackageDescription(data.package_description);
        if (data) {
          const parsed: Accommodation = {
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
    if (!id) return;

    const fetchBlockedDates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/calendar/blocked-dates/id?accommodation_id=${id}`);
        const json = await res.json();
        console.log('Blocked dates response:', json);
        if (json.success) {
          const dates = json.data.map((d: any) => ({
            date: new Date(d.blocked_date),
            // Treat empty room values as all rooms blocked
            blockedRooms: d.rooms ? parseInt(d.rooms) : maxiRoom
          }));
          setBlockedDates(dates);
        }
      } catch (error) {
        console.error('Failed to fetch blocked dates', error);
      }
    };

    fetchBlockedDates();
  }, [id, maxiRoom]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/coupons`);
        const result = await response.json();
        if (result.success && result.data) {
          const activeCoupons = result.data.filter((coupon: Coupon) =>
            coupon.active && new Date(coupon.expiryDate) > new Date()
          );
          console.log('Active Coupons:', activeCoupons);
          setAllAvailableCoupons(activeCoupons);
          setAvailableCoupons(activeCoupons.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/packages`);
        const result = await response.json();
        if (result && result.length > 0) {
          setPackages(result);
          setSelectedPackage(result[0]);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!checkInDate) {
      setCheckInDate(new Date());
    }
  }, [checkInDate]);

  const ADULT_RATE = accommodation?.price || 0;
  const CHILD_RATE = Math.round(ADULT_RATE * 0.6);

  const calculateTotal = () => {
    if (!accommodation || !checkInDate) return 0;
    
    // Always 1 night stay
    const nights = 1;
    const adultsTotal = totalAdults * ADULT_RATE * nights;
    const childrenTotal = totalChildren * CHILD_RATE * nights;

    let activityCost = 0;
    if (accommodation.detailedInfo?.activities) {
      accommodation.detailedInfo.activities.forEach((activity: Activity) => {
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
  const [advanceAmount, setAdvanceAmount] = useState<number>(minAdvance);

  useEffect(() => {
    setAdvanceAmount(minAdvance);
  }, [totalAmount]);

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();

    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons?search=${code}`);
      const result = await res.json();

      if (!res.ok || !result.success || !result.data || result.data.length === 0) {
        throw new Error('Invalid coupon code');
      }

      const couponData = result.data[0];

      if (couponData.code.toUpperCase() !== code) {
        throw new Error('Invalid coupon code');
      }

      const now = new Date();
      const expiryDate = new Date(couponData.expiryDate);
      if (expiryDate < now) {
        alert('Coupon has expired');
        return;
      }

      const subtotal = (() => {
        if (!accommodation || !checkInDate) return 0;
        const nights = 1;
        const adultsTotal = totalAdults * ADULT_RATE * nights;
        const childrenTotal = totalChildren * CHILD_RATE * nights;
        return adultsTotal + childrenTotal;
      })();

      if (subtotal < parseFloat(couponData.minAmount)) {
        alert(`Minimum amount for this coupon is ₹${couponData.minAmount}`);
        return;
      }

      let appliedDiscount = 0;

      if (couponData.discountType === 'fixed') {
        appliedDiscount = parseFloat(couponData.discount);
        if (appliedDiscount > subtotal) {
          alert('Coupon discount cannot exceed total amount');
          return;
        }
      } else if (couponData.discountType === 'percentage') {
        const percent = parseFloat(couponData.discount);
        const maxAllowed = parseFloat(couponData.maxDiscount || '0');
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

  const handleCouponSelect = (selectedCoupon: Coupon) => {
    setCoupon(selectedCoupon.code);
  };

  const handleActivityToggle = (activityName: string) => {
    setSelectedActivities(prev => ({
      ...prev,
      [activityName]: !prev[activityName]
    }));
  };

  const handleAdvanceChange = (val: number) => {
    setAdvanceAmount(val);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!guestInfo.name) newErrors.name = 'Name is required';
    if (!guestInfo.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) newErrors.email = 'Email is invalid';
    if (!guestInfo.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(guestInfo.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!checkInDate) newErrors.dates = 'Please select a date';
    if (!selectedPackage) newErrors.package = 'Please select a package';
    if ((foodCounts.veg + foodCounts.nonveg + foodCounts.jain) !== totalGuests) {
      newErrors.food = 'Food preferences must match total guests';
    }

    // Check for blocked date
    if (checkInDate && isDateDisabled(checkInDate)) {
      newErrors.dates = 'Your selected date is not available. Please choose different date.';
    }

    setErrors(newErrors);

    // Add room availability validation
    if (!validateRoomAvailability()) {
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formatDate = (date: Date | undefined) => date ? format(date, 'yyyy-MM-dd') : undefined;

      const bookingPayload = {
        guest_name: guestInfo.name,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone || null,
        accommodation_id: id,
        check_in: formatDate(checkInDate),
        check_out: formatDate(checkOutDate),
        adults: totalAdults,
        children: totalChildren,
        rooms: rooms,
        food_veg: foodCounts.veg,
        food_nonveg: foodCounts.nonveg,
        food_jain: foodCounts.jain,
        total_amount: totalAmount,
        advance_amount: advanceAmount,
        package_id: selectedPackage?.id,
        coupon_code: couponApplied ? coupon : null,
      };

      console.log('Booking payload:', bookingPayload);

      const bookingResponse = await fetch(`https://adminplumeria-back.onrender.com/admin/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const bookingData = await bookingResponse.json();
      console.log('Booking response:', bookingData);

      if (!bookingResponse.ok) {
        const errorMsg = bookingData.error || bookingData.message || 'Failed to create booking';
        throw new Error(errorMsg);
      }

      const bookingId = bookingData.data?.booking_id || bookingData.booking_id;
      if (!bookingId) {
        throw new Error('Booking ID not found in response');
      }

      const paymentPayload = {
        amount: advanceAmount,
        firstname: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone || '',
        productinfo: `Booking for ${accommodation?.name}`,
        booking_id: bookingId,
      };

      console.log('Payment payload:', paymentPayload);

      const paymentResponse = await fetch(`https://adminplumeria-back.onrender.com/admin/bookings/payments/payu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });

      const paymentData = await paymentResponse.json();
      console.log('Payment response:', paymentData);

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || paymentData.message || 'Failed to initiate payment');
      }

      // Type guard for response validation
      if (!paymentData.payu_url || !paymentData.payment_data || typeof paymentData.payment_data !== 'object') {
        console.error('Invalid payment data structure:', paymentData);
        throw new Error('Invalid payment data received from server');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.payu_url;

      // Create hidden inputs with type-safe values
      Object.entries(paymentData.payment_data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);  // Explicit string conversion
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error('Full booking error:', error);

      let errorMessage = error.message || 'Something went wrong. Please try again.';

      if (error.message.includes('Cannot convert undefined or null to object')) {
        errorMessage = 'Payment system configuration error. Please contact support.';
      }
      else if (error.message.includes('Booking ID not found')) {
        errorMessage = 'Booking created but failed to get booking ID. Please contact support.';
      }

      alert(errorMessage);
      setLoading(false);
    }
  };

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
      if (fullscreenImgIdx !== null) setFullscreenImgIdx(next);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        if (e.key === 'ArrowRight') sliderRef.current?.slickNext();
        if (e.key === 'ArrowLeft') sliderRef.current?.slickPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImgIdx]);

  if (!accommodation || packages.length === 0) {
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
      <PartyEffect
        show={showPartyEffect}
        onComplete={() => setShowPartyEffect(false)}
      />

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
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{accommodation?.name}</h1>
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
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Accommodation Details</h2>
                <p className='m-2'>{packageDescription}</p>
                {accommodation.detailedInfo && (
                  <div className="space-y-6">
                    {(
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-l-4 border-purple-500">
                        <div className="flex items-center mb-3">
                          <Music className="text-purple-600 mr-3" size={24} />
                          <h3 className="text-xl font-bold text-purple-800">🎸 EVERY SATURDAY LIVE MUSIC GUITARIST 🎸</h3>
                        </div>
                        <p className="text-purple-700">Enjoy live acoustic performances every Saturday evening by the lakeside!</p>
                      </div>
                    )}

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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Things to Carry - Mobile Only */}
            <div className="block lg:hidden">
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
            {/* Things to Carry - Desktop Only */}
            <div className="hidden lg:block">
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

            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Book Your Stay</h2>

                <div className="space-y-6">
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
                          className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                          className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                          placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-green-600 focus:border-transparent`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <button
                          type="button"
                          className={`w-full px-4 py-2 border rounded-lg bg-white text-left focus:ring-2 focus:ring-green-600 ${errors.dates ? 'border-red-500' : ''}`}
                          onClick={() => {
                            setShowCalendar(true);
                            setCalendarTempDate(checkInDate);
                          }}
                        >
                          {checkInDate
                            ? `${format(checkInDate, 'dd MMM yyyy')} (Check-in)`
                            : 'Select your stay date'}
                        </button>
                        {errors.dates && (
                          <p className="text-red-500 text-sm mt-1">{errors.dates}</p>
                        )}

                        {blockedDates.length === 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            All dates are currently available!
                          </p>
                        )}
                        {blockedDates.length > 0 && (
                          <p className="text-sm text-yellow-600 mt-2">
                            Some dates are blocked. Please check the calendar before booking.
                          </p>
                        )}

                        {showCalendar && (
                          <div className="relative z-10 mt-2">
                            <DayPicker
                              mode="single"
                              selected={calendarTempDate}
                              onSelect={setCalendarTempDate}
                              numberOfMonths={1}
                              fromDate={new Date()}
                              toDate={addDays(new Date(), 365)}
                              disabled={isDateDisabled}
                              modifiers={{
                                fullyBlocked,
                                partiallyBlocked,
                              }}
                              modifiersClassNames={{
                                fullyBlocked: 'bg-red-100 text-gray-400 line-through cursor-not-allowed',
                                partiallyBlocked: 'bg-yellow-100 relative partially-blocked',
                                selected: 'bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:bg-blue-600',
                              }}
                              className="mx-auto bg-white p-2 rounded-lg shadow-lg"
                            />

                            {/* Legend for date types */}
                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-100 mr-2"></div>
                                <span>Fully Booked</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-100 mr-2 relative partially-blocked"></div>
                                <span>Limited Availability</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
                                <span>Available</span>
                              </div>
                            </div>

                            <div className="flex justify-end mt-2">
                              <button
                                type="button"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() => {
                                  if (calendarTempDate) {
                                    // Check if date is blocked
                                    if (isDateDisabled(calendarTempDate)) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        dates: 'Your selected date is not available. Please choose different date.',
                                      }));
                                      return;
                                    }

                                    setCheckInDate(calendarTempDate);
                                    setShowCalendar(false);
                                    setErrors((prev) => ({ ...prev, dates: '' }));
                                  }
                                }}
                                disabled={!calendarTempDate}
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


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        type="button"
                        onClick={() => handleRoomsChange(Math.max(1, rooms - 1))}
                        disabled={rooms <= 1}
                        className="px-3 py-1 bg-green-700 text-white rounded"
                      >-</Button>
                      <span className="font-bold text-lg">{rooms}</span>
                      <Button
                        type="button"
                        onClick={() => handleRoomsChange(Math.min(availableRoomsForSelectedDate, rooms + 1))}
                        disabled={rooms >= availableRoomsForSelectedDate}
                        className="px-3 py-1 bg-green-700 text-white rounded"
                      >+</Button>
                      <span className="text-xs text-gray-500">
                        {Math.max(0, availableRoomsForSelectedDate - rooms)} rooms remaining
                      </span>
                    </div>

                    <div className="border rounded p-2 bg-gray-50">
                      {roomGuests.slice(0, rooms).map((room, idx) => {
                        const adults = room.adults;
                        const children = room.children;
                        const roomSubtotal = adults * ADULT_RATE + children * CHILD_RATE;

                        return (
                          <div key={idx} className="flex flex-col gap-1 mb-2 border-b pb-2 last:border-0">
                            <div className="flex items-center gap-4">
                              <span className="w-16 font-medium">Room {idx + 1}</span>
                              <select
                                value={adults}
                                onChange={e => handleRoomGuestChange(idx, 'adults', Number(e.target.value))}
                                className="border rounded px-2 py-1"
                              >
                                {[...Array(maxPeoplePerRoom + 1).keys()].map(n =>
                                  n + children <= maxPeoplePerRoom && (
                                    <option key={n} value={n}>{n} Adults</option>
                                  )
                                )}
                              </select>
                              <select
                                value={children}
                                onChange={e => handleRoomGuestChange(idx, 'children', Number(e.target.value))}
                                className="border rounded px-2 py-1"
                              >
                                {[...Array(maxPeoplePerRoom + 1).keys()].map(n =>
                                  n + adults <= maxPeoplePerRoom && (
                                    <option key={n} value={n}>{n} Children</option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2 text-sm">
                      <span className="font-medium">Total:</span> {totalAdults} Adults, {totalChildren} Children
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                      Adult rate: ₹{accommodation?.adult_price || 0} / night, Child rate: ₹{Math.round((accommodation?.child_price || 0))} / night
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Food Preferences</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded border">
                      {(['veg', 'nonveg', 'jain'] as const).map(type => (
                        <div key={type} className="flex items-center gap-4">
                          <span className="w-32 capitalize">{type === 'nonveg' ? 'Non veg' : type} count</span>
                          <Button
                            type="button"
                            onClick={() => handleFoodCount(type, -1)}
                            disabled={foodCounts[type] <= 0}
                            className="rounded-full bg-gray-200 text-lg w-8 h-8 flex items-center justify-center disabled:opacity-50"
                          >-</Button>
                          <span className="w-6 text-center">{foodCounts[type]}</span>
                          <Button
                            type="button"
                            onClick={() => handleFoodCount(type, 1)}
                            disabled={(foodCounts.veg + foodCounts.nonveg + foodCounts.jain) >= totalGuests}
                            className="rounded-full bg-gray-200 text-lg w-8 h-8 flex items-center justify-center disabled:opacity-50"
                          >+</Button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-2">
                        Total food count: {foodCounts.veg + foodCounts.nonveg + foodCounts.jain} / {totalGuests}
                        {foodCounts.veg + foodCounts.nonveg + foodCounts.jain !== totalGuests && (
                          <span className="text-red-600 ml-2">Must match total guests!</span>
                        )}
                      </div>
                      {errors.food && <p className="text-red-500 text-sm mt-2">{errors.food}</p>}
                    </div>
                  </div>

                  {accommodation.detailedInfo?.activities && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Extra Activities (Optional)</h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded border">
                        {accommodation.detailedInfo.activities
                          .filter((activity: Activity) => ['speed boating', 'motor boating', 'kayaking'].includes(activity.name.toLowerCase()))
                          .map((activity: Activity, index: number) => (
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
          </div>
          <div className="lg:sticky lg:top-24 h-fit space-y-6">


            <Card>
              <CardContent>
                <h3 className="text-2xl font-bold text-green-800 mb-6">Booking Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Accommodation</span>
                    <span className="text-green-600">{accommodation.name}</span>
                  </div>

                  {checkInDate && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Check-in Date</span>
                        <span className="text-gray-600">
                          {format(checkInDate, 'dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Check-out Date</span>
                        <span className="text-gray-600">
                          {format(addDays(checkInDate, 1), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Nights</span>
                        <span className="text-gray-600">
                          1
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

                  {allAvailableCoupons.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Offers</label>
                      <div className="flex overflow-x-auto space-x-2 mb-3 px-1 sm:flex-wrap sm:space-x-0 sm:gap-2 no-scrollbar">
                        {(() => {
                          console.log("Accommodation name:", accommodation?.name);
                          console.log("All available coupons:", allAvailableCoupons);

                          const matchingCoupons = allAvailableCoupons.filter(
                            (coupon: Coupon) =>
                              coupon.accommodationType?.trim() === accommodation?.name?.trim()
                          );

                          let couponsToShow: Coupon[] = [];

                          if (matchingCoupons.length > 0) {
                            // ✅ Show up to 3 matching coupons
                            couponsToShow = matchingCoupons.slice(0, 3);
                          } else {
                            // ✅ Show up to 3 from all available coupons if no match
                            couponsToShow = allAvailableCoupons.slice(0, 3);
                          }

                          console.log("Coupons to show:", couponsToShow);

                          return couponsToShow.map((availableCoupon: Coupon) => (
                            <button
                              key={availableCoupon.id}
                              onClick={() => handleCouponSelect(availableCoupon)}
                              className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors whitespace-nowrap"
                            >
                              {availableCoupon.code} - {availableCoupon.discountType === 'percentage'
                                ? `${availableCoupon.discount}%`
                                : `₹${availableCoupon.discount}`} OFF
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
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

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance to Pay Now
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={advanceAmount}
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
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-green-800">
                      <span>Total</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-blue-700 mt-2">
                      <span>Advance</span>
                      <span>{formatCurrency(advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Pay at property</span>
                      <span>{formatCurrency(totalAmount - advanceAmount)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center mt-4"
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
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Secure booking with instant confirmation.<br />
                    Pay {formatCurrency(advanceAmount)} now, and the rest at the property.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
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
                    <MapPin className="text-green-600 mr-2 mt-1 py" size={16} />
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

            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6103.946344270747!2d73.49323289387719!3d18.66382967533796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2a9180b52a2fd%3A0xa5d86c10d8d9846d!2sPlumeria%20Retreat%20%7C%20Pawna%20Lakeside%20Cottages!5e1!3m2!1sen!2sin!4v1749631888045!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Plumeria Retreat Location"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampsiteBooking;