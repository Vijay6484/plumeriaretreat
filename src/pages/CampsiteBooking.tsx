import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, differenceInDays } from 'date-fns';
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
  Activity,
  Music
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import 'react-day-picker/dist/style.css';

interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  rooms: number;
  available: boolean;
  features: string[];
  images: string[];
  amenity_ids: string[];
  address: string;
  latitude: number;
  longitude: number;
  package?: {
    name?: string;
    description?: string;
    images?: string[];
    pricing?: {
      adult?: number;
      child?: number;
      maxGuests?: number;
    };
  };
}

const API_BASE_URL = 'https://a.plumeriaretreat.com';

const MAX_ROOMS = 4;
const MAX_ADULTS_PER_ROOM = 2;
const MAX_CHILDREN_PER_ROOM = 2;
const MAX_PEOPLE_PER_ROOM = MAX_ADULTS_PER_ROOM + MAX_CHILDREN_PER_ROOM;
const PARTIAL_PAYMENT_MIN_PERCENT = 0.3; // 30%

const CampsiteBooking: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const accommodationId = Number(id);

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [rooms, setRooms] = useState(1);
  const [roomGuests, setRoomGuests] = useState(
    Array.from({ length: MAX_ROOMS }, () => ({ adults: 2, children: 0 }))
  );
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancePercent, setAdvancePercent] = useState(PARTIAL_PAYMENT_MIN_PERCENT);
  const [advanceAmount, setAdvanceAmount] = useState<number | null>(null);

  const hasFetchedRef = useRef(false);

  const parseStringToArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
      } catch {
        return value.split(',').map((item: string) => item.trim());
      }
    }
    return [String(value)];
  };

  const fetchAccommodation = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/properties/accommodations`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      const data = responseData.data || [];

      const foundAccommodation = data.find((item: any) => item.id === accommodationId);
      
      if (!foundAccommodation) {
        throw new Error('Accommodation not found');
      }

      const mapped: Accommodation = {
        id: foundAccommodation.id || 0,
        name: foundAccommodation.name || '',
        type: foundAccommodation.type || '',
        description: foundAccommodation.description || '',
        price: parseFloat(foundAccommodation.price) || 0,
        capacity: foundAccommodation.capacity || 0,
        rooms: foundAccommodation.rooms || 0,
        available: Boolean(foundAccommodation.available),
        features: parseStringToArray(foundAccommodation.features),
        images: foundAccommodation.package?.images?.length > 0
          ? parseStringToArray(foundAccommodation.package.images)
          : parseStringToArray(foundAccommodation.images),
        amenity_ids: parseStringToArray(foundAccommodation.amenity_ids),
        address: foundAccommodation.address || '',
        latitude: parseFloat(foundAccommodation.latitude) || 0,
        longitude: parseFloat(foundAccommodation.longitude) || 0,
        package: foundAccommodation.package || undefined,
      };

      setAccommodation(mapped);
      setError(null);
      document.title = `${mapped.name} - Plumeria Retreat`;
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load accommodation details. Please try again later.');
    } finally {
      setFetchLoading(false);
    }
  }, [accommodationId]);

  useEffect(() => {
    if (!hasFetchedRef.current && accommodationId) {
      fetchAccommodation();
      hasFetchedRef.current = true;
    }
  }, [fetchAccommodation, accommodationId]);

  // Calculate total price based on rooms, guests, and dates
  const totalAdults = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomGuests.slice(0, rooms).reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;

  const calculateTotal = () => {
    if (!accommodation || !dateRange?.from || !dateRange?.to) return 0;
    
    const nights = differenceInDays(dateRange.to, dateRange.from);
    if (nights <= 0) return 0;

    const ADULT_RATE = accommodation.price;
    const CHILD_RATE = Math.round(ADULT_RATE * 0.5);
    
    const adultsTotal = totalAdults * ADULT_RATE * nights;
    const childrenTotal = totalChildren * CHILD_RATE * nights;
    
    return adultsTotal + childrenTotal;
  };

  const totalAmount = calculateTotal();
  const minAdvance = Math.round(totalAmount * PARTIAL_PAYMENT_MIN_PERCENT);

  // Update advanceAmount when totalAmount changes
  useEffect(() => {
    setAdvanceAmount(minAdvance);
  }, [totalAmount]);

  const handleBooking = async () => {
    if (!guestInfo.name || !guestInfo.email || !dateRange?.from || !dateRange?.to) {
      alert('Please fill in all required fields');
      return;
    }

    if (!accommodation) {
      alert('Accommodation details not loaded');
      return;
    }

    setLoading(true);

    try {
      // 1. Create booking
      const bookingRes = await fetch(`${API_BASE_URL}/admin/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accommodation_id: accommodation.id,
          guest_name: guestInfo.name,
          guest_email: guestInfo.email,
          guest_phone: guestInfo.phone,
          rooms,
          adults: totalAdults,
          children: totalChildren,
          check_in: format(dateRange.from, 'yyyy-MM-dd'),
          check_out: format(dateRange.to, 'yyyy-MM-dd'),
          total_amount: totalAmount,
          advance_amount: advanceAmount
        })
      });

      if (!bookingRes.ok) {
        throw new Error('Failed to create booking');
      }

      const bookingData = await bookingRes.json();

      if (!bookingData.success) {
        throw new Error(bookingData.message || 'Booking failed');
      }

      // 2. Initiate PayU payment
      const payuRes = await fetch(`${API_BASE_URL}/admin/payments/payu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: advanceAmount,
          firstname: guestInfo.name,
          email: guestInfo.email,
          phone: guestInfo.phone,
          productinfo: accommodation.name,
          booking_id: bookingData.booking_id,
          surl: window.location.origin + '/payment/success/' + bookingData.booking_id,
          furl: window.location.origin + '/payment/failed/' + bookingData.booking_id
        })
      });

      if (!payuRes.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { payu_url, payuData } = await payuRes.json();

      // 3. Submit PayU form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payu_url;
      Object.entries(payuData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Booking error:', err);
      alert(err instanceof Error ? err.message : 'Booking failed. Please try again.');
      setLoading(false);
    }
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

  // Handle rooms change
  const handleRoomsChange = (newRooms: number) => {
    setRooms(newRooms);
    setRoomGuests(prev => {
      const updated = [...prev];
      // Add default rooms if needed
      while (updated.length < MAX_ROOMS) updated.push({ adults: 2, children: 0 });
      return updated;
    });
  };

  // Handle advance amount change
  const handleAdvanceChange = (val: number) => {
    if (val === minAdvance || val === totalAmount) {
      setAdvanceAmount(val);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Accommodation</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button variant="primary" onClick={() => navigate('/campsites')}>
            Back to Campsites
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {accommodation.images.length > 0 ? (
          <img 
            src={accommodation.images[0]} 
            alt={accommodation.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{accommodation.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center">
                  <Bed className="mr-2" size={16} />
                  {accommodation.type}
                </span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center">
                  <Users className="mr-2" size={16} />
                  Up to {accommodation.capacity} guests
                </span>
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center">
                  <Star className="mr-2" size={16} />
                  Premium
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
                
                <div className="space-y-6">
                  {/* Accommodation Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Bed className="text-green-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-green-800">Type</h3>
                      <p className="text-green-700">{accommodation.type}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Users className="text-blue-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-blue-800">Capacity</h3>
                      <p className="text-blue-700">{accommodation.capacity} People</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Star className="text-purple-600 mx-auto mb-2" size={24} />
                      <h3 className="font-semibold text-purple-800">Rooms Available</h3>
                      <p className="text-purple-700">{accommodation.rooms}</p>
                    </div>
                  </div>

                  {/* Live Music Banner */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
                    <div className="flex items-center justify-center mb-4">
                      <Music className="mr-3" size={32} />
                      <h3 className="text-2xl font-bold">🎸 EVERY SATURDAY LIVE MUSIC GUITARIST 🎸</h3>
                    </div>
                    <p className="text-center text-lg">
                      Enjoy live acoustic performances every Saturday evening by the lakeside!
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-800">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{accommodation.description}</p>
                  </div>

                  {/* Features */}
                  {accommodation.features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                        <CheckCircle className="mr-2" size={20} />
                        Features & Amenities
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {accommodation.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardContent>
                <h2 className="text-3xl font-bold text-green-800 mb-6">Book This Accommodation</h2>
                
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
                          fromDate={new Date()}
                          toDate={addDays(new Date(), 365)}
                          className="mx-auto"
                        />
                      </div>
                      <div className="lg:w-64">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <Calendar className="mr-2" size={16} />
                            Selected Dates
                          </h4>
                          <div className="space-y-2 text-sm">
                            {dateRange?.from && (
                              <>
                                <p><strong>Check-in:</strong> {format(dateRange.from, 'PPP')}</p>
                                {dateRange.to && (
                                  <>
                                    <p><strong>Check-out:</strong> {format(dateRange.to, 'PPP')}</p>
                                    <p><strong>Nights:</strong> {differenceInDays(dateRange.to, dateRange.from)}</p>
                                  </>
                                )}
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
                        onClick={() => handleRoomsChange(Math.min(MAX_ROOMS, rooms + 1))}
                        disabled={rooms >= MAX_ROOMS}
                        className="px-3 py-1 bg-green-700 text-white rounded"
                      >+</Button>
                      <span className="text-xs text-gray-500">{MAX_ROOMS - rooms} rooms remaining</span>
                    </div>
                    <div className="border rounded p-2 bg-gray-50">
                      {Array.from({ length: rooms }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-4 mb-2">
                          <span className="w-16 font-medium">Room {idx + 1}</span>
                          <select
                            value={roomGuests[idx].adults}
                            onChange={e => handleRoomGuestChange(idx, 'adults', Number(e.target.value))}
                            className="border rounded px-2 py-1"
                          >
                            {[...Array(MAX_PEOPLE_PER_ROOM + 1).keys()].map(n => (
                              n + roomGuests[idx].children <= MAX_PEOPLE_PER_ROOM &&
                              <option key={n} value={n}>{n} Adults</option>
                            ))}
                          </select>
                          <select
                            value={roomGuests[idx].children}
                            onChange={e => handleRoomGuestChange(idx, 'children', Number(e.target.value))}
                            className="border rounded px-2 py-1"
                          >
                            {[...Array(MAX_PEOPLE_PER_ROOM + 1).keys()].map(n => (
                              n + roomGuests[idx].adults <= MAX_PEOPLE_PER_ROOM &&
                              <option key={n} value={n}>{n} Children</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Total:</span> {totalAdults} Adults, {totalChildren} Children
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
                <h3 className="text-2xl font-bold text-green-800 mb-6">Booking Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Accommodation</span>
                    <span className="text-green-600">{accommodation.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rooms</span>
                    <span className="text-gray-600">{rooms}</span>
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
                          {differenceInDays(dateRange.to, dateRange.from)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Guests</span>
                    <span className="text-gray-600">
                      {totalAdults} Adults{totalChildren > 0 && `, ${totalChildren} Children`}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advance to Pay Now
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={advanceAmount ?? minAdvance}
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
                      <span>Total Price</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-blue-700 mt-2">
                      <span>Advance</span>
                      <span>{formatCurrency(advanceAmount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Pay at property</span>
                      <span>{formatCurrency(totalAmount - (advanceAmount ?? 0))}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">All inclusive price</p>
                  </div>
                  
                  <Button
                    onClick={handleBooking}
                    disabled={
                      loading ||
                      !dateRange?.from ||
                      !dateRange?.to ||
                      !guestInfo.name ||
                      !guestInfo.email ||
                      !advanceAmount ||
                      (advanceAmount !== minAdvance && advanceAmount !== totalAmount)
                    }
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
                    Secure booking with instant confirmation.<br />
                    Pay {formatCurrency(advanceAmount ?? 0)} now, and the rest at the property.
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
                    <span>+91 9226869678</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-green-600 mr-2" size={16} />
                    <span>campatpawna@gmail.com</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="text-green-600 mr-2 mt-1" size={16} />
                    <span>Plumeria Retreat, Pawna Lake, Maharashtra</span>
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