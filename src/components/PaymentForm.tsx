import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  bookingId: number;
  totalAmount: number;
  onPaymentInitiated: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ bookingId, totalAmount, onPaymentInitiated }) => {
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState<number>(totalAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const minPartialAmount = totalAmount * 0.2; // 20% minimum

  useEffect(() => {
    if (paymentType === 'full') {
      setAmount(totalAmount);
    } else {
      setAmount(minPartialAmount);
    }
  }, [paymentType, totalAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/payments/initiate', {
        bookingId,
        amount,
        paymentType
      });

      // Create a form and submit it to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.data.paymentUrl;

      Object.entries(response.data.paymentParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      onPaymentInitiated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Type
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="full"
                checked={paymentType === 'full'}
                onChange={() => setPaymentType('full')}
                className="form-radio"
              />
              <span className="ml-2">Full Payment</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="partial"
                checked={paymentType === 'partial'}
                onChange={() => setPaymentType('partial')}
                className="form-radio"
              />
              <span className="ml-2">Partial Payment</span>
            </label>
          </div>
        </div>

        {paymentType === 'partial' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount (Minimum: ₹{minPartialAmount.toFixed(2)})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={minPartialAmount}
              max={totalAmount}
              step="0.01"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700">
            Total Amount: <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
          </p>
          {paymentType === 'partial' && (
            <p className="text-gray-700">
              Remaining Amount: <span className="font-bold">₹{(totalAmount - amount).toFixed(2)}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 