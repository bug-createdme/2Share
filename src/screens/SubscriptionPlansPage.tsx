"use client";

import React, { useState, useEffect } from "react";
import { Check, Star, Zap, Crown, Loader2 } from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  price: number;
  duration_in_days: number;
  description: string;
  maxSocialLinks: number;
  maxTemplates: number;
  customDomain: boolean;
  maxBusinessCard: number;
  maxCardLevels: number;
  isTrial: boolean;
}

const SubscriptionPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy authentication token
  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      const token = 
        localStorage.getItem('authToken') || 
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('token');
      
      console.log("🔑 Token found:", token ? "Yes" : "No");
      return token;
    }
    return null;
  };

  // Fetch plans từ API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const authToken = getAuthToken();
        console.log("🔄 Fetching plans with token:", authToken ? "Yes" : "No");

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch('https://2share.icu/plans/get-plans', {
          method: 'GET',
          headers: headers,
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            // Token không hợp lệ, thử không dùng token
            console.log("Token invalid, trying without token...");
            const responseWithoutToken = await fetch('https://2share.icu/plans/get-plans', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (responseWithoutToken.ok) {
              const data = await responseWithoutToken.json();
              if (data.message === "Get plan successfully" && data.result) {
                setPlans(data.result);
                return;
              }
            }
            throw new Error('Không thể truy cập gói dịch vụ. Vui lòng kiểm tra đăng nhập.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.message === "Get plan successfully" && data.result) {
          console.log("✅ Plans data received:", data.result);
          setPlans(data.result);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching plans:', err);
        setError(err.message || 'Không thể tải danh sách gói dịch vụ. Vui lòng thử lại sau.');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Generate features từ plan data
  const getPlanFeatures = (plan: Plan) => {
    const features = [];
    
    if (plan.maxSocialLinks > 0) {
      features.push(`${plan.maxSocialLinks} liên kết mạng xã hội`);
    }
    if (plan.maxTemplates > 0) {
      features.push(`${plan.maxTemplates} mẫu thiết kế`);
    }
    if (plan.maxBusinessCard > 0) {
      features.push(`${plan.maxBusinessCard} danh thiếp`);
    }
    if (plan.maxCardLevels > 0) {
      features.push(`${plan.maxCardLevels} cấp độ thẻ`);
    }
    if (plan.customDomain) {
      features.push('Tên miền tuỳ chỉnh');
    }
    if (plan.isTrial) {
      features.push('Dùng thử miễn phí');
    }
    
    return features;
  };

  // Get plan styling - ĐÃ SỬA: chỉ dùng index
  const getPlanStyle = (index: number) => {
    const styles = [
      {
        icon: Zap,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        popular: false
      },
      {
        icon: Star,
        color: "from-purple-500 to-purple-600", 
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        popular: true
      },
      {
        icon: Crown,
        color: "from-amber-500 to-amber-600",
        bgColor: "bg-amber-50", 
        borderColor: "border-amber-200",
        textColor: "text-amber-600",
        popular: false
      }
    ];
    
    return styles[index] || styles[0];
  };

  const handleUpgrade = (planId: string) => {
    console.log("Upgrading to plan:", planId);
    
    // Kiểm tra token trước khi chuyển hướng
    const token = getAuthToken();
    if (!token) {
      setError('Vui lòng đăng nhập để nâng cấp gói dịch vụ');
      return;
    }
    
    // Chuyển hướng đến trang thanh toán với planId từ API
    window.location.href = `/subscription?plan=${planId}`;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Miễn phí' : `${price.toLocaleString('vi-VN')}đ`;
  };

  // Debug: Hiển thị token info
  const token = getAuthToken();
  const userEmail = localStorage.getItem('userEmail');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Đang tải gói dịch vụ...</p>
          <p className="text-sm text-gray-500 mt-2">
            Token: {token ? '✅ Found' : '❌ Not found'} | User: {userEmail || 'Not logged in'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-spartan text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-8 object-contain"
              />
            </div>
            {userEmail && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Xin chào, {userEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8 py-2">
            <div className="text-sm text-blue-800">
              🔍 Debug: Token: {token ? '✅' : '❌'} | User: {userEmail || 'Not set'} | Plans: {plans.length}
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center gap-2 text-red-800">
              <span>❌</span>
              <div>
                <div className="text-sm font-semibold">{error}</div>
                <div className="text-xs mt-1">
                  Vui lòng kiểm tra kết nối internet hoặc thử lại sau.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Chọn Gói Dịch Vụ Phù Hợp
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Nâng cấp trải nghiệm của bạn với các gói dịch vụ được thiết kế đặc biệt
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có gói dịch vụ nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const style = getPlanStyle(index); // ĐÃ SỬA: chỉ truyền index
              const IconComponent = style.icon;
              const features = getPlanFeatures(plan);
              
              return (
                <div
                  key={plan._id}
                  className={`relative rounded-2xl border-2 ${
                    style.popular 
                      ? "border-purple-300 shadow-xl scale-105" 
                      : "border-gray-200 shadow-lg"
                  } bg-white transition-all hover:shadow-2xl hover:scale-105`}
                >
                  {/* Popular Badge */}
                  {style.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ Phổ Biến Nhất
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className={`p-8 rounded-t-2xl ${style.bgColor} ${style.borderColor} border-b`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${style.bgColor}`}>
                        <IconComponent className={`w-6 h-6 ${style.textColor}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">Thời hạn: {plan.duration_in_days} ngày</p>

                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(plan.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-8">
                    <ul className="space-y-4 mb-8">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleUpgrade(plan._id)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                        style.popular
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {plan.price === 0 ? "Dùng Thử Ngay" : style.popular ? "Nâng Cấp Ngay" : "Chọn Gói"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-8 object-contain mb-4" />
              <p className="text-gray-400">Nền tảng tạo danh thiếp số hàng đầu Việt Nam.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tính năng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gói dịch vụ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPlansPage;