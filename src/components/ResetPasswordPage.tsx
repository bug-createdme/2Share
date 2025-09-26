import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword, verifyForgotPassword } from '../lib/api';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  useEffect(() => {
    async function verify() {
      setLoading(true);
      setError('');
      try {
        if (!token) throw new Error('Thiếu token');
        await verifyForgotPassword(token);
        setTokenValid(true);
      } catch (err: any) {
        setError(err.message || 'Token không hợp lệ');
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp');
      return;
    }
    try {
      setSubmitting(true);
      await resetPassword({ password, confirm_password: confirmPassword, forgot_password_token: token });
      setSuccess('Đặt lại mật khẩu thành công, chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-8">
      <h2 className="text-3xl font-bold text-center mb-2">Reset password</h2>
      <p className="text-gray-500 text-center mb-8 text-lg">Enter your new password.</p>
      {loading ? (
        <div className="text-gray-500">Đang kiểm tra token...</div>
      ) : !tokenValid ? (
        <div className="text-red-600">{error || 'Token không hợp lệ hoặc đã hết hạn'}</div>
      ) : (
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
        <div className="w-full mb-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#f6f8f3] rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black pr-12"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>
        <div className="w-full mb-3">
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-[#f6f8f3] rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black pr-12"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm(v => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mb-2 w-full text-left">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2 w-full text-left">{success}</div>}
        <button
          type="submit"
          className={`w-full text-white py-3 rounded-lg text-lg font-bold mt-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-900'}`}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Reset Password'}
        </button>
      </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
