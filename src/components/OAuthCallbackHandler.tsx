import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from './Header';
import Hero from './Hero';

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/profile');
    }
  }, [navigate]);

  // Nếu không có token thì render trang chủ
  return (
    <div className="bg-[#225C29]">
      <Header />
      <Hero />
    </div>
  );
};

export default OAuthCallbackHandler;
