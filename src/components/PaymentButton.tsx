import React, { useState } from 'react';

interface PaymentButtonProps {
  orderCode?: number;
  amount?: number;
  description?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const API_URL = 'https://2share.icu/subscriptions/create-payment';

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  orderCode = 1,
  amount = 0,
  description = '',
  items = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderCode,
          amount,
          description,
          items,
          cancelUrl: 'http://localhost:3000/cancel.html',
          returnUrl: 'http://localhost:3000/success.html',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi tạo thanh toán');
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Không nhận được paymentUrl');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading} style={{ padding: '8px 16px', fontSize: 16 }}>
        {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default PaymentButton;
