import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowLeft } from 'lucide-react';

const TrialOfferPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAcceptTrial = () => {
    // Backend đã tự động kích hoạt trial khi user mới thanh toán
    // Chỉ cần chuyển hướng đến my-links
    navigate('/my-links');
  };

  const handleCancel = () => {
    // Quay lại trang subscription hoặc my-links
    navigate('/subscription-plans');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-spartan flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base font-medium">Quay lại</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Chào mừng bạn đến với 2Share!
          </h1>

          {/* Description */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              Đối với người dùng lần đầu tạo tài khoản, bạn sẽ được{' '}
              <span className="font-bold text-purple-600">dùng thử dịch vụ miễn phí 7 ngày</span>.
            </p>
            <p className="text-base text-gray-600 text-center mt-4">
              Sau khi hết hạn dùng thử, bạn có thể tùy chọn nâng cấp gói để có thể sử dụng dịch vụ của chúng tôi một cách tốt nhất.
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quyền lợi dùng thử:</h3>
            <div className="space-y-3">
              {[
                'Truy cập đầy đủ các tính năng cơ bản',
                'Tạo và quản lý portfolio',
                'Chia sẻ link cá nhân',
                'Hỗ trợ 24/7'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-4 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-all duration-300"
            >
              Hủy
            </button>
            <button
              onClick={handleAcceptTrial}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Đồng ý - Dùng thử 7 ngày
            </button>
          </div>

          {/* Info Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Bằng việc nhấn "Đồng ý", bạn xác nhận đã đọc và chấp nhận điều khoản dùng thử của chúng tôi.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Có câu hỏi?{' '}
            <a href="/support" className="text-purple-600 hover:text-purple-700 font-semibold underline">
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialOfferPage;
