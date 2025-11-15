// src/components/Header.tsx
import React from "react";
import { Upload, Check } from "lucide-react";

interface HeaderProps {
  title?: string;
  onShare?: () => void;
  isCopied?: boolean;
  shareBtnRef?: React.RefObject<HTMLButtonElement>;
  // When a fixed right sidebar exists on xl screens (e.g., MyLinksPage),
  // offset the header to avoid overlapping it. Default: no offset.
  rightOffsetOnXL?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "2Share của tôi", onShare, isCopied = false, shareBtnRef, rightOffsetOnXL = false }) => {
  const rightOffsetClass = rightOffsetOnXL ? 'xl:right-[395px]' : '';
  return (
    <header className={`fixed top-0 left-0 right-0 lg:left-[200px] xl:left-[265px] ${rightOffsetClass} bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 z-10`}>
      <div className="grid grid-cols-[auto,1fr,auto] items-center lg:flex lg:items-center lg:justify-between">
        {/* Left spacer to balance mobile hamburger width (hidden on desktop) */}
        <div className="block lg:hidden w-9 sm:w-10" />
        <h1 className="text-center lg:text-left text-base sm:text-lg lg:text-2xl font-bold truncate px-1 sm:px-2">{title}</h1>
        <div className="justify-self-end flex items-center gap-2 sm:gap-4">
          {onShare && (
            <button
              ref={shareBtnRef}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-400 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 ${
                isCopied ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''
              }`}
              onClick={onShare}
              title="Chia sẻ portfolio của bạn"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <span className="text-white hidden sm:inline">Đã copy!</span>
                  <span className="text-white sm:hidden">OK</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Chia sẻ</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
