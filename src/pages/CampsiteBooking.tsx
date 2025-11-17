import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, number } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format, addDays, isBefore, startOfDay, isSameDay } from 'date-fns';
import { X, Camera, MapPin, CheckCircle, CreditCard, Activity, Clock, Phone, Mail, MessageCircle } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Gallery.css';
import { MAX_ROOMS, MAX_PEOPLE_PER_ROOM, PARTIAL_PAYMENT_MIN_PERCENT } from '../data';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';
import 'react-day-picker/dist/style.css';
import { trackPageView } from '../utils/analytics';

const API_BASE_URL = "https://a.plumeriaretreat.com";
const BACKEND_URL = 'https://u.plumeriaretreat.com';

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}
interface City {
  id: number;
  name: string;
  country: string;
}

// --- VILLA LOGIC: Updated RoomGuest interface ---
interface RoomGuest {
  adults: number;
  children: number;
  extraGuests?: number;
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
// --- VILLA LOGIC: Updated Accommodation interface ---
interface Accommodation {
  id: number;
  name: string;
  price: number;
  type: string;
  address: string;
  city_id: number;
  latitude: string;
  longitude: string;
  adult_price: number;
  child_price: number;
  capacity: number;
  availableRooms?: number;
  features: string[];
  detailedInfo?: {
    activities?: Activity[];
  };
  image: string | string[];
  rooms: number;
  // Villa-specific fields
  MaxPersonVilla?: number;
  RatePerPerson?: number;
}
interface Coupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percentage';
  discount: string;
  minAmount: string;
  maxDiscount?: string | null;
  expiryDate: string;
  active: number;
  accommodationType: string;
}
interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}
interface AdditionalRoomInfo {
  date: Date;
  additionalRooms: number;
  adultPrice: number | null;
  childPrice: number | null;
}
interface TotalRoomBooked {
  totalRooms: number;
}

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

  // --- VILLA LOGIC: Added isVilla trigger and property capacity ---
  const isVilla = accommodation?.type.toLowerCase() === 'villa';
  const totalPropertyCapacity = accommodation?.MaxPersonVilla || accommodation?.capacity || 99;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cities, setCities] = useState<City[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [rooms, setRooms] = useState(0);
  const [fullyBlocked, setFullyBlocked] = useState<Date[]>([]);
  const [partiallyBlocked, setPartiallyBlocked] = useState<Date[]>([]);
  const [roomGuests, setRoomGuests] = useState<RoomGuest[]>([]);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [foodChoice, setFoodChoice] = useState<'veg' | 'nonveg' | 'jain'>('veg');
  const [foodCounts, setFoodCounts] = useState<FoodCounts>({ veg: 0, nonveg: 0, jain: 0 });
  const [showCalendar, setShowCalendar] = useState(false);
  const [fullscreenImgIdx, setFullscreenImgIdx] = useState<number | null>(null);
  const [showPartyEffect, setShowPartyEffect] = useState(false);
  const [bookedRoom, setBookedRoom] = useState<number>(0);
  const [selectedActivities, setSelectedActivities] = useState<{ [key: string]: boolean }>({});
  const [allAvailableCoupons, setAllAvailableCoupons] = useState<Coupon[]>([]);
  const [additionalRoomsInfo, setAdditionalRoomsInfo] = useState<AdditionalRoomInfo[]>([]);
  const [maxiRoom, setMaxiRoom] = useState<number>(MAX_ROOMS);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const sliderRef = useRef<any>(null);
  const [maxPeoplePerRoom, setMaxPeoplePerRoom] = useState<number>(MAX_PEOPLE_PER_ROOM);
  const [packageDescription, setPackageDescription] = useState<string>('');
  const [availableRoomsForSelectedDate, setAvailableRoomsForSelectedDate] = useState<number>(0);
  const [currentAdultRate, setCurrentAdultRate] = useState<number>(0);
  const [currentChildRate, setCurrentChildRate] = useState<number>(0);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);

  const totalAdults = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;

  // --- VILLA LOGIC: Calculate total guests including extra guests for villas ---
  const totalExtraGuests = isVilla ? roomGuests.reduce((sum, villa) => sum + (villa.extraGuests || 0), 0) : 0;
  const finalTotalGuests = totalGuests + totalExtraGuests;

  const checkOutDate = checkInDate ? addDays(checkInDate, 1) : undefined;

  useEffect(() => {
    if (accommodation) {
      if (isVilla) {
        setRooms(1);
        setRoomGuests([{ adults: 2, children: 0, extraGuests: 0 }]);
      } else {
        setRooms(0);
        setRoomGuests([]);
      }
    }
  }, [accommodation, isVilla]);

  const refreshAvailability = useCallback(async () => {
    if (id) {
      try {
        await fetchAdditionalRooms();
      } catch (error) {
        console.error('Failed to fetch additional rooms info', error);
      }
    }

    if (checkInDate) {
      fetchTotalRoom(checkInDate);
    }
  }, [id, checkInDate]);
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

  // --- VILLA LOGIC: Updated handleRoomGuestChange to handle both scenarios ---
  const handleRoomGuestChange = (roomIdx: number, type: 'adults' | 'children', value: number) => {
    setRoomGuests(prev => {
      const updated = [...prev];
      const currentRoom = updated[roomIdx];
      let newValue = Math.max(0, value);

      if (isVilla) {
        if (type === 'children') return prev; // No children for villas

        newValue = Math.max(1, Math.min(newValue, totalPropertyCapacity));
        updated[roomIdx] = { ...currentRoom, [type]: newValue };

        if (updated[roomIdx].adults < totalPropertyCapacity) {
          updated[roomIdx].extraGuests = 0;
        }
      } else {
        // Standard room logic
        const otherType = type === 'adults' ? 'children' : 'adults';
        const otherValue = currentRoom[otherType];

        if (newValue + otherValue > maxPeoplePerRoom) {
          newValue = maxPeoplePerRoom - otherValue;
        }

        updated[roomIdx][type] = newValue;
      }

      setFoodCounts({ veg: 0, nonveg: 0, jain: 0 });
      return updated;
    });
  };

  // --- VILLA LOGIC: Added handler for extra guests ---
  const handleExtraGuestChange = (index: number, delta: number) => {
    setRoomGuests(prev => {
      const newGuests = [...prev];
      const currentExtra = newGuests[index].extraGuests || 0;
      const newExtraCount = Math.max(0, Math.min(5, currentExtra + delta));

      newGuests[index] = { ...newGuests[index], extraGuests: newExtraCount };
      return newGuests;
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

    additionalRoomsInfo.forEach(({ date, additionalRooms }) => {
      if (isBefore(date, today)) return;
      const baseRooms = accommodation?.rooms || maxiRoom;
      const totalRoomsForDay = baseRooms + additionalRooms;
      if (bookedRoom >= totalRoomsForDay) {
        fully.push(date);
      }
      else if (bookedRoom > 0) {
        partial.push(date);
      }
    });

    setFullyBlocked(fully);
    setPartiallyBlocked(partial);
  };
  useEffect(() => {
    calculateBlockedDateTypes();
  }, [additionalRoomsInfo, bookedRoom, accommodation, maxiRoom]);
  const isDateDisabled = (date: Date) => {
    const isPast = isBefore(date, startOfDay(new Date()));
    return isPast || fullyBlocked.some(d => isSameDay(d, date));
  };
  const calculateAvailableRoomsForDate = useCallback((date?: Date) => {
    if (!date || !accommodation) return maxiRoom;
    const dateObj = startOfDay(date);
    const baseRooms = accommodation.rooms || maxiRoom;
    const additionalInfo = additionalRoomsInfo.find(a => isSameDay(a.date, dateObj));
    const extraRooms = additionalInfo ? additionalInfo.additionalRooms || 0 : 0;
    const totalRoomsForDay = baseRooms + extraRooms;
    const availableRooms = totalRoomsForDay - bookedRoom;
    return Math.max(0, availableRooms);
  }, [accommodation, additionalRoomsInfo, bookedRoom, maxiRoom]);
  const fetchTotalRoom = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/bookings/room-occupancy?check_in=${formattedDate}&id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setBookedRoom(data.total_rooms || 0);
      } else {
        setBookedRoom(0);
      }
    } catch (error) {
      console.error("Error fetching booked rooms:", error);
      setBookedRoom(0);
    }
  };
  useEffect(() => {
    if (checkInDate) {
      fetchTotalRoom(checkInDate);
    }
  }, [checkInDate]);

  // ========== MODIFIED SECTION 1 ==========
  // This useEffect will now ONLY run if it's NOT a villa
  useEffect(() => {
    if (!isVilla) {
      if (checkInDate) {
        const available = calculateAvailableRoomsForDate(checkInDate);
        setAvailableRoomsForSelectedDate(available);
        if (rooms > available) {
          setRooms(available);
        }
      }
    }
  }, [checkInDate, bookedRoom, additionalRoomsInfo, calculateAvailableRoomsForDate, isVilla]); // Added isVilla to dependency array
  // ========== END MODIFIED SECTION 1 ==========

  // ========== MODIFIED SECTION 2 ==========
  // This function now skips validation for villas
  const validateRoomAvailability = () => {
    if (isVilla) return true; // <-- ADDED THIS LINE

    if (!checkInDate) return true;
    const availableRooms = calculateAvailableRoomsForDate(checkInDate);
    if (availableRooms < rooms) {
      setErrors(prev => ({
        ...prev,
        dates: `On ${format(checkInDate, 'dd MMM yyyy')}, only ${availableRooms} room(s) available. Reduce rooms or choose different date.`
      }));
      return false;
    }
    return true;
  };
  // ========== END MODIFIED SECTION 2 ==========

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/accommodations/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch accommodation');
        }
        const data = await res.json();
        setMaxiRoom(data.rooms);
        setMaxPeoplePerRoom(data.capacity || MAX_PEOPLE_PER_ROOM);
        setPackageDescription(data.package_description);
        if (data) {
          let accommodationImages: string[] = [];
          try {
            const imgs = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
            if (Array.isArray(imgs)) {
              accommodationImages = imgs;
            }
          } catch (e) {
            console.error('Failed to parse images:', e);
          }
          setImages(accommodationImages);
          const parsed: Accommodation = {
            ...data,
            image: data.image,
            features: (() => {
              try {
                const featArr = JSON.parse(data.features);
                return Array.isArray(featArr) ? featArr : [];
              } catch {
                return [];
              }
            })(),
            detailedInfo: data.detailed_info ? JSON.parse(data.detailed_info) : {},
            rooms: data.rooms || MAX_ROOMS
          };
          setAccommodation(parsed);
          setCurrentAdultRate(data.adult_price);
          setCurrentChildRate(data.child_price);
        } else {
          navigate('/campsites');
        }
        const fetchCities = async () => {
          try {
            const citiesRes = await axios.get(`${API_BASE_URL}/admin/properties/cities`);
            setCities(citiesRes.data);
            console.log('Fetched cities:', citiesRes.data);
          } catch (error) {
            console.error('Error fetching cities:', error);

          }
        };


      } catch (err) {
        console.error('Accommodation fetch failed', err);
        navigate('/campsites');
      }
    };
    if (id) fetchAccommodation();
  }, [id, navigate]);

  // Track page view for Google Analytics
  useEffect(() => {
    const pageTitle = accommodation
      ? `Booking - ${accommodation.name}`
      : `Booking - Campsite ${id || ''}`;
    trackPageView(`/campsites/${id || ''}`, pageTitle);
  }, [id, accommodation]);

  const fetchAdditionalRooms = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/calendar/blocked-dates/${id}`);
      const json = await res.json();

      if (json.success) {
        const dates = json.data.map((d: any) => {
          const roomsRaw = d.rooms;
          let additionalRooms = 0;
          if (roomsRaw !== null && roomsRaw !== "null" && roomsRaw !== "") {
            additionalRooms = parseInt(roomsRaw, 10) || 0;
          }
          return {
            date: new Date(d.blocked_date),
            additionalRooms,
            adultPrice: d.adult_price ? parseFloat(d.adult_price) : null,
            childPrice: d.child_price ? parseFloat(d.child_price) : null,
          };
        });
        setAdditionalRoomsInfo(dates);
      }
    } catch (error) {
      console.error('Failed to fetch additional rooms info', error);
    }
  }, [id]);
  useEffect(() => {
    fetchAdditionalRooms();
  }, [fetchAdditionalRooms]);
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/coupons`);
        const result = await response.json();

        if (result.success && result.data) {
          const currentDate = new Date();
          const activeCoupons = result.data.filter((coupon: Coupon) =>
            coupon.active === 1 && new Date(coupon.expiryDate) > currentDate
          );
          setAllAvailableCoupons(activeCoupons);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (isDateDisabled(date)) {
      setErrors(prev => ({
        ...prev,
        dates: 'Your selected date is not available. Please choose different date.'
      }));
      return;
    }
    const roomInfo = additionalRoomsInfo.find(b => isSameDay(b.date, date));
    if (roomInfo && roomInfo.adultPrice !== null) {
      setCurrentAdultRate(roomInfo.adultPrice);
    } else if (accommodation) {
      setCurrentAdultRate(accommodation.adult_price);
    }
    if (roomInfo && roomInfo.childPrice !== null) {
      setCurrentChildRate(roomInfo.childPrice);
    } else if (accommodation) {
      setCurrentChildRate(accommodation.child_price);
    }
    setCheckInDate(date);
    setShowCalendar(false);
    setErrors(prev => ({ ...prev, dates: '' }));
  };

  // --- VILLA LOGIC: Updated total calculation ---
  const calculateTotal = () => {
    if (!accommodation || !checkInDate) return 0;
    const nights = 1;

    if (isVilla) {
      const baseRate = (Number(currentChildRate) > 0)
        ? Number(currentChildRate)
        : (Number(accommodation.price) || 0);
      const extraPersonCharge = (Number(currentAdultRate) > 0)
        ? Number(currentAdultRate)
        : (Number(accommodation.RatePerPerson) || 0);
      const extraGuests = roomGuests[0]?.extraGuests || 0;
      const extraGuestsCost = extraGuests * extraPersonCharge;
      const nightlyRate = baseRate + extraGuestsCost;

      // === CORRECTED LINE ===
      let subtotal = baseRate + (totalExtraGuests * extraPersonCharge);
      console.log("Villa Subtotal Calculation:--", subtotal);
      console.log("Base Rate:", baseRate);
      console.log("Extra Guests:", totalExtraGuests);
      console.log("Extra Person Charge:", extraPersonCharge);
      console.log("subtotal:", subtotal);
      console.log("nightrate:", nightlyRate);

      return subtotal - discount;
    }

    const adultsTotal = totalAdults * currentAdultRate * nights;
    const childrenTotal = totalChildren * currentChildRate * nights;
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

  useEffect(() => {
    if (!couponApplied || !appliedCoupon) {
      setDiscount(0);
      return;
    }

    const subtotal = (() => {
      if (!accommodation || !checkInDate) return 0;
      const nights = 1;

      if (isVilla) {
        const baseRate = (Number(currentChildRate) > 0)
          ? Number(currentChildRate)
          : (accommodation.price || 0);
        const extraPersonCharge = (Number(currentAdultRate) > 0)
          ? Number(currentAdultRate)
          : (accommodation.RatePerPerson || 0);
        const extraGuests = roomGuests[0]?.extraGuests || 0;
        const extraGuestsCost = extraGuests * extraPersonCharge;
        return (baseRate + extraGuestsCost) * nights;
      }

      const adultsTotal = totalAdults * currentAdultRate * nights;
      const childrenTotal = totalChildren * currentChildRate * nights;
      return adultsTotal + childrenTotal;
    })();

    if (subtotal < parseFloat(appliedCoupon.minAmount)) {
      setDiscount(0);
      setCouponApplied(false);
      setAppliedCoupon(null);
      setCoupon('');
      setCouponError(`Minimum amount for this coupon is ₹${appliedCoupon.minAmount}`);
      return;
    }

    let calculatedDiscount = 0;
    if (appliedCoupon.discountType === 'fixed') {
      calculatedDiscount = parseFloat(appliedCoupon.discount);
    } else if (appliedCoupon.discountType === 'percentage') {
      const percent = parseFloat(appliedCoupon.discount);
      calculatedDiscount = (subtotal * percent) / 100;
      if (appliedCoupon.maxDiscount) {
        const maxAllowed = parseFloat(appliedCoupon.maxDiscount);
        calculatedDiscount = Math.min(calculatedDiscount, maxAllowed);
      }
    }

    const finalDiscount = Math.min(calculatedDiscount, subtotal);
    setDiscount(finalDiscount);
  }, [
    totalAdults,
    totalChildren,
    currentAdultRate,
    currentChildRate,
    couponApplied,
    appliedCoupon,
    accommodation,
    checkInDate,
    isVilla,
    roomGuests
  ]);

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponError('');

    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const foundCoupon = allAvailableCoupons.find(
        (c: Coupon) => c.code.toUpperCase() === code
      );

      if (!foundCoupon) {
        setCouponError('Invalid coupon code');
        return;
      }

      if (foundCoupon.active !== 1) {
        setCouponError('This coupon is no longer active');
        return;
      }

      const now = new Date();
      const expiryDate = new Date(foundCoupon.expiryDate);
      if (expiryDate < now) {
        setCouponError('This coupon has expired');
        return;
      }

      const couponAccommodationType = foundCoupon.accommodationType?.trim() || '';
      const currentAccommodationName = accommodation?.name?.trim() || '';

      if (couponAccommodationType.toLowerCase() !== 'all' &&
        couponAccommodationType !== currentAccommodationName) {
        setCouponError('This coupon is not valid for this accommodation');
        return;
      }

      const subtotal = (() => {
        if (!accommodation || !checkInDate) return 0;
        const nights = 1;
        if (isVilla) {
          const baseRate = (Number(currentChildRate) > 0)
            ? Number(currentChildRate)
            : (accommodation.price || 0);
          const extraPersonCharge = (Number(currentAdultRate) > 0)
            ? Number(currentAdultRate)
            : (accommodation.RatePerPerson || 0);
          const extraGuestsCost = (roomGuests[0]?.extraGuests || 0) * extraPersonCharge;
          return (baseRate + extraGuestsCost) * nights;
        }
        const adultsTotal = totalAdults * currentAdultRate * nights;
        const childrenTotal = totalChildren * currentChildRate * nights;
        return adultsTotal + childrenTotal;
      })();

      if (subtotal < parseFloat(foundCoupon.minAmount)) {
        setCouponError(`Minimum amount for this coupon is ₹${foundCoupon.minAmount}`);
        return;
      }

      setAppliedCoupon(foundCoupon);
      setCoupon(code);
      setCouponApplied(true);
      setShowPartyEffect(true);
      setCouponError('');

    } catch (error: any) {
      console.error('Coupon application error:', error);
      setCouponError(error.message || 'Failed to apply coupon');
      setDiscount(0);
      setCouponApplied(false);
      setAppliedCoupon(null);
    }
  };

  const handleCouponSelect = (selectedCoupon: Coupon) => {
    setCoupon(selectedCoupon.code);
    setCouponError('');
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

  // --- VILLA LOGIC: Updated validation ---
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!guestInfo.name) newErrors.name = 'Name is required';
    if (!guestInfo.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) newErrors.email = 'Email is invalid';
    if (!guestInfo.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(guestInfo.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!checkInDate) newErrors.dates = 'Please select a date';

    if (isVilla) {
      if (finalTotalGuests < 1) {
        newErrors.guests = "At least one guest is required for the villa.";
      }
    } else {
      if (rooms === 0) {
        newErrors.rooms = "Please select at least one room.";
      }
      if ((foodCounts.veg + foodCounts.nonveg + foodCounts.jain) !== totalGuests) {
        newErrors.food = 'Food preferences must match total guests';
      }
    }

    if (checkInDate && isDateDisabled(checkInDate)) {
      newErrors.dates = 'Your selected date is not available. Please choose different date.';
    }
    setErrors(newErrors);
    if (!validateRoomAvailability()) {
      return false;
    }
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      scrollToError(firstErrorKey);
      return false;
    }
    return true;
  };

  // --- VILLA LOGIC: Updated booking payload ---
  const handleBooking = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formatDate = (date: Date | undefined) => date ? format(date, 'yyyy-MM-dd') : undefined;

      // --- NEW CALCULATION ---
      // Calculate the pre-discount price
      const fullAmount = totalAmount + discount;

      const bookingPayload = {
        guest_name: guestInfo.name,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone || null,
        accommodation_id: id,
        check_in: formatDate(checkInDate),
        check_out: formatDate(checkOutDate),
        adults: isVilla ? finalTotalGuests : totalAdults,
        children: isVilla ? 0 : totalChildren,
        rooms: rooms,
        food_veg: isVilla ? finalTotalGuests : foodCounts.veg,
        food_nonveg: isVilla ? 0 : foodCounts.nonveg,
        food_jain: isVilla ? 0 : foodCounts.jain,

        // Existing fields
        total_amount: totalAmount, // This is the amount AFTER discount
        advance_amount: advanceAmount,
        package_id: 0,
        coupon_code: couponApplied ? coupon : null,
        RatePersonVilla: isVilla ? accommodation?.RatePerPerson || 0 : undefined,
        ExtraPersonVilla: isVilla ? roomGuests[0]?.extraGuests || 0 : undefined,
        type: isVilla ? 'villa' : 'cottage',

        // --- ADD THESE NEW FIELDS ---
        full_amount: fullAmount,               // Price before discount
        discount: discount,                    // Discount amount
        coupon: couponApplied ? coupon : null, // Ensure key matches backend expectation (e.g. 'coupon' vs 'coupon_code')
      };
      console.log('Booking payload:', bookingPayload);
      const bookingResponse = await fetch(`https://a.plumeriaretreat.com/admin/bookings`, {
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
      setBookingDetails(bookingData.data || bookingData);
      const paymentPayload = {
        amount: advanceAmount,
        firstname: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone || '',
        productinfo: `Booking for ${accommodation?.name}`,
        booking_id: bookingId,
      };
      const paymentResponse = await fetch(`https://a.plumeriaretreat.com/admin/bookings/payments/payu`, {
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
      if (!paymentData.payu_url || !paymentData.payment_data || typeof paymentData.payment_data !== 'object') {
        console.error('Invalid payment data structure:', paymentData);
        throw new Error('Invalid payment data received from server');
      }
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.payu_url;
      Object.entries(paymentData.payment_data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);

      form.submit();
    } catch (error: any) {
      console.error('Booking/Payment error:', error);
      let errorMessage = error.message || 'Something went wrong. Please try again.';
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
          setFullscreenImgIdx((prev) => prev !== null ? (prev + 1) % images.length : 0);
        }
        if (e.key === 'ArrowLeft') {
          setFullscreenImgIdx((prev) => prev !== null ? (prev - 1 + images.length) % images.length : 0);
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
  }, [fullscreenImgIdx, images]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesRes = await axios.get(`${API_BASE_URL}/admin/properties/cities`);
        setCities(citiesRes.data);
        console.log('Fetched cities:', citiesRes.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities(); // Call the function
  }, []);

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
      <PartyEffect show={showPartyEffect} onComplete={() => setShowPartyEffect(false)} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* ===== LEFT COLUMN (INFORMATION) ===== */}
          <div className="lg:col-span-2 space-y-8">
            <br />
            {/* Image Gallery */}
            <div className="relative animate-fade-in">
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">

                <img
                  src={images[currentImageIndex] || (Array.isArray(accommodation.image) ? accommodation.image[0] : accommodation.image)}
                  alt={accommodation.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setFullscreenImgIdx(currentImageIndex)}
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
                <button
                  className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-md"
                  onClick={() => setFullscreenImgIdx(currentImageIndex)}
                >
                  <Camera className="w-4 h-4" />
                  <span>View all photos</span>
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2 sm:space-x-3 mt-4 overflow-x-auto pb-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-emerald-500 scale-105" : "border-transparent hover:border-gray-300"}`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {accommodation.name}
                    </h1>
                    <div className="flex flex-wrap items-center space-x-2 text-gray-600 text-sm sm:text-base mb-3">
                      <MapPin className="w-4 h-4" />
                      {cities.find(c => c.id === accommodation.city_id)?.name || accommodation.city_id}
                      <span className="mx-2 hidden sm:inline">•</span>
                      <span className="capitalize">{accommodation.type}</span>
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                      ₹{accommodation.price.toLocaleString()}
                    </div>
                    {/* --- VILLA LOGIC: DYNAMIC PRICE LABEL --- */}
                    <div className="text-xs sm:text-sm text-gray-500">
                      {isVilla ? `per night (up to ${totalPropertyCapacity} guests)` : "per night"}
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: packageDescription }}
                />
              </div>

              {accommodation.features && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accommodation.features.map((feature: string) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <CheckCircle className="text-green-600 w-5 h-5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Things to Carry</h3>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <ol className="list-decimal list-inside space-y-2 text-orange-800">
                    <li>Always good to carry extra pair of clothes</li>
                    <li>Winter and warm clothes as it will be cold night</li>
                    <li>Toothbrush and paste (toiletries)</li>
                    <li>Any other things you feel necessary</li>
                    <li>Personal medicine if any</li>
                  </ol>
                </div>
              </div>


            </div>
          </div>

          {/* ===== RIGHT COLUMN (BOOKING FORM) ===== */}
          <div className="lg:col-span-1">
            <br />
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Reserve Your Stay</h3>
                  <p className="text-green-100 text-sm sm:text-base">Select dates to see prices</p>
                </div>

                <div className="p-6 sm:p-8 space-y-6">

                  {/* Date Selection */}
                  <div>
                    <button type="button" ref={dateRef} className={`w-full p-3 border rounded-lg bg-white text-left focus:ring-2 focus:ring-green-500 ${errors.dates ? 'border-red-500' : 'border-gray-300'}`} onClick={() => setShowCalendar(!showCalendar)}>
                      {checkInDate ? `${format(checkInDate, 'dd MMM yyyy')} (Check-in)` : 'Select your stay date'}
                    </button>
                    {errors.dates && (<p className="text-red-500 text-sm mt-1">{errors.dates}</p>)}
                    {showCalendar && (
                      <div className="relative z-10 mt-2">
                        <DayPicker mode="single" selected={checkInDate} onSelect={handleDateSelect} numberOfMonths={1} fromDate={new Date()} toDate={addDays(new Date(), 365)} disabled={isDateDisabled} modifiers={{ fullyBlocked, partiallyBlocked }} modifiersClassNames={{ fullyBlocked: 'bg-red-500 text-white line-through cursor-not-allowed', partiallyBlocked: 'bg-yellow-400 text-gray-800', selected: 'bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:bg-blue-600' }} className="mx-auto bg-white p-4 rounded-lg shadow-lg border border-gray-200" />
                        <div className="flex flex-wrap gap-4 mt-4 text-xs justify-center">
                          <div className="flex items-center"><div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>Fully Booked</div>
                          <div className="flex items-center"><div className="w-4 h-4 bg-yellow-400 mr-2 rounded-sm"></div>Limited</div>
                          <div className="flex items-center"><div className="w-4 h-4 bg-white border border-gray-300 mr-2 rounded-sm"></div>Available</div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* --- VILLA LOGIC: Conditional UI for Rooms/Guests --- */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isVilla ? 'Guests' : 'Rooms'}
                    </label>

                    {isVilla ? (
                      // VILLA GUEST SELECTOR
                      <div className="border rounded-lg p-3 bg-gray-50">
                        {roomGuests.length > 0 && roomGuests[0] && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-gray-600">Standard Guests</span>
                              <div className="flex items-center gap-3">
                                <Button onClick={() => handleRoomGuestChange(0, 'adults', roomGuests[0].adults - 1)} disabled={roomGuests[0].adults <= 1} className="px-3 py-1 bg-green-700 text-white rounded-lg disabled:bg-gray-300">-</Button>
                                <span className="font-bold text-lg w-8 text-center">{roomGuests[0].adults}</span>
                                <Button onClick={() => handleRoomGuestChange(0, 'adults', roomGuests[0].adults + 1)} disabled={roomGuests[0].adults >= totalPropertyCapacity} className="px-3 py-1 bg-green-700 text-white rounded-lg disabled:bg-gray-300">+</Button>
                              </div>


                            </div>
                            {roomGuests[0].adults >= totalPropertyCapacity && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm text-gray-600">Extra Guests</span>
                                  <div className="flex items-center gap-3">
                                    <Button onClick={() => handleExtraGuestChange(0, -1)} disabled={(roomGuests[0].extraGuests || 0) <= 0} className="px-3 py-1 bg-green-700 text-white rounded-lg disabled:bg-gray-300">-</Button>
                                    <span className="font-bold text-lg w-8 text-center">{roomGuests[0].extraGuests || 0}</span>
                                    <Button onClick={() => handleExtraGuestChange(0, 1)} disabled={(roomGuests[0].extraGuests || 0) >= 5} className="px-3 py-1 bg-green-700 text-white rounded-lg disabled:bg-gray-300">+</Button>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">Charge: ₹{accommodation.RatePerPerson?.toLocaleString() || 0} per extra guest</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      // CAMPSITE ROOM SELECTOR (Existing Logic)
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Button type="button" onClick={() => handleRoomsChange(Math.max(0, rooms - 1))} disabled={rooms <= 0} className="px-3 py-1 bg-green-700 text-white rounded-lg disabled:bg-gray-300">-</Button>
                          <span className="font-bold text-lg">{rooms}</span>
                          <Button type="button" onClick={() => handleRoomsChange(Math.min(availableRoomsForSelectedDate, rooms + 1))} disabled={rooms >= availableRoomsForSelectedDate} className="px-3 py-1 bg-green-700 text-white rounded-lg disabled:bg-gray-300">+</Button>
                          <span className="text-xs text-gray-500">{Math.max(0, availableRoomsForSelectedDate - rooms)} rooms remaining</span>
                        </div>

                        {rooms > 0 && (
                          <div className="border rounded-lg p-3 bg-gray-50">
                            {roomGuests.slice(0, rooms).map((room, idx) => (
                              <div key={`room-${idx}`} className="flex flex-col gap-2 mb-2 border-b pb-2 last:border-0">
                                <span className="w-16 font-medium text-sm">Room {idx + 1}</span>
                                <div className="flex items-center gap-4">
                                  <select value={room.adults} onChange={e => handleRoomGuestChange(idx, 'adults', Number(e.target.value))} className="border rounded px-2 py-1 text-sm flex-1">
                                    {[...Array(maxPeoplePerRoom + 1).keys()].slice(1).map(n => n + room.children <= maxPeoplePerRoom && (<option key={`adults-${n}`} value={n}>{n} Adults</option>))}
                                  </select>
                                  <select value={room.children} onChange={e => handleRoomGuestChange(idx, 'children', Number(e.target.value))} className="border rounded px-2 py-1 text-sm flex-1">
                                    {[...Array(maxPeoplePerRoom + 1).keys()].map(n => n + room.adults <= maxPeoplePerRoom && (<option key={`children-${n}`} value={n}>{n} Children</option>))}
                                  </select>
                                </div>
                              </div>
                            ))}

                          </div>

                        )}
                      </>
                    )}
                    <div className="mt-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-sm text-white shadow-lg">
                      <ul className="space-y-2">

                        <li className="flex items-center justify-between">
                          <span className="font-medium text-green-100">Pricing</span>
                          <span className="font-medium">

                            {!isVilla && (
                              <>  Adult: {currentAdultRate} | Child: {currentChildRate}</>
                            )}
                          </span>
                        </li>

                        <li className="flex items-center justify-between">
                          <span className="font-medium text-green-100">Guests</span>
                          <span className="text-right">
                            {isVilla
                              ? `${finalTotalGuests} Guests`
                              : `${totalGuests} Guests in ${rooms} Room(s)`}
                          </span>
                        </li>

                        {/* Divider */}
                        <li className="pt-2 !mt-3 border-t border-white/20"></li>

                        <li className="flex items-center justify-between">
                          <span className="font-medium text-green-100">Check-in</span>
                          <div className="text-right">
                            <span>{checkInDate ? format(checkInDate, 'dd MMM yyyy') : 'N/A'}</span>
                            <span className="font-medium ml-3">{isVilla ? '2:00 PM' : '3:00 PM'}</span>
                          </div>
                        </li>

                        <li className="flex items-center justify-between">
                          <span className="font-medium text-green-100">Check-out</span>
                          <div className="text-right">
                            <span>{checkOutDate ? format(checkOutDate, 'dd MMM yyyy') : 'N/A'}</span>
                            <span className="font-medium ml-3">11:00 AM</span>
                          </div>
                        </li>

                      </ul>
                    </div>

                  </div>

                  {/* Guest Info */}
                  <div className="space-y-4">
                    <div>
                      <input type="text" required value={guestInfo.name} onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Full Name" ref={nameRef} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <input type="email" required value={guestInfo.email} onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="Email Address" ref={emailRef} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <input type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="Phone Number" ref={phoneRef} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* --- VILLA LOGIC: Hide Food Preferences for Villas --- */}
                  {!isVilla && (
                    <div ref={foodRef}>
                      <h3 className="text-base font-semibold mb-2">Food Preferences</h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
                        {(['veg', 'nonveg', 'jain'] as const).map(type => (
                          <div key={type} className="flex items-center gap-4">
                            <span className="w-24 capitalize text-sm">{type === 'nonveg' ? 'Non-Veg' : type}</span>
                            <Button type="button" onClick={() => handleFoodCount(type, -1)} disabled={foodCounts[type] <= 0} className="rounded-full bg-gray-200 text-lg w-8 h-8 flex items-center justify-center disabled:opacity-50">-</Button>
                            <span className="w-6 text-center font-medium">{foodCounts[type]}</span>
                            <Button type="button" onClick={() => handleFoodCount(type, 1)} disabled={(foodCounts.veg + foodCounts.nonveg + foodCounts.jain) >= totalGuests} className="rounded-full bg-gray-200 text-lg w-8 h-8 flex items-center justify-center disabled:opacity-50">+</Button>
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
                  )}

                  {/* Coupon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">


                      Available Offers 🏷️
                    </label>
                    {allAvailableCoupons.length > 0 && (
                      <div className="mb-4">
                        <div className="flex overflow-x-auto space-x-2 pb-2">
                          {(() => {
                            const accommodationCoupons = allAvailableCoupons.filter(
                              (c: Coupon) => c.accommodationType?.trim() === accommodation?.name?.trim()
                            );
                            const allTypeCoupons = allAvailableCoupons.filter(
                              (c: Coupon) => c.accommodationType?.trim().toLowerCase() === "all"
                            );
                            const couponsToShow = [...accommodationCoupons, ...allTypeCoupons.filter(ac => !accommodationCoupons.find(sc => sc.id === ac.id))].slice(0, 4);

                            return couponsToShow.map((couponItem: Coupon) => (
                              <button
                                key={couponItem.code}
                                onClick={() => handleCouponSelect(couponItem)}
                                className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-green-200 transition-colors whitespace-nowrap"
                              >
                                {couponItem.code}
                              </button>
                            ));
                          })()}
                        </div>


                      </div>
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => {
                          setCoupon(e.target.value);
                          setCouponApplied(false);
                          setDiscount(0);
                          setAppliedCoupon(null);
                          setCouponError(''); // Clear error when user types
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter coupon code"
                        disabled={couponApplied}
                      />

                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !coupon}
                        className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {couponApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                    {/* Display coupon error message */}
                    {couponError && (
                      <p className="text-red-500 text-sm mt-2">{couponError}</p>
                    )}
                    {couponApplied && discount > 0 && (
                      <p className="text-green-700 text-sm mt-2">
                        Coupon applied! You saved {formatCurrency(discount)}.
                      </p>
                    )}
                  </div>


                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-base">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Check-in:</span><span className="font-medium">{checkInDate ? format(checkInDate, 'dd MMM yyyy') : 'N/A'}</span></div>

                      {/* --- VILLA LOGIC: DYNAMIC BOOKING SUMMARY --- */}
                      {isVilla ? (
                        <>
                          <div className="flex justify-between">
                            <span>Base rate per night:</span>
                            <span>
                              ₹
                              {(
                                (Number(currentChildRate) > 0)
                                  ? Number(currentChildRate)
                                  : (Number(accommodation.price) || 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                          {totalExtraGuests > 0 && (
                            <div className="flex justify-between">
                              <span>Extra person charges:</span>
                              <span>
                                ₹
                                {(
                                  Number(currentAdultRate) && Number(currentAdultRate) !== 0
                                    ? Number(currentAdultRate)
                                    : Number(accommodation?.RatePerPerson) || 0
                                ).toLocaleString()}{" "}
                                x {totalExtraGuests}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between"><span>Guests:</span><span className="font-medium">{totalAdults} Adults, {totalChildren} Children</span></div>
                          <div className="flex justify-between"><span>Rooms:</span><span className="font-medium">{rooms}</span></div>
                        </>
                      )}

                      <div className="border-t pt-2 mt-2 flex justify-between"><span>Subtotal:</span><span className="font-medium">{formatCurrency(totalAmount + discount)}</span></div>
                      {discount > 0 && (<div className="flex justify-between text-green-600"><span>Discount:</span><span className="font-medium">-{formatCurrency(discount)}</span></div>)}
                      <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance to Pay:</span>
                        <span className="font-medium">{formatCurrency(advanceAmount)} ({totalAmount > 0 ? ((advanceAmount / totalAmount) * 100).toFixed(0) : 0}%)</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Pay at property:</span>
                        <span>{formatCurrency(totalAmount - advanceAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleBooking} disabled={loading} className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center">
                    {loading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Processing...</>) : (<><CreditCard className="mr-2" size={20} />Book Now & Pay Advance</>)}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">You won't be charged the full amount yet. Secure your booking now!</p>
                </div>
              </div>

              <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-transparent bg-clip-padding flex flex-col">
                <div className="relative p-6">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Need Help? 🤝
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Our friendly support team is here to assist you with your booking
                  </p>

                  <div className="space-y-4">
                    <a href="tel:+919226869678" className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <Phone className="mr-3" size={20} />
                      <div className="text-left"><div className="font-semibold">Call Now</div><div className="text-sm opacity-90">+91 9226869678</div></div>
                    </a>
                    <a href="https://wa.me/919226869678" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-gradient-to-r from-green-400 to-green-500 text-white py-3 px-4 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <MessageCircle className="mr-3" size={20} />
                      <div className="text-left"><div className="font-semibold">WhatsApp</div><div className="text-sm opacity-90">Quick Support</div></div>
                    </a>
                    <a href="mailto:booking@plumeriaretreat.com" className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <Mail className="mr-3" size={20} />
                      <div className="text-left"><div className="font-semibold">Email Us</div><div className="text-sm opacity-90">booking@plumeriaretreat.com</div></div>
                    </a>
                  </div>

                  <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-start">
                      <MapPin className="text-gray-600 mr-3 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <div className="font-semibold text-gray-800 mb-1">Visit Us</div>
                        <div className="text-sm text-gray-600">At- Bramhanoli fangne post, tal, pawnanagar,<br />maval, Maharashtra 410406</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              {accommodation?.latitude && accommodation?.longitude ? (
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={`https://maps.google.com/maps?q=${accommodation.latitude},${accommodation.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${accommodation.name} Location`}
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">Map location not available.</p>
              )}



            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CampsiteBooking;