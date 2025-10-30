import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason') || 'Người dùng hủy thanh toán';
  
  const [countdown, setCountdown] = useState(10);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    
    if (countdown === 0) {
      navigate('/subscription');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse"></div>
              <XCircle className="w-20 h-20 text-red-500 relative" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thanh toán đã bị hủy
          </h1>
          <p className="text-gray-600 mb-6">
            Giao dịch của bạn không được hoàn tất
          </p>

          {/* Cancel Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Lý do:</span>
              <span className="font-semibold text-gray-800 text-right">{reason}</span>
            </div>
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold text-gray-800 break-all">{orderId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-semibold text-gray-800">
                {new Date().toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-semibold text-red-600">❌ Đã hủy</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-yellow-900 font-semibold mb-2">⚠️ Lưu ý:</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Gói đăng ký của bạn chưa được kích hoạt</li>
              <li>• Không có khoản tiền nào bị trừ</li>
              <li>• Bạn có thể thử lại bất kỳ lúc nào</li>
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
              <RotateCcw className="w-4 h-4" />
              Thử lại
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">
              Cần giúp đỡ?
            </p>
            <button
              onClick={() => window.location.href = 'mailto:support@2share.icu'}
              className="text-sm text-[#8A2EA5] hover:text-[#6f2488] font-semibold transition-colors"
            >
              Liên hệ bộ phận hỗ trợ
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Nếu bạn gặp vấn đề khi thanh toán, vui lòng kiểm tra:
          </p>
          <ul className="mt-2 space-y-1 text-gray-500">
            <li>✓ Thông tin thẻ của bạn</li>
            <li>✓ Kết nối internet</li>
            <li>✓ Liên hệ ngân hàng nếu cần</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;

