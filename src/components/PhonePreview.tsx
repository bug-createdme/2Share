// src/components/PhonePreview.tsx
import React from "react";
import type { SocialLink } from "../screens/MyLinksPage/sections/SocialLinksSection/SocialLinksSection";

// Social icons import - THÊM CÁC ICON KHÁC
import { 
  FaLinkedin, FaBehance, FaInstagram, FaFacebookSquare, FaTiktok, 
  FaYoutube, FaGithub, FaTwitter, FaGlobe, FaLink, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram, FaSnapchat,
  FaPinterest, FaReddit, FaDiscord, FaTwitch, FaSpotify
} from "react-icons/fa";

// Định nghĩa interface đầy đủ cho DesignSettings
interface DesignSettings {
  buttonFill: number;
  buttonCorner: number;
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
  fontFamily: string;
  backgroundType: string;
  backgroundImage?: string;
  backgroundSolidColor?: string;
  backgroundGradient?: string;
}

// Định nghĩa interface đầy đủ cho PhonePreviewProps
interface PhonePreviewProps {
  themeClasses: Record<string, string>;
  textColors?: Record<string, string>; // retained for backward compatibility with callers
  selectedTheme: string;
  selectedLayout: number;
  user?: any;
  bio?: string;
  socialLinks?: SocialLink[];
  designSettings?: DesignSettings;
}

// Helper function để lấy font family class

// Helper function để lấy font family style

