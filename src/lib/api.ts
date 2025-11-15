// Google OAuth URL
export const getOauthGoogleUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: import.meta.env.VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};
// Tạo portfolio mới
export async function createPortfolio(data: {
  title: string;
  blocks: Array<{ type: string; content: string; order: number }>;
  social_links?: Record<string, any>;
  avatar_url?: string;
  banner_url?: string;
}) {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Creating portfolio with token:', token ? 'Yes' : 'No');

  const res = await fetch('https://2share.icu/portfolios/create-portfolio', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log('📡 Create portfolio response status:', res.status, 'data:', result);

  if (!res.ok) throw new Error(result.message || `HTTP ${res.status}: Lỗi tạo portfolio`);
  return result;
}
export interface DesignSettings {
  theme: string;
  profileLayout: number;
  buttonFill: number;
  buttonCorner: number;
  fontFamily: string;
  textColor: string;
  buttonTextColor: string;
  buttonColor: string;
  backgroundType: string;
  backgroundImage?: string;
  backgroundSolidColor?: string;
  backgroundGradient?: string;
  backgroundPattern?: string;
}
// Cập nhật portfolio hiện tại
export async function updatePortfolio(slug: string, data: {
  title?: string;
  blocks?: Array<{ type: string; content: string; order: number }>;
  social_links?: Record<string, any>;
  avatar_url?: string;
  banner_url?: string;
  design_settings?: DesignSettings;
}) {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('📤 updatePortfolio - Sending request with slug:', slug, 'data:', data);
  
  const res = await fetch(`https://2share.icu/portfolios/update-portfolio/${slug}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('📡 updatePortfolio - Response status:', res.status);
  console.log('📡 updatePortfolio - Response headers:', res.headers);

  const contentType = res.headers.get('content-type');
  let result;

  if (contentType?.includes('application/json')) {
    result = await res.json();
  } else {
    const text = await res.text();
    console.log('📡 updatePortfolio - Response text:', text.substring(0, 200));
    throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 200)}`);
  }

  if (!res.ok) {
    const message = result?.message || 'Lỗi cập nhật portfolio';
    const error = new Error(`HTTP_${res.status}:${message}`);
    throw error;
  }

  console.log('✅ updatePortfolio - Success:', result);
  return result;
}

