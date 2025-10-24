// PaymentSuccessPage.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      // Gọi API xác nhận thanh toán thành công
      confirmPayment(orderId);
      
      // Hiển thị thông báo thành công
      alert('Thanh toán thành công!');
      
      // Chuyển hướng về trang chủ hoặc trang subscription
      setTimeout(() => {
        navigate('/subscriptions');
      }, 3000);
    }
  }, [orderId, navigate]);

  const confirmPayment = async (orderId: string) => {
    try {
      // Gọi API backend để xác nhận thanh toán
      const response = await fetch(`/api/payments/confirm/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        console.log('Payment confirmed successfully');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  return (
    <div className="payment-success">
      <h1>✅ Thanh toán thành công!</h1>
      <p>Order ID: {orderId}</p>
      <p>Chúng tôi đang kích hoạt gói của bạn...</p>
    </div>
  );
};

export default PaymentSuccessPage;