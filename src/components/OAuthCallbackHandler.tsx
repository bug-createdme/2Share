import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/profile'); // hoặc đổi thành '/'
    }
  }, [navigate]);

  return null;
};

export default OAuthCallbackHandler;