// Lấy portfolio của chính mình (cần authentication)
export async function getMyPortfolio() {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Getting my portfolio with token:', token ? 'Yes' : 'No');

  const res = await fetch('https://2share.icu/portfolios/get-my-portfolio', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  console.log('📡 Get my portfolio response status:', res.status, 'data:', result);

  if (!res.ok) throw new Error(result.message || `HTTP ${res.status}: Lỗi lấy portfolio`);

  // If result is null, portfolio doesn't exist yet - throw error to trigger creation
  if (result.result === null) {
    throw new Error('Portfolio does not exist yet');
  }

  return result.result;
}

// Lấy danh sách tất cả portfolio của user (cần authentication)
export async function getMyPortfolios() {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Getting my portfolios with token:', token ? 'Yes' : 'No');

  const res = await fetch('https://2share.icu/portfolios/get-my-portfolio', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  console.log('📡 Get my portfolios response status:', res.status, 'data:', result);

  if (!res.ok) throw new Error(result.message || `HTTP ${res.status}: Lỗi lấy danh sách portfolio`);

  // Handle different response formats
  // If result is null, return empty array
  if (result.result === null) {
    return [];
  }

  // If result is already an array, return it
  if (Array.isArray(result.result)) {
    return result.result;
  }

  // If result is an object (single portfolio), wrap it in an array
  if (typeof result.result === 'object' && result.result !== null) {
    return [result.result];
  }

  // Fallback to empty array
  return [];
}



// Lấy portfolio public theo slug (không cần authentication)
export async function getPortfolioBySlug(slug: string) {
  const res = await fetch(`https://2share.icu/portfolios/get-portfolio/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi lấy portfolio công khai');
  return result.result;
}

// (Giữ tương thích cũ) Lấy portfolio public theo username qua query nếu backend còn hỗ trợ
export async function getPortfolioByUsername(username: string) {
  const res = await fetch(`https://2share.icu/portfolios/get-portfolio?username=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi lấy portfolio công khai');
  return result.result;
}
// src/lib/api.ts
export async function getMyProfile() {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Getting my profile with token:', token ? 'Yes' : 'No');

  const res = await fetch('https://2share.icu/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  console.log('📡 Get my profile response status:', res.status);

  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}: Lỗi lấy thông tin người dùng`);
  return data.result;
}

export async function updateMyProfile(data: {
  name?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  bio?: string;
  social_links?: Record<string, any>;
  username?: string;
}) {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Updating my profile with token:', token ? 'Yes' : 'No');

  const res = await fetch('https://2share.icu/users/me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log('📡 Update my profile response status:', res.status);

  if (!res.ok) throw new Error(result.message || `HTTP ${res.status}: Lỗi cập nhật thông tin`);
  return result;
}

export async function resendVerifyEmail(refresh_token: string) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Gợi ý URL xác thực để backend render link click-được trong email
  // Nếu backend bỏ qua trường này thì không ảnh hưởng
  // Ưu tiên domain deploy theo yêu cầu
  const verify_url = `https://2-share-nu.vercel.app/verify-email`;
  const res = await fetch('https://2share.icu/users/resend-verify-email', {
    method: 'POST',
    headers,
    body: JSON.stringify({ refresh_token, verify_url }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi gửi email xác thực');
  return result;
}

export async function verifyEmail(token: string) {
  const res = await fetch('https://2share.icu/users/verify-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Gửi theo schema mới: code
    // Đồng thời giữ tương thích ngược với key email_verify_token nếu backend cũ
    body: JSON.stringify({ code: token, email_verify_token: token }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi xác thực email');
  return result;
}

// Đổi refresh_token lấy access_token mới sau khi xác thực email
export async function refreshAccessToken(refresh_token: string) {
  const res = await fetch('https://2share.icu/users/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi làm mới phiên đăng nhập');
  return result;
}

// Kiểm tra gói hiện tại của người dùng (yêu cầu đăng nhập)
export async function getCurrentPlan() {
  // Lấy token từ nhiều nơi có thể
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Getting current plan with token:', token ? 'Yes' : 'No');

  const url = 'https://2share.icu/users/get-current-plan';

  // Force revalidation to avoid 304 confusing our logic
  let res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      // Hint proxies/CDNs to not serve stale cached payloads
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  } as RequestInit);

  // Some environments may still return 304. If so, perform a cache-busted retry.
  if (res.status === 304) {
    console.warn('⚠️ getCurrentPlan received 304 Not Modified. Retrying with cache-busting...');
    res = await fetch(`${url}?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      cache: 'reload',
    } as RequestInit);
  }

  // Try to parse JSON, but keep raw text for debugging if needed
  const text = await res.text();
  let result: any = {};
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    console.warn('⚠️ getCurrentPlan response is not valid JSON. Text:', text?.slice(0, 200));
  }
  console.log('📡 Get current plan response status:', res.status, 'data:', result);

  if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}: Lỗi lấy gói hiện tại`);
  return result; // backend có thể trả {result: {...}} hoặc object thẳng
}

// Hủy subscription hiện tại
export async function cancelSubscription() {
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Cancelling subscription with token:', token ? 'Yes' : 'No');

  const res = await fetch('https://2share.icu/subscriptions/cancel', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json().catch(() => ({}));
  console.log('📡 Cancel subscription response status:', res.status, 'data:', result);

  if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}: Lỗi hủy subscription`);
  return result;
}

// Get the Trial plan ID from backend
export async function getTrialPlanId(): Promise<string> {
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  console.log('🔍 Fetching Trial plan ID...');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch('https://2share.icu/plans/get-plans', {
    method: 'GET',
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch plans: HTTP ${res.status}`);
  }

  const data = await res.json();
  
  if (data.message === "Get plan successfully" && data.result) {
    // Find Trial plan (price = 0 or isTrial = true)
    const trialPlan = data.result.find((plan: any) => 
      plan.price === 0 || plan.isTrial === true
    );
    
    if (!trialPlan) {
      throw new Error('Trial plan not found in database');
    }
    
    const trialPlanId = trialPlan._id || trialPlan.id;
    console.log('✅ Found Trial plan:', trialPlan.name, 'ID:', trialPlanId);
    return trialPlanId;
  }
  
  throw new Error('Invalid response format from get-plans API');
}

// Kích hoạt gói trial cho người dùng mới (ALWAYS use Trial plan from database, ignore passed planId)
export async function activateTrial(originalPlanId?: string) {
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🎁 Activating trial...');
  
  // IMPORTANT: Always fetch and use the actual Trial plan ID from database
  // Do NOT use the planId that user selected in UI
  const trialPlanId = await getTrialPlanId();
  console.log(`🔄 Using Trial plan ID from database: ${trialPlanId} (Original plan ID was: ${originalPlanId || 'none'})`);

  // NOTE: Backend requires minimal validation: amount >= 1000 and items must be non-empty
  // Even for trial, backend will record a TRIAL gateway and amount 0 internally.
  const res = await fetch('https://2share.icu/subscriptions/create-payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: trialPlanId, // Use Trial plan ID from database
      // Send a minimal valid amount to satisfy validation (won't charge for trial)
      amount: 2000,
      description: 'Trial activation - 7 days free trial',
      items: [
        {
          name: 'Trial 7 days',
          quantity: 1,
          price: 2000,
        },
      ],
    }),
  });

  const result = await res.json().catch(() => ({}));
  console.log('📡 Activate trial response status:', res.status, 'data:', result);

  if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}: Lỗi kích hoạt trial`);
  return result;
}

// Quên mật khẩu: gửi email chứa liên kết đặt lại mật khẩu
export async function forgotPassword(email: string) {
  // Gợi ý URL reset password để backend render link click-được trong email
  // Bao gồm email trong URL để có thể test login sau khi reset
  const reset_url = `https://2-share-nu.vercel.app/reset-password?email=${encodeURIComponent(email)}`;
  const res = await fetch('https://2share.icu/users/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, reset_url }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi gửi email đặt lại mật khẩu');
  return result;
}

// Xác minh forgot_password_token trước khi đặt lại mật khẩu
export async function verifyForgotPassword(forgot_password_token: string) {
  const res = await fetch('https://2share.icu/users/verify-forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ forgot_password_token }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Token đặt lại mật khẩu không hợp lệ');
  return result;
}

// Đặt lại mật khẩu với token đã được gửi qua email
export async function resetPassword(data: { password: string; confirm_password: string; forgot_password_token: string; }) {
  console.log('Sending reset password request:', {
    password: data.password.substring(0, 3) + '***',
    confirm_password: data.confirm_password.substring(0, 3) + '***',
    forgot_password_token: data.forgot_password_token.substring(0, 10) + '...'
  });
  
  const res = await fetch('https://2share.icu/users/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: data.password,
      confirm_password: data.confirm_password,
      forgot_password_token: data.forgot_password_token
    }),
  });
  const result = await res.json();
  console.log('Reset password response:', result);
  if (!res.ok) throw new Error(result.message || 'Lỗi đặt lại mật khẩu');
  return result;
}

