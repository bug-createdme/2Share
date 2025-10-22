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
  social_links?: Record<string, string>;
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
  social_links?: Record<string, string>;
  avatar_url?: string;
  banner_url?: string;
}) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  const res = await fetch('https://2share.icu/portfolios/update-portfolio', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
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
  social_links?: Record<string, string>;
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

  // Kiểm tra token có hợp lệ không
  if (!token.startsWith('eyJ')) {
    throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.');
  }

  console.log('Starting upload process for file:', {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  try {
    // ==================== BƯỚC 1: Lấy presigned URL ====================
    const formData = new FormData();
    formData.append('image', file);

    console.log('Step 1: Getting presigned URL...');
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    const step1Response = await fetch('https://2share.icu/medias/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Không thêm Content-Type, để browser tự động set với boundary cho multipart/form-data
      },
      body: formData,
    });

    const step1Result = await step1Response.json();
    console.log('Step 1 response (full):', JSON.stringify(step1Result, null, 2));
    console.log('Step 1 response summary:', {
      status: step1Response.status,
      ok: step1Response.ok,
      hasResult: !!step1Result.result,
      resultKeys: step1Result.result ? Object.keys(step1Result.result) : [],
      topLevelKeys: Object.keys(step1Result)
    });

    if (!step1Response.ok) {
      console.error('Step 1 failed:', {
        status: step1Response.status,
        statusText: step1Response.statusText,
        message: step1Result.message,
        errorInfo: step1Result.errorInfo
      });

      // Xử lý các lỗi cụ thể
      if (step1Response.status === 413) {
        throw new Error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      } else if (step1Response.status === 415) {
        throw new Error('Định dạng file không được hỗ trợ. Vui lòng chọn file hình ảnh.');
      } else if (step1Response.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (step1Response.status === 500 && step1Result.message?.includes('Input file is missing')) {
        throw new Error('Lỗi server: Không thể xử lý file upload. Backend có thể chưa hỗ trợ presigned URL hoặc cần cấu hình khác.');
      } else {
        throw new Error(step1Result.message || `Lỗi server: ${step1Response.status}`);
      }
    }

    // Lấy presigned URL và final URL từ response - thử nhiều cách
    const presignedUrl = step1Result.result?.presignedUrl || 
                         step1Result.result?.presigned_url ||
                         step1Result.presignedUrl || 
                         step1Result.presigned_url ||
                         step1Result.result?.uploadUrl ||
                         step1Result.uploadUrl;
                         
    const finalImageUrl = step1Result.result?.url || 
                         step1Result.result?.image_url ||
                         step1Result.result?.imageUrl ||
                         step1Result.url || 
                         step1Result.image_url ||
                         step1Result.imageUrl;

    // Kiểm tra xem có presigned URL không
    if (!presignedUrl) {
      console.warn('No presigned URL found in response. Checking if direct upload was used...');
      
      // Nếu không có presigned URL, có thể backend đã upload trực tiếp và trả về URL
      if (finalImageUrl) {
        console.log('Direct upload successful (no presigned URL needed), image URL:', finalImageUrl);
        return finalImageUrl;
      }
      
      console.error('Invalid response structure - no presignedUrl or finalUrl:', step1Result);
      throw new Error('Backend không trả về presigned URL hoặc URL ảnh. Response structure: ' + JSON.stringify(Object.keys(step1Result)));
    }

    console.log('Received presigned URL:', presignedUrl.substring(0, 80) + '...');
    console.log('Final image URL will be:', finalImageUrl);

    // ==================== BƯỚC 2: Upload file lên S3 với presigned URL ====================
    console.log('Step 2: Uploading file to S3 using presigned URL...');
    
    const step2Response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
      },
      body: file, // Gửi file binary trực tiếp
    });

    console.log('Step 2 response:', {
      status: step2Response.status,
      ok: step2Response.ok,
      statusText: step2Response.statusText
    });

    if (!step2Response.ok) {
      console.error('Step 2 (S3 upload) failed:', {
        status: step2Response.status,
        statusText: step2Response.statusText,
      });
      throw new Error(`Lỗi upload file lên S3: ${step2Response.status} ${step2Response.statusText}`);
    }

    console.log('Upload to S3 successful!');

    // Trả về URL cuối cùng của ảnh
    if (!finalImageUrl) {
      console.error('Invalid response structure - missing final URL:', step1Result);
      throw new Error('Không nhận được URL ảnh từ server');
    }

    console.log('Upload completed successfully, image URL:', finalImageUrl);
    return finalImageUrl;

  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
    throw error;
  }
}
