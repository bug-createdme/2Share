import {
  BarChart3Icon,
  ChevronDownIcon,
  CreditCardIcon,
  HelpCircleIcon,
  UserIcon,
  ZapIcon,
  LogOutIcon,
  SendIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../components/ui/collapsible";
import { useLocation } from "react-router-dom";

export const NavigationMenuSection = ({ user }: { user: any }): JSX.Element => {
  const location = useLocation();
  const [isMyShareOpen, setIsMyShareOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);
  // Removed unused menuItems, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu

  const subMenuItems = [
    {
      id: "links",
      label: "Đường dẫn",
      isActive: true,
    },
    {
      id: "design",
      label: "Thiết kế",
      isActive: false,
    },
  ];

  // Determine active menu by current pathname
  const currentPath = location.pathname;

  return (
    <div className="w-full max-w-[213px] h-full flex flex-col translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
      {/* User Profile Section */}
      <div className="mb-4 w-full max-w-[203px] relative" ref={profileRef}>
        <button
          type="button"
          className="h-10 bg-white rounded-[10px] inline-flex items-center w-full px-0 py-0 cursor-pointer relative focus:outline-none"
          onClick={() => setProfileMenuOpen((v) => !v)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setProfileMenuOpen(v => !v);
            }
          }}
          aria-haspopup="menu"
          aria-expanded={profileMenuOpen}
        >
          <img
            className="w-[26px] h-[26px] ml-[9px] mr-3"
            alt="User avatar"
            src={user.avatar_url || "https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-1.png"}
          />
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="[font-family:'Carlito',Helvetica] text-[#6e6e6e] text-base tracking-[1.60px] font-normal truncate">
              @{user.username}
            </span>
            <ChevronDownIcon className={`w-[18px] h-[18px] ml-2 mr-[18px] text-[#6e6e6e] flex-shrink-0 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {/* Dropdown menu */}
        {profileMenuOpen && (
          <div className="absolute left-0 top-[110%] w-full bg-white rounded-[10px] shadow-lg border border-[#ececec] z-50 animate-fade-in">
            <button
              className="w-full flex items-center px-4 py-2 text-[#222] hover:bg-gray-100 rounded-t-[10px] focus:outline-none"
              onClick={() => {
                window.location.href = '/account';
                setProfileMenuOpen(false);
              }}
            >
              <UserIcon className="w-5 h-5 mr-3 text-[#222]" />
              <span className="text-[15px] text-left flex-1">Tài khoản</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 text-[#a259ff] hover:bg-gray-100 focus:outline-none">
              <ZapIcon className="w-5 h-5 mr-3 text-[#a259ff]" />
              <span className="text-[15px] text-left flex-1">Nâng cấp</span>
            </button>
            
            <button className="w-full flex items-center px-4 py-2 text-[#222] hover:bg-gray-100 focus:outline-none">
              <SendIcon className="w-5 h-5 mr-3 text-[#222]" />
              <span className="text-[15px] text-left flex-1">Để phản hồi</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 text-[#222] hover:bg-gray-100 rounded-b-[10px] border-t border-[#ececec] focus:outline-none"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              <LogOutIcon className="w-5 h-5 mr-3 text-[#222]" />
              <span className="text-[15px] text-left flex-1">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      {/* All Sidebar Buttons & Menu */}
      <div className="flex flex-col gap-2">
        {/* 2Share của tôi */}
        <Collapsible open={isMyShareOpen} onOpenChange={setIsMyShareOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] font-bold text-[#6e6e6e] text-base ${currentPath === '/my-links' ? 'bg-[#ececec]' : ''}`}
            >
              2Share của tôi
              <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isMyShareOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 mt-2">
              {subMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full px-3 py-2 rounded-[10px] text-[#6e6e6e] text-base font-normal ${item.id === 'links' && currentPath === '/my-links' ? 'bg-[#ececec]' : ''}`}
                  onClick={() => {
                    if (item.id === 'links') window.location.href = '/my-links';
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        {/* Thẻ NFC của tôi */}
        <Button
          variant="ghost"
          className={`w-full flex items-center px-3 py-2 rounded-[10px] text-[#6e6e6e] text-base font-normal ${currentPath === '/nfc' ? 'bg-[#ececec]' : ''}`}
        >
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Thẻ NFC của tôi
        </Button>
        {/* Thống kê */}
        <Button
          variant="ghost"
          className={`w-full flex items-center px-3 py-2 rounded-[10px] text-[#6e6e6e] text-base font-normal ${currentPath === '/statistics' ? 'bg-[#ececec]' : ''}`}
        >
          <BarChart3Icon className="w-5 h-5 mr-2" />
          Thống kê
        </Button>
        {/* Help Icon at the bottom */}
        <div className="ml-2.5 mb-2 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 hover:bg-transparent"
          >
            <HelpCircleIcon className="w-6 h-6 text-[#6e6e6e]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
