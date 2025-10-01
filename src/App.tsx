import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuthCallbackHandler from './components/AuthGoogle/OAuthCallbackHandler';
import LoginPage from './components/LoginRegister/LoginPage';
import RegisterPage from './components/LoginRegister/RegisterPage';
import ForgotPasswordPage from './components/Password/ForgotPasswordPage';
import ResetPasswordPage from './components/Password/ResetPasswordPage';
import { MyLinksPage } from './screens/MyLinksPage/MyLinksPage';
import UserProfilePage from './screens/UserProfilePage';
import VerifyEmailPage from './screens/VerifyEmailPage';
import EmailVerifyActionPage from './screens/EmailVerifyActionPage';
import { getMyProfile } from './lib/api';
import Header from './components/MainLayout/Header';
import Hero from './components/MainLayout/Hero';

// Wrapper để lấy user từ API và truyền vào UserProfilePage
function UserProfilePageWrapper() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Đang tải thông tin...</div>;
  if (error || !user) return <div className="flex items-center justify-center h-screen text-red-500">{error || "Không có thông tin người dùng"}</div>;
  return <UserProfilePage user={user} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <div className="bg-[#225C29]">
                <Header />
                <Hero />
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/my-links" element={<MyLinksPage />} />
          <Route path="/account" element={<UserProfilePageWrapper />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/email-verify-action" element={<EmailVerifyActionPage />} />
          {/* Route xử lý callback OAuth Google */}
          <Route path="/oauth/google" element={<OAuthCallbackHandler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
