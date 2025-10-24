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
import SubscriptionPlansPage from './screens/SubscriptionPlansPage'; // THÊM DÒNG NÀY
import InsightsPage from './screens/InsightPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PaymentSuccessPage from './screens/PaymentSuccessPage';
import PaymentCancelPage from './screens/PaymentCancelPage';
import TrialOfferPage from './screens/TrialOfferPage';

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
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <div className="relative overflow-hidden bg-white">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#fef5f8] to-[#fce8ef]"></div>
                  
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/30 to-transparent"></div>
                  
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#f7bfcf] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f7bfcf] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-100"></div>
                  
                  <div className="absolute top-3/4 left-1/3 w-96 h-96 bg-[#fce8ef] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

                  <div className="relative z-10">
                    <Header />
                    <Hero />
                  </div>
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
            {/* THÊM ROUTE MỚI CHO TRANG GÓI ĐĂNG KÝ */}
            <Route 
              path="/plans" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <SubscriptionPlansPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <SubscriptionUpgradePage />
                </ProtectedRoute>
              }
            />
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

            {/* PayOS callback aliases */}
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-cancel" element={<PaymentCancelPage />} />
            <Route path="/success" element={<PaymentSuccessPage />} />
            <Route path="/cancel" element={<PaymentCancelPage />} />
            <Route path="/trial-offer" element={<TrialOfferPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/email-verify-action" element={<EmailVerifyActionPage />} />
            {/* Public portfolio route - không cần authentication */}
            <Route path="/portfolio/:slug" element={<PublicPortfolioPage />} />
            {/* Route xử lý callback OAuth Google */}
            <Route path="/oauth/google" element={<OAuthCallbackHandler />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;