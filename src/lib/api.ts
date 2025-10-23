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
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  const res = await fetch('https://2share.icu/portfolios/create-portfolio', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi tạo portfolio');
  return result;
}
// Cập nhật portfolio hiện tại
export async function updatePortfolio(data: {
  title?: string;
  blocks?: Array<{ type: string; content: string; order: number }>;
  social_links?: Record<string, any>;
  avatar_url?: string;
  banner_url?: string;
}) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');

  console.log('updatePortfolio - Sending request with data:', data);
  console.log('updatePortfolio - Token:', token?.substring(0, 20) + '...');

  const res = await fetch('https://2share.icu/portfolios/update-portfolio', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('updatePortfolio - Response status:', res.status);
  console.log('updatePortfolio - Response headers:', res.headers);

  const contentType = res.headers.get('content-type');
  let result;

  if (contentType?.includes('application/json')) {
    result = await res.json();
  } else {
    const text = await res.text();
    console.log('updatePortfolio - Response text:', text.substring(0, 200));
    throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 200)}`);
  }

  if (!res.ok) {
    const message = result?.message || 'Lỗi cập nhật portfolio';
    const error = new Error(`HTTP_${res.status}:${message}`);
    throw error;
  }
  return result;
}

// Lấy portfolio của chính mình (cần authentication)
export async function getMyPortfolio() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  const res = await fetch('https://2share.icu/portfolios/get-my-portfolio', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi lấy portfolio');
  return result.result;
}

// Lấy portfolio public theo username (không cần authentication)
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
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  const res = await fetch('https://2share.icu/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi lấy thông tin người dùng');
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
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  const res = await fetch('https://2share.icu/users/me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Lỗi cập nhật thông tin');
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

// Upload image function with presigned URL (2 steps process)
export async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');

  // Lấy thông tin file
  const filename = file.name;
  const filesize = file.size;
  const filetype = file.type || 'image/jpeg';

  try {
    // Bước 1: Lấy presigned URL
    const res1 = await fetch('https://cyperstack.com/media/images/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ filename, filesize }),
    });

    const data1 = await res1.json();
    if (!res1.ok) {
      throw new Error(data1.message || 'Không lấy được presigned URL');
    }
    const presignedUrl = data1.presignedUrl;
    const finalUrl = data1.url;
    if (!presignedUrl || !finalUrl) {
      throw new Error('Thiếu presignedUrl hoặc url trong response');
    }

    // Bước 2: Upload file lên S3
    const res2 = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': filetype,
      },
      body: file,
    });
    if (!res2.ok) {
      throw new Error('Lỗi upload file lên S3: ' + res2.status + ' ' + res2.statusText);
    }

    // Trả về url cuối cùng
    return finalUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
