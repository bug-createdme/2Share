import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCurrentPlan } from '../lib/api';

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



const SubscriptionUpgradePage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{success: boolean; message: string} | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [setCurrentUserPlan] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planIdFromUrl = searchParams?.get('plan') || null;

  const API_BASE_URL = "https://2share.icu";

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
    const fetchPlansAndUserPlan = async () => {
      try {
        setLoading(true);
        
        const authToken = getAuthToken();
        console.log("🔄 Fetching plans from:", `${API_BASE_URL}/plans/get-plans`);

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        // Kiểm tra gói hiện tại của user
        try {
          const userPlan = await getCurrentPlan();
          console.log("📦 Current user plan:", userPlan);
          setCurrentUserPlan(userPlan);
          
          // Nếu không có plan hoặc plan là null, đánh dấu là new user
          if (!userPlan || userPlan === null || Object.keys(userPlan).length === 0) {
            setIsNewUser(true);
            console.log("✨ New user detected - will offer trial");
          } else {
            setIsNewUser(false);
            console.log("👤 Existing user - will use upgrade endpoint");
          }
        } catch (planError) {
          console.warn("⚠️ Could not fetch current plan, treating as new user:", planError);
          setIsNewUser(true);
        }
        
        // SỬA QUAN TRỌNG: XÓA credentials: 'include'
        const response = await fetch(`${API_BASE_URL}/plans/get-plans`, {
          method: 'GET',
          headers: headers,
          // XÓA DÒNG NÀY: credentials: 'include'
        });

        console.log("📡 Response status:", response.status);

        if (response.status === 401 || response.status === 403) {
          setPlans([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ API Response data:", data);

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
              features: features.length > 0 ? features : ["Tính năng cơ bản"],
              max_storage: 5368709120,
              max_share_links: apiPlan.maskedallinks || 50,
              priority_support: apiPlan.customDomain || false
            };
          });

          setPlans(transformedPlans);
          autoSelectPlan(transformedPlans);
        } else {
          throw new Error("Data structure không hợp lệ");
        }
        
      } catch (error: any) {
        console.error("❌ Lỗi fetch plans:", error);
        setPlans([]);
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

    fetchPlansAndUserPlan();
  }, [planIdFromUrl]);

  const currentPlan = plans.find((plan: Plan) => plan._id === selectedPlan);
  const monthlyPrice = currentPlan?.price || 0;
  const yearlyPrice = monthlyPrice * 12 * 0.9;

  const handlePayment = async () => {
    if (!currentPlan) {
      setPaymentResult({
        success: false,
        message: "Vui long chon goi dang ky"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const authToken = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Xác định endpoint dựa trên isNewUser
      // New user: create-payment (backend sẽ auto trial)
      // Existing user: create-payment-upgrade
      const endpoint = isNewUser 
        ? `${API_BASE_URL}/subscriptions/create-payment`
        : `${API_BASE_URL}/subscriptions/create-payment-upgrade`;

      const paymentPayload = {
        plan_id: selectedPlan,
        amount: currentPlan.price,
          description: `Goi ${currentPlan.name}`,
        items: [
          {
            name: currentPlan.name,
            quantity: 1,
            price: currentPlan.price
          }
        ]
      };

      console.log("🎯 Payment endpoint:", endpoint);
      console.log("📦 Payment payload:", paymentPayload);
      console.log("👤 User type:", isNewUser ? "New User (Trial)" : "Existing User (Upgrade)");

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentPayload)
      });

      const responseText = await response.text();
      console.log("Payment response:", responseText);

      if (!response.ok) {
        // Kiểm tra nếu là lỗi người dùng mới chưa có gói
        if (response.status === 400 || response.status === 404) {
          try {
            const errorData = JSON.parse(responseText);
            // Nếu message cho biết người dùng chưa có gói hoặc cần trial
            if (errorData.message && (
              errorData.message.includes('trial') ||
              errorData.message.includes('new user') ||
              errorData.message.includes('no plan') ||
              errorData.message.includes('first time')
            )) {
              // Chuyển đến trang trial offer
              navigate('/trial-offer');
              return;
            }
          } catch (e) {
            // Nếu không parse được JSON, tiếp tục xử lý lỗi bình thường
          }
        }
        
        throw new Error(`Loi server: ${response.status} - ${responseText}`);
      }

      const result = JSON.parse(responseText);

      // Chấp nhận nhiều key khác nhau mà backend có thể trả về
      const payUrl =
        result?.result?.checkoutUrl ||
        result?.result?.paymentUrl ||
        result?.checkoutUrl ||
        result?.paymentUrl ||
        null;

      if (payUrl) {
        console.log("Redirect den PayOS:", payUrl);
        window.location.href = payUrl as string;
        return;
      }

      // Không có URL thanh toán: nếu là user mới thì đưa tới trial-offer, ngược lại báo lỗi rõ ràng
      if (isNewUser) {
        navigate('/trial-offer');
      } else {
        setPaymentResult({
          success: false,
          message: 'Không tìm thấy link thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
        });
      }
    } catch (error: any) {
      console.error("Loi thanh toan:", error);
      
      // Kiểm tra nếu lỗi liên quan đến người dùng mới
      const errorMessage = error.message || "";
      if (errorMessage.includes('trial') || 
          errorMessage.includes('new user') || 
          errorMessage.includes('no plan')) {
        navigate('/trial-offer');
      } else {
        setPaymentResult({
          success: false,
          message: "Loi: " + (error.message || "Khong the ket noi den server.")
        });
      }
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

      {/* Rest of your JSX remains exactly the same */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
        {/* LEFT SECTION - giữ nguyên */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Nâng cấp gói đăng ký</h1>

          {/* Plan Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">Chọn gói</label>
            <div className="space-y-3">
              {plans.map((plan: Plan) => (
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