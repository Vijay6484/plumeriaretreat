import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PaymentHistoryProps {
  bookingId: string;
}

interface Payment {
  id: number;
  amount: number;
  paymentType: 'partial' | 'full';
  status: 'pending' | 'success' | 'failed';
  paymentMode: string;
  paymentDate: string;
  payuTransactionId: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ bookingId }) => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, [bookingId]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(`/api/payments/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading payment history...</div>;
  }

  if (!payments || !payments.payments.length) {
    return <div className="text-center p-4">No payment records found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Payment History</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {payments.payments.map((payment: Payment) => (
            <div
              key={payment.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">₹{payment.amount}</p>
                <p className="text-sm text-gray-600">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {payment.paymentMode || 'N/A'}
                </p>
                {payment.payuTransactionId && (
                  <p className="text-xs text-gray-500">
                    Txn ID: {payment.payuTransactionId}
                  </p>
                )}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    payment.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {payment.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {payment.paymentType === 'full' ? 'Full Payment' : 'Partial Payment'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-lg font-semibold">₹{payments.totalPaid}</p>
            </div>
            {payments.remainingAmount > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Remaining Amount</p>
                <p className="text-lg font-semibold">₹{payments.remainingAmount}</p>
              </div>
            )}
          </div>
          {payments.isFullyPaid && (
            <p className="mt-2 text-green-600 font-medium">Fully Paid</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory; 