import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Giả lập submit, có thể thay bằng API thực tế
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gửi mật khẩu mới lên backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-8">
      <h2 className="text-3xl font-bold text-center mb-2">Reset password</h2>
      <p className="text-gray-500 text-center mb-8 text-lg">Enter your new password.</p>
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
        <button
          type="submit"
          className="w-full bg-[#e6e8df] text-gray-400 py-3 rounded-lg text-lg font-bold mt-2 cursor-not-allowed"
          disabled
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
