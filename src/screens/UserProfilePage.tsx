import React, { useState } from 'react';
import { NavigationMenuSection } from './MyLinksPage/sections/NavigationMenuSection/NavigationMenuSection';
import { SettingsIcon } from 'lucide-react';
import { updateMyProfile } from '../lib/api';

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
    refresh_token?: string;
    email_verify_token?: string;
  };
}

const UserProfilePage: React.FC<UserProfileProps> = ({ user }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    avatar_url: user.avatar_url || '',
    // format ISO to YYYY-MM-DD for input[type=date]
    date_of_birth: user.date_of_birth ? String(user.date_of_birth).slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await updateMyProfile(form);
      setSuccess('Cập nhật thành công!');
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  // Nút "Xác thực ngay" sẽ điều hướng sang trang hành động xác thực

  return (
    <div className="w-full min-h-screen flex bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="hidden md:block pt-12 pr-8">
        <NavigationMenuSection user={user} />
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col pt-12">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-8 pb-6 border-b border-[#ececec]">
          <h1 className="text-3xl font-bold text-[#222]">Tài khoản</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-[#ececec] bg-white hover:bg-gray-100 transition-colors">
            <SettingsIcon className="w-6 h-6 text-[#222]" />
          </button>
        </div>
        {/* Profile Info Card */}
        <section className="flex justify-center items-start py-12">
          <form className="w-full max-w-xl bg-white rounded-[32px] border border-[#ececec] px-10 py-8 flex flex-col gap-6 shadow-[0_2px_8px_#0001]" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-[#222]">Thông tin của tôi</h2>
            <div className="flex flex-col gap-4">
              <div>
                <span className="block text-sm text-[#888] mb-1">Họ và tên</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="text-lg font-semibold text-[#222] w-full bg-transparent border-b border-[#ececec] focus:outline-none" />
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Email</span>
                <div className="text-lg text-[#222]">{user.email}</div>
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Username</span>
                <div className="text-lg text-[#222]">{user.username}</div>
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Số điện thoại</span>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="text-lg text-[#222] w-full bg-transparent border-b border-[#ececec] focus:outline-none" />
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Avatar URL</span>
                <input type="text" name="avatar_url" value={form.avatar_url} onChange={handleChange} className="text-lg text-[#222] w-full bg-transparent border-b border-[#ececec] focus:outline-none" />
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Ngày sinh</span>
                <input type="date" name="date_of_birth" value={form.date_of_birth || ''} onChange={handleChange} className="text-lg text-[#222] w-full bg-transparent border-b border-[#ececec] focus:outline-none" />
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Gói tài khoản</span>
                <div className="text-lg text-[#222]">{user.plan || 'free'}</div>
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">Xác thực</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[#222]">{user.verify ? 'Đã xác thực' : 'Chưa xác thực'}</span>
                  {!user.verify && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-[10px] bg-[#222] text-white font-semibold text-sm disabled:opacity-60"
                      onClick={() => {
                        // Chuyển hướng sang trang xác thực email, truyền đủ param
                        const refreshToken = user.refresh_token || localStorage.getItem('refresh_token') || '';
                        window.location.href = `/email-verify-action?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(user.email_verify_token || '')}&refresh_token=${encodeURIComponent(refreshToken)}`;
                      }}
                    >
                      Xác thực ngay
                    </button>
                  )}
                </div>
                
              </div>
              <div>
                <span className="block text-sm text-[#888] mb-1">ID</span>
                <div className="text-lg text-[#222]">{user._id}</div>
              </div>
            </div>
            {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
            {error && <div className="text-red-500 font-semibold text-center">{error}</div>}
            <button type="submit" className="w-full h-12 mt-6 rounded-[16px] bg-[#222] text-white font-semibold text-lg disabled:opacity-60" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UserProfilePage;
