import React, { useState } from 'react';
import { FiKey } from 'react-icons/fi';
import { forgotPassword } from '../lib/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f2f2] py-8">
      {/* Icon key */}
      <div className="mb-2 flex justify-center">
        <FiKey size={48} color="#FFD600" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Forgot your password?</h2>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow w-full max-w-md flex flex-col items-center">
        <p className="text-center text-[15px] font-medium mb-6 text-black">
          Enter the email address associated with your account, and we'll<br />
          email you a link to reset your password
        </p>
        {submitted ? (
          <div className="text-green-600 text-center font-semibold py-4">If the email exists, a reset link has been sent!</div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <div className="text-red-600 text-sm mb-3 w-full text-left">{error}</div>}
            <button
              type="submit"
              className={`w-full text-white py-3 rounded-lg text-lg font-bold transition mb-2 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-900'}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
        <a href="#" className="block text-center text-black underline text-[15px] mt-2">Forgot login email?</a>
      </div>
      {/* Logo dự án dưới cùng */}
      <div className="mt-10 flex flex-col items-center">
        <img src="/public/images/logo.png" alt="2Share Logo" className="w-[140px] h-auto" />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
