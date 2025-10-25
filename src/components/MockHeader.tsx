// src/components/MockHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { Settings, Upload, Check, Share2, FileText, QrCode, ExternalLink, Copy, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MockHeaderProps {
  title?: string;
  username?: string;
  avatarUrl?: string;
}

const MockHeader: React.FC<MockHeaderProps> = ({ 
  title = "2Share của tôi", 
  username = "username_123",
  avatarUrl = "/images/profile-pictures/pfp.jpg"
}) => {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const portfolioLink = `${window.location.origin}/portfolio/mock`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShareClick = () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      setShowShareDropdown(false);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOpenPortfolio = () => {
    navigate('/portfolio/mock');
    setShowShareDropdown(false);
  };

  const handleOpenInNewTab = () => {
    window.open(portfolioLink, '_blank');
    setShowShareDropdown(false);
  };

  // Rút gọn link hiển thị
  const displayLink = `2share.icu/${username}`;

  return (
    <header className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          {/* Share Button với Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              ref={buttonRef}
              className={`flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl hover:bg-gray-50 transition-all duration-200 ${
                copied ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''
              }`}
              onClick={handleShareClick}
              title="Chia sẻ portfolio của bạn"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white">Đã copy!</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>

            {/* Share Dropdown */}
            {showShareDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl w-80 p-4 border border-gray-200 z-50">
                {/* Header */}
                <div className="mb-3">
                  <div className="font-semibold text-[15px] text-gray-900">Share your Portfolio</div>
                </div>

                {/* Preview card */}
                <div className="w-full bg-gray-900 rounded-xl p-4 mb-3 text-white relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <img
                        src={avatarUrl}
                        alt={username}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold leading-none">{username}</span>
                      <span className="text-white/70 text-sm">2Share Portfolio</span>
                    </div>
                  </div>
                  <div className="absolute right-3 bottom-3 bg-white/10 rounded-full p-2">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Link row */}
                <div className="w-full flex items-center gap-2 bg-gray-100 rounded-lg p-2 mb-3">
                  <input
                    readOnly
                    value={displayLink}
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>

                {/* Action rows */}
                <div className="w-full flex flex-col">
                  <DropdownItem 
                    icon={<FileText className="w-4 h-4" />} 
                    label="Add to bio" 
                    onClick={() => setShowShareDropdown(false)}
                  />
                  <DropdownItem 
                    icon={<QrCode className="w-4 h-4" />} 
                    label="QR code" 
                    onClick={() => setShowShareDropdown(false)}
                  />
                  <DropdownItem 
                    icon={<Share2 className="w-4 h-4" />} 
                    label="Share to..." 
                    onClick={() => setShowShareDropdown(false)}
                  />
                  <DropdownItem 
                    icon={<ExternalLink className="w-4 h-4" />} 
                    label="Open" 
                    onClick={handleOpenPortfolio}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button className="p-3 border border-gray-400 rounded-xl hover:bg-gray-50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

// Dropdown Item Component
const DropdownItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void 
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <span className="flex items-center gap-3 text-sm text-gray-700">
      <span className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-700">
        {icon}
      </span>
      {label}
    </span>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </button>
);

export default MockHeader;