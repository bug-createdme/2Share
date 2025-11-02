import React, { useState } from "react";
import MockHeader from "../../components/MockHeader"; // Sử dụng MockHeader thay vì Header
import { Zap } from "lucide-react";
import { FaFillDrip, FaRegCircle, FaLinkedin, FaBehance, FaInstagram, FaFacebookSquare, FaTiktok } from "react-icons/fa";
import MockSidebar from "../../components/MockSidebar";
import {
  TbBorderCornerSquare,
  TbBorderCornerRounded,
  TbBorderCornerPill,
} from "react-icons/tb";

// Mock component thay thế ImageUpload
const MockImageUpload: React.FC<{
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "rounded" | "square";
  placeholder?: string;
  maxSize?: number;
}> = ({ 
  onImageUploaded, 
  className = "", 
  size = "md",
  variant = "rounded",
  placeholder = "Upload image",
  maxSize = 5 
}) => {
  const handleClick = () => {
    const mockImageUrl = "https://via.placeholder.com/300x200";
    onImageUploaded(mockImageUrl);
  };

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-32", 
    lg: "w-32 h-40"
  };

  const variantClasses = {
    rounded: "rounded-2xl",
    square: "rounded-lg"
  };

  return (
    <div className={`text-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          border-2 border-dashed border-gray-400 bg-white 
          flex flex-col items-center justify-center cursor-pointer
          hover:bg-gray-50 transition-colors mb-2 mx-auto
        `}
        onClick={handleClick}
      >
        <span className="text-sm text-gray-600">{placeholder}</span>
      </div>
    </div>
  );
};

// Mock data
const mockUser = {
  _id: "1",
  username: "Bobby",
  name: "User Name", 
  avatar_url: "/images/profile-pictures/pfp-black.jpg",
  email: "user@example.com"
};

// Mock social links data
const mockSocialLinks = [
  {
    id: "4",
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61582005475148",
    isEnabled: true,
  },
  {
    id: "5",
    name: "TikTok",
    url: "https://www.tiktok.com/@2share_fpt?_t=ZS-90kuyEOVaiG&_r=1",
    isEnabled: true,
  }
];

