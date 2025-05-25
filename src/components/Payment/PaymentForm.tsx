import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  bookingId: string;
  totalAmount: number;
  onPaymentComplete?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ bookingId, totalAmount, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentStatus();
  }, [bookingId]);

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get(`/api/payments/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaymentStatus(response.data);
    } catch (err) {
      console.error('Error fetching payment status:', err);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amount = paymentType === 'full' ? totalAmount : parseFloat(partialAmount);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const response = await axios.post(
        '/api/payments/initiate',
        {
          bookingId,
          paymentType,
          amount
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const { paymentData, formUrl } = response.data;

      // Create and submit PayU form
      const form = document.createElement('form');
      form.setAttribute('action', formUrl);
      form.setAttribute('method', 'post');
      form.setAttribute('target', '_self');

      for (const [key, value] of Object.entries(paymentData)) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', value as string);
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  const calculateMinPartialAmount = () => {
    return totalAmount * 0.25; // 25% of total amount
  };

  if (loading) {
    return <div className="text-center p-4">Processing payment...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
      
      {paymentStatus && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p>Total Amount: ₹{totalAmount}</p>
          <p>Paid Amount: ₹{paymentStatus.totalPaid}</p>
          <p>Remaining: ₹{paymentStatus.remainingAmount}</p>
          {paymentStatus.isFullyPaid && (
            <p className="text-green-600 font-semibold">Fully Paid</p>
          )}
        </div>
      )}

      {!paymentStatus?.isFullyPaid && (
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as 'full' | 'partial')}
              className="w-full p-2 border rounded"
            >
              <option value="full">Full Payment</option>
              <option value="partial">Partial Payment</option>
            </select>
          </div>

          {paymentType === 'partial' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                min={calculateMinPartialAmount()}
                max={totalAmount}
                step="0.01"
                className="w-full p-2 border rounded"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum amount: ₹{calculateMinPartialAmount()} (25%)
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm; 