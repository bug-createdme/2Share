import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuthCallbackHandler from './components/AuthGoogle/OAuthCallbackHandler';
import LoginPage from './components/LoginRegister/LoginPage';
import RegisterPage from './components/LoginRegister/RegisterPage';
import ForgotPasswordPage from './components/Password/ForgotPasswordPage';
import ResetPasswordPage from './components/Password/ResetPasswordPage';
import { MyLinksPage } from './screens/MyLinksPage/MyLinksPage';

import UserProfilePage from './screens/UserProfilePage';
import PortfolioDesignPage from './screens/PortfolioDesignPage';
import PublicPortfolioPage from './screens/PublicPortfolioPage';
import VerifyEmailPage from './screens/VerifyEmail/VerifyEmailPage';
import EmailVerifyActionPage from './screens/VerifyEmail/EmailVerifyActionPage';
import AdminPage from './screens/AdminPage';

import { getMyProfile } from './lib/api';
import Header from './components/MainLayout/Header';
import Hero from './components/MainLayout/Hero';
import NfcDesignPage from './screens/NfcDesignPage';
import SubscriptionUpgradePage from './screens/SubscriptionUpgradePage';
import InsightsPage from './screens/InsightPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
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
        setError(err.message || "Lỗi l��y thông tin người dùng");
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
      <AuthProvider>
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
            <Route
              path="/portfolio/design"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <PortfolioDesignPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nfc"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <NfcDesignPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-links/*"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <MyLinksPage />
                </ProtectedRoute>
              }
            />
            <Route path="/subscription" element={<SubscriptionUpgradePage/>} />
          <Route path='/insights' element={<InsightsPage/>}/>
          <Route
              path="/account"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserProfilePageWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/email-verify-action" element={<EmailVerifyActionPage />} />
            {/* Public portfolio route - không cần authentication */}
            <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
            {/* Route xử lý callback OAuth Google */}
            <Route path="/oauth/google" element={<OAuthCallbackHandler />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