const MockPortfolioDesignPage: React.FC = () => {
  const [user] = useState(mockUser);
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [activeTab, setActiveTab] = useState<"text" | "button">("text");
  const [buttonFill, setButtonFill] = useState(0);
  const [buttonCorner, setButtonCorner] = useState(1);

  // Theme configurations
  const themeClasses: Record<string, string> = {
    coral: "from-[#E7A5A5] to-[#E7A5A5]",
    green: "from-green-300 to-green-400",
    dark: "from-gray-700 to-gray-800",
    gradient: "from-purple-400 via-blue-400 to-green-400",
    orange: "from-blue-400 to-orange-400",
  };

  const textColors: Record<string, string> = {
    coral: 'text-[#E7A5A5]',
    green: 'text-green-400',
    dark: 'text-gray-500',
    gradient: 'text-purple-400',
    orange: 'text-orange-400',
  };

  const avatarColors: Record<string, string> = {
    coral: "bg-[#E7A5A5]",
    green: 'bg-green-300',
    dark: 'bg-gray-500',
    gradient: 'bg-purple-400',
    orange: 'bg-orange-400',
  };

  // Social icons cho phần preview
  const socialIcons = [
    { name: "Facebook", icon: <FaFacebookSquare className="text-white text-sm" /> },
    { name: "TikTok", icon: <FaTiktok className="text-white text-sm" /> }
  ];

  // Mock bio
  const bio = "Mình là một Kỹ sư phần mềm muốn gây ấn tượng với portfolio tích hợp trong thẻ NFC";

  // Fix type cho image upload handlers
  const handleProfileImageUpload = (imageUrl: string): void => {
    console.log('Profile image uploaded:', imageUrl);
  };

  const handleBackgroundImageUpload = (imageUrl: string): void => {
    console.log('Background image uploaded:', imageUrl);
  };

  // Hàm render Bio Section với khung ôm nội dung
  const renderBioSection = (content: string, className: string = "") => {
    return (
      <div className={`w-full bg-white rounded-[12px] shadow-lg p-3 ${className}`}>
        <p className="text-[10px] leading-relaxed text-gray-600 text-center break-words"
           style={{ wordBreak: 'break-word' }}>
          {content}
        </p>
      </div>
    );
  };

  // Render PhonePreview dựa trên layout được chọn
  const renderPhonePreview = () => {
    const enabledLinks = mockSocialLinks.filter(link => link.isEnabled);

    // Layout 1: Avatar ở trên, centered
    if (selectedProfile === 0) {
      return (
        <div className="flex flex-col items-center gap-4 mt-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-14 h-14 rounded-xl object-cover opacity-90"
            />
          </div>
          
          {/* Username */}
          <h3 className="text-white text-sm font-bold tracking-wide">{user.username}</h3>

          {/* SOCIAL ICONS ROW */}
          <div className="flex gap-2 justify-center mb-2">
            {socialIcons.map((social) => (
              <div 
                key={social.name}
                className="hover:opacity-80 transition-transform hover:scale-110 w-4 h-4 flex items-center justify-center"
                title={social.name}
              >
                {social.icon}
              </div>
            ))}
          </div>

          {/* Bio Section - ĐÃ SỬA: KHUNG ÔM NỘI DỤNG */}
          {renderBioSection(bio, "mb-4")}

          {/* Links */}
          <div className="space-y-2 w-full">
            {enabledLinks.map((link) => (
              <button
                key={link.id}
                className="w-full py-1.5 bg-white/20 border border-white/30 rounded-[12px] text-white text-[12px] font-medium hover:bg-white/30 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Layout 2: Avatar bên trái với username
    if (selectedProfile === 1) {
      return (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 mx-auto w-fit">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30">
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-10 h-10 rounded-xl object-cover opacity-90"
              />
            </div>
            <div className="flex flex-col items-start">
              {/* Username */}
              <h3 className="text-white text-sm font-bold tracking-wide">@{user.username}</h3>
              {/* Social Icons */}
              <div className="flex gap-1 mt-1">
                {socialIcons.slice(0, 3).map((social) => (
                  <div key={social.name} className="w-3 h-3 flex items-center justify-center">
                    {social.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bio Section - ĐÃ SỬA: KHUNG ÔM NỘI DỤNG */}
          {renderBioSection(bio, "mb-4")}

          {/* Links */}
          <div className="space-y-1.5 w-full">
            {enabledLinks.map((link) => (
              <button
                key={link.id}
                className="w-full py-1 bg-white/20 border border-white/30 rounded-[10px] text-white text-[11px] font-medium hover:bg-white/30 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Layout 3: Username trên, avatar wide ở giữa
    if (selectedProfile === 2) {
      return (
        <div className="flex flex-col items-center gap-3 mt-6 w-full">
          {/* Username */}
          <h3 className="text-white text-sm font-bold tracking-wide">@{user.username}</h3>
          
          {/* Social Icons */}
          <div className="flex gap-2 justify-center mb-1">
            {socialIcons.map((social) => (
              <div 
                key={social.name}
                className="hover:opacity-80 transition-transform hover:scale-110 w-3 h-3 flex items-center justify-center"
                title={social.name}
              >
                {social.icon}
              </div>
            ))}
          </div>

          {/* Avatar large middle */}
          <div className="w-20 h-16 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30 mb-2">
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-18 h-14 rounded-xl object-cover opacity-90"
            />
          </div>

          {/* Bio Section - ĐÃ SỬA: KHUNG ÔM NỘI DỤNG */}
          {renderBioSection(bio, "mb-4")}

          {/* Links */}
          <div className="space-y-1.5 w-full">
            {enabledLinks.map((link) => (
              <button
                key={link.id}
                className="w-full py-1 bg-white/20 border border-white/30 rounded-[10px] text-white text-[11px] font-medium hover:bg-white/30 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Layout 4: Background avatar style
    if (selectedProfile === 3) {
      return (
        <div className="relative h-full flex flex-col items-center justify-between py-6">
          {/* Background avatar - large avatar in center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/30 border-2 border-white/20">
              <img
                className="w-full h-full object-cover"
                alt="Avatar background"
                src={user.avatar_url}
              />
            </div>
          </div>

          {/* Foreground content */}
          <div className="relative z-10 w-full flex flex-col items-center mt-4">
            {/* Username */}
            <h3 className="text-white text-sm font-bold tracking-wide mb-2">@{user.username}</h3>
            
            {/* Social Icons */}
            <div className="flex gap-2 justify-center mb-4">
              {socialIcons.map((social) => (
                <div 
                  key={social.name}
                  className="hover:opacity-80 transition-transform hover:scale-110 w-3 h-3 flex items-center justify-center"
                  title={social.name}
                >
                  {social.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Bio and links at bottom */}
          <div className="relative z-10 w-full space-y-2">
            {/* Bio Section - ĐÃ SỬA: KHUNG ÔM NỘI DỤNG */}
            {renderBioSection(bio, "mb-3")}

            {/* Links */}
            <div className="space-y-1 w-full">
              {enabledLinks.slice(0, 3).map((link) => (
                <button
                  key={link.id}
                  className="w-full py-1 bg-white/20 border border-white/30 rounded-[8px] text-white text-[10px] font-medium hover:bg-white/30 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-spartan">
      {/* Header - SỬA THÀNH MOCKHEADER */}
      <MockHeader 
        username={user.username}
        avatarUrl={user.avatar_url}
        title="Thiết kế Portfolio"
      />

      <div className="flex pt-20">
        {/* Sidebar trái - MockSidebar */}
        <div className="fixed top-0 left-0 h-full min-h-screen w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 flex flex-col z-20">
          <MockSidebar user={mockUser} />
        </div>

        {/* Main Content */}
        <main className="flex ml-72 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Hồ sơ</h2>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <div className="flex justify-center gap-6 mb-8">
                  {[0, 1, 2, 3].map((index) => {
                    const baseBg =
                      selectedProfile === index
                        ? "bg-gray-300"
                        : "bg-gray-100";

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedProfile(index)}
                        className={`
                          w-24 h-32 rounded-2xl cursor-pointer transition-all 
                          ${baseBg} 
                          hover:bg-gray-200
                          ${selectedProfile === index ? "border-2 border-blue-400" : "border border-gray-300"}
                          flex flex-col items-center justify-start p-3
                        `}
                      >
                        {/* index-specific mini-layout mocks */}
                        {index === 0 && (
                          <>
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">
                              <div className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`} />
                              <div className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
                            </div>
                            {/* Username */}
                            <div className="w-10 h-2 bg-white rounded mb-1"></div>
                            {/* Socials */}
                            <div className="w-16 h-2 bg-white rounded mb-2"></div>
                            {/* Bio block */}
                            <div className="w-16 h-6 bg-white rounded"></div>
                          </>
                        )}

                        {index === 1 && (
                          <>
                            {/* Avatar + username/social row */}
                            <div className="flex items-center gap-1 mb-2">
                              <div className="w-6 h-6 bg-gray-50 rounded-md flex flex-col items-center justify-end">                
                                <div className={`w-2 h-2 rounded-full ${avatarColors[selectedTheme]}`} />
                                <div className={`w-3 h-1 rounded-t-full mt-0.5 ${avatarColors[selectedTheme]}`} />
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="w-8 h-2 bg-white rounded"></div>
                                <div className="w-10 h-2 bg-white rounded"></div>
                              </div>
                            </div>
                            {/* Bio */}
                            <div className="w-full h-6 bg-white rounded mb-2"></div>
                            {/* Links */}
                            <div className="w-14 h-4 bg-white rounded mb-1"></div>
                                <div className="w-14 h-4 bg-white rounded"></div>
                              </>
                            )}

                        {index === 2 && (
                          <>
                            {/* Username */}
                            <div className="w-12 h-2 bg-white rounded mb-1"></div>
                            {/* Socials */}
                            <div className="w-16 h-2 bg-white rounded mb-2"></div>
                            {/* Avatar large middle */}
                            <div className="w-12 h-10 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">                
                                <div className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`} />
                                <div className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
                            </div>
                            {/* Bio */}
                            <div className="w-full h-6 bg-white rounded mb-2"></div>
                            {/* Links */}
                            <div className="w-14 h-4 bg-white rounded"></div>
                          </>
                        )}

                        {index === 3 && (
                          <>
                            {/* Background avatar style */}
                            <div className="w-full h-24 bg-gray-200 rounded-xl mb-2 relative flex flex-col items-center justify-center">
                              <div className="w-12 h-2 mt-2 bg-white rounded mb-1"></div>
                              <div className="w-16 h-2 bg-white rounded mb-2"></div>
                              <div className={`w-5 h-5 rounded-full opacity-70 ${avatarColors[selectedTheme]}`} />
                              <div className={`w-8 h-4 rounded-t-full mt-1 opacity-70 ${avatarColors[selectedTheme]}`} />
                            </div>
                            {/* Link buttons */}
                            <div className="w-14 h-4 bg-white rounded mb-1"></div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ImageUpload ở giữa */}
                <div className="w-full flex justify-center">
                  <MockImageUpload
                    onImageUploaded={handleProfileImageUpload}
                    size="md"
                    placeholder="Chỉnh hình ảnh"
                    maxSize={3}
                  />
                </div>
              </div>
            </section>

            {/* Theme Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Chủ đề</h2>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <div className="grid grid-cols-3 gap-6 place-items-center">
                  {/* Custom Design */}
                  <div className="text-center">
                    <MockImageUpload
                      onImageUploaded={handleBackgroundImageUpload}
                      size="md"
                      variant="rounded"
                      placeholder="Tự thiết kế"
                    />
                    <Zap className="w-4 h-4 mt-1 mx-auto text-purple-500" />
                  </div>

                  {/* Theme Options */}
                  {[
                    { key: 'coral', name: 'Coral', gradient: 'from-[#E7A5A5] to-[#E7A5A5]' },
                    { key: 'green', name: 'Green', gradient: 'from-green-300 to-green-400' },
                    { key: 'dark', name: 'Dark', gradient: 'from-gray-700 to-gray-800' },
                    { key: 'gradient', name: 'Gradient', gradient: 'from-purple-400 via-blue-400 to-green-400' },
                    { key: 'orange', name: 'Orange', gradient: 'from-blue-400 to-orange-400' },
                  ].map((theme) => (
                    <div key={theme.key} className="text-center">
                      <div
                        onClick={() => setSelectedTheme(theme.key)}
                        className={`
                          w-24 h-32 bg-gradient-to-br ${theme.gradient} rounded-2xl mb-2 cursor-pointer
                          ${selectedTheme === theme.key ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                      />
                      <span className="text-sm">{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Background Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-[#a259ff]" />
                <h2 className="text-2xl font-bold">Giao diện tự thiết kế</h2>
              </div>

              <div className="bg-white rounded-3xl border border-gray-400 p-8 mb-8">
                <h3 className="text-xl font-bold mb-6">Hình nền</h3>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-4xl mx-auto">
                  <div className="grid grid-cols-5 gap-6">
                    {/* Add Image */}
                    <div className="text-center">
                      <MockImageUpload
                        onImageUploaded={handleBackgroundImageUpload}
                        size="md"
                        variant="rounded"
                        placeholder="Hình ảnh"
                        maxSize={5}
                      />
                    </div>

                    {/* Background Options */}
                    {[
                      { type: 'solid', name: 'Màu phẳng', color: 'bg-gray-600' },
                      { type: 'gradient', name: 'Màu trộn', color: 'bg-gradient-to-b from-gray-600 to-gray-400' },
                      { type: 'dots', name: 'Chấm bi', color: 'bg-gray-600' },
                      { type: 'stripes', name: 'Kẻ sọc', color: 'bg-gray-600' },
                    ].map((bg) => (
                      <div key={bg.type} className="text-center">
                        <div className={`w-24 h-32 rounded-2xl mb-2 relative overflow-hidden ${bg.color}`}>
                          {/* Pattern overlays */}
                          {bg.type === 'dots' && (
                            <div className="absolute inset-0 opacity-30">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-2 h-2 bg-white rounded-full"
                                  style={{
                                    left: `${(i % 4) * 25 + 10}%`,
                                    top: `${Math.floor(i / 4) * 20 + 10}%`,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          {bg.type === 'stripes' && (
                            <div className="absolute inset-0">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-40 h-2 bg-white opacity-25 transform -rotate-45"
                                  style={{ 
                                    top: `${i * 18 - 20}%`,
                                    left: `${i * 8 - 50}%`
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-sm">{bg.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Style Section */}
            <section>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-6">Kiểu</h3>

                {/* Tabs */}
                <div className="flex border-b border-gray-300 mb-6">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-6 py-3 font-bold transition-all ${
                      activeTab === "text"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    Chữ viết
                  </button>
                  <button
                    onClick={() => setActiveTab("button")}
                    className={`px-6 py-3 font-bold transition-all ${
                      activeTab === "button"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    Nút
                  </button>
                </div>

                {/* TEXT TAB */}
                {activeTab === "text" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm mb-2">Phông chữ</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl">
                        <span className="font-bold">Carlito</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Màu chữ viết trên trang</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div className="w-5 h-5 bg-black rounded"></div>
                        <span className="font-bold">#000000</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Màu chữ viết trên nút</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div className="w-5 h-5 bg-black rounded"></div>
                        <span className="font-bold">#000000</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* BUTTON TAB */}
                {activeTab === "button" && (
                  <div className="space-y-8">
                    {/* Fill Style */}
                    <div>
                      <label className="block text-sm mb-2">Tô nền</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: <FaFillDrip size={18} />, label: "Tô khối" },
                          { icon: <FaRegCircle size={18} />, label: "Tô viền" },
                        ].map((item, i) => (
                          <button
                            key={item.label}
                            onClick={() => setButtonFill(i)}
                            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl text-sm font-medium transition-all ${
                              buttonFill === i
                                ? "bg-gray-300 border border-gray-400"
                                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Corner Style */}
                    <div>
                      <label className="block text-sm mb-2">Góc</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: <TbBorderCornerSquare size={20} />, label: "Góc cứng" },
                          { icon: <TbBorderCornerRounded size={20} />, label: "Góc mềm" },
                          { icon: <TbBorderCornerPill size={20} />, label: "Góc tròn" },
                        ].map((item, i) => (
                          <button
                            key={item.label}
                            onClick={() => setButtonCorner(i)}
                            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl text-sm font-medium transition-all ${
                              buttonCorner === i
                                ? "bg-gray-300 border border-gray-400"
                                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Màu nút</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div className="w-5 h-5 bg-black rounded"></div>
                        <span className="font-bold">#000000</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Phone Preview Panel */}
        <div className="fixed top-0 right-0 h-full min-h-screen w-[395px] bg-white border-l border-[#d9d9d9] flex-shrink-0 z-20">
          <div className="w-70 py-4 px-20 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-hidden z-40">
            <div
              className={`w-60 h-[580px] bg-gradient-to-br ${themeClasses[selectedTheme]} 
                rounded-3xl border-4 border-gray-600 p-6 relative overflow-hidden mt-20`}
            >
              {renderPhonePreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPortfolioDesignPage;