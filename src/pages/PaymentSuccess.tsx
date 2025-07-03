import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const StatusPage: React.FC = () => {
  const { status, id } = useParams<{ status: string; id: string }>();
  const navigate = useNavigate();

  // Determine styles and messages
  const statusConfig = {
    success: {
      color: 'text-green-600',
      title: 'Payment Successful',
      message: 'Your payment was processed successfully. Thank you for booking with us!',
    },
    failed: {
      color: 'text-red-600',
      title: 'Payment Failed',
      message: 'Unfortunately, your payment could not be completed. Please try again or contact support.',
    },
    expired: {
      color: 'text-yellow-600',
      title: 'Payment Expired',
      message: 'Your payment session has expired. Please make a new booking.',
    },
    pending: {
      color: 'text-blue-600',
      title: 'Payment Pending',
      message: 'Your payment is still being processed. Please refresh later or check your email for updates.',
    },
  };

  const { color, title, message } = statusConfig[status as keyof typeof statusConfig] || {
    color: 'text-gray-600',
    title: 'Unknown Status',
    message: 'We could not determine your payment status. Please contact support.',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className={`text-3xl font-bold mb-4 ${color}`}>{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="bg-gray-50 p-4 rounded mb-6 text-gray-600 text-sm">
          <span className="font-semibold">Transaction ID:</span> {id}
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default StatusPage;
