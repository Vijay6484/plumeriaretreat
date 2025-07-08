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

const API_BASE_URL = "https://a.plumeriaretreat.com";
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
  const [bookedRooms, setBookedRooms] = useState<number[]>([]);
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
  
  // Refs for scrolling to errors
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);

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
    setRoomGuests(prev => {
      if (newRooms > prev.length) {
        const newEntries = Array.from({ length: newRooms - prev.length }, () => ({
          adults: 2,
          children: 0
        }));
        return [...prev, ...newEntries];
      } else if (newRooms < prev.length) {
        return prev.slice(0, newRooms);
      }
      return prev;
    });

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

  const calculateAvailableRoomsForDate = () => {
    if (!checkInDate) return maxiRoom;

    const date = startOfDay(checkInDate);
    const blockedInfo = blockedDates.find(b => isSameDay(b.date, date));
    const blockedRooms = blockedInfo?.blockedRooms || 0;
    return maxiRoom - blockedRooms;
  };

  useEffect(() => {
    if (checkInDate) {
      const available = calculateAvailableRoomsForDate();
      setAvailableRoomsForSelectedDate(available);

      if (rooms > available) {
        setRooms(available);
      }
    }
  }, [checkInDate, blockedDates, maxiRoom]);

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
        if (json.success) {
          const dates = json.data.map((d: any) => ({
            date: new Date(d.blocked_date),
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

  // Use dynamic prices from accommodation data
  const ADULT_RATE = accommodation?.adult_price || 0;
  const CHILD_RATE = accommodation?.child_price || 0;

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

  const scrollToError = (errorKey: string) => {
    let elementToScroll: HTMLElement | null = null;

    switch (errorKey) {
      case 'name':
        elementToScroll = nameRef.current;
        break;
      case 'email':
        elementToScroll = emailRef.current;
        break;
      case 'phone':
        elementToScroll = phoneRef.current;
        break;
      case 'dates':
        elementToScroll = dateRef.current;
        break;
      case 'food':
        elementToScroll = foodRef.current;
        break;
      default:
        break;
    }

    if (elementToScroll) {
      elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (elementToScroll instanceof HTMLInputElement || 
          elementToScroll instanceof HTMLButtonElement) {
        elementToScroll.focus();
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!guestInfo.name) newErrors.name = 'Name is required';
    if (!guestInfo.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) newErrors.email = 'Email is invalid';
    if (!guestInfo.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(guestInfo.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!checkInDate) newErrors.dates = 'Please select a date';
    if ((foodCounts.veg + foodCo