import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '@/lib/toast';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else if (savedUser || savedToken) {
      // Clean up inconsistent state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First, try to login as regular user to get access token
      const loginResponse = await fetch('https://2share.icu/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();

        if (loginData.result?.access_token) {
          // Store access token (for API calls)
          localStorage.setItem('token', loginData.result.access_token);

          // Also store refresh token if backend returns it (needed for email verification resend)
          const refreshToken =
            loginData.result?.refresh_token ||
            loginData.result?.refreshToken ||
            loginData.refresh_token ||
            loginData.refreshToken ||
            null;
          if (refreshToken) {
            localStorage.setItem('refresh_token', String(refreshToken));
          }

          // Test if user has admin access by calling admin API with token
          try {
            const adminResponse = await fetch('https://2share.icu/admins/get-user-stats', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${loginData.result.access_token}`,
                'Content-Type': 'application/json',
              },
            });

            if (adminResponse.ok) {
              // User is admin - redirect to admin dashboard
              const userData: User = {
                id: 'admin-1',
                email,
                role: 'admin',
                name: 'Administrator'
              };
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              showToast.success('Đăng nhập thành công! Chào mừng Admin.');
              navigate('/admin');
            } else {
              // User is regular user - redirect to my-links
              const userData: User = {
                id: 'user-1',
                email,
                role: 'user',
                name: 'User'
              };
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              showToast.success('Đăng nhập thành công! Chào mừng bạn.');
              navigate('/my-links');
            }
          } catch (adminError) {
            // If admin API call fails, assume user is regular user
            console.log('Admin API not accessible, treating as regular user');
            const userData: User = {
              id: 'user-1',
              email,
              role: 'user',
              name: 'User'
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            showToast.success('Đăng nhập thành công! Chào mừng bạn.');
            navigate('/my-links');
          }
        } else {
          throw new Error('Invalid login response');
        }
      } else {
        const errorData = await loginResponse.json();
        const errorMessage = errorData.message || 'Đăng nhập thất bại';
        showToast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message && error.message !== 'Đăng nhập thất bại') {
        showToast.error(error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    showToast.info('Đã đăng xuất thành công!');

    // Also log to console to verify the function is being called
    console.log('Logout function called, toast should appear');

    // Delay navigation để toast có thời gian hiển thị
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
