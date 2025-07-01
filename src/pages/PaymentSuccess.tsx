import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get('booking_id');
  const [verifying, setVerifying] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Verify payment and get booking details
  useEffect(() => {
    const verifyPayment = async () => {
      if (!bookingId) {
        navigate('/');
        return;
      }

      try {
        // 1. Verify payment status with backend
        const verifyRes = await fetch(
          `https://a.plumeriaretreat.com/admin/bookings/${bookingId}/verify`
        );
        
        if (!verifyRes.ok) {
          throw new Error('Payment verification failed');
        }

        const verifyData = await verifyRes.json();
        
        if (!verifyData.verified) {
          navigate(`/payment/failure?booking_id=${bookingId}&reason=verification_failed`);
          return;
        }

        // 2. Get booking details
        const bookingRes = await fetch(
          `https://a.plumeriaretreat.com/admin/bookings/${bookingId}`
        );
        
        if (!bookingRes.ok) {
          throw new Error('Failed to load booking details');
        }

        const bookingData = await bookingRes.json();
        setBooking(bookingData);

        // 3. Send confirmation email
        try {
          await fetch('https://a.plumeriaretreat.com/admin/bookings/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking_id: bookingId })
          });
          setEmailSent(true);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Payment verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [bookingId, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Verifying your payment...
          </h2>
          <p className="mt-2 text-gray-500">
            Please wait while we confirm your payment details
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">
            {error} - Please contact support with your booking ID
          </p>
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="font-medium">Booking Reference:</p>
            <p className="font-mono text-lg">{bookingId || 'N/A'}</p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 mr-3"
          >
            Contact Support
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">
              Payment Successful!
            </h1>
            <p className="text-white/90 mt-2">
              Your booking at Plumeria Retreat is confirmed
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Booking Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium">{booking?.id || bookingId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accommodation</span>
                    <span className="font-medium text-green-700">
                      {booking?.accommodation_name || 'Plumeria Retreat'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">{booking?.check_in}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">{booking?.check_out}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-medium">
                      {booking?.adults} Adults, {booking?.children} Children
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(booking?.advance_amount || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">
                      {formatCurrency(booking?.total_amount || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Balance</span>
                    <span className="font-medium">
                      {formatCurrency((booking?.total_amount || 0) - (booking?.advance_amount || 0))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-green-800">
                    {emailSent
                      ? "A confirmation email has been sent to your inbox with all booking details."
                      : "Your booking is confirmed! Please check your email shortly for confirmation details."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 p-8 border-t">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What to do next
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-800 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-800">Save your booking</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Keep this confirmation for your records
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-800 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-800">Prepare for your stay</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Check the "Things to Carry" list
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-800 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-800">Get directions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Save our location for easy navigation
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Return to Homepage
              </button>
              
              <a
                href="https://maps.google.com/?q=Plumeria+Retreat+Pawna+Lakeside+Cottages"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Get Directions
              </a>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600">
          <p>Need help? Contact us at +91 9226869678 or campatpawna@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;