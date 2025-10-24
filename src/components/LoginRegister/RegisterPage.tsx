import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Lỗi từng trường
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  // Xử lý submit đăng ký
  // Validate nâng cao
  const validateName = (name: string) => {
    // Không chứa số hoặc ký tự đặc biệt, tối thiểu 2 từ, mỗi từ >=2 ký tự
    if (!name.trim()) return 'Vui lòng nhập họ và tên';
    if (/[^a-zA-ZÀ-ỹ\s]/.test(name)) return 'Họ và tên không được chứa số hoặc ký tự đặc biệt';
    if (name.trim().split(' ').length < 2) return 'Vui lòng nhập đầy đủ họ và tên';
    if (name.trim().split(' ').some(w => w.length < 2)) return 'Mỗi từ trong họ tên phải từ 2 ký tự';
    return '';
  };
  const validateEmail = (email: string) => {
    if (!email) return 'Vui lòng nhập email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
    return '';
  };
  const validateUsername = (username: string) => {
    if (!username) return 'Vui lòng nhập tên người dùng';
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) return 'Tên người dùng chỉ gồm chữ, số, dấu _ và từ 4-20 ký tự';
    if (/^\d+$/.test(username)) return 'Tên người dùng không được chỉ gồm số';
    return '';
  };
  const validatePassword = (password: string) => {
    if (!password) return 'Vui lòng nhập mật khẩu';
    if (password.length < 8) return 'Mật khẩu phải từ 8 ký tự trở lên';
    if (!/[A-Z]/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    if (!/[a-z]/.test(password)) return 'Mật khẩu phải có ít nhất 1 chữ thường';
    if (!/\d/.test(password)) return 'Mật khẩu phải có ít nhất 1 số';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
    return '';
  };
  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu';
    if (confirmPassword !== password) return 'Xác nhận mật khẩu không khớp';
    return '';
  };

  // Xử lý realtime validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError(validateUsername(e.target.value));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
    // Cập nhật lại xác nhận mật khẩu nếu đã nhập
    if (confirmPassword) setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
  };
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(validateConfirmPassword(e.target.value, password));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    // Validate tất cả trường trước khi submit
    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(confirmPassword, password);
    setNameError(nErr);
    setEmailError(eErr);
    setUsernameError(uErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);
    if (nErr || eErr || uErr || pErr || cpErr) {
      setFormError('Vui lòng kiểm tra lại các trường bên dưới.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://2share.icu/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
          username
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || 'Đăng ký thất bại');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setFormError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="h-screen bg-white flex items-center justify-center overflow-hidden">      {/* Logo góc trên bên phải */}
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
            Tham gia 2Share
          </h1>
          {/* Subtitle */}
          <p className="text-[20px] font-bold leading-[18.4px] text-[#CAC1C1] mb-[39px] font-['League_Spartan'] text-center">
            Đăng ký miễn phí!
          </p>
          {/* Register Form */}
          <form className="mb-[18px] w-full flex flex-col items-center space-y-3" onSubmit={handleRegister}>
            {/* Họ và tên */}
            <div className="w-[475px] min-h-[59px] bg-[#F1F0F0] rounded-[10px] px-[21px] flex flex-col justify-center">
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={handleNameChange}
                className="w-full bg-transparent text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] placeholder-[#CAC1C1] outline-none font-['League_Spartan']"
                required
                autoComplete="off"
              />
              {nameError && <span className="text-red-500 text-xs font-semibold mt-1">{nameError}</span>}
            </div>
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
            {/* Tên người dùng */}
            <div className="w-[475px] min-h-[59px] bg-[#F0F0F0] rounded-[10px] px-[21px] flex flex-col justify-center">
              <input
                type="text"
                placeholder="Tên người dùng"
                value={username}
                onChange={handleUsernameChange}
                className="w-full bg-transparent text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] placeholder-[#CAC1C1] outline-none font-['League_Spartan']"
                required
                autoComplete="off"
              />
              {usernameError && <span className="text-red-500 text-xs font-semibold mt-1">{usernameError}</span>}
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
                  autoComplete="new-password"
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
            {/* Xác nhận mật khẩu */}
            <div className="w-[475px] min-h-[59px] bg-[#F0F0F0] rounded-[10px] px-[21px] flex flex-col justify-center">
              <div className="flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full bg-transparent text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] placeholder-[#CAC1C1] outline-none font-['League_Spartan']"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="ml-2 focus:outline-none"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={0}
                  aria-label={showConfirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}
                >
                  {showConfirmPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>
              {confirmPasswordError && <span className="text-red-500 text-xs font-semibold mt-1">{confirmPasswordError}</span>}
            </div>
            {formError && <div className="text-red-500 w-full text-center text-sm font-semibold mt-2">{formError}</div>}
            <button
              type="submit"
              className="w-[475px] h-[59px] bg-[#1B1111] rounded-[10px] flex items-center justify-center mb-[19px] hover:bg-[#2a1a1a] transition-colors text-white text-[24px] font-bold leading-[22.08px] font-['League_Spartan'] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
          {/* Or divider */}
          <div className="text-center mb-[14px] w-full">
            <span className="text-[14px] font-bold leading-[12.88px] text-[#CAC1C1] font-['League_Spartan']">
              Hoặc
            </span>
          </div>
          {/* Social Login Buttons */}
          <div className="space-y-[18px] mb-[20px] w-full flex flex-col items-center">
            {/* Google Login */}
            <button className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] flex items-center px-[21px] hover:bg-[#e8e8e8] transition-colors">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/kAvOZ8CcqE.svg" 
                alt="Google" 
                className="w-[22.54px] h-[19px] mr-[11px]"
              />
              <span className="text-[20px] font-bold leading-[18.4px] text-black font-['League_Spartan']">
                Đăng ký bằng Google
              </span>
            </button>

            {/* Facebook Login
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
            </button> */}

            {/* Phone Login */}
            {/* <button className="w-[475px] h-[59px] bg-[#F0F0F0] rounded-[10px] flex items-center px-[21px] hover:bg-[#e8e8e8] transition-colors">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/cAXi8U5rXE.svg" 
                alt="WhatsApp" 
                className="w-[22.89px] h-[19px] mr-[10px]"
              />
              <span className="text-[20px] font-bold leading-[18.4px] text-black font-['League_Spartan']">
                Đăng ký bằng số điện thoại
              </span>
            </button> */}
          </div>

          {/* Forgot Password Links
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
          </div> */}
          {/* Sign Up Link */}
          <div className="flex items-center justify-center w-full">
            <span className="text-[20px] font-bold leading-[18.4px] text-[#CAC1C1] font-['League_Spartan'] mr-[14px]">
              Đã có tài khoản?
            </span>
            <button
              className="text-[20px] font-bold leading-[18.4px] text-[rgba(219,143,145,0.71)] font-['League_Spartan'] hover:underline"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
      {/* Right side - Image, ẩn trên mobile */}
      <div className="hidden lg:flex flex-1 h-full">
        <img 
          src="/images/image.png"
          alt="Login background"
          className="w-auto h-full object-cover"
        />
      </div>
    </div>
  )
}

export default RegisterPage
