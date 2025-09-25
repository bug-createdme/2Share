import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../lib/api';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState('Đang xác thực email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Thiếu mã xác thực email.');
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Xác thực email thành công!');
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
