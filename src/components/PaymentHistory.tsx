import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Payment {
  id: number;
  amount: number;
  paymentType: 'full' | 'partial';
  status: 'pending' | 'success' | 'failed';
  paymentDate: string;
  payuTransactionId: string;
  remainingAmount: number;
}

interface PaymentHistoryProps {
  bookingId: number;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ bookingId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`/api/payments/history/${bookingId}`);
        setPayments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No payment history available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Payment History</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <div key={payment.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">
                  {format(new Date(payment.paymentDate), 'PPP')}
                </p>
                <p className="text-sm text-gray-600">
                  Transaction ID: {payment.payuTransactionId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  ₹{payment.amount.toFixed(2)}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === 'success' 
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <p>Payment Type: {payment.paymentType}</p>
              {payment.paymentType === 'partial' && (
                <p>Remaining Amount: ₹{payment.remainingAmount.toFixed(2)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory; 