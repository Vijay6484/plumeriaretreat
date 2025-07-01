import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, RotateCw, Phone, MessageCircle } from 'lucide-react';

const PaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get('booking_id');
  const reason = searchParams.get('reason') || 'payment_failed';
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reasonMessages: Record<string, string> = {
    payment_failed: 'Payment was declined by your bank or payment gateway',
    verification_failed: 'Payment could not be verified with our system',
    server_error: 'Technical issue occurred during payment processing',
    connection_error: 'Network connection interrupted during payment',
    default: 'Payment processing failed unexpectedly'
  };

  const handleRetry = async () => {
    if (!bookingId) return;
    
    setRetrying(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://a.plumeriaretreat.com/admin/bookings/${bookingId}/retry-payment`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to prepare payment retry');
      }

      // Create payment form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.payu_url;

      Object.entries(data.payment_data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value); // ✅ Convert to string
        form.appendChild(input);
    });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error('Retry error:', err);
      setError(err.message || 'Failed to retry payment');
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 text-center">
            <XCircle className="mx-auto h-16 w-16 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">
              Payment Not Completed
            </h1>
            <p className="text-white/90 mt-2">
              We couldn't process your payment
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full inline-block mb-4">
                {reasonMessages[reason] || reasonMessages.default}
              </div>
              
              {bookingId && (
                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                  <p className="font-medium">Booking Reference:</p>
                  <p className="font-mono text-lg">{bookingId}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                  <RotateCw className="mr-2" size={20} />
                  Try Payment Again
                </h3>
                <p className="text-orange-700 mb-4">
                  You can securely retry your payment now
                </p>
                
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className={`w-full py-3 rounded-lg flex items-center justify-center ${
                    retrying 
                      ? 'bg-gray-500 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {retrying ? (
                    <>
                      <span className="animate-spin mr-2">↻</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <RotateCw className="mr-2" size={18} />
                      Retry Payment Now
                    </>
                  )}
                </button>
                
                {error && (
                  <p className="text-red-500 mt-3 text-center">
                    {error} - Please contact support if problem persists
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <Phone className="mr-2" size={20} />
                  Get Help
                </h3>
                <p className="text-blue-700 mb-4">
                  Our support team is ready to assist you
                </p>
                
                <div className="space-y-3">
                  <a
                    href="tel:+919226869678"
                    className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    <Phone className="mr-2" size={18} />
                    Call +91 9226869678
                  </a>
                  
                  <a
                    href="https://wa.me/919226869678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2" size={18} />
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 p-4 rounded-lg border-t-4 border-gray-300">
              <h4 className="font-semibold text-gray-800 mb-2">Common reasons for payment failure:</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Insufficient funds in your account</li>
                <li>Incorrect card details entered</li>
                <li>Bank declining the transaction</li>
                <li>Network connectivity issues</li>
                <li>Technical errors during processing</li>
              </ul>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600">
          <p>Plumeria Retreat • Lakeside Drive, Nature Valley • campatpawna@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;