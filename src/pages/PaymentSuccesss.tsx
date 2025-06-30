import React from 'react';
import { Link } from 'react-router-dom';

const PaymentMessage: React.FC<{ status: 'success' | 'failure' | 'cancel'; }> = ({ status }) => {
  const messages = {
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

  const { title, message } = messages[status];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export const Success: React.FC = () => <PaymentMessage status="success" />;
export const Failure: React.FC = () => <PaymentMessage status="failure" />;
export const Cancel: React.FC = () => <PaymentMessage status="cancel" />;
