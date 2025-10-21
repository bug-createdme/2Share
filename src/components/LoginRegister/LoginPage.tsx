import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getOauthGoogleUrl } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // Lỗi từng trường
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  // SVG icon cho mắt
  const EyeIcon = (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4C6 4 2.73 8.11 2.73 11C2.73 13.89 6 18 11 18C16 18 19.27 13.89 19.27 11C19.27 8.11 16 4 11 4ZM11 16C7.13 16 4.27 12.36 4.27 11C4.27 9.64 7.13 6 11 6C14.87 6 17.73 9.64 17.73 11C17.73 12.36 14.87 16 11 16ZM11 8C9.34 8 8 9.34 8 11C8 12.66 9.34 14 11 14C12.66 14 14 12.66 14 11C14 9.34 12.66 8 11 8ZM11 12C10.45 12 10 11.55 10 11C10 10.45 10.45 10 11 10C11.55 10 12 10.45 12 11C12 11.55 11.55 12 11 12Z" fill="#CAC1C1"/>
    </svg>
  );
  const EyeOffIcon = (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L21 21" stroke="#CAC1C1" strokeWidth="2"/>
      <path d="M11 4C6 4 2.73 8.11 2.73 11C2.73 13.89 6 18 11 18C16 18 19.27 13.89 19.27 11C19.27 8.11 16 4 11 4ZM11 16C7.13 16 4.27 12.36 4.27 11C4.27 9.64 7.13 6 11 6C14.87 6 17.73 9.64 17.73 11C17.73 12.36 14.87 16 11 16ZM11 8C9.34 8 8 9.34 8 11C8 12.66 9.34 14 11 14C12.66 14 14 12.66 14 11C14 9.34 12.66 8 11 8ZM11 12C10.45 12 10 11.55 10 11C10 10.45 10.45 10 11 10C11.55 10 12 10.45 12 11C12 11.55 11.55 12 11 12Z" fill="#CAC1C1"/>
    </svg>
  );
  const navigate = useNavigate();

  // Xử lý submit login
  const validateEmail = (email: string) => {
    if (!email) return 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
    return '';
  };
  const validatePassword = (password: string) => {
    if (!password) return 'Vui lòng nhập mật khẩu';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return '';
  };

  // Xử lý realtime validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    // Validate tất cả trường trước khi submit
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) {
      setFormError('Vui lòng kiểm tra lại các trường bên dưới.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Login successful - navigation is handled by AuthContext
    } catch (err: any) {
      console.error('Login error:', err);
      setFormError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Logo góc trên bên phải */}
  <button
    type="button"
    className="fixed top-6 left-8 z-20 bg-white bg-opacity-80 rounded-md p-0 cursor-pointer focus:outline-none"
    onClick={() => navigate('/')}
    tabIndex={0}  
    aria-label="Về trang chủ"
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate('/');
      }
    }}
  >
    <img 
      src="/images/logo.png" 
      alt="2share Logo" 
      className="w-[125px] h-[29px]"
    />
  </button>
      <div className="w-full max-w-[679px] flex flex-col items-center px-4 sm:px-0 pt-[70px]">
        <div className="w-full flex flex-col items-center">
          {/* Title */}
          <h1 className="text-[40px] font-bold leading-[36.8px] text-black mb-[12px] font-['League_Spartan'] text-center">
            Chào mừng trở lại
          </h1>
          {/* Subtitle */}
          <p className="text-[20px] font-bold leading-[18.4px] text-[#CAC1C1] mb-[39px] font-['League_Spartan'] text-center">
            Đăng nhập vào 2share của bạn
          </p>
          {/* Username Input */}
          <form className="mb-[18px] w-full flex flex-col items-center space-y-3" onSubmit={handleLogin}>
            {/* Email */}
            <div className="w-[475px] min-h-[59px] bg-[#F0F0F0] rounded-[10px] px-[21px] flex flex-col justify-center">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className="w-full bg-transparent text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] placeholder-[#CAC1C1] outline-none font-['League_Spartan']"
                required
                autoComplete="off"
              />
              {emailError && <span className="text-red-500 text-xs font-semibold mt-1">{emailError}</span>}
            </div>
            {/* Mật khẩu */}
            <div className="w-[475px] min-h-[59px] bg-[#F0F0F0] rounded-[10px] px-[21px] flex flex-col justify-center">
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full bg-transparent text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] placeholder-[#CAC1C1] outline-none font-['League_Spartan']"
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="ml-2 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>
              {passwordError && <span className="text-red-500 text-xs font-semibold mt-1">{passwordError}</span>}
            </div>
            {formError && <div className="text-red-500 w-full text-center text-sm font-semibold mt-2">{formError}</div>}
            <button
              type="submit"
              className="w-[475px] h-[59px] bg-[#1B1111] rounded-[10px] flex items-center justify-center mb-[19px] hover:bg-[#2a1a1a] transition-colors text-white text-[24px] font-bold leading-[22.08px] font-['League_Spartan'] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          {/* Or divider */}
          <div className="text-center mb-[14px] w-full">
            <span className="text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] font-['League_Spartan']">
              Hoặc
            </span>
          </div>
          {/* Social Login Buttons */}
          <div className="space-y-[18px] mb-[59px] w-full flex flex-col items-center">
            {/* Google Login */}
            <button
              type="button"
              className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] flex items-center px-[21px] hover:bg-[#e8e8e8] transition-colors"
              onClick={() => window.location.href = getOauthGoogleUrl()}
            >
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/kAvOZ8CcqE.svg" 
                alt="Google" 
                className="w-[22.54px] h-[19px] mr-[11px]"
              />
              <span className="text-[20px] font-bold leading-[18.4px] text-black font-['League_Spartan']">
                Đăng nhập bằng Google
              </span>
            </button>
          </div>

          {/* Forgot Password Links */}
          <div className="flex flex-col items-center w-full mb-[33px]">
            <div className="flex items-center justify-center gap-10 w-full">
              <button
                className="text-[20px] font-bold leading-[18.4px] text-[#DB8F91] font-['League_Spartan'] hover:underline"
                type="button"
                onClick={() => navigate('/forgot-password')}
              >
                Quên mật khẩu?
              </button>
              <div className="flex items-center">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/jbnLNpQ2Jx.svg" 
                  alt="Fingerprint" 
                  className="w-[23.01px] h-[24px] mr-[11px]"
                />
                <button className="text-[20px] font-bold leading-[18.4px] text-[#DB8F91] font-['League_Spartan'] hover:underline">
                  Quên email?
                </button>
              </div>
            </div>
          </div>
          {/* Sign Up Link */}
          <div className="flex items-center justify-center w-full">
            <span className="text-[20px] font-bold leading-[18.4px] text-[#CAC1C1] font-['League_Spartan'] mr-[14px]">
              Không có tài khoản?
            </span>
            <button
              className="text-[20px] font-bold leading-[18.4px] text-[rgba(219,143,145,0.71)] font-['League_Spartan'] hover:underline"
              onClick={() => navigate('/register')}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      {/* Right side - Image, ẩn trên mobile */}
      <div className="hidden lg:flex flex-1 h-full">
        <img
          src="/images/login.jpg"
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default LoginPage
