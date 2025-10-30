import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

interface PaymentConfirmation {
  orderId: string;
  subscriptionId: string;
  status: string;
  amount: number;
  planName: string;
  createdAt: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Accept multiple possible param names from gateways (PayOS returns orderCode & id)
  const qp = Object.fromEntries(searchParams.entries());
  const orderId = (
    (qp as any).orderId || (qp as any).order_id || (qp as any).orderCode || (qp as any).order_code || (qp as any).id || (qp as any).code || null
  ) as string | null;
  const subscriptionId = ((qp as any).subscriptionId || (qp as any).subscription_id || null) as string | null;
  const statusParam = ((qp as any).status || '').toString().toUpperCase();

  const [confirmation, setConfirmation] = useState<PaymentConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState(10);

  const API_BASE_URL = "https://2share.icu";

  useEffect(() => {
    // There is no confirm-payment API. Treat the gateway callback as the source of truth.
    // PayOS success indicators: status=PAID and/or code=00, cancel=false
    const codeParam = ((qp as any).code || '').toString();
    const cancelParam = ((qp as any).cancel || '').toString().toLowerCase();
    const isPaid = statusParam === 'PAID' || (codeParam === '00' && cancelParam !== 'true');

    if (!isPaid) {
      setError('Thanh toán không thành công hoặc đã hủy.');
      setLoading(false);
      return;
    }

    // Build a local confirmation object from query params only
    setConfirmation({
      orderId: orderId || (qp as any).orderCode || (qp as any).id || 'unknown',
      subscriptionId: (qp as any).subscriptionId || (qp as any).subscription_id || '',
      status: 'success',
      amount: Number((qp as any).amount) || 0,
      planName: (qp as any).planName || 'Gói đăng ký',
      createdAt: new Date().toLocaleString('vi-VN'),
    });
    setLoading(false);
  }, [orderId, subscriptionId, statusParam]);

  // Countdown timer
  useEffect(() => {
    if (!loading && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && !loading) {
      navigate('/subscription');
    }
  }, [countdown, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#8A2EA5] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error && !confirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lỗi</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/subscription')}
            className="bg-[#8A2EA5] text-white px-6 py-3 rounded-lg hover:bg-[#6f2488] transition-colors font-semibold"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-pulse"></div>
              <CheckCircle className="w-20 h-20 text-green-500 relative" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Gói đăng ký của bạn đã được kích hoạt
          </p>

          {/* Order Details */}
          {confirmation && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold text-gray-800 break-all">{confirmation.orderId}</span>
              </div>
              {confirmation.subscriptionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đăng ký:</span>
                  <span className="font-semibold text-gray-800 break-all">{confirmation.subscriptionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-semibold text-gray-800">{confirmation.createdAt}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-semibold text-green-600">✅ Thành công</span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-900 font-semibold mb-2">📧 Tiếp theo:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Kiểm tra email để nhận xác nhận</li>
              <li>✓ Gói của bạn đã được kích hoạt</li>
              <li>✓ Bạn có thể bắt đầu sử dụng ngay</li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              Chuyển hướng về trang gói đăng ký trong <span className="font-bold">{countdown}</span> giây...
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-[#8A2EA5] text-white py-3 rounded-lg hover:bg-[#6f2488] transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Quay lại gói đăng ký
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Về trang chủ
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-6">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận hỗ trợ
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;