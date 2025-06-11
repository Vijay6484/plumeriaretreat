import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
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
import { accommodations } from '../data';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent, CardImage } from '../components/ui/Card';
import Button from '../components/ui/Button';
import 'react-day-picker/dist/style.css';

const CampsiteBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const found = accommodations.find(acc => acc.id === parseInt(id));
      if (found) {
        setAccommodation(found);
        document.title = `${found.title} - Plumeria Retreat`;
      } else {
        navigate('/campsites');
      }
    }
  }, [id, navigate]);

  const calculateTotal = () => {
    if (!accommodation || !dateRange?.from || !dateRange?.to) return 0;
    const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return accommodation.price * rooms * nights;
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
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={accommodation.image} 
          alt={accommodation.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{accommodation.title}</h1>
              <p className="text-xl md:text-2xl opacity-90">{accommodation.description}</p>
              <div className="flex items-center mt-4 space-x-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  {accommodation.type}
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Up to {accommodation.capacity} guests
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
                    {accommodation.detailedInfo.meals.included && (
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
                    </div>
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

                  {/* Guests and Rooms */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                      <input
                        type="number"
                        min="1"
                        max={accommodation.availableRooms}
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
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
                    <span className="font-medium">Guests</span>
                    <span className="text-gray-600">
                      {guests.adults} Adults{guests.children > 0 && `, ${guests.children} Children`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Rooms</span>
                    <span className="text-gray-600">{rooms}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-green-800">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleBooking}
                    disabled={loading || !dateRange?.from || !dateRange?.to || !guestInfo.name || !guestInfo.email}
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
                    Secure booking with instant confirmation
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