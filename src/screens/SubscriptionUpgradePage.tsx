"use client";

import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { useSearchParams } from 'react-router-dom';

// Types
interface Plan {
  _id: string;
  name: string;
  price: number;
  duration_in_days: number;
  description: string;
  features: string[];
  max_storage: number;
  max_share_links: number;
  priority_support: boolean;
}

// SỬA PaymentResponse theo API thực tế
interface PaymentResponse {
  result: {
    success: boolean;
    orderId: string;
    subscriptionId: string;
    trial: boolean;
  };
}

const SubscriptionUpgradePage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{success: boolean; message: string} | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  
  const [searchParams] = useSearchParams();
  const planIdFromUrl = searchParams?.get('plan') || null;

  const API_BASE_URL = "https://2share.icu";

  // Fallback plans
  const fallbackPlans: Plan[] = [
    {
      _id: "plan_standard",
      name: "Gói Tiêu Chuẩn",
      price: 39000,
      duration_in_days: 30,
      description: "Gói cơ bản dành cho người mới bắt đầu",
      features: ["4 danh thiếp", "3 templates", "1 domain", "5GB lưu trữ", "50 share links"],
      max_storage: 5368709120,
      max_share_links: 50,
      priority_support: false
    },
    {
      _id: "plan_premium",
      name: "Gói Đặc Biệt",
      price: 59000,
      duration_in_days: 30,
      description: "Gói nâng cao với nhiều tính năng",
      features: ["4 danh thiếp", "6 templates", "3 domains", "10GB lưu trữ", "100 share links", "Hỗ trợ ưu tiên"],
      max_storage: 10737418240,
      max_share_links: 100,
      priority_support: true
    },
    {
      _id: "plan_member", 
      name: "Gói Thành Viên",
      price: 139000,
      duration_in_days: 120,
      description: "Gói đặc biệt dành cho thành viên",
      features: ["4 danh thiếp", "12 templates", "5 domains", "15GB lưu trữ", "200 share links", "Hỗ trợ ưu tiên", "Tính năng cao cấp"],
      max_storage: 16106127360,
      max_share_links: 200,
      priority_support: true
    }
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

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

  // SỬA LỖI CORS Ở ĐÂY - REMOVE credentials: 'include'
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setDebugInfo("Bắt đầu fetch plans...");
        
        const authToken = getAuthToken();
        console.log("🔄 Fetching plans from:", `${API_BASE_URL}/plans/get-plans`);

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        setDebugInfo("Đang gọi API...");
        
        // SỬA QUAN TRỌNG: XÓA credentials: 'include'
        const response = await fetch(`${API_BASE_URL}/plans/get-plans`, {
          method: 'GET',
          headers: headers,
          // XÓA DÒNG NÀY: credentials: 'include'
        });

        console.log("📡 Response status:", response.status);
        setDebugInfo(`API trả về status: ${response.status}`);

        if (response.status === 401 || response.status === 403) {
          setDebugInfo(`Lỗi auth: ${response.status}. Dùng fallback plans.`);
          setPlans(fallbackPlans);
          autoSelectPlan(fallbackPlans);
          setError(`Lỗi xác thực (${response.status}). Đang dùng dữ liệu mẫu.`);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ API Response data:", data);
        setDebugInfo(`API trả về: ${data.message || 'No message'}`);

        if (data && data.result && Array.isArray(data.result)) {
          console.log("📊 Plans data received:", data.result);
          
          const transformedPlans = data.result.map((apiPlan: any, index: number) => {
            const features = [
              apiPlan.maskedallinks && `${apiPlan.maskedallinks} link ẩn`,
              apiPlan.maxTempId && `${apiPlan.maxTempId} templates`,
              apiPlan.maskslessCard && `${apiPlan.maskslessCard} danh thiếp`,
              apiPlan.maxCardLevels && `${apiPlan.maxCardLevels} cấp độ`,
              apiPlan.customDomain && "Domain tuỳ chỉnh",
              apiPlan.isTrial && "Dùng thử"
            ].filter(Boolean) as string[];

            return {
              _id: apiPlan.id || apiPlan._id || `plan_${index}`,
              name: apiPlan.name || `Gói ${index + 1}`,
              price: apiPlan.price || 0,
              duration_in_days: apiPlan.duration_in_days || 30,
              description: apiPlan.description || "Gói dịch vụ",
              features: features.length > 0 ? features : fallbackPlans[index]?.features || ["Tính năng cơ bản"],
              max_storage: 5368709120,
              max_share_links: apiPlan.maskedallinks || 50,
              priority_support: apiPlan.customDomain || false
            };
          });

          setPlans(transformedPlans);
          autoSelectPlan(transformedPlans);
          setError("");
          setDebugInfo(`Đã tải ${transformedPlans.length} gói từ server`);
        } else {
          throw new Error("Data structure không hợp lệ");
        }
        
      } catch (error: any) {
        console.error("❌ Lỗi fetch plans:", error);
        setDebugInfo(`Lỗi: ${error.message}`);
        setPlans(fallbackPlans);
        autoSelectPlan(fallbackPlans);
        setError(`Không thể kết nối đến server: ${error.message}. Đang dùng dữ liệu mẫu.`);
      } finally {
        setLoading(false);
      }
    };

    const autoSelectPlan = (planList: Plan[]) => {
      if (planIdFromUrl && planList.length > 0) {
        // Tìm plan theo ID từ URL
        const planFromUrl = planList.find((plan: Plan) => 
          plan._id === planIdFromUrl || 
          plan.name.toLowerCase().includes(planIdFromUrl.toLowerCase())
        );
        
        if (planFromUrl) {
          setSelectedPlan(planFromUrl._id);
          console.log(`✅ Auto-selected plan from URL: ${planFromUrl.name}`);
        } else {
          setSelectedPlan(planList[0]._id);
          console.log(`⚠️ Plan từ URL không tìm thấy, chọn plan đầu tiên`);
        }
      } else if (planList.length > 0) {
        setSelectedPlan(planList[0]._id);
        console.log(`✅ Auto-selected first plan: ${planList[0].name}`);
      }
    };

    fetchPlans();
  }, [planIdFromUrl]);

  const currentPlan = displayPlans.find(plan => plan._id === selectedPlan);
  const monthlyPrice = currentPlan?.price || 0;
  const yearlyPrice = monthlyPrice * 12 * 0.9;

  // TEST API - Cũng sửa credentials
  const testAPI = async () => {
    try {
      setDebugInfo("Đang test API...");
      const response = await fetch(`${API_BASE_URL}/plans/get-plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
        // XÓA credentials: 'include'
      });
      setDebugInfo(`Test API: Status ${response.status}`);
      console.log("Test API response:", response);
    } catch (error) {
      setDebugInfo(`Test API lỗi: ${error}`);
    }
  };

  // Payment handler - Cũng sửa credentials
  const handlePayment = async () => {
    // Thêm vào đầu hàm handlePayment
console.log('🔍 Debug info:');
console.log('- Current Plan:', currentPlan);
console.log('- Selected Plan ID:', selectedPlan);
console.log('- Auth Token:', getAuthToken() ? 'Exists' : 'Missing');
console.log('- API URL:', `${API_BASE_URL}/subscriptions/create-payment`);
  if (!currentPlan) {
    setPaymentResult({
      success: false,
      message: "Vui lòng chọn gói đăng ký"
    });
    return;
  }

  setIsProcessing(true);
  setPaymentResult(null);
  setDebugInfo("Bắt đầu xử lý thanh toán...");

  try {
    // Lấy token - GIỮ NGUYÊN
    const authToken = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // SỬA paymentData theo API thực tế
    const paymentData = {
      plan_id: selectedPlan, // Dùng _id của plan
      amount: currentPlan.price, // Dùng price thực tế
      description: `Thanh toán gói ${currentPlan.name}`,
      items: [
        {
          name: `Gói ${currentPlan.name}`,
          quantity: 1,
          price: currentPlan.price
        }
      ]
    };

    console.log("🔄 Gửi dữ liệu thanh toán:", paymentData);
    setDebugInfo(`Gửi thanh toán: ${paymentData.amount}đ cho ${currentPlan.name}`);

    // Gọi API thanh toán - GIỮ NGUYÊN
    const response = await fetch(`${API_BASE_URL}/subscriptions/create-payment`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData)
    });

    console.log("💰 Payment response status:", response.status);
    setDebugInfo(`Payment API status: ${response.status}`);

    // Đọc response text trước để debug
    const responseText = await response.text();
    console.log("💰 Payment response body:", responseText);

    if (response.status === 401) {
      throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    }

    if (response.status === 403) {
      throw new Error("Bạn không có quyền thực hiện thanh toán.");
    }

    if (!response.ok) {
      throw new Error(`Lỗi server: ${response.status} - ${responseText}`);
    }

    // SỬA: Parse response theo API thực tế
    let result: PaymentResponse;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Lỗi parse JSON:', parseError);
      throw new Error("Lỗi xử lý dữ liệu từ server");
    }

    console.log("✅ Kết quả thanh toán:", result);
    setDebugInfo(`Kết quả: ${JSON.stringify(result)}`);

    // SỬA: Xử lý kết quả theo API thực tế
    if (result.result && result.result.success) {
      // THANH TOÁN THÀNH CÔNG
      const successMessage = `🎉 Thanh toán thành công!\nOrder ID: ${result.result.orderId}\nSubscription ID: ${result.result.subscriptionId}`;
      
      setPaymentResult({
        success: true,
        message: successMessage
      });

      // Có thể redirect hoặc hiển thị thông tin thành công
      setTimeout(() => {
        // Redirect đến trang cảm ơn hoặc trang xác nhận
        window.location.href = `/payment-success?orderId=${result.result.orderId}`;
      }, 3000);

    } else {
      setPaymentResult({
        success: false, 
        message: "Thanh toán không thành công. Vui lòng thử lại."
      });
    }

  } catch (error: any) {
    console.error("❌ Lỗi thanh toán:", error);
    setDebugInfo(`Lỗi thanh toán: ${error.message}`);
    setPaymentResult({
      success: false,
      message: "❌ " + (error.message || "Không thể kết nối đến server.")
    });
  } finally {
    setIsProcessing(false);
  }
};

  const formatStorage = (bytes: number) => {
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#8A2EA5]" />
          <p className="mt-4 text-gray-600">Đang tải danh sách gói...</p>
          <p className="text-sm text-blue-600 mt-2">{debugInfo}</p>
          {planIdFromUrl && (
            <p className="text-sm text-gray-500 mt-2">
              Plan ID từ URL: {planIdFromUrl}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-spartan text-gray-800 px-8 py-10">
      {/* Back Link */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col items-start">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 object-contain mb-12"
          />
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#8A2EA5] hover:text-[#6f2488] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-medium">Trở lại</span>
          </button>
        </div>
      </div>

      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <strong>Debug Info:</strong> 
              <span className="ml-2 text-sm">{debugInfo}</span>
            </div>
            <button 
              onClick={testAPI}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
            >
              Test API
            </button>
          </div>
          <div className="text-xs mt-2">
            Plans: {plans.length} | Selected: {selectedPlan} | Token: {getAuthToken() ? 'Yes' : 'No'} | Plan from URL: {planIdFromUrl || 'None'}
          </div>
        </div>
      )}

      {/* Status Banner */}
      <div className="max-w-6xl mx-auto mb-6">
        {error ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <span>⚠️</span>
              <div>
                <div className="font-semibold">Thông báo</div>
                <div className="text-sm mt-1">{error}</div>
                <div className="text-xs mt-2">
                  Bạn vẫn có thể tiếp tục thanh toán với dữ liệu mẫu
                </div>
              </div>
            </div>
          </div>
        ) : plans.length > 0 ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <span>✅</span>
              <div>
                <div className="font-semibold">Kết nối thành công</div>
                <div className="text-sm mt-1">Đã tải {plans.length} gói từ server</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <span>ℹ️</span>
              <div>
                <div className="font-semibold">Đang dùng dữ liệu mẫu</div>
                <div className="text-sm mt-1">Bạn vẫn có thể tiếp tục thanh toán</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rest of your JSX remains exactly the same */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
        {/* LEFT SECTION - giữ nguyên */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Nâng cấp gói đăng ký</h1>

          {/* Plan Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">Chọn gói</label>
            <div className="space-y-3">
              {displayPlans.map((plan) => (
                <label
                  key={plan._id}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlan === plan._id ? "border-[#8A2EA5] bg-purple-50 shadow-sm" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    checked={selectedPlan === plan._id}
                    onChange={() => setSelectedPlan(plan._id)}
                    className="accent-[#8A2EA5]"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{plan.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {plan.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <div>• Lưu trữ: {formatStorage(plan.max_storage)}</div>
                      <div>• Share links: {plan.max_share_links}</div>
                      <div>• Thời hạn: {plan.duration_in_days} ngày</div>
                      {plan.priority_support && <div>• Hỗ trợ ưu tiên</div>}
                    </div>
                  </div>
                  <div className="font-bold text-[#8A2EA5] text-lg">
                    {plan.price.toLocaleString("vi-VN")} đ
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* PAYMENT FORM - giữ nguyên */}
          <h2 className="mt-10 text-2xl font-semibold mb-6">Thanh toán</h2>
          <div className="space-y-6">
            {/* Card number */}
            <div>
              <label className="block text-sm font-semibold mb-2">Số thẻ ngân hàng</label>
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A2EA5] border border-gray-200"
              />
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Ngày hết hạn</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A2EA5] border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Mã xác minh thẻ</label>
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A2EA5] border border-gray-200"
                />
              </div>
            </div>

            {/* Billing Info */}
            <h3 className="text-2xl font-semibold mt-10 mb-6">Chi tiết thanh toán</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A2EA5] border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A2EA5] border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A2EA5] border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - giữ nguyên */}
        <div className="mt-20 rounded-3xl border border-gray-300 p-8 h-fit shadow-sm">
          {/* Subscription Box */}
          <div className="pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Gói đăng ký của bạn</h2>
            
            {currentPlan && (
              <div className="mb-6">
                <div className="font-semibold text-lg text-[#8A2EA5] mb-2">
                  Gói {currentPlan.name}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-3">Chu kỳ thanh toán</label>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    billingCycle === "monthly" ? "border-[#8A2EA5] bg-purple-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    checked={billingCycle === "monthly"}
                    onChange={() => setBillingCycle("monthly")}
                    className="accent-[#8A2EA5]"
                  />
                  <span className="font-medium">Mỗi tháng</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    billingCycle === "yearly" ? "border-[#8A2EA5] bg-purple-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    checked={billingCycle === "yearly"}
                    onChange={() => setBillingCycle("yearly")}
                    className="accent-[#8A2EA5]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Mỗi năm</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                      Tiết kiệm 10%
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="flex pt-6 border-gray-200 gap-1 items-center">
            <div className="text-sm text-gray-500">Hết hạn vào</div>
            <div className="text-sm font-semibold text-gray-800 ml-1">02/08/2025</div>
          </div>

          {/* Price */}
          <div className="pb-6 pt-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Thanh toán</div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-[#8A2EA5]">
                {currentPlan ? (
                  billingCycle === "monthly"
                    ? `${monthlyPrice.toLocaleString("vi-VN")} đ`
                    : `${yearlyPrice.toLocaleString("vi-VN")} đ`
                ) : (
                  "0 đ"
                )}
              </div>
              {billingCycle === "yearly" && currentPlan && (
                <div className="text-sm text-green-600 font-medium">
                  Tiết kiệm {(monthlyPrice * 12 * 0.1).toLocaleString("vi-VN")} đ
                </div>
              )}
            </div>
          </div>

          {/* Payment Result */}
          {paymentResult && (
            <div className={`mt-6 p-4 rounded-xl border ${
              paymentResult.success 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="font-semibold flex items-center gap-2">
                {paymentResult.success ? "✅" : "❌"} {paymentResult.message}
              </div>
            </div>
          )}

          {/* Button */}
          <div className="pt-6">
            <button 
              onClick={handlePayment}
              disabled={isProcessing || !currentPlan}
              className={`w-full ${
                isProcessing || !currentPlan
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#8A2EA5] hover:bg-[#6f2488] shadow-sm hover:shadow-md'
              } text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                `💳 Thanh toán ${currentPlan ? (billingCycle === "monthly" ? monthlyPrice : yearlyPrice).toLocaleString("vi-VN") + " đ" : ""}`
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              🔒 Thanh toán được bảo mật và mã hóa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradePage;