// src/components/MockSidebar.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Figma,
  CreditCard,
  BarChart3,
  HelpCircle,
  User,
  LogOut,
  Crown
} from "lucide-react";

interface MockSidebarProps {
  user?: any;
}

export default function MockSidebar({ user }: MockSidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [show2ShareMenu, setShow2ShareMenu] = useState(true);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock logout function
  const handleMockLogout = () => {
    alert("Đây là mock logout - Trong thực tế sẽ chuyển hướng đến trang đăng nhập");
    setShowUserMenu(false);
  };

  // Mock navigation cho các trang chưa có
  const handleMockNavigation = (pageName: string) => {
    alert(`Trang ${pageName} đang được phát triển`);
    setShowUserMenu(false);
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 ml-2.5 bg-white overflow-y-auto border-r border-[#d9d9d9]">
      <div className="p-4 space-y-3">
        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="flex items-center gap-3 p-3 bg-white rounded-lg w-full cursor-pointer focus:outline-none hover:bg-gray-50 transition-colors"
            onClick={() => setShowUserMenu((p) => !p)}
            aria-haspopup="menu"
            aria-expanded={showUserMenu}
          >
            <img
              className="w-6 h-6 rounded-full"
              src={user?.avatar_url || "/images/profile-pictures/pfp.jpg"}
              alt="User avatar"
            />
            <span className="text-gray-600 truncate">@{user?.username || "username_123"}</span>
            <ChevronDown
              className={`w-4 h-4 ml-auto text-gray-600 transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute left-0 top-[105%] w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                onClick={() => handleMockNavigation("Tài khoản")}
              >
                <User className="w-5 h-5 mr-3 text-gray-700" />
                <span className="text-sm flex-1 text-left">Tài khoản</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-[#a259ff] hover:bg-gray-50"
                onClick={() => handleMockNavigation("Nâng cấp gói")}
              >
                <Crown className="w-5 h-5 mr-3 text-[#a259ff]" />
                <span className="text-sm flex-1 text-left">Nâng cấp gói</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-gray-50 rounded-b-lg border-t border-gray-200"
                onClick={handleMockLogout}
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                <span className="text-sm flex-1 text-left">Đăng xuất</span>
              </button>
            </div>
          )}
        </div>

        {/* My 2Share Section */}
        <div className="rounded-lg px-3 py-1">
          <div
            className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => setShow2ShareMenu((p) => !p)}
          >
            <Figma className="w-4 h-4" />
            <span className="font-medium">2Share của tôi</span>
            {show2ShareMenu ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </div>
          {show2ShareMenu && (
            <div className="border-l ml-2 pl-4 space-y-2">
              <button
                className={`block w-full text-left px-3 py-2 rounded-xl transition-colors ${
                  location.pathname.includes("/demo/my-links")
                    ? "bg-gray-300 text-black font-medium"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => navigate("/demo/my-links")}
              >
                Đường dẫn
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded-xl transition-colors ${
                  location.pathname.includes("/demo/portfolio-design")
                    ? "bg-gray-300 text-black font-medium"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => navigate("/demo/portfolio-design")}
              >
                Thiết kế
              </button>
            </div>
          )}
        </div>

        {/* NFC Card */}
        <button
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${
            location.pathname.includes("/demo/nfc")
            ? "bg-gray-300 text-black font-medium"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => navigate("/demo/nfc")} // THAY ĐỔI TỪ handleMockNavigation THÀNH navigate
        >
        <CreditCard className="w-4 h-4" />
        <span>Thẻ NFC của tôi</span>
        </button>

        {/* Statistics */}
        <button
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${
            location.pathname.includes("/demo/insights")
            ? "bg-gray-300 text-black font-medium"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => navigate("/demo/insights")} // THAY ĐỔI THÀNH navigate
        >
        <BarChart3 className="w-4 h-4" />
        <span>Thống kê</span>
        </button>

        {/* Subscription Plans */}
        <button
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${
            location.pathname.includes("/plans") || location.pathname.includes("/subscription")
            ? "bg-gray-300 text-black font-medium"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => navigate("/plans")} // Điều hướng đến trang plans thực tế
        >
        <Crown className="w-4 h-4" />
        <span>Gói đăng ký</span>
        </button>
      </div>

      {/* Help Button */}
      <div className="absolute bottom-6 left-6">
        <button 
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => handleMockNavigation("Trợ giúp")}
        >
          <HelpCircle className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </aside>
  );
}