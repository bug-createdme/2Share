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
  plan?: any;
}


// API cho upgrade plan
const API_UPGRADE_URL = 'https://2share.icu/subscriptions/create-payment-upgrade';

export const PaymentButton: React.FC<PaymentButtonProps> = (props) => {
  // Ưu tiên lấy từ plan nếu có
  const { plan } = props;
  const orderCode = props.orderCode ?? 1;
  const amount = plan?.price ?? props.amount ?? 0;
  const description = plan?.description ?? props.description ?? '';
  const items = plan
    ? [{ name: plan.name, quantity: 1, price: plan.price }]
    : props.items ?? [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let plan_id = undefined;
      if (plan && typeof plan === 'object') {
        if (plan._id) plan_id = plan._id;
        else if (plan.id) plan_id = plan.id;
      }
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      // Gọi API upgrade đúng chuẩn
      const body = {
        plan_id,
        amount,
        description,
        items,
      };
      console.log('Upgrade payment body:', body);
      const res = await fetch(API_UPGRADE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi tạo thanh toán nâng cấp');
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

  // Nếu plan là free thì không hiển thị nút thanh toán
  if (plan && (plan.price === 0 || plan.isFree)) {
    return <div className="text-green-600 font-semibold">Gói miễn phí</div>;
  }
  return (
    <div>
      <button onClick={handlePayment} disabled={loading} style={{ padding: '8px 16px', fontSize: 16 }}>
        {loading ? 'Đang xử lý...' : 'Thanh toán nâng cấp'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default PaymentButton;
