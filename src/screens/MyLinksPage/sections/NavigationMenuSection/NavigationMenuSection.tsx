
import {
  BarChart3Icon,
  ChevronDownIcon,
  CreditCardIcon,
  FigmaIcon,
  HelpCircleIcon,
  UserIcon,
  ZapIcon,
  LogOutIcon,
  SendIcon,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../components/ui/collapsible";

export const NavigationMenuSection = (): JSX.Element => {
  const [isMyShareOpen, setIsMyShareOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string>('my-nfc');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('');
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

  const menuItems = [
    {
      id: "my-nfc",
      label: "Thẻ NFC của tôi",
      icon: CreditCardIcon,
      isActive: false,
    },
    {
      id: "statistics",
      label: "Thống kê",
      icon: BarChart3Icon,
      isActive: false,
    },
  ];

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
            src="https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-1.png"
          />
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="[font-family:'Carlito',Helvetica] text-[#6e6e6e] text-base tracking-[1.60px] font-normal truncate">
              @username_123
            </span>
            <ChevronDownIcon className={`w-[18px] h-[18px] ml-2 mr-[18px] text-[#6e6e6e] flex-shrink-0 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {/* Dropdown menu */}
        {profileMenuOpen && (
          <div className="absolute left-0 top-[110%] w-full bg-white rounded-[10px] shadow-lg border border-[#ececec] z-50 animate-fade-in">
            <button className="w-full flex items-center px-4 py-2 text-[#222] hover:bg-gray-100 rounded-t-[10px] focus:outline-none">
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
            <button className="w-full flex items-center px-4 py-2 text-[#222] hover:bg-gray-100 rounded-b-[10px] border-t border-[#ececec] focus:outline-none">
              <LogOutIcon className="w-5 h-5 mr-3 text-[#222]" />
              <span className="text-[15px] text-left flex-1">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      {/* All Sidebar Buttons & Menu */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* My 2Share Collapsible Section */}
          <div className="ml-2.5 w-full max-w-[203px] mt-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <Collapsible open={isMyShareOpen} onOpenChange={setIsMyShareOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full max-w-[205px] h-10 justify-start px-0 py-0 rounded-[10px] transition-colors
                    ${activeMenu === '2share' ? 'bg-[#d9d9d9] text-black' : 'bg-white text-[#222] hover:bg-gray-100'}`}
                  aria-current={activeMenu === '2share' ? 'page' : undefined}
                  onClick={() => {
                    setActiveMenu('2share');
                    setActiveSubMenu('links');
                  }}
                >
                  <FigmaIcon className="w-[18px] h-[18px] ml-[3px] mr-2" />
                  <span className="[font-family:'Carlito',Helvetica] font-normal text-base tracking-[1.60px] flex-1 text-left">
                    2Share của tôi
                  </span>
                  <ChevronDownIcon
                    className={`w-[18px] h-[18px] mr-4 transition-transform ${isMyShareOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="relative">
                <div className="ml-3 border-l border-[#d9d9d9] pl-[18px] pt-2 pb-2 space-y-0.5">
                  {subMenuItems.map((item) => {
                    const isActive = activeMenu === '2share' && activeSubMenu === item.id;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full max-w-[155px] h-8 justify-start px-2 py-0 rounded-[10px] transition-colors
                          ${isActive ? 'bg-[#d9d9d9] text-black' : 'bg-white text-[#6e6e6e] hover:bg-gray-100'}`}
                        onClick={() => {
                          setActiveMenu('2share');
                          setActiveSubMenu(item.id);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="[font-family:'Carlito',Helvetica] font-normal text-base tracking-[1.60px]">
                          {item.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Other Menu Items */}
          <div className="ml-2.5 space-y-0.5 mt-2 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full max-w-[205px] h-10 justify-start px-0 py-0 rounded-[10px] transition-colors
                    ${isActive ? 'bg-[#d9d9d9] text-black' : 'bg-white text-[#6e6e6e] hover:bg-gray-100'}`}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setActiveSubMenu('');
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent className="w-[18px] h-[18px] ml-[3px] mr-2" />
                  <span className="[font-family:'Carlito',Helvetica] font-normal text-base tracking-[1.60px] flex-1 text-left">
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

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
