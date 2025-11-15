import React from 'react';
import { Bot } from 'lucide-react';

interface AIChatButtonProps {
  onClick: () => void;
}

export const AIChatButton: React.FC<AIChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 xl:right-[415px] z-40 w-14 h-14 bg-gradient-to-r from-[#f3b4c3] to-[#fb9191] text-[#161515] rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-200 group font-spartan"
      aria-label="Open AI Chat Assistant"
    >
      <Bot size={24} />
      
      {/* Pulse animation - SỬA MÀU THEME */}
      <div className="absolute inset-0 rounded-full bg-[#f3b4c3] animate-ping opacity-20"></div>
      
      {/* Tooltip - SỬA MÀU THEME */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-[#161515] text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap font-spartan">
        AI Design Assistant
        <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-[#161515]"></div>
      </div>
    </button>
  );
};