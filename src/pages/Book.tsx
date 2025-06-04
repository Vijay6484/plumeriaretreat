import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Sparkles, Calendar, Clock, Loader2, Check, X, CreditCard } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const API_BASE_URL = 'https://plumeriaretreatback-production.up.railway.app/api';

interface Accommodation {
  id: number;
  title: string;
  description: string;
  price: number;
  available_rooms: number;
  amenities: string[];
  image_url: string;
  available: boolean;
}

interface MealPlan {
  id: number;
  title: string;
  description: string;
  price: number;
  available: boolean;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  max_participants: number;
  available: boolean;
}

const SPARKLE_COUNT = 12;

const SparkleBurst: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="absolute left-1/2 top-0 z-50 pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
        const angle = (360 / SPARKLE_COUNT) * i;
        const distance = 32;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x, y, scale: 0.7 }}
            transition={{ duration: 0.7, delay: 0.05 * i }}
            className="absolute"
          >
            <Sparkles className="text-yellow-400 drop-shadow" size={18} />
          </motion.span>
        );
      })}
    </div>
  );
};

const Book: React.FC = () => {
  // State for data from backend
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  
  // Booking form state
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedMealPlan, setSelectedMealPlan] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [error, setError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  // Guest information
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    document.title = 'Book Now - Plumeria Retreat';
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accommodationsRes, mealPlansRes, activitiesRes, blockedDatesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/accommodations`),
        fetch(`${API_BASE_URL}/meal-plans`),
        fetch(`${API_BASE_URL}/activities`),
        fetch(`${API_BASE_URL}/blocked-dates`)
      ]);

      if (!accommodationsRes.ok || !mealPlansRes.ok || !activitiesRes.ok || !blockedDatesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [accommodationsData, mealPlansData, activitiesData, blockedDatesData] = await Promise.all([
        accommodationsRes.json(),
        mealPlansRes.json(),
        activitiesRes.json(),
        blockedDatesRes.json()
      ]);

      setAccommodations(accommodationsData);
      setMealPlans(mealPlansData);
      setActivities(activitiesData);
      
      // Convert blocked dates to Date objects
      const blocked = blockedDatesData.map((dateStr: string) => new Date(dateStr));
      setBlockedDates(blocked);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load booking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityToggle = (activityId: number) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleCouponApply = async () => {
    if (!coupon.trim()) return;
    
    try {
      setCouponLoading(true);
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: coupon }),
      });

      const result = await response.json();
      
      if (result.valid) {
        const subtotal = calculateSubtotal();
        if (result.min_amount && subtotal < result.min_amount) {
          setError(`Minimum order amount of ₹${result.min_amount} required for this coupon`);
          setTimeout(() => setError(''), 3000);
          return;
        }
        
        setDiscount(result.discount);
        setShowCouponSuccess(true);
        setTimeout(() => setShowCouponSuccess(false), 3000);
      } else {
        setError(result.message || 'Invalid or expired coupon code');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError('Failed to validate coupon');
      setTimeout(() => setError(''), 3000);
    } finally {
      setCouponLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!selectedAccommodation || !dateRange?.from || !dateRange?.to) {
      return false;
    }

    try {
      setAvailabilityLoading(true);
      setAvailabilityError('');
      
      const response = await fetch(`${API_BASE_URL}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodation_id: parseInt(selectedAccommodation),
          check_in_date: format(dateRange.from, 'yyyy-MM-dd'),
          check_out_date: format(dateRange.to, 'yyyy-MM-dd'),
          rooms: selectedRooms
        }),
      });

      const result = await response.json();
      
      if (!result.available) {
        setAvailabilityError(result.reason || `Only ${result.available_rooms} rooms available, but you requested ${result.requested_rooms}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityError('Failed to check availability');
      return false;
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!guestInfo.name || !guestInfo.email || !dateRange?.from || !dateRange?.to || !selectedAccommodation) {
      setError('Please fill in all required fields');
      return;
    }

    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_name: guestInfo.name,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          check_in_date: format(dateRange.from, 'yyyy-MM-dd'),
          check_out_date: format(dateRange.to, 'yyyy-MM-dd'),
          adults: guests.adults,
          children: guests.children,
          accommodation_id: parseInt(selectedAccommodation),
          rooms: selectedRooms,
          meal_plan_id: selectedMealPlan ? parseInt(selectedMealPlan) : null,
          activities: selectedActivities,
          coupon_code: discount > 0 ? coupon : null,
          total_amount: calculateTotal()
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Initialize payment after successful booking creation
        await initiatePayment(result.booking_id);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const initiatePayment = async (bookingId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Create a form and submit it to PayU
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.payment_url;

        // Add all PayU parameters as hidden inputs
        Object.keys(result.payment_data).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = result.payment_data[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError('Failed to initialize payment. Please try again.');
    }
  };

  const calculateSubtotal = () => {
    let total = 0;
    
    const accommodation = accommodations.find(a => a.id.toString() === selectedAccommodation);
    if (accommodation && dateRange?.from && dateRange?.to) {
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      total += accommodation.price * selectedRooms * days;
    }
    
    const mealPlan = mealPlans.find(m => m.id.toString() === selectedMealPlan);
    if (mealPlan && dateRange?.from && dateRange?.to) {
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      total += mealPlan.price * (guests.adults + guests.children) * days;
    }
    
    selectedActivities.forEach(activityId => {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        total += activity.price * (guests.adults + guests.children);
      }
    });
    
    return total;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    
    if (discount > 0) {
      return subtotal * (1 - discount / 100);
    }
    
    return subtotal;
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => 
      blocked.toDateString() === date.toDateString()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-600" size={48} />
          <p className="text-green-700">Loading booking options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[40vh] bg-green-800 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        ></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Stay</h1>
            <p className="text-xl opacity-90">Plan your perfect getaway</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
          >
            <X className="mr-2" size={20} />
            {error}
          </motion.div>
        )}

        {availabilityError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-center"
          >
            <X className="mr-2" size={20} />
            {availabilityError}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Guest Information */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Guest Information</h2>
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
              </CardContent>
            </Card>

            {/* Calendar and Check-in/out Times */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Select Dates</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      fromDate={new Date()}
                      toDate={addDays(new Date(), 365)}
                      disabled={isDateBlocked}
                      className="mx-auto"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-green-800">Check-in/out Times</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Clock className="text-green-600 mt-1 mr-2" size={20} />
                          <div>
                            <p className="font-medium">Check-in Time</p>
                            <p className="text-gray-600">3:00 PM on arrival day</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="text-green-600 mt-1 mr-2" size={20} />
                          <div>
                            <p className="font-medium">Check-out Time</p>
                            <p className="text-gray-600">11:00 AM on departure day</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guests */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Number of Guests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={guests.adults}
                      onChange={(e) => setGuests(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                    <input
                      type="number"
                      min="0"
                      value={guests.children}
                      onChange={(e) => setGuests(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Selection */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Select Accommodation</h2>
                <div className="space-y-4">
                  {accommodations.map((accommodation) => (
                    <div
                      key={accommodation.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedAccommodation === accommodation.id.toString()
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => {
                        setSelectedAccommodation(accommodation.id.toString());
                        setSelectedRooms(1);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{accommodation.title}</h3>
                          <p className="text-gray-600 mb-2">{accommodation.description}</p>
                          {accommodation.amenities && Array.isArray(accommodation.amenities) && accommodation.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {accommodation.amenities.map((amenity, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-green-700">
                            {accommodation.available_rooms} rooms available
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-700 text-lg">
                            {formatCurrency(accommodation.price)}
                          </p>
                          <span className="text-gray-500 text-sm">per night</span>
                        </div>
                      </div>
                      {selectedAccommodation === accommodation.id.toString() && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Rooms
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={accommodation.available_rooms}
                            value={selectedRooms}
                            onChange={(e) => setSelectedRooms(parseInt(e.target.value) || 1)}
                            className="w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan Selection */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Select Meal Plan (Optional)</h2>
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedMealPlan === ''
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedMealPlan('')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">No Meal Plan</h3>
                        <p className="text-gray-600">You can dine at nearby restaurants</p>
                      </div>
                      <p className="font-bold text-green-700">Free</p>
                    </div>
                  </div>
                  {mealPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedMealPlan === plan.id.toString()
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedMealPlan(plan.id.toString())}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{plan.title}</h3>
                          <p className="text-gray-600">{plan.description}</p>
                        </div>
                        <p className="font-bold text-green-700">
                          {formatCurrency(plan.price)}
                          <span className="text-gray-500 font-normal text-sm"> / person / day</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activities Selection */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Add Activities (Optional)</h2>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedActivities.includes(activity.id)
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleActivityToggle(activity.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{activity.title}</h3>
                          <p className="text-gray-600">{activity.description}</p>
                          <p className="text-sm text-gray-500">Duration: {activity.duration}</p>
                          {activity.max_participants && (
                            <p className="text-sm text-gray-500">
                              Max participants: {activity.max_participants}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-green-700">
                          {formatCurrency(activity.price)}
                          <span className="text-gray-500 font-normal text-sm"> / person</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-green-800">Booking Summary</h2>
                <div className="space-y-4">
                  {/* Summary Details */}
                  {dateRange?.from && dateRange?.to && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Dates</p>
                      <p className="text-gray-600">
                        {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-green-700">
                        {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights
                      </p>
                    </div>
                  )}

                  <div className="border-b pb-2">
                    <p className="font-medium">Guests</p>
                    <p className="text-gray-600">
                      {guests.adults} Adults{guests.children > 0 && `, ${guests.children} Children`}
                    </p>
                  </div>

                  {selectedAccommodation && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Accommodation</p>
                      <p className="text-gray-600">
                        {accommodations.find(a => a.id.toString() === selectedAccommodation)?.title}
                        {selectedRooms > 1 && ` (${selectedRooms} rooms)`}
                      </p>
                      {dateRange?.from && dateRange?.to && (
                        <p className="text-sm text-green-700">
                          {formatCurrency(accommodations.find(a => a.id.toString() === selectedAccommodation)?.price || 0)} × {selectedRooms} × {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights
                        </p>
                      )}
                    </div>
                  )}

                  {selectedMealPlan && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Meal Plan</p>
                      <p className="text-gray-600">
                        {mealPlans.find(m => m.id.toString() === selectedMealPlan)?.title}
                      </p>
                      {dateRange?.from && dateRange?.to && (
                        <p className="text-sm text-green-700">
                          {formatCurrency(mealPlans.find(m => m.id.toString() === selectedMealPlan)?.price || 0)} × {guests.adults + guests.children} × {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      )}
                    </div>
                  )}

                  {selectedActivities.length > 0 && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Activities</p>
                      <div className="space-y-1">
                        {selectedActivities.map(id => {
                          const activity = activities.find(a => a.id === id);
                          return (
                            <div key={id} className="text-sm">
                              <span className="text-gray-700">{activity?.title}</span>
                              <span className="text-green-700 ml-2">
                                {formatCurrency(activity?.price || 0)} × {guests.adults + guests.children}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Coupon Section */}
                  <div className="border-b pb-4">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                      <Button
                        onClick={handleCouponApply}
                        disabled={couponLoading || !coupon.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {couponLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    
                    <div className="relative min-h-[32px]">
                      <SparkleBurst show={showCouponSuccess} />
                      <AnimatePresence>
                        {showCouponSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="flex items-center text-green-600 text-sm relative"
                          >
                            <Check size={16} className="mr-1" />
                            Coupon applied successfully!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-{formatCurrency(calculateSubtotal() * (discount / 100))}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xl font-bold text-green-800 pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <Button
                    onClick={handleBookingSubmit}
                    disabled={bookingLoading || availabilityLoading || !selectedAccommodation || !dateRange?.from || !dateRange?.to || !guestInfo.name || !guestInfo.email}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Processing...
                      </>
                    ) : availabilityLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Checking Availability...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2" size={20} />
                        Book Now & Pay
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    You will be redirected to PayU for secure payment processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-lg p-8 max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                {bookingId && (
                  <p className="text-sm text-gray-500 mb-6">
                    Booking ID: #{bookingId}
                  </p>
                )}
                <Button
                  onClick={() => {
                    setBookingSuccess(false);
                    // Reset form or redirecta
                    window.location.href = '/';
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Book;