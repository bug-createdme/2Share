// src/components/Sidebar.tsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Figma,
  CreditCard,
  BarChart3,
  HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [show2ShareMenu, setShow2ShareMenu] = useState(true);
  const [activePage, setActivePage] = useState<
    "duongdan" | "thietke" | "nfc" | "thongke"
  >("thietke");

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-3">
        {/* User Profile */}
        <div
          className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer"
          onClick={() => setShowUserMenu((p) => !p)}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-pink-300"></div>
          </div>
          <span className="text-gray-600">@username_123</span>
          <ChevronDown
            className={`w-4 h-4 ml-auto text-gray-600 transition-transform ${
              showUserMenu ? "rotate-180" : ""
            }`}
          />
        </div>
        {showUserMenu && (
          <div className="ml-10 space-y-1">
            <button className="block w-full text-left text-gray-600 hover:text-black">
              Profile
            </button>
            <button className="block w-full text-left text-gray-600 hover:text-black">
              Settings
            </button>
            <button className="block w-full text-left text-red-500">Logout</button>
          </div>
        )}

        {/* My 2Share Section */}
        <div className=" rounded-lg px-3 py-1">
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
              <button
                onClick={() => setActivePage("duongdan")}
                className={`block w-full text-left px-3 py-2 rounded-xl ${
                  activePage === "duongdan"
                    ? "bg-gray-300 text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Đường dẫn
              </button>
              <button
                onClick={() => setActivePage("thietke")}
                className={`block w-full text-left px-3 py-2 rounded-xl ${
                  activePage === "thietke"
                    ? "bg-gray-300 text-black"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Thiết kế
              </button>
            </div>
          )}
        </div>

        {/* NFC Card */}
        <button
          onClick={() => setActivePage("nfc")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl ${
            activePage === "nfc"
              ? "bg-gray-300 text-black"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Thẻ NFC của tôi</span>
        </button>

        {/* Statistics */}
        <button
          onClick={() => setActivePage("thongke")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl ${
            activePage === "thongke"
              ? "bg-gray-300 text-black"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống kê</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6">
        <HelpCircle className="w-6 h-6 text-gray-600" />
      </div>
    </aside>
  );
}
