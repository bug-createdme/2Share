// src/components/Sidebar.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Figma,
  CreditCard,
  BarChart3,
  HelpCircle,
  User,
  LogOut,
  Send,
  Crown // THÊM ICON MỚI
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  user?: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [show2ShareMenu, setShow2ShareMenu] = useState(true);
  const location = useLocation(); // to know the current route
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

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white overflow-y-auto">
      <div className="p-4 space-y-3">
        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="flex items-center gap-3 p-3 bg-white rounded-lg w-full cursor-pointer focus:outline-none"
            onClick={() => setShowUserMenu((p) => !p)}
            aria-haspopup="menu"
            aria-expanded={showUserMenu}
          >
            <img
              className="w-6 h-6 rounded-full"
              src={user?.avatar_url || "https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-1.png"}
              alt="User avatar"
            />
            <span className="text-gray-600 truncate">@{user?.username || "username"}</span>
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
                onClick={() => {
                  window.location.href = '/account';
                  setShowUserMenu(false);
                }}
              >
                <User className="w-5 h-5 mr-3 text-gray-700" />
                <span className="text-sm flex-1 text-left">Tài khoản</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  navigate("/my-links");
                  setShowUserMenu(false);
                  // Trigger mở portfolios modal sau khi navigate
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-portfolios-modal'));
                  }, 100);
                }}
              >
                <Figma className="w-5 h-5 mr-3 text-gray-700" />
                <span className="text-sm flex-1 text-left">Portfolio</span>
              </button>
              {/* CẬP NHẬT: Chuyển hướng đến trang plans thay vì subscription */}
              <button
                className="w-full flex items-center px-4 py-2 text-[#a259ff] hover:bg-gray-50"
                onClick={() => {
                  navigate("/plans"); // THAY ĐỔI TỪ "/subscription" THÀNH "/plans"
                  setShowUserMenu(false);
                }}
              >
                <Crown className="w-5 h-5 mr-3 text-[#a259ff]" />
                <span className="text-sm flex-1 text-left">Nâng cấp gói</span>
              </button>

              <button
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Send className="w-5 h-5 mr-3 text-gray-700" />
                <span className="text-sm flex-1 text-left">Để phản hồi</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-gray-50 rounded-b-lg border-t border-gray-200"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
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
            className="flex items-center gap-3 mb-3 cursor-pointer"
            onClick={() => setShow2ShareMenu((p) => !p)}
          >
            <Figma className="w-4 h-4" />
            <span>2Share của tôi</span>
            {show2ShareMenu ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </div>
          {show2ShareMenu && (
            <div className="border-l ml-2 pl-4 space-y-2">
              <Link
                to="/my-links"
                className={`block w-full text-left px-3 py-2 rounded-xl ${
                  location.pathname === "/my-links"
                    ? "bg-gray-300 text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Đường dẫn
              </Link>
              <Link
                to="/portfolio/design"
                className={`block w-full text-left px-3 py-2 rounded-xl ${
                  location.pathname === "/portfolio/design"
                    ? "bg-gray-300 text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Thiết kế
              </Link>
            </div>
          )}
        </div>

        {/* NFC Card */}
        <Link
          to="/nfc"
          className={`flex items-center gap-3 w-full p-3 rounded-xl ${
            location.pathname === "/nfc"
              ? "bg-gray-300 text-black"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Thẻ NFC của tôi</span>
        </Link>

        {/* Statistics */}
        <Link
          to="/insights"
          className={`flex items-center gap-3 w-full p-3 rounded-xl ${
            location.pathname === "/insights"
              ? "bg-gray-300 text-black"  
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống kê</span>
        </Link>

        {/* THÊM MENU MỚI: GÓI ĐĂNG KÝ */}
        <Link
          to="/plans"
          className={`flex items-center gap-3 w-full p-3 rounded-xl ${
            location.pathname === "/plans"
              ? "bg-gray-300 text-black"  
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Gói đăng ký</span>
        </Link>
      </div>

      <div className="absolute bottom-6 left-6">
        <HelpCircle className="w-6 h-6 text-gray-600" />
      </div>
    </aside>
  );
}