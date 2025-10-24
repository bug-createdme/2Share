import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../lib/api';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Derive display name from multiple sources
  const derivedName = useMemo(() => {
    if (!user) return '';
    if (user.name && user.name !== 'User') return user.name;
    try {
      const pRaw = localStorage.getItem('profile');
      if (pRaw) {
        const p = JSON.parse(pRaw || '{}');
        const full = `${p.first_name || ''} ${p.last_name || ''}`.trim();
        if (full) return full;
        if (p.email) return String(p.email).split('@')[0];
      }
    } catch {}
    // Fallback to email prefix from stored user or localStorage
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u?.email) return String(u.email).split('@')[0];
      }
    } catch {}
    return 'Bạn';
  }, [user]);

  useEffect(() => {
    setDisplayName(derivedName);
  }, [derivedName]);

  // Try to resolve avatar from multiple sources; best-effort only
  useEffect(() => {
    if (!user) return;
    // 1) From OAuth profile
    try {
      const pRaw = localStorage.getItem('profile');
      if (pRaw) {
        const p = JSON.parse(pRaw || '{}');
        if (p.profile_picture_path) setAvatarUrl(p.profile_picture_path);
      }
    } catch {}
    // 2) From backend profile (if token exists)
    (async () => {
      try {
        const me = await getMyProfile();
        if (me?.avatar_url) setAvatarUrl(me.avatar_url);
        if (me?.name && me.name !== displayName) setDisplayName(me.name);
      } catch {
        // ignore errors – not critical on homepage
      }
    })();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  return (
    <header className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <nav className="bg-[#f3b4c3] rounded-[35px] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-14">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/Ut2E6nUPhe.png" 
              alt="2Share Logo" 
              className="h-8 w-auto ml-4"
            />
            
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading ? null : user ? (
              <div className="flex items-center gap-4" >
                <div className="hidden sm:block text-[18px] font-bold text-[#161515]">
                  Xin chào, <span className="truncate max-w-[180px] inline-block align-bottom">{displayName}</span>
                </div>
                <div className="relative" ref={menuRef}>
                  <button
                    aria-label="Tài khoản"
                    className="w-11 h-11 rounded-full border-2 border-white shadow ring-2 ring-[#f7d3db] overflow-hidden focus:outline-none focus:ring-[#eb9bb0] cursor-pointer"
                    onClick={() => setOpen(o => !o)}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#161515] text-white flex items-center justify-center text-lg font-bold">
                        {(displayName || 'B').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-56 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm text-gray-500">Đang đăng nhập</div>
                        <div className="text-sm font-semibold truncate">{displayName}</div>
                      </div>
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-[15px] hover:bg-gray-50"
                          onClick={() => { setOpen(false); navigate('/my-links'); }}
                        >
                          Trang của tôi
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-[15px] hover:bg-gray-50 text-red-600"
                          onClick={() => { setOpen(false); logout(); }}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  className="bg-[#f2e4e4] text-black font-bold text-xl font-spartan px-4 py-2 rounded-[10px] hover:bg-gray-300 transition-colors"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </button>
                <button
                  className="bg-[#161515] text-[#FCF1F1] font-bold text-xl font-spartan px-6 py-2 rounded-[30px] hover:bg-gray-800 transition-colors"
                  onClick={() => navigate('/register')}
                >
                  Đăng ký miễn phí
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
