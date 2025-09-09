import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-[750px] lg:min-h-[850px] bg-white flex items-center justify-center">
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
      src="public/images/logo.png" 
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
          <div className="mb-[18px] w-full flex justify-center">
            <div className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] px-[21px] flex items-center">
              <input
                type="text"
                placeholder="Tên đăng nhập hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] placeholder-[#CAC1C1] outline-none font-['League_Spartan']"
              />
            </div>
          </div>
          {/* Continue Button */}
          <button className="w-[475px] h-[59px] bg-[#1B1111] rounded-[10px] flex items-center justify-center mb-[19px] hover:bg-[#2a1a1a] transition-colors">
            <span className="text-[24px] font-bold leading-[22.08px] text-white font-['League_Spartan']">
              Tiếp tục
            </span>
          </button>
          {/* Or divider */}
          <div className="text-center mb-[14px] w-full">
            <span className="text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] font-['League_Spartan']">
              Hoặc
            </span>
          </div>
          {/* Social Login Buttons */}
          <div className="space-y-[18px] mb-[59px] w-full flex flex-col items-center">
            {/* Google Login */}
            <button className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] flex items-center px-[21px] hover:bg-[#e8e8e8] transition-colors">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/kAvOZ8CcqE.svg" 
                alt="Google" 
                className="w-[22.54px] h-[19px] mr-[11px]"
              />
              <span className="text-[20px] font-bold leading-[18.4px] text-black font-['League_Spartan']">
                Đăng nhập bằng Google
              </span>
            </button>

            {/* Facebook Login */}
            <button className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] flex items-center px-[21px] hover:bg-[#e8e8e8] transition-colors">
              <div className="w-[23px] h-[19px] mr-[8px] relative">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/Gs1KbKB7Th.svg" 
                  alt="Facebook background" 
                  className="absolute inset-0 w-full h-full"
                />
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/TOAh1d7AJE.svg" 
                  alt="Facebook f" 
                  className="absolute top-[3.52px] left-[6.35px] w-[10.49px] h-[15.48px]"
                />
              </div>
              <span className="text-[20px] font-bold leading-[18.4px] text-black font-['League_Spartan']">
                Đăng nhập bằng Facebook
              </span>
            </button>

            {/* Phone Login */}
            <button className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] flex items-center px-[21px] hover:bg-[#e8e8e8] transition-colors">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/cAXi8U5rXE.svg" 
                alt="WhatsApp" 
                className="w-[22.89px] h-[19px] mr-[10px]"
              />
              <span className="text-[20px] font-bold leading-[18.4px] text-black font-['League_Spartan']">
                Đăng nhập bằng số điện thoại
              </span>
            </button>
          </div>

          {/* Forgot Password Links */}
          <div className="flex flex-col items-center w-full mb-[33px]">
            <div className="flex items-center justify-center gap-10 w-full">
              <button className="text-[20px] font-bold leading-[18.4px] text-[#DB8F91] font-['League_Spartan'] hover:underline">
                Quên mật khẩu?
              </button>
              <div className="flex items-center">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/jbnLNpQ2Jx.svg" 
                  alt="Fingerprint" 
                  className="w-[23.01px] h-[24px] mr-[11px]"
                />
                <button className="text-[20px] font-bold leading-[18.4px] text-[#DB8F91] font-['League_Spartan'] hover:underline">
                  Quên tên đăng nhập?
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
          src="public/images/login.png"
          alt="Login background"
          className="w-full h-full object-cover min-h-[750px] lg:min-h-[850px]"
        />
      </div>
    </div>
  )
}

export default LoginPage
