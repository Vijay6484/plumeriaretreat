import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

interface PaymentMessageProps {
  status: 'success' | 'failure' | 'cancel';
  title?: string;
  message?: string;
}

const PaymentMessage: React.FC<PaymentMessageProps> = ({ 
  status, 
  title, 
  message 
}) => {
  const defaultMessages = {
    success: {
      title: 'Payment Successful',
      message: 'Thank you for your payment! Your transaction has been completed successfully.',
    },
    failure: {
      title: 'Payment Failed',
      message: 'Unfortunately, your payment could not be processed. Please try again.',
    },
    cancel: {
      title: 'Payment Cancelled',
      message: 'You have cancelled the payment process. You can try again if you wish.',
    },
  };

  const displayTitle = title || defaultMessages[status].title;
  const displayMessage = message || defaultMessages[status].message;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className={`text-2xl font-bold mb-4 ${
          status === 'success' ? 'text-green-600' : 
          status === 'failure' ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {displayTitle}
        </h1>
        <p className="text-gray-700 mb-6">{displayMessage}</p>
        <Link
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

// Success component with API verification
export const Success: React.FC = () => {
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract transaction ID from query parameters
        const queryParams = new URLSearchParams(location.search);
        const txnid = queryParams.get('txnid');
        
        if (!txnid) {
          throw new Error('Transaction ID not found');
        }

        // Call backend API to verify payment
        const response = await axios.get('/api/bookings/payments/confirm', {
          params: { txnid },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('failed');
          setError(response.data.error || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setVerificationStatus('failed');
        setError(
          (err as any)?.response?.data?.error || 
          (err as Error)?.message || 
          'Failed to verify payment'
        );
      }
    };

    verifyPayment();
  }, [location.search]);

  if (verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mx-auto animate-spin mb-4"></div>
          <p className="text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <PaymentMessage 
        status="failure"
        title="Verification Failed"
        message={error || 'We could not confirm your payment. Please contact support.'}
      />
    );
  }

  return <PaymentMessage status="success" />;
};

// Failure component with API notification
export const Failure: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const notifyFailure = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const txnid = queryParams.get('txnid');
        
        if (txnid) {
          await axios.post('/api/bookings/payments/failure', { txnid });
        }
      } catch (err) {
        console.error('Failed to notify backend:', err);
      }
    };

    notifyFailure();
  }, [location.search]);

  return <PaymentMessage status="failure" />;
};

export const Cancel: React.FC = () => <PaymentMessage status="cancel" />;