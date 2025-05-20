import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { accommodations, mealPlans, activities } from '../data';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Sparkles, Calendar, Clock } from 'lucide-react';
import 'react-day-picker/dist/style.css';

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

const Book: React.FC = () => {
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [selectedMealPlan, setSelectedMealPlan] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Book Now - Plumeria Retreat';
  }, []);

  const handleActivityToggle = (activityId: number) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleCouponApply = () => {
    if (coupon.toLowerCase() === 'welcome10') {
      setDiscount(10);
      setShowCouponSuccess(true);
      setTimeout(() => setShowCouponSuccess(false), 3000);
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

  const getBookingSummary = (): BookingSummary => {
    const summary: BookingSummary = {
      dates: dateRange,
      guests,
      activities: [],
    };

    const accommodation = accommodations.find(a => a.id.toString() === selectedAccommodation);
    if (accommodation) {
      summary.accommodation = {
        title: accommodation.title,
        price: accommodation.price,
        rooms: selectedRooms,
      };
    }

    const mealPlan = mealPlans.find(m => m.id.toString() === selectedMealPlan);
    if (mealPlan) {
      summary.mealPlan = {
        title: mealPlan.title,
        price: mealPlan.price,
      };
    }

    selectedActivities.forEach(activityId => {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        summary.activities.push({
          title: activity.title,
          price: activity.price,
        });
      }
    });

    return summary;
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{accommodation.title}</h3>
                          <p className="text-black/70">{accommodation.description}</p>
                          <p className="text-sm text-brunswick-green mt-2">
                            {accommodation.availableRooms} rooms available
                          </p>
                        </div>
                        <p className="font-bold text-brunswick-green">
                          {formatCurrency(accommodation.price)}
                          <span className="text-black/60 font-normal text-sm"> / night</span>
                        </p>
                      </div>
                      {selectedAccommodation === accommodation.id.toString() && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Rooms
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={accommodation.availableRooms}
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
                    </div>
                  )}

                  {selectedMealPlan && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Meal Plan</p>
                      <p className="text-black/70">
                        {mealPlans.find(m => m.id.toString() === selectedMealPlan)?.title}
                      </p>
                    </div>
                  )}

                  {selectedActivities.length > 0 && (
                    <div className="border-b pb-2">
                      <p className="font-medium">Activities</p>
                      <ul className="text-black/70">
                        {selectedActivities.map(id => (
                          <li key={id}>
                            {activities.find(a => a.id === id)?.title}
                          </li>
                        ))}
                      </ul>
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
                      >
                        Apply
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
                        <span>Coupon applied successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Total Amount */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-brunswick-green">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>

                  <Button variant="primary" size="lg" fullWidth>
                    Confirm Booking
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