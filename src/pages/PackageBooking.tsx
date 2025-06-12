import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { 
  Calendar, 
  Users, 
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  CreditCard,
  Star,
  Utensils,
  Bed,
  Activity
} from 'lucide-react';
import { packages } from '../data';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import 'react-day-picker/dist/style.css';

const MIN_ADVANCE_PERCENT = 0.3; // 30% minimum
const MAX_ROOMS = 4;
const VALID_COUPONS: { [key: string]: number } = {
  'PLUM10': 0.10, // 10% off
  'WELCOME5': 0.05 // 5% off
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const PackageBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [foodChoice, setFoodChoice] = useState<'veg' | 'nonveg' | 'jain'>('veg');
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [advancePercent, setAdvancePercent] = useState(MIN_ADVANCE_PERCENT);

  useEffect(() => {
    if (id) {
      const found = packages.find(pkg => pkg.id === parseInt(id));
      if (found) {
        setPackageData(found);
        document.title = `${found.name} - Plumeria Retreat`;
      } else {
        navigate('/packages');
      }
    }
  }, [id, navigate]);

  // Calculate total price based on rooms, guests, and coupon
  const calculateTotal = () => {
    if (!packageData) return 0;
    // Assume package price is for 1 room, 2 guests (adults+children), for the full duration
    // You can adjust this logic as per your pricing model
    const baseGuests = 2;
    const basePrice = packageData.price;
    const extraGuests = Math.max(0, guests.adults + guests.children - baseGuests * rooms);
    const extraGuestCharge = extraGuests > 0 ? extraGuests * 1000 : 0; // Example: ₹1000 per extra guest
    const subtotal = (basePrice * rooms) + extraGuestCharge;
    return subtotal - discount;
  };

  const calculateAdvance = () => {
    return Math.round(calculateTotal() * advancePercent);
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      const subtotal = (() => {
        if (!packageData) return 0;
        const baseGuests = 2;
        const basePrice = packageData.price;
        const extraGuests = Math.max(0, guests.adults + guests.children - baseGuests * rooms);
        const extraGuestCharge = extraGuests > 0 ? extraGuests * 1000 : 0;
        return (basePrice * rooms) + extraGuestCharge;
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
    if (!guestInfo.name || !guestInfo.email || !dateRange?.from) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate booking process
    setTimeout(() => {
      alert('Package booking request submitted! We will contact you shortly.');
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700">Loading package details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={packageData.image_url} 
          alt={packageData.name}
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
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{packageData.name}</h1>
              <p className="text-xl md:text-2xl opacity-90 mb-6">{packageData.description}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center">
                  <Clock className="mr-2" size={16} />
                  {packageData.duration} Days
                </span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center">
                  <Users className="mr-2" size={16} />
                  Up to {packageData.max_guests} guests
                </span>
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center">
                  <Star className="mr-2" size={16} />
                  Premium Package
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
            {/* Package Details */}
            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Package Details</h2>
                
                <div className="space-y-6">
                  {/* Package Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Clock className="text-green-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-green-800">Duration</h3>
                      <p className="text-green-700">{packageData.duration} Days</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Users className="text-blue-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-blue-800">Max Guests</h3>
                      <p className="text-blue-700">{packageData.max_guests} People</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Star className="text-purple-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-purple-800">Package Type</h3>
                      <p className="text-purple-700">Premium</p>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                      <CheckCircle className="mr-2" size={20} />
                      What's Included
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {packageData.includes.map((item: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Information */}
                  {packageData.detailedInfo && (
                    <div className="space-y-6">
                      {/* Accommodation */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                          <Bed className="mr-2" size={20} />
                          Accommodation
                        </h3>
                        <p className="text-gray-700">{packageData.detailedInfo.accommodation}</p>
                      </div>

                      {/* Meals */}
                      <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-orange-800 flex items-center">
                          <Utensils className="mr-2" size={20} />
                          Meals & Dining
                        </h3>
                        <p className="text-orange-700">{packageData.detailedInfo.meals}</p>
                      </div>

                      {/* Activities */}
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                          <Activity className="mr-2" size={20} />
                          Activities Included
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {packageData.detailedInfo.activities.map((activity: string, index: number) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle className="text-blue-600 mr-2" size={16} />
                              <span className="text-blue-700">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Important Information */}
                      <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                        <h3 className="text-xl font-semibold mb-4 text-yellow-800">Important Information</h3>
                        <div className="space-y-2 text-yellow-700">
                          <p><strong>Check-in:</strong> {packageData.detailedInfo.checkIn}</p>
                          <p><strong>Check-out:</strong> {packageData.detailedInfo.checkOut}</p>
                          <p><strong>Cancellation:</strong> {packageData.detailedInfo.cancellation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Book This Package</h2>
                
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
                    <h3 className="text-lg font-semibold mb-4">Select Start Date</h3>
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <DayPicker
                          mode="single"
                          selected={dateRange?.from}
                          onSelect={(date) => setDateRange(date ? { from: date, to: addDays(date, packageData.duration - 1) } : undefined)}
                          fromDate={new Date()}
                          toDate={addDays(new Date(), 365)}
                          className="mx-auto"
                        />
                      </div>
                      <div className="lg:w-64">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <Calendar className="mr-2" size={16} />
                            Package Duration
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Duration:</strong> {packageData.duration} days</p>
                            {dateRange?.from && (
                              <>
                                <p><strong>Start:</strong> {format(dateRange.from, 'PPP')}</p>
                                <p><strong>End:</strong> {format(addDays(dateRange.from, packageData.duration - 1), 'PPP')}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Number of Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <input
                      type="number"
                      min={1}
                      max={MAX_ROOMS}
                      value={rooms}
                      onChange={e => {
                        const newRooms = Math.max(1, Math.min(Number(e.target.value), MAX_ROOMS));
                        setRooms(newRooms);
                        // Optionally reset guests if over new max
                        setGuests(prev => ({
                          adults: Math.min(prev.adults, newRooms * packageData.max_guests),
                          children: Math.min(prev.children, newRooms * packageData.max_guests)
                        }));
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                    <span className="text-xs text-gray-500">Max {MAX_ROOMS} rooms</span>
                  </div>

                  {/* Number of Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <input
                        type="number"
                        min="1"
                        max={rooms * packageData.max_guests}
                        value={guests.adults}
                        onChange={(e) => setGuests(prev => ({ ...prev, adults: Math.max(1, Math.min(Number(e.target.value), rooms * packageData.max_guests)) }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                      <input
                        type="number"
                        min="0"
                        max={rooms * packageData.max_guests}
                        value={guests.children}
                        onChange={(e) => setGuests(prev => ({ ...prev, children: Math.max(0, Math.min(Number(e.target.value), rooms * packageData.max_guests)) }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Food Preference */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Food Preference</h3>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="foodChoice"
                          value="veg"
                          checked={foodChoice === 'veg'}
                          onChange={() => setFoodChoice('veg')}
                          className="accent-green-600"
                        />
                        <span className="ml-2">Veg</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="foodChoice"
                          value="nonveg"
                          checked={foodChoice === 'nonveg'}
                          onChange={() => setFoodChoice('nonveg')}
                          className="accent-green-600"
                        />
                        <span className="ml-2">Non Veg</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="foodChoice"
                          value="jain"
                          checked={foodChoice === 'jain'}
                          onChange={() => setFoodChoice('jain')}
                          className="accent-green-600"
                        />
                        <span className="ml-2">Jain</span>
                      </label>
                    </div>
                  </div>
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
                <h3 className="text-2xl font-bold text-green-800 mb-6">Package Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Package</span>
                    <span className="text-green-600">{packageData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rooms</span>
                    <span className="text-gray-600">{rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration</span>
                    <span className="text-gray-600">{packageData.duration} days</span>
                  </div>
                  {dateRange?.from && (
                    <div className="flex justify-between">
                      <span className="font-medium">Dates</span>
                      <span className="text-gray-600">
                        {format(dateRange.from, 'MMM dd')} - {format(addDays(dateRange.from, packageData.duration - 1), 'MMM dd')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Guests</span>
                    <span className="text-gray-600">
                      {guests.adults} Adults{guests.children > 0 && `, ${guests.children} Children`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Food</span>
                    <span className="text-gray-600 capitalize">{foodChoice}</span>
                  </div>
                  {couponApplied && discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span className="font-medium">Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance to Pay Now
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={MIN_ADVANCE_PERCENT * 100}
                        max={100}
                        step={1}
                        value={advancePercent * 100}
                        onChange={e => setAdvancePercent(Number(e.target.value) / 100)}
                        className="w-full"
                      />
                      <span className="w-16 text-right text-green-700 font-semibold">
                        {Math.round(advancePercent * 100)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Move slider to pay minimum 30% or any higher amount up to 100%.
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-green-800">
                      <span>Total Package Price</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-blue-700 mt-2">
                      <span>Advance ({Math.round(advancePercent * 100)}%)</span>
                      <span>{formatCurrency(calculateAdvance())}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Pay at property</span>
                      <span>{formatCurrency(calculateTotal() - calculateAdvance())}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">All inclusive package price</p>
                  </div>
                  <Button
                    onClick={handleBooking}
                    disabled={loading || !dateRange?.from || !guestInfo.name || !guestInfo.email}
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
                        Book Package
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Secure booking with instant confirmation.<br />
                    Pay {formatCurrency(calculateAdvance())} now, and the rest at the property.
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

export default PackageBooking;