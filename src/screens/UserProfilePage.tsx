import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, CreditCard, Camera, Save, AlertCircle } from 'lucide-react';
import { updateMyProfile, getMyPortfolio, updatePortfolio } from '../lib/api';
import { showToast } from '../lib/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useRef } from 'react';
import ShareDialog from '../components/ShareDialog';

interface UserProfileProps {
  user: {
    _id: string;
    name: string;
    email: string;
    username: string;
    phone?: string | null;
    avatar_url?: string | null;
    plan?: string;
    verify?: number;
    date_of_birth?: string | null;
    created_at?: string | null;
    refresh_token?: string;
    email_verify_token?: string;
  };
}

const UserProfilePage: React.FC<UserProfileProps> = ({ user }) => {
  // Nếu đã xác thực email qua Google, ép verify = 1
  const emailVerified = typeof window !== 'undefined' && localStorage.getItem('email_verified') === 'true';
  if (emailVerified && user.verify !== 1) {
    user.verify = 1;
  }

  // Debug: Log user object để kiểm tra các field có sẵn
  console.log('UserProfilePage - User data:', user);
  console.log('Available user fields:', Object.keys(user));
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    avatar_url: user.avatar_url || '',
    // format ISO to YYYY-MM-DD for input[type=date]
    date_of_birth: user.date_of_birth ? String(user.date_of_birth).slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  // Mobile left sidebar toggle
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch my portfolio to get slug for share link
  useEffect(() => {
    (async () => {
      try {
        const p = await getMyPortfolio();
        if (p?.slug) setPortfolioSlug(p.slug);
      } catch {}
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyProfile(form);
      
      // Sync avatar to portfolio if changed
      if (form.avatar_url !== user.avatar_url) {
        try {
          const portfolio = await getMyPortfolio();
          if (portfolio && portfolio.slug) {
            await updatePortfolio(portfolio.slug, { avatar_url: form.avatar_url });
            console.log('✅ Avatar synced to portfolio');
          }
        } catch (portfolioErr) {
          console.warn('⚠️ Could not sync avatar to portfolio:', portfolioErr);
          // Don't show error to user, profile update was successful
        }
      }
      
      showToast.success('Cập nhật thành công!');
    } catch (err: any) {
      showToast.error(err.message || 'Lỗi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  // Display username from user object (backend is source of truth)
  const displayUsername = user.username;

  // Hàm mở dialog chia sẻ
  const handleOpenShareDialog = () => {
    setShowShareDialog(true);
  };
  // Hàm đóng dialog chia sẻ
  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
  };

  // Hàm format ngày thành viên
  const formatMemberSince = (createdAt?: string | null) => {
    if (!createdAt) return 'Từ 2024';

    try {
      const date = new Date(createdAt);
      const year = date.getFullYear();
      return `Từ ${year}`;
    } catch {
      return 'Từ 2024';
    }
  };

  return (
    <div className="font-spartan">
      {/* Mobile: Menu button to open left sidebar */}
      <button
        className="lg:hidden fixed top-3 left-3 z-30 bg-white rounded-lg p-2 shadow-md border border-gray-200 hover:bg-gray-50"
        onClick={() => setShowMobileSidebar(true)}
        aria-label="Mở menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar trái - Hidden on desktop container, slide-in on mobile */}
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full min-h-screen w-[200px] xl:w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 z-20">
        <Sidebar user={user} />
      </div>

      {/* Mobile slide-in sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white border-r border-[#d9d9d9] z-40 transition-transform duration-300 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar user={user} />
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          aria-label="Đóng menu"
          onClick={() => setShowMobileSidebar(false)}
        >
          <span className="text-gray-600 text-xl leading-none">×</span>
        </button>
      </div>

      {/* Mobile overlay */}
      {showMobileSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-[200px] xl:ml-[265px] bg-[#f7f7f7] min-h-screen flex flex-col">
        <main className="flex-1 w-full flex flex-col items-center pt-16 sm:pt-20">
          {/* Header */}
          <Header onShare={handleOpenShareDialog} shareBtnRef={shareBtnRef} />
          {/* Share Dialog */}
          {showShareDialog && (
            <ShareDialog
              open={showShareDialog}
              onClose={handleCloseShareDialog}
              portfolioLink={portfolioSlug ? `${window.location.origin}/portfolio/${portfolioSlug}` : ''}
              anchorRef={shareBtnRef}
              username={user?.username}
              avatarUrl={user?.avatar_url || undefined}
            />
          )}

          {/* Content Section */}
          <div className="w-full flex flex-col items-center flex-1 px-4 sm:px-6">
            <div className="w-full max-w-4xl flex flex-col items-center pt-6 sm:pt-8 lg:pt-12 pb-8">
              {/* Profile Header Card */}
              <Card className="mb-6 sm:mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-gray-50 w-full">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3 sm:gap-4 w-full md:w-auto">
                  <div className="relative">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-lg">
                      <AvatarImage src={form.avatar_url || user.avatar_url || ''} alt={form.name || user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl sm:text-2xl font-bold">
                        {(form.name || user.name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-lg"
                    >
                      <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{form.name || user.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-600">@{displayUsername}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="w-full md:flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">Gói</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-gray-900 capitalize">{user.plan || 'Free'}</p>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <Shield className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${user.verify ? 'text-green-500' : 'text-orange-500'}`} />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">Trạng thái</span>
                    </div>
                    <p className={`text-sm sm:text-base font-bold ${user.verify ? 'text-green-600' : 'text-orange-600'}`}>
                      {user.verify ? 'Đã xác thực' : 'Chưa xác thực'}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 col-span-2 md:col-span-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide">Thành viên</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatMemberSince(user.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="shadow-lg border-0 w-full">
            <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Cập nhật thông tin cá nhân của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Họ và tên
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Email
                  </label>
                  <div className="h-10 sm:h-12 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mr-2" />
                    <span className="text-sm sm:text-base text-gray-900 truncate">{user.email}</span>
                  </div>
                </div>

                {/* Username Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Username</label>
                  <div className="h-10 sm:h-12 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                    <span className="text-sm sm:text-base text-gray-900 font-mono">@{displayUsername}</span>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Số điện thoại
                  </label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Avatar URL Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Avatar URL
                  </label>
                  <Input
                    name="avatar_url"
                    value={form.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Date of Birth Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Ngày sinh
                  </label>
                  <Input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth || ''}
                    onChange={handleChange}
                    className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Verification Section */}
                {!user.verify && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-orange-800">Xác thực tài khoản</h3>
                        <p className="text-xs sm:text-sm text-orange-700">Vui lòng xác thực email để bảo mật tài khoản</p>
                      </div>
                      <Button
                        type="button"
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-sm h-9 sm:h-10"
                        onClick={() => {
                          const refreshToken = user.refresh_token || localStorage.getItem('refresh_token') || '';
                          window.location.href = `/email-verify-action?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(user.email_verify_token || '')}&refresh_token=${encodeURIComponent(refreshToken)}`;
                        }}
                      >
                        Xác thực ngay
                      </Button>
                    </div>
                  </div>
                )}



                {/* Submit Button */}
                <div className="pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm sm:text-base">Đang lưu...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Lưu thông tin</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
