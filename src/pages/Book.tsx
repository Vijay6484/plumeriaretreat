import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Sparkles, Calendar, Clock, Loader2, Check, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const API_BASE_URL = 'http://localhost:5000/api';

interface BookingSummary {
  accommodation?: {
    title: string;
    price: number;
    rooms: number;
  };
  mealPlan?: {
    title: string;
    price: number;
  };
  activities: {
    title: string;
    price: number;
  }[];
  dates: DateRange | undefined;
  guests: {
    adults: number;
    children: number;
  };
}

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

const Book: React.FC = () => {
  // State for data from backend
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
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
  const [error, setError] = useState('');
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
      const [accommodationsRes, mealPlansRes, activitiesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/accommodations`),
        fetch(`${API_BASE_URL}/meal-plans`),
        fetch(`${API_BASE_URL}/activities`)
      ]);

      if (!accommodationsRes.ok || !mealPlansRes.ok || !activitiesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [accommodationsData, mealPlansData, activitiesData] = await Promise.all([
        accommodationsRes.json(),
        mealPlansRes.json(),
        activitiesRes.json()
      ]);

      setAccommodations(accommodationsData);
      setMealPlans(mealPlansData);
      setActivities(activitiesData);
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
        setDiscount(result.discount);
        setShowCouponSuccess(true);
        setTimeout(() => setShowCouponSuccess(false), 3000);
      } else {
        setError('Invalid or expired coupon code');
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
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodation_id: selectedAccommodation,
          check_in_date: format(dateRange.from, 'yyyy-MM-dd'),
          check_out_date: format(dateRange.to, 'yyyy-MM-dd'),
          rooms: selectedRooms
        }),
      });

      const result = await response.json();
      return result.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const handleBookingSubmit = async () => {
    if (!guestInfo.name || !guestInfo.email || !dateRange?.from || !dateRange?.to || !selectedAccommodation) {
      setError('Please fill in all required fields');
      return;
    }

    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      setError('Selected accommodation is not available for the chosen dates');
      return;
    }

    try {
      setBookingLoading(true);
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
        setBookingSuccess(true);
        setBookingId(result.booking_id);
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

  const calculateTotal = () => {
    let total = 0;
    
    const accommodation = accommodations.find(a => a.id.toString() === selectedAccommodation);
    if (accommodation) {
      total += accommodation.price * selectedRooms;
    }
    
    const mealPlan = mealPlans.find(m => m.id.toString() === selectedMealPlan);
    if (mealPlan) {
      total += mealPlan.price * (guests.adults + guests.children);
    }
    
    selectedActivities.forEach(activityId => {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        total += activity.price * (guests.adults + guests.children);
      }
    });

    if (discount > 0) {
      total = total * (1 - discount / 100);
    }
    
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-baby-powder flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-brunswick-green" size={48} />
          <p className="text-brunswick-green">Loading booking options...</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-baby-powder flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center">
            <Check className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-brunswick-green mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your booking has been successfully created. Booking ID: <strong>#{bookingId}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to {guestInfo.email}
            </p>
            <Button 
              variant="primary" 
              onClick={() => window.location.href = '/'}
              fullWidth
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-baby-powder">
      <div className="h-[40vh] bg-brunswick-green relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        ></div>
        <div className="container-custom h-full flex items-center relative z-10">
          <div className="text-baby-powder">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Stay</h1>
            <p className="text-xl opacity-90">Plan your perfect getaway</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Guest Information */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Guest Information</h2>
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar and Check-in/out Times */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Select Dates</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      fromDate={new Date()}
                      toDate={addDays(new Date(), 365)}
                      className="mx-auto"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-brunswick-green/5 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 text-brunswick-green">Check-in/out Times</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Clock className="text-brunswick-green mt-1 mr-2" size={20} />
                          <div>
                            <p className="font-medium">Check-in Time</p>
                            <p className="text-black/70">3:00 PM on arrival day</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="text-brunswick-green mt-1 mr-2" size={20} />
                          <div>
                            <p className="font-medium">Check-out Time</p>
                            <p className="text-black/70">11:00 AM on departure day</p>
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
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Number of Guests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={guests.adults}
                      onChange={(e) => setGuests(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                    <input
                      type="number"
                      min="0"
                      value={guests.children}
                      onChange={(e) => setGuests(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Selection */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Select Accommodation</h2>
                <div className="space-y-4">
                  {accommodations.map((accommodation) => (
                    <div
                      key={accommodation.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedAccommodation === accommodation.id.toString()
                          ? 'border-brunswick-green bg-brunswick-green/5'
                          : 'border-gray-200 hover:border-brunswick-green/50'
                      }`}
                      onClick={() => {
                        setSelectedAccommodation(accommodation.id.toString());
                        setSelectedRooms(1);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{accommodation.title}</h3>
                          <p className="text-black/70 mb-2">{accommodation.description}</p>
                          {accommodation.amenities && accommodation.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {accommodation.amenities.map((amenity, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-brunswick-green/10 text-brunswick-green text-xs rounded-full"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-brunswick-green">
                            {accommodation.available_rooms} rooms available
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brunswick-green text-lg">
                            {formatCurrency(accommodation.price)}
                          </p>
                          <span className="text-black/60 text-sm">per night</span>
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
                            onChange={(e) => setSelectedRooms(parseInt(e.target.value))}
                            className="w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
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
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Select Meal Plan</h2>
                <div className="space-y-4">
                  {mealPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedMealPlan === plan.id.toString()
                          ? 'border-brunswick-green bg-brunswick-green/5'
                          : 'border-gray-200 hover:border-brunswick-green/50'
                      }`}
                      onClick={() => setSelectedMealPlan(plan.id.toString())}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{plan.title}</h3>
                          <p className="text-black/70">{plan.description}</p>
                        </div>
                        <p className="font-bold text-brunswick-green">
                          {formatCurrency(plan.price)}
                          <span className="text-black/60 font-normal text-sm"> / person</span>
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
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Add Activities</h2>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedActivities.includes(activity.id)
                          ? 'border-brunswick-green bg-brunswick-green/5'
                          : 'border-gray-200 hover:border-brunswick-green/50'
                      }`}
                      onClick={() => handleActivityToggle(activity.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{activity.title}</h3>
                          <p className="text-black/70">{activity.description}</p>
                          <p className="text-sm text-black/60">Duration: {activity.duration}</p>
                          {activity.max_participants && (
                            <p className="text-sm text-black/60">
                              Max participants: {activity.max_participants}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-brunswick-green">
                          {formatCurrency(activity.price)}
                          <span className="text-black/60 font-normal text-sm"> / person</span>
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
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Booking Summary</h2>
                <div className="space-y-4">
                  {/* Summary Details */}
                  {dateRange?.from && dateRange?.to && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Dates</p>
                      <p className="text-black/70">
                        {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-brunswick-green mt-1">
                        Check-in: 3:00 PM | Check-out: 11:00 AM
                      </p>
                    </div>
                  )}

                  {(guests.adults > 0 || guests.children > 0) && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Guests</p>
                      <p className="text-black/70">
                        {guests.adults} Adults, {guests.children} Children
                      </p>
                    </div>
                  )}

                  {selectedAccommodation && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Accommodation</p>
                      <p className="text-black/70">
                        {accommodations.find(a => a.id.toString() === selectedAccommodation)?.title}
                        {selectedRooms > 1 && ` (${selectedRooms} rooms)`}
                      </p>
                      <p className="text-sm text-brunswick-green">
                        {formatCurrency(accommodations.find(a => a.id.toString() === selectedAccommodation)?.price || 0)} × {selectedRooms}
                      </p>
                    </div>
                  )}

                  {selectedMealPlan && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Meal Plan</p>
                      <p className="text-black/70">
                        {mealPlans.find(m => m.id.toString() === selectedMealPlan)?.title}
                      </p>
                      <p className="text-sm text-brunswick-green">
                        {formatCurrency(mealPlans.find(m => m.id.toString() === selectedMealPlan)?.price || 0)} × {guests.adults + guests.children} guests
                      </p>
                    </div>
                  )}

                  {selectedActivities.length > 0 && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Activities</p>
                      <div className="space-y-1">
                        {selectedActivities.map(id => {
                          const activity = activities.find(a => a.id === id);
                          return (
                            <div key={id}>
                              <p className="text-black/70">{activity?.title}</p>
                              <p className="text-sm text-brunswick-green">
                                {formatCurrency(activity?.price || 0)} × {guests.adults + guests.children} guests
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Coupon Input */}
                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                      />
                      <Button
                        variant="primary"
                        onClick={handleCouponApply}
                        disabled={couponLoading || !coupon.trim()}
                      >
                        {couponLoading ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                      </Button>
                    </div>
                  </div>

                  {/* Coupon Success Animation */}
                  <AnimatePresence>
                    {showCouponSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-center text-brunswick-green"
                      >
                        <Sparkles className="mr-2" />
                        <span>Coupon applied! {discount}% discount</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Discount Display */}
                  {discount > 0 && (
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Discount ({discount}%)</span>
                        <span className="text-sm text-green-600">
                          -{formatCurrency((calculateTotal() / (1 - discount / 100)) * (discount / 100))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-brunswick-green">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    onClick={handleBookingSubmit}
                    disabled={bookingLoading || !guestInfo.name || !guestInfo.email || !dateRange?.from || !dateRange?.to || !selectedAccommodation}
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>

                  <p className="text-sm text-black/60 text-center">
                    By clicking "Confirm Booking" you agree to our terms and conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;