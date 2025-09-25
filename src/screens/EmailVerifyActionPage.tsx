import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerifyEmail, refreshAccessToken } from '../lib/api';

const EmailVerifyActionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy email và email_verify_token từ query
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';
  const email_verify_token = params.get('token') || '';
  const refresh_token = params.get('refresh_token') || localStorage.getItem('refresh_token') || '';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const hasToken = Boolean(email_verify_token);
  const [manualToken, setManualToken] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const tokenToUse = hasToken ? email_verify_token : manualToken.trim();
      if (!tokenToUse) {
        throw new Error('Vui lòng dán mã xác thực từ email.');
      }
      const result = await verifyEmail(tokenToUse);
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
    setResendLoading(true);
    setResendMsg('');
    try {
      if (!refresh_token) {
        throw new Error('Thiếu refresh_token. Vui lòng đăng nhập lại.');
      }
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
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      if (!refresh_token) {
        throw new Error('Thiếu refresh_token. Vui lòng đăng nhập lại.');
      }
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
          className="mt-2 px-6 py-3 rounded-[16px] bg-[#222] text-white font-semibold text-lg disabled:opacity-60"
          onClick={hasToken ? handleVerify : handleSendLinkPrimary}
          disabled={hasToken ? loading : (!refresh_token || loading)}
        >
          {hasToken ? (loading ? 'Đang xác thực...' : 'Xác thực ngay') : (loading ? 'Đang gửi...' : 'Gửi link xác thực')}
        </button>
        {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
        {error && <div className="text-red-500 font-semibold text-center">{error}</div>}
        {/* Manual token input if the email sends a code instead of a link */}
        {!hasToken && (
          <div className="w-full flex flex-col items-center gap-3 mt-2">
            <input
              type="text"
              placeholder="Dán mã xác thực từ email"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleVerify();
                }
              }}
              className="w-full max-w-xs bg-white border border-[#ececec] rounded-[10px] px-4 py-2 text-[#222]"
            />
            <button
              className="px-6 py-3 rounded-[16px] bg-[#222] text-white font-semibold text-lg disabled:opacity-60"
              onClick={handleVerify}
              disabled={loading || !manualToken.trim()}
            >
              {loading ? 'Đang xác thực...' : 'Xác thực bằng mã' }
            </button>
          </div>
        )}
        <button
          className="mt-2 px-6 py-3 rounded-[16px] bg-[#ececec] text-[#222] font-semibold text-lg disabled:opacity-60"
          onClick={handleResend}
          disabled={resendLoading || !refresh_token}
        >
          {resendLoading ? 'Đang gửi lại...' : 'Gửi lại email xác thực'}
        </button>
        {resendMsg && <div className="text-green-600 font-semibold text-center">{resendMsg}</div>}
      </div>
    </div>
  );
};

export default EmailVerifyActionPage;
