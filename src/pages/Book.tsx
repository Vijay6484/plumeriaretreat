import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { accommodations, mealPlans, activities } from '../data';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Book: React.FC = () => {
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  // const [selectedMealPlan, setSelectedMealPlan] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

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

  const calculateTotal = () => {
    let total = 0;
    
    // Add accommodation cost
    const accommodation = accommodations.find(a => a.id.toString() === selectedAccommodation);
    if (accommodation) {
      total += accommodation.price;
    }
    
    // Add meal plan cost
    // const mealPlan = mealPlans.find(m => m.id.toString() === selectedMealPlan);
    // if (mealPlan) {
    //   total += mealPlan.price * (guests.adults + guests.children);
    // }
    
    // Add activities cost
    selectedActivities.forEach(activityId => {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        total += activity.price * (guests.adults + guests.children);
      }
    });
    
    return total;
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
            {/* Dates and Guests */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4 text-brunswick-green">Dates & Guests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={dates.checkIn}
                      onChange={(e) => setDates(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={dates.checkOut}
                      onChange={(e) => setDates(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                    />
                  </div>
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
                      onClick={() => setSelectedAccommodation(accommodation.id.toString())}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{accommodation.title}</h3>
                          <p className="text-black/70">{accommodation.description}</p>
                        </div>
                        <p className="font-bold text-brunswick-green">
                          {formatCurrency(accommodation.price)}
                          <span className="text-black/60 font-normal text-sm"> / night</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan Selection */}
            {/* <Card>
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
            </Card> */}

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
                  <div className="flex justify-between items-center pb-4 border-b">
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