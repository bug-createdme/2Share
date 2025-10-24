// src/components/PhonePreview.tsx
import React from "react";
import type { SocialLink } from "../screens/MyLinksPage/sections/SocialLinksSection/SocialLinksSection";

interface PhonePreviewProps {
  themeClasses: Record<string, string>;
  textColors: Record<string, string>;
  selectedTheme: string;
  selectedLayout: number;
  user?: any;
  bio?: string;
  socialLinks?: SocialLink[];
}

const PhonePreview: React.FC<PhonePreviewProps> = ({
  themeClasses,
  textColors,
  selectedTheme,
  selectedLayout,
  user,
  bio = "",
  socialLinks = [],
}) => {
  // Get enabled social links
  const enabledLinks = socialLinks.filter(link => link.isEnabled && link.url);
  const displayUsername = user?.username || "username_123";
  const displayBio = bio || "Mình là username_123, sinh viên thiết kế đồ họa với niềm yêu thích sáng tạo và sự chỉn chu trong từng chi tiết.";
  const displayAvatar = user?.avatar_url || "https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-2.png";

  // Avatar thật với hình ảnh user
  const avatar = (
    <div className="w-[45px] h-[45px] rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center border border-[#e0e0e0]">
      <img
        className="w-full h-full object-cover"
        alt="Avatar"
        src={displayAvatar}
      />
    </div>
  );

  const avatarWide = (
    <div className="w-full h-[56px] rounded-xl overflow-hidden bg-white shadow-lg flex items-center justify-center border border-[#e0e0e0]">
      <img
        className="w-full h-full object-cover"
        alt="Avatar"
        src={displayAvatar}
      />
    </div>
  );

  const username = (
    <h3 className="text-white text-sm font-bold tracking-wide">@{displayUsername}</h3>
  );

  const bioSection = (
    <div className="relative w-full min-h-[40px] flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full min-h-[40px] bg-white rounded-[8px] shadow-lg" />
      <p className={`relative text-[8px] leading-relaxed ${textColors[selectedTheme]} px-2 py-2 text-center`}
         style={{ minHeight: 20, maxHeight: 40, overflowY: 'auto', wordBreak: 'break-word' }}>
        {displayBio}
      </p>
    </div>
  );

  const links = (
    <div className="space-y-[3px]">
      {enabledLinks.map((link) => (
        <button
          key={link.id}
          className="w-full py-[6px] bg-transparent border-[1.5px] border-white rounded-[8px] text-white text-[10px] font-normal"
        >
          {link.displayName || link.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-70 py-4 px-20 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-hidden z-40">
      <div
        className={`w-60 h-[580px] bg-gradient-to-br ${themeClasses[selectedTheme]} 
          rounded-3xl border-4 border-gray-600 p-6 relative overflow-hidden mt-20`}
      >
        {/* Layout 1: Avatar ở trên, centered */}
        {selectedLayout === 1 && (
        <div className="flex flex-col items-center gap-3 mt-6">
            {avatar}
            {username}
            {bioSection}
            {links}
        </div>
        )}

        {/* Layout 2: Avatar bên trái với username */}
        {selectedLayout === 2 && (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-4">
            {avatar}
            <div className="flex flex-col items-start">
                {username}
            </div>
            </div>
            {bioSection}
            {links}
        </div>
        )}

        {/* Layout 3: Username trên, avatar wide ở giữa */}
        {selectedLayout === 3 && (
        <div className="flex flex-col items-center gap-3 mt-6 w-full">
            {username}
            {avatarWide} 
            {bioSection}
            {links}
        </div>
        )}

        {/* Layout 4: Background avatar style */}
        {selectedLayout === 4 && (
        <div className="relative h-full flex flex-col items-center justify-between py-8">
            {/* background avatar - large avatar in center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-white/50 border-2 border-white/40">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar background"
                  src={displayAvatar}
                />
              </div>
            </div>

            {/* foreground content - username at top */}
            <div className="relative z-10 w-full flex flex-col items-center mt-4">
              {username}
            </div>

            {/* bio and links at bottom */}
            <div className="relative z-10 w-full space-y-2">
              {bioSection}
              {links}
            </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default PhonePreview;