// Test login function để kiểm tra mật khẩu mới
export async function testLogin(email: string, password: string) {
  console.log('Testing login with new password...');
  const res = await fetch('https://2share.icu/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  console.log('Test login response:', data);
  return { success: res.ok, data };
}

// Upload image function - SỬA LẠI để dùng blob URL tạm thời
export async function uploadImage(file: File): Promise<string> {
  console.log('📤 Uploading image:', file.name, file.size, file.type);

  try {
    // KIỂM TRA KÍCH THƯỚC VÀ ĐỊNH DẠNG TRƯỚC
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Kích thước ảnh không được vượt quá 5MB');
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
    }

    // TẠO BLOB URL TẠM THỜI (sẽ hoạt động ngay lập tức)
    const blobUrl = URL.createObjectURL(file);
    console.log('✅ Created temporary blob URL:', blobUrl);
    
    return blobUrl;

  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error('Không thể upload ảnh: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// =========================
// Admin - Users CRUD APIs
// =========================
export type AdminUser = {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  is_verified?: boolean;
  verify?: number; // 0 = chưa verify, 1 = đã verify
  status?: string;
  created_at?: string;
};

const ADMIN_BASE = 'https://2share.icu/admins';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as Record<string, string>;
}

function unwrap<T = any>(res: Response, data: any): T {
  if (!res.ok) {
    const msg = data?.message || `HTTP_${res.status}`;
    throw new Error(msg);
  }
  // backend may wrap in {result} or return raw
  return (data?.result ?? data) as T;
}

export async function adminGetAllUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${ADMIN_BASE}/users`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  const unwrapped = unwrap<any>(res, data);
  // Try common shapes
  if (Array.isArray(unwrapped)) return unwrapped as AdminUser[];
  if (Array.isArray(unwrapped?.users)) return unwrapped.users as AdminUser[];
  if (Array.isArray(data?.users)) return data.users as AdminUser[];
  return [];
}

export async function adminCreateUser(payload: {
  name?: string;
  email: string;
  password: string;
  role?: string;
}): Promise<AdminUser> {
  const res = await fetch(`${ADMIN_BASE}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return unwrap<AdminUser>(res, data);
}

export async function adminUpdateUser(
  id: string,
  payload: Partial<{ name: string; email: string; password: string; role: string; is_verified: boolean; status: string }>
): Promise<AdminUser> {
  const res = await fetch(`${ADMIN_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return unwrap<AdminUser>(res, data);
}

export async function adminDeleteUser(id: string): Promise<{ deleted: boolean } | any> {
  const res = await fetch(`${ADMIN_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  return unwrap(res, data);
}

// =========================
// Analytics APIs
// =========================
export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  clickRate: number;
  socialStats: Array<{
    name: string;
    clicks: number;
    url: string;
    displayName?: string;
    icon?: string;
    color?: string;
  }>;
}

export async function getMyAnalytics(): Promise<AnalyticsData> {
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  console.log('🔑 Getting my analytics with token:', token ? 'Yes' : 'No');

  try {
    // Call the new analytics API from backend
    const res = await fetch('https://2share.icu/portfolios/get-portpolio-analytics', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check content type before parsing
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON. Please check API endpoint.');
    }

    const response = await res.json();
    console.log('📡 Get analytics response status:', res.status, 'data:', response);

    if (!res.ok) throw new Error(response.message || `HTTP ${res.status}: Lỗi lấy thống kê`);

    // Parse the new API response structure
    const analyticsResult = response.result;
    
    if (!analyticsResult || !analyticsResult.portfolios || analyticsResult.portfolios.length === 0) {
      return {
        totalViews: 0,
        totalClicks: 0,
        clickRate: 0,
        socialStats: []
      };
    }

    // Calculate total views from all portfolios
    let totalViews = 0;
    let totalClicks = 0;

    analyticsResult.portfolios.forEach((portfolio: any) => {
      if (portfolio.stats && Array.isArray(portfolio.stats)) {
        portfolio.stats.forEach((stat: any) => {
          if (stat.type === 'view') {
            totalViews += stat.count || 0;
          } else if (stat.type === 'click') {
            totalClicks += stat.count || 0;
          }
        });
      }
    });

    // Try to get portfolio social links for detailed stats (optional)
    let socialStats: AnalyticsData['socialStats'] = [];
    
    try {
      const myPortfolio = await getMyPortfolio();
      
      if (myPortfolio && myPortfolio.social_links) {
        Object.entries(myPortfolio.social_links).forEach(([key, value]: any) => {
          const clicks = value?.clicks || 0;
          
          if (value && (value.url || value.isEnabled)) {
            socialStats.push({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              clicks: clicks,
              url: value.url || '',
              displayName: value.displayName || key.charAt(0).toUpperCase() + key.slice(1),
              icon: value.icon || '🔗',
              color: value.color || '#6e6e6e',
            });
          }
        });

        // Sort by clicks descending
        socialStats.sort((a, b) => b.clicks - a.clicks);
      }
    } catch (portfolioError) {
      console.warn('⚠️ Could not fetch portfolio for social stats:', portfolioError);
      // Continue without social stats - just show total views/clicks
    }

    // Calculate click rate
    const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    return {
      totalViews,
      totalClicks,
      clickRate,
      socialStats
    };
  } catch (error) {
    console.error('❌ Error getting analytics:', error);
    throw error;
  }
  }

const API_BASE_URL = 'https://simplified-ai-server.onrender.com';

export interface PortfolioSuggestionRequest {
  userInfo: string;
  currentDesign?: {
    theme?: string;
    layout?: number;
    fontFamily?: string;
    buttonFill?: number;
    buttonCorner?: number;
  };
}

export interface PortfolioSuggestionResponse {
  palette: number[];
  fonts: string[];
  layout: {
    number: number;
    name: string;
    explanation: string;
  };
  bio: string;
  social_suggestions: string[];
  allColorThemes: Array<{
    number: number;
    name: string;
    description: string;
  }>;
  allLayouts: Array<{
    number: number;
    name: string;
    description: string;
  }>;
}

// Thêm API key constant - bạn có thể dùng environment variable
const AI_API_KEY = 'YOUR_API_KEY'; // Thay bằng API key thực tế

export const getPortfolioSuggestions = async (
  request: PortfolioSuggestionRequest
): Promise<PortfolioSuggestionResponse> => {
  console.log('🔄 Calling AI portfolio suggestions API...');
  
  const response = await fetch(`${API_BASE_URL}/portfolio-suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_API_KEY // THÊM API KEY VÀO HEADERS
    },
    body: JSON.stringify(request)
  });

  console.log('📡 AI API Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ AI API Error:', errorText);
    
    if (response.status === 401) {
      throw new Error('API key không hợp lệ hoặc thiếu');
    } else if (response.status === 403) {
      throw new Error('Không có quyền truy cập AI API');
    }
    throw new Error(`Lỗi AI API: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ AI API Response data:', data);
  return data;
};

export const getQuoteOfTheDay = async () => {
  console.log('🔄 Calling quote of the day API...');
  
  const response = await fetch(`${API_BASE_URL}/quote-of-the-day`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_API_KEY // THÊM API KEY CHO QUOTE API NẾU CẦN
    }
  });

  console.log('📡 Quote API Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Quote API Error:', errorText);
    throw new Error(`Lỗi Quote API: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ Quote API Response data:', data);
  return data;
};