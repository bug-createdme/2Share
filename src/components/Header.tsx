// src/components/Header.tsx
import React from "react";
import { Settings, Upload, Check } from "lucide-react";

interface HeaderProps {
  title?: string;
  onShare?: () => void;
  isCopied?: boolean;
  shareBtnRef?: React.RefObject<HTMLButtonElement>;
}

const Header: React.FC<HeaderProps> = ({ title = "2Share của tôi", onShare, isCopied = false, shareBtnRef }) => {
  return (
    <header className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          {onShare && (
            <button
              ref={shareBtnRef}
              className={`flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl hover:bg-gray-50 transition-all duration-200 ${
                isCopied ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''
              }`}
              onClick={onShare}
              title="Chia sẻ portfolio của bạn"
            >
              {isCopied ? (
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
          )}
          <button className="p-3 border border-gray-400 rounded-xl hover:bg-gray-50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
