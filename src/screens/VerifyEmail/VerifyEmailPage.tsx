import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, refreshAccessToken } from '../../lib/api';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState('Đang xác thực email...');

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('code');
    if (!token) {
      setStatus('error');
      setMessage('Thiếu mã xác thực email.');
      return;
    }
    verifyEmail(token)
      .then(async () => {
        // Refresh access token after verify so the session reflects new state
        try {
          const refreshToken = localStorage.getItem('refresh_token') || '';
          if (refreshToken) {
            const refreshed = await refreshAccessToken(refreshToken);
            if (refreshed?.result?.access_token) {
              localStorage.setItem('token', refreshed.result.access_token);
            }
          }
        } catch (e) {
          // non-blocking
          console.warn('Refresh token after verify failed:', e);
        }
        setStatus('success');
        setMessage('Xác thực email thành công!');
        setTimeout(() => {
          navigate('/login');
        }, 800);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Xác thực email thất bại.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
      <div className="bg-white rounded-[32px] border border-[#ececec] px-10 py-8 shadow-[0_2px_8px_#0001] flex flex-col items-center gap-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#222] mb-2">Xác thực email</h1>
        <div className={`text-lg font-semibold ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-500' : 'text-[#222]'}`}>{message}</div>
        {status === 'success' && (
          <button
            className="mt-4 px-6 py-3 rounded-[16px] bg-[#222] text-white font-semibold text-lg"
            onClick={() => navigate('/login')}
          >
            Quay lại đăng nhập
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
