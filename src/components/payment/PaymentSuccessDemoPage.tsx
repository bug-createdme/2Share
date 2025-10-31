import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PaymentSuccessDemoPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30); // 30 giây để chụp ảnh

  // Demo data - có thể tùy chỉnh
  const demoData = {
    orderId: '2024102501234567',
    subscriptionId: 'SUB-ABC123XYZ',
    planName: 'Gói Thành Viên (3 bạn)',
    amount: 139000,
    duration: '120 ngày',
    status: 'Thành công',
    paymentMethod: 'PayOS',
    createdAt: new Date().toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
          {/* Success Icon with Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 bg-green-300 rounded-full animate-pulse"></div>
              <CheckCircle className="w-24 h-24 text-green-500 relative animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🎉 Thanh toán thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Gói đăng ký của bạn đã được kích hoạt thành công
          </p>

          {/* Order Details - Beautiful Layout */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📋 Thông tin đơn hàng
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                <span className="font-bold text-gray-800 text-lg">{demoData.orderId}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Mã đăng ký:</span>
                <span className="font-bold text-gray-800 text-lg">{demoData.subscriptionId}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Gói đăng ký:</span>
                <span className="font-bold text-purple-700 text-lg">{demoData.planName}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Thời hạn:</span>
                <span className="font-bold text-gray-800 text-lg">{demoData.duration}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Số tiền:</span>
                <span className="font-bold text-green-600 text-2xl">
                  {demoData.amount.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Phương thức:</span>
                <span className="font-semibold text-gray-800 text-lg">{demoData.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Thời gian:</span>
                <span className="font-semibold text-gray-800">{demoData.createdAt}</span>
              </div>

              <div className="flex justify-between items-start pt-2">
                <span className="text-gray-600 font-medium">Trạng thái:</span>
                <span className="font-bold text-green-600 text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {demoData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits/Features */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-left">
            <p className="text-lg text-green-900 font-bold mb-3 flex items-center gap-2">
              ✨ Tính năng đã được kích hoạt:
            </p>
            <ul className="text-green-800 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Domain tùy chỉnh</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Tối đa 50 share links</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>50 templates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Hỗ trợ ưu tiên 24/7</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 text-left">
            <p className="text-lg text-blue-900 font-bold mb-3 flex items-center gap-2">
              📧 Các bước tiếp theo:
            </p>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">1.</span>
                <span>Email xác nhận đã được gửi đến hộp thư của bạn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">2.</span>
                <span>Gói của bạn đã được kích hoạt và sẵn sàng sử dụng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">3.</span>
                <span>Bắt đầu tạo portfolio và chia sẻ links của bạn</span>
              </li>
            </ul>
          </div>

          {/* Countdown - Reduced prominence for screenshot */}
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Tự động chuyển hướng sau <span className="font-bold text-purple-600">{countdown}s</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-links')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              Bắt đầu sử dụng ngay
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Xem thông tin gói đăng ký
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Về trang chủ
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              💬 Cần hỗ trợ? Liên hệ: <span className="text-purple-600 font-semibold">support@2share.vn</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ 2Share! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessDemoPage;