const PhonePreview: React.FC<PhonePreviewProps> = ({
  themeClasses,
  selectedTheme,
  selectedLayout,
  user,
  bio = "",
  socialLinks = [],
  designSettings,
}) => {
  // Get enabled social links - CHỈ LẤY CÁC LINK CÓ URL VÀ ĐƯỢC ENABLED
  const enabledLinks = socialLinks.filter(link => 
    link.isEnabled && link.url && link.url.trim() !== ''
  );
  
  const displayUsername = user?.username || "username";
  const displayBio = bio || "...";
  const displayAvatar = user?.avatar_url || "/images/profile-pictures/pfp.jpg";

  // Lấy các giá trị từ designSettings hoặc dùng giá trị mặc định
  const buttonFill = designSettings?.buttonFill ?? 0;
  const buttonCorner = designSettings?.buttonCorner ?? 1;
  const fontFamily = designSettings?.fontFamily || "spartan";
  const backgroundType = designSettings?.backgroundType || "theme";
  const backgroundImage = designSettings?.backgroundImage;
  const backgroundSolidColor = designSettings?.backgroundSolidColor;
  const backgroundGradient = designSettings?.backgroundGradient;

  // Màu chữ cho bio theo theme
  const getBioTextColor = () => {
    switch (selectedTheme) {
      case 'classic-rose': return '#E8B4B4';
      case 'fresh-mint': return '#A7E9AF';
      case 'dark-slate': return '#4A5568';
      case 'purple-green': return '#C084FC';
      case 'sunset': return '#FB923C';
      case 'custom': return '#6B7280';
      default: return '#6B7280';
    }
  };

  // Social icons mapping - CẬP NHẬT THÊM NHIỀU PLATFORM
  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    const iconProps = { className: "text-white text-sm" };
    
    switch (platformLower) {
      case 'facebook': return <FaFacebookSquare {...iconProps} />;
      case 'tiktok': return <FaTiktok {...iconProps} />;
      case 'instagram': return <FaInstagram {...iconProps} />;
      case 'linkedin': return <FaLinkedin {...iconProps} />;
      case 'youtube': return <FaYoutube {...iconProps} />;
      case 'github': return <FaGithub {...iconProps} />;
      case 'twitter': return <FaTwitter {...iconProps} />;
      case 'x': return <FaTwitter {...iconProps} />;
      case 'behance': return <FaBehance {...iconProps} />;
      case 'whatsapp': return <FaWhatsapp {...iconProps} />;
      case 'telegram': return <FaTelegram {...iconProps} />;
      case 'snapchat': return <FaSnapchat {...iconProps} />;
      case 'pinterest': return <FaPinterest {...iconProps} />;
      case 'reddit': return <FaReddit {...iconProps} />;
      case 'discord': return <FaDiscord {...iconProps} />;
      case 'twitch': return <FaTwitch {...iconProps} />;
      case 'spotify': return <FaSpotify {...iconProps} />;
      case 'email': return <FaEnvelope {...iconProps} />;
      case 'phone': return <FaPhone {...iconProps} />;
      case 'location': return <FaMapMarkerAlt {...iconProps} />;
      case 'website': return <FaGlobe {...iconProps} />;
      case 'link': return <FaLink {...iconProps} />;
      default: return <FaGlobe {...iconProps} />;
    }
  };

  // Hàm xác định border radius dựa trên buttonCorner
  const getButtonBorderRadius = () => {
    switch (buttonCorner) {
      case 0: return "8px";
      case 1: return "12px";
      case 2: return "20px";
      default: return "12px";
    }
  };

  // Hàm xác định button style dựa trên buttonFill
  const getButtonStyle = () => {
    const borderRadius = getButtonBorderRadius();
    
    if (buttonFill === 0) {
      // Solid fill - glassmorphism effect
      return {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white", // LUÔN DÙNG MÀU TRẮNG
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius,
        backdropFilter: "blur(10px)",
        fontFamily: fontFamily,
      };
    } else {
      // Outline
      return {
        backgroundColor: "transparent",
        color: "white", // LUÔN DÙNG MÀU TRẮNG
        border: `1px solid white`,
        borderRadius,
        fontFamily: fontFamily,
      };
    }
  };

  // Hàm render Bio Section với khung ôm nội dung giống mock
  const renderBioSection = (content: string, className: string = "") => {
    if (!content || content.trim() === '') return null;
    
    const bioTextColor = getBioTextColor();
    
    return (
      <div className={`w-full bg-white rounded-[12px] shadow-lg p-3 ${className}`}>
        <p 
          className="text-[10px] leading-relaxed text-center break-words"
          style={{ 
            wordBreak: 'break-word',
            fontFamily: fontFamily,
            color: bioTextColor // MÀU THEO THEME CHO BIO
          }}
        >
          {content}
        </p>
      </div>
    );
  };

  // Xác định background style
  const getPhoneBackgroundStyle = () => {
    if (backgroundType && backgroundType !== "default" && backgroundType !== "theme") {
      switch (backgroundType) {
        case "image":
          return backgroundImage ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : {};
        case "gradient":
          if (backgroundGradient) {
            const gradientParts = backgroundGradient.split(" ");
            const fromColor = gradientParts[1] || "#6e6e6e";
            const toColor = gradientParts[3] || "#4a4a4a";
            return {
              background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            };
          }
          break;
        case "solid":
          return backgroundSolidColor ? {
            backgroundColor: backgroundSolidColor,
          } : {};
        case "pattern":
          return {
            backgroundColor: "#6e6e6e",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 2px, transparent 2px)
            `,
            backgroundSize: "20px 20px",
          };
        default:
          return {};
      }
    }
    
    return {};
  };

  // Layout 1: Avatar ở trên, centered (giống mock)
  const renderLayout1 = () => (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30">
        <img
          src={displayAvatar}
          alt="avatar"
          className="w-14 h-14 rounded-xl object-cover opacity-90"
        />
      </div>
      
      {/* Username - LUÔN MÀU TRẮNG */}
      <h3 className="text-white text-sm font-bold tracking-wide">
        @{displayUsername}
      </h3>

      {/* SOCIAL ICONS ROW - HIỂN THỊ CÁC SOCIAL LINKS THỰC TẾ */}
      {enabledLinks.length > 0 && (
        <div className="flex gap-2 justify-center mb-2">
          {enabledLinks.slice(0, 6).map((link) => (
            <div 
              key={link.id}
              className="hover:opacity-80 transition-transform hover:scale-110 w-4 h-4 flex items-center justify-center"
              title={link.displayName || link.name}
            >
              {getSocialIcon(link.name)}
            </div>
          ))}
        </div>
      )}

      {/* Bio Section */}
      {renderBioSection(displayBio, "mb-4")}

      {/* Links - HIỂN THỊ CÁC BUTTON SOCIAL LINKS THỰC TẾ */}
      {enabledLinks.length > 0 && (
        <div className="space-y-2 w-full">
          {enabledLinks.map((link) => (
            <button
              key={link.id}
              className="w-full py-1.5 text-[12px] font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              style={getButtonStyle()}
            >
              {getSocialIcon(link.name)}
              <span>{link.displayName || link.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Layout 2: Avatar bên trái với username (giống mock)
  const renderLayout2 = () => (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 mx-auto w-fit">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30">
          <img
            src={displayAvatar}
            alt="avatar"
            className="w-10 h-10 rounded-xl object-cover opacity-90"
          />
        </div>
        <div className="flex flex-col items-start">
          {/* Username - LUÔN MÀU TRẮNG */}
          <h3 className="text-white text-sm font-bold tracking-wide">
            @{displayUsername}
          </h3>
          {/* Social Icons */}
          {enabledLinks.length > 0 && (
            <div className="flex gap-1 mt-1">
              {enabledLinks.slice(0, 4).map((link) => (
                <div key={link.id} className="w-3 h-3 flex items-center justify-center">
                  {getSocialIcon(link.name)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Bio Section */}
      {renderBioSection(displayBio, "mb-4")}

      {/* Links */}
      {enabledLinks.length > 0 && (
        <div className="space-y-1.5 w-full">
          {enabledLinks.map((link) => (
            <button
              key={link.id}
              className="w-full py-1 text-[11px] font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              style={getButtonStyle()}
            >
              {getSocialIcon(link.name)}
              <span>{link.displayName || link.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Layout 3: Username trên, avatar wide ở giữa (giống mock)
  const renderLayout3 = () => (
    <div className="flex flex-col items-center gap-3 mt-6 w-full">
      {/* Username - LUÔN MÀU TRẮNG */}
      <h3 className="text-white text-sm font-bold tracking-wide">
        @{displayUsername}
      </h3>
      
      {/* Social Icons */}
      {enabledLinks.length > 0 && (
        <div className="flex gap-2 justify-center mb-1">
          {enabledLinks.slice(0, 5).map((link) => (
            <div 
              key={link.id}
              className="hover:opacity-80 transition-transform hover:scale-110 w-3 h-3 flex items-center justify-center"
              title={link.displayName || link.name}
            >
              {getSocialIcon(link.name)}
            </div>
          ))}
        </div>
      )}

      {/* Avatar large middle */}
      <div className="w-20 h-16 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30 mb-2">
        <img
          src={displayAvatar}
          alt="avatar"
          className="w-18 h-14 rounded-xl object-cover opacity-90"
        />
      </div>

      {/* Bio Section */}
      {renderBioSection(displayBio, "mb-4")}

      {/* Links */}
      {enabledLinks.length > 0 && (
        <div className="space-y-1.5 w-full">
          {enabledLinks.map((link) => (
            <button
              key={link.id}
              className="w-full py-1 text-[11px] font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              style={getButtonStyle()}
            >
              {getSocialIcon(link.name)}
              <span>{link.displayName || link.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Layout 4: Background avatar style (giống mock)
  const renderLayout4 = () => (
    <div className="relative h-full flex flex-col items-center justify-between py-6">
      {/* Background avatar - large avatar in center */}
      <div className="absolute top-1/4 flex items-center justify-center opacity-85">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-white/30 border-2 border-white/20">
          <img
            className="w-full h-full object-cover"
            alt="Avatar background"
            src={displayAvatar}
          />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full flex flex-col items-center mt-4">
        {/* Username - LUÔN MÀU TRẮNG */}
        <h3 className="text-white text-sm font-bold tracking-wide mb-2">
          @{displayUsername}
        </h3>
        
        {/* Social Icons */}
        {enabledLinks.length > 0 && (
          <div className="flex gap-2 justify-center mb-4">
            {enabledLinks.slice(0, 5).map((link) => (
              <div 
                key={link.id}
                className="hover:opacity-80 transition-transform hover:scale-110 w-3 h-3 flex items-center justify-center"
                title={link.displayName || link.name}
              >
                {getSocialIcon(link.name)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bio and links at bottom */}
      <div className="relative z-10 w-full space-y-2">
        {/* Bio Section */}
        {renderBioSection(displayBio, "mb-3")}

        {/* Links */}
        {enabledLinks.length > 0 && (
          <div className="space-y-1 w-full">
            {enabledLinks.slice(0, 4).map((link) => (
              <button
                key={link.id}
                className="w-full py-1 text-[10px] font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2 ${getFontFamilyClass(fontFamily)}"
                style={getButtonStyle()}
              >
                {getSocialIcon(link.name)}
                <span>{link.displayName || link.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render layout dựa trên selectedLayout
  const renderCurrentLayout = () => {
    switch (selectedLayout) {
      case 1: return renderLayout1();
      case 2: return renderLayout2();
      case 3: return renderLayout3();
      case 4: return renderLayout4();
      default: return renderLayout1();
    }
  };

  // Trong PhonePreview.tsx
  return (
    <div className="w-70 py-4 px-20 mx-auto bg-white border-l border-gray-200 fixed top-16 right-0 h-screen overflow-hidden z-20 font-spartan">
      <div
        className={`w-60 h-[580px] bg-gradient-to-br ${themeClasses[selectedTheme]} rounded-3xl border-4 border-gray-600 p-6 relative overflow-hidden mt-4 font-spartan`}
        style={getPhoneBackgroundStyle()}
      >
        {/* Overlay làm mờ và tối - CHỈ ÁP DỤNG KHI backgroundType là 'image' */}
        {backgroundType === 'image' && backgroundImage && (
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.35) 100%)',
              backdropFilter: 'blur(1px)'
            }}
          />
        )}
        
        {/* Nội dung hiển thị phía trên overlay */}
        <div className="relative z-10 h-full">
          {renderCurrentLayout()}
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;