import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerifyEmail, refreshAccessToken } from '../../lib/api';

const EmailVerifyActionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy email và email_verify_token từ query
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';
  const email_verify_token = params.get('token') || '';
  
  // Lấy refresh_token từ nhiều nguồn và lưu vào localStorage
  const refreshTokenFromUrl = params.get('refresh_token');
  if (refreshTokenFromUrl) {
    localStorage.setItem('refresh_token', refreshTokenFromUrl);
  }
  const refresh_token = refreshTokenFromUrl || localStorage.getItem('refresh_token') || '';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const hasToken = Boolean(email_verify_token);

  // Debug log
  console.log('Email:', email);
  console.log('Email verify token:', email_verify_token ? 'exists' : 'none');
  console.log('Refresh token:', refresh_token ? 'exists' : 'none');

  const handleVerify = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const result = await verifyEmail(email_verify_token);
      setSuccess(result.message || 'Xác thực email thành công!');
      // Sau khi xác thực: refresh access_token để API nhận trạng thái verify mới
      try {
        const refreshToken = localStorage.getItem('refresh_token') || '';
        if (refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken);
          if (refreshed?.result?.access_token) {
            localStorage.setItem('token', refreshed.result.access_token);
          }
        }
      } catch (e) {
        // Không chặn luồng nếu refresh token lỗi; vẫn điều hướng tiếp
        console.warn('Refresh access token after verify failed:', e);
      }
      // Điều hướng sau khi xác thực thành công
      const token = localStorage.getItem('token');
      setTimeout(() => {
        if (token) {
          navigate('/account');
        } else {
          navigate('/login');
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Lỗi xác thực email');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!refresh_token) {
      setResendMsg('Không tìm thấy refresh token. Vui lòng đăng nhập lại.');
      return;
    }
    setResendLoading(true);
    setResendMsg('');
    try {
      const result = await resendVerifyEmail(refresh_token);
      // For debugging visibility
      console.log('resendVerifyEmail result:', result);
      setResendMsg(result.message || 'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.');
    } catch (err: any) {
      console.error('resendVerifyEmail error:', err);
      setResendMsg(err.message || 'Lỗi gửi lại email xác thực');
    } finally {
      setResendLoading(false);
    }
  };

  // Primary button behavior when NO token: send verify email but keep independent loading state
  const handleSendLinkPrimary = async () => {
    if (!refresh_token) {
      setError('Không tìm thấy refresh token. Vui lòng đăng nhập lại.');
      return;
    }
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const result = await resendVerifyEmail(refresh_token);
      console.log('resend via primary result:', result);
      setSuccess(result.message || 'Đã gửi email xác thực. Vui lòng kiểm tra hộp thư.');
    } catch (err: any) {
      console.error('resend via primary error:', err);
      setError(err.message || 'Lỗi gửi email xác thực');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
      <div className="bg-white rounded-[32px] border border-[#ececec] px-10 py-8 shadow-[0_2px_8px_#0001] flex flex-col items-center gap-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#222] mb-2">Xác thực email</h1>
        <div className="text-lg text-[#222]">Email đăng ký: <span className="font-semibold">{email}</span></div>
        {/* Primary action */}
        <button
          className="mt-2 px-6 py-3 rounded-[16px] bg-[#222] text-white font-semibold text-lg disabled:opacity-60 hover:bg-[#333] transition-colors cursor-pointer"
          onClick={hasToken ? handleVerify : handleSendLinkPrimary}
          disabled={loading}
        >
          {hasToken ? (loading ? 'Đang xác thực...' : 'Xác thực ngay') : (loading ? 'Đang gửi...' : 'Gửi link xác thực')}
        </button>
        {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
        {error && <div className="text-red-500 font-semibold text-center">{error}</div>}
        <button
          className="mt-2 px-6 py-3 rounded-[16px] bg-[#ececec] text-[#222] font-semibold text-lg disabled:opacity-60 hover:bg-[#ddd] transition-colors cursor-pointer"
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? 'Đang gửi lại...' : 'Gửi lại email xác thực'}
        </button>
        {resendMsg && <div className="text-green-600 font-semibold text-center">{resendMsg}</div>}
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left w-full">
            <div>Email: {email}</div>
            <div>Has verify token: {hasToken ? 'Yes' : 'No'}</div>
            <div>Has refresh token: {refresh_token ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerifyActionPage;