// src/components/PhonePreview.tsx
import React from "react";

interface PhonePreviewProps {
  themeClasses: Record<string, string>;
  avatarColors: Record<string, string>;
  textColors: Record<string, string>;
  selectedTheme: string;
  selectedLayout: number; // new prop
}

const PhonePreview: React.FC<PhonePreviewProps> = ({
  themeClasses,
  avatarColors,
  textColors,
  selectedTheme,
  selectedLayout,
}) => {
  const avatar = (
    <div className="w-20 h-20 bg-white/90 rounded-2xl flex flex-col items-center justify-end shadow-lg">
      <div className={`w-7 h-7 rounded-full ${avatarColors[selectedTheme]}`} />
      <div className={`w-12 h-6 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
    </div>
  );

  const avatarWide = (
    <div className="w-full h-28 bg-white/90 rounded-2xl flex flex-col items-center justify-end shadow-lg">
        <div className={`w-10 h-10 rounded-full ${avatarColors[selectedTheme]}`} />
        <div className={`w-16 h-8 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
    </div>
  );


  const username = (
    <h3 className="text-white text-sm tracking-wide">username_123</h3>
  );

const socialsCentered = (
  <div className="flex justify-center gap-3 ">
    {["in", "📷", "Be"].map((icon, index) => (
      <div
        key={index}
        className="w-4 h-4 bg-white rounded flex items-center justify-center text-[10px]"
      >
        {icon}
      </div>
    ))}
  </div>
);

const socialsCompact = (
  <div className="flex gap-1 mt-1">
    {["in", "📷", "Be"].map((icon, index) => (
      <div
        key={index}
        className="w-4 h-4 bg-white rounded flex items-center justify-center text-[10px]"
      >
        {icon}
      </div>
    ))}
  </div>
);


  const bio = (
    <div className="bg-white/90 rounded-2xl p-3 shadow-lg">
      <p className={`text-[10px] leading-relaxed ${textColors[selectedTheme]}`}>
        Mình là username_123, sinh viên thiết kế đồ họa với niềm yêu thích sáng tạo
        và sự chỉn chu trong từng chi tiết. Mình tập trung vào thiết kế thương hiệu,
        UI và minh họa số, với mong muốn tạo ra những trải nghiệm có chiều sâu.
        Theo dõi mình để cùng khám phá hành trình thiết kế và phát triển bản thân
        mỗi ngày nhé!
      </p>
    </div>
  );

  const links = (
    <div className="space-y-2">
      {["LinkedIn", "Behance", "Instagram"].map((platform) => (
        <button
          key={platform}
          className="w-full py-2 bg-white/10 border-2 border-white rounded-2xl text-white text-xs"
        >
          {platform}
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
        {selectedLayout === 1 && (
        <div className="flex flex-col items-center gap-3 mt-6">
            {avatar}
            {username}
            {socialsCentered}
            {bio}
            {links}
        </div>
        )}

        {selectedLayout === 2 && (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-4">
            {avatar}
            <div className="flex flex-col items-start">
                {username}
                {socialsCompact}
            </div>
            </div>
            {bio}
            {links}
        </div>
        )}

        {selectedLayout === 3 && (
        <div className="flex flex-col items-center gap-3 mt-6 w-full">
            {username}
            {socialsCentered}
            {avatarWide} 
            {bio}
            {links}
        </div>
        )}

        {selectedLayout === 4 && (
        <div className="relative h-full flex flex-col items-center justify-between py-6">
            {/* background avatar same */}
            <div className="absolute inset-0 flex items-center justify-center opacity-75">
            <div className="w-40 h-40 bg-white/50 rounded-full flex flex-col items-center justify-end">
                <div
                className={`w-14 h-14 rounded-full ${avatarColors[selectedTheme]}`}
                />
                <div
                className={`w-20 h-10 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`}
                />
            </div>
            </div>

            {/* foreground */}
            <div className="relative z-10 text-center">
            {username}
            <div className="mt-2">{socialsCentered}</div>
            </div>

            <div className="relative z-10 w-full">{links}</div>
        </div>
        )}

      </div>
    </div>
  );
};

export default PhonePreview;
