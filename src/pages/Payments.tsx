// PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar, User, Mail, Phone, Download, Home, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const API_BASE_URL = 'http://localhost:5000/api';

interface BookingDetails {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  accommodation_title: string;
  accommodation_price: number;
  meal_plan_title?: string;
  meal_plan_price?: number;
  rooms: number;
  total_amount: number;
  payment_id: string;
  status: string;
  activities?: Array<{
    id: number;
    title: string;
    price: number;
  }>;
}

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const txnid = searchParams.get('txnid');
  const payuMoneyId = searchParams.get('payuMoneyId');
  const status = searchParams.get('status');

  useEffect(() => {
    document.title = 'Payment Successful - Plumeria Retreat';
    
    if (txnid && status === 'success') {
      fetchBookingDetails();
    } else {
      setError('Invalid payment confirmation');
      setLoading(false);
    }
  }, [txnid, status]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/status/${txnid}`);
      const paymentData = await response.json();
      
      if (paymentData.booking_id) {
        const bookingResponse = await fetch(`${API_BASE_URL}/bookings/${paymentData.booking_id}`);
        const bookingData = await bookingResponse.json();
        setBooking(bookingData);
      } else {
        setError('Booking details not found');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const downloadReceipt = () => {
    if (!booking) return;
    
    const receiptContent = `
      PLUMERIA RETREAT - BOOKING CONFIRMATION
      =====================================
      
      Booking ID: #${booking.id}
      Payment ID: ${booking.payment_id}
      Date: ${new Date().toLocaleDateString()}
      
      GUEST DETAILS:
      Name: ${booking.guest_name}
      Email: ${booking.guest_email}
      Phone: ${booking.guest_phone}
      
      BOOKING DETAILS:
      Check-in: ${format(new Date(booking.check_in_date), 'PPP')}
      Check-out: ${format(new Date(booking.check_out_date), 'PPP')}
      Nights: ${calculateNights(booking.check_in_date, booking.check_out_date)}
      
      Accommodation: ${booking.accommodation_title}
      Rooms: ${booking.rooms}
      Guests: ${booking.adults} Adults, ${booking.children} Children
      
      ${booking.meal_plan_title ? `Meal Plan: ${booking.meal_plan_title}` : ''}
      
      TOTAL AMOUNT: ${formatCurrency(booking.total_amount)}
      
      Thank you for choosing Plumeria Retreat!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Plumeria-Retreat-Receipt-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')} className="bg-green-600 text-white hover:bg-green-700">
              <Home className="mr-2" size={20} />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Your booking has been confirmed</p>
        </motion.div>

        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Booking Details */}
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold text-green-800 mb-6">Booking Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Receipt className="text-green-600 mt-1 mr-3" size={20} />
                    <div>
                      <p className="font-semibold">Booking ID</p>
                      <p className="text-gray-600">#{booking.id}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="text-green-600 mt-1 mr-3" size={20} />
                    <div>
                      <p className="font-semibold">Stay Dates</p>
                      <p className="text-gray-600">
                        {format(new Date(booking.check_in_date), 'PPP')} - {format(new Date(booking.check_out_date), 'PPP')}
                      </p>
                      <p className="text-sm text-green-700">
                        {calculateNights(booking.check_in_date, booking.check_out_date)} nights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="text-green-600 mt-1 mr-3" size={20} />
                    <div>
                      <p className="font-semibold">Guests</p>
                      <p className="text-gray-600">
                        {booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Accommodation</h3>
                    <p className="text-gray-600">{booking.accommodation_title}</p>
                    <p className="text-sm text-green-700">{booking.rooms} room(s)</p>
                  </div>

                  {booking.meal_plan_title && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Meal Plan</h3>
                      <p className="text-gray-600">{booking.meal_plan_title}</p>
                    </div>
                  )}

                  {booking.activities && booking.activities.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Activities</h3>
                      <ul className="space-y-1">
                        {booking.activities.map((activity) => (
                          <li key={activity.id} className="text-gray-600 text-sm">
                            {activity.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-green-800">
                      <span>Total Paid</span>
                      <span>{formatCurrency(booking.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information & Actions */}
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <h2 className="text-2xl font-bold text-green-800 mb-6">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="text-green-600 mt-1 mr-3" size={20} />
                      <div>
                        <p className="font-semibold">Guest Name</p>
                        <p className="text-gray-600">{booking.guest_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="text-green-600 mt-1 mr-3" size={20} />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-gray-600">{booking.guest_email}</p>
                      </div>
                    </div>

                    {booking.guest_phone && (
                      <div className="flex items-start">
                        <Phone className="text-green-600 mt-1 mr-3" size={20} />
                        <div>
                          <p className="font-semibold">Phone</p>
                          <p className="text-gray-600">{booking.guest_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold text-green-800 mb-4">What's Next?</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>✓ A confirmation email has been sent to {booking.guest_email}</p>
                    <p>✓ Your booking is confirmed and payment processed</p>
                    <p>✓ Check-in time: 3:00 PM on your arrival date</p>
                    <p>✓ Check-out time: 11:00 AM on your departure date</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={downloadReceipt}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <Download className="mr-2" size={20} />
                  Download Receipt
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Home className="mr-2" size={20} />
                  Return to Home
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// PaymentFailure.tsx
const Failure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const error = searchParams.get('error');
  const txnid = searchParams.get('txnid');

  useEffect(() => {
    document.title = 'Payment Failed - Plumeria Retreat';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-3xl">✕</span>
            </div>
            
            <h1 className="text-3xl font-bold text-red-800 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Your booking has not been confirmed.
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">Error: {error}</p>
              </div>
            )}
            
            {txnid && (
              <p className="text-sm text-gray-500 mb-6">
                Transaction ID: {txnid}
              </p>
            )}
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/book')}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                Try Again
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Home className="mr-2" size={20} />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// PaymentCancel.tsx
const Cancel: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Payment Cancelled - Plumeria Retreat';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-yellow-600 text-3xl">⚠</span>
            </div>
            
            <h1 className="text-3xl font-bold text-yellow-800 mb-4">Payment Cancelled</h1>
            <p className="text-gray-600 mb-6">
              You have cancelled the payment process. Your booking has not been completed.
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              No charges have been made to your payment method.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/book')}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                Continue Booking
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Home className="mr-2" size={20} />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export { Success, Failure, Cancel };