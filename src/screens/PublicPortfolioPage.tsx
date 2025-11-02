import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { getPortfolioBySlug } from "../lib/api";
import type { SocialLink } from "./MyLinksPage/sections/SocialLinksSection/SocialLinksSection";

// Social icons import
import { 
  FaLinkedin, FaBehance, FaInstagram, FaFacebookSquare, FaTiktok, 
  FaYoutube, FaGithub, FaTwitter, FaGlobe, FaLink, FaEnvelope,
  FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram, FaSnapchat,
  FaPinterest, FaReddit, FaDiscord, FaTwitch, FaSpotify
} from "react-icons/fa";

// Social icons mapping
const getSocialIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  const iconProps = { className: "text-white text-lg" };
  
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

// Theme classes mapping - KHỚP VỚI PORTFOLIO DESIGN
const themeClasses: Record<string, string> = {
  coral: "from-[#E7A5A5] to-[#E7A5A5]",
  green: "from-green-300 to-green-400",
  dark: "from-gray-700 to-gray-800", 
  gradient: "from-purple-400 via-blue-400 to-green-400",
  orange: "from-blue-400 to-orange-400",
};

// Bio text colors theo theme - KHỚP VỚI PHONE PREVIEW
const getBioTextColor = (selectedTheme: string) => {
  switch (selectedTheme) {
    case 'coral': return '#E7A5A5';
    case 'green': return '#4ADE80';
    case 'dark': return '#6B7280';
    case 'gradient': return '#A855F7';
    case 'orange': return '#FB923C';
    default: return '#6B7280';
  }
};

const PublicPortfolioPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      if (!slug) {
        setError("Không tìm thấy slug");
        setLoading(false);
        return;
      }

      try {
        const portfolioData = await getPortfolioBySlug(slug);
        console.log('📋 Portfolio data received:', portfolioData);
        console.log('🎨 Design settings:', portfolioData?.design_settings);
        console.log('👤 User data:', {
          username: portfolioData?.username,
          avatar_url: portfolioData?.avatar_url,
          title: portfolioData?.title
        });
        setPortfolio(portfolioData);
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [slug]);

  // Hàm xác định background style dựa trên design settings - SỬA LẠI ĐỂ KHỚP VỚI PHONE PREVIEW
  const getBackgroundStyle = () => {
    if (!portfolio?.design_settings) {
      return {
        background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)"
      };
    }

    const design = portfolio.design_settings;
    console.log('🎨 Applying design settings for background:', {
      backgroundType: design.backgroundType,
      selectedTheme: design.selectedTheme || design.theme,
      backgroundImage: design.backgroundImage,
      backgroundSolidColor: design.backgroundSolidColor,
      backgroundGradient: design.backgroundGradient
    });
    
    // ƯU TIÊN: backgroundType trước, sau đó mới đến theme
    if (design.backgroundType === "image" && design.backgroundImage) {
      console.log('🖼️ Using background image:', design.backgroundImage);
      return {
        backgroundImage: `url(${design.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      };
    } else if (design.backgroundType === "gradient" && design.backgroundGradient) {
      console.log('🌈 Using background gradient:', design.backgroundGradient);
      // Parse gradient string từ PortfolioDesignPage (ví dụ: "from-gray-600 to-gray-400")
      const gradientParts = design.backgroundGradient.split(" ");
      let fromColor = "#6e6e6e";
      let toColor = "#4a4a4a";
      
      if (gradientParts.length >= 2) {
        // Map Tailwind colors to hex
        const colorMap: Record<string, string> = {
          'gray-600': '#4b5563',
          'gray-400': '#9ca3af',
          'gray-700': '#374151',
          'gray-800': '#1f2937',
          'gray-900': '#111827',
          'blue-400': '#60a5fa',
          'blue-500': '#3b82f6',
          'blue-700': '#1d4ed8',
          'purple-400': '#c084fc',
          'purple-500': '#a855f7', 
          'purple-700': '#7e22ce',
          'green-300': '#86efac',
          'green-400': '#4ade80',
          'green-500': '#10b981',
          'green-700': '#047857',
          'orange-400': '#fb923c',
        };
        
        fromColor = colorMap[gradientParts[1]] || gradientParts[1];
        toColor = colorMap[gradientParts[3]] || gradientParts[3] || fromColor;
      }
      
      return {
        background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
      };
    } else if (design.backgroundType === "solid" && design.backgroundSolidColor) {
      console.log('🎨 Using solid color:', design.backgroundSolidColor);
      return {
        backgroundColor: design.backgroundSolidColor,
      };
    } else if (design.backgroundType === "pattern") {
      console.log('🔵 Using pattern background');
      return {
        backgroundColor: "#6e6e6e",
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 2px, transparent 2px),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 2px, transparent 2px)
        `,
        backgroundSize: "20px 20px",
      };
    } else {
      // Mặc định dùng theme - SỬA LẠI ĐỂ KHỚP CHÍNH XÁC VỚI PHONE PREVIEW
      const selectedTheme = design.selectedTheme || design.theme || "dark";
      console.log('🎭 Using theme:', selectedTheme);
      
      // SỬ DỤNG CÙNG THEME CLASSES VỚI PHONE PREVIEW
      const themeGradients: Record<string, string> = {
        "coral": "linear-gradient(135deg, #E7A5A5 0%, #E7A5A5 100%)",
        "green": "linear-gradient(135deg, #86efac 0%, #4ade80 100%)",
        "dark": "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
        "gradient": "linear-gradient(135deg, #c084fc 0%, #60a5fa 50%, #4ade80 100%)",
        "orange": "linear-gradient(135deg, #60a5fa 0%, #fb923c 100%)",
      };
      
      const background = themeGradients[selectedTheme] || themeGradients.dark;
      console.log('🎨 Theme background:', background);
      return { background };
    }
  };

  // Hàm xác định text color - LUÔN DÙNG MÀU TRẮNG CHO TẤT CẢ CHỮ (TRỪ BIO)
  const getTextColor = () => {
    return "#ffffff"; // LUÔN MÀU TRẮNG
  };

  // Hàm xác định button style dựa trên design settings
  const getButtonStyle = (design: any) => {
    const buttonFill = design?.buttonFill ?? 0;
    const buttonCorner = design?.buttonCorner ?? 1;
    const buttonColor = design?.buttonColor || "#ffffff";
    const buttonTextColor = design?.buttonTextColor || "#ffffff";

    console.log('🎨 Button settings:', {
      buttonFill,
      buttonCorner,
      buttonColor,
      buttonTextColor
    });

    const getBorderRadius = () => {
      switch (buttonCorner) {
        case 0: return "8px";
        case 1: return "12px";
        case 2: return "20px";
        default: return "12px";
      }
    };

    if (buttonFill === 0) {
      // Solid fill - glassmorphism effect
      return {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white", // LUÔN DÙNG MÀU TRẮNG
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: getBorderRadius(),
        backdropFilter: "blur(10px)",
        fontFamily: "spartan", // THÊM FONT SPARTAN
      };
    } else {
      // Outline
      return {
        backgroundColor: "transparent",
        color: "white", // LUÔN DÙNG MÀU TRẮNG
        border: `1px solid white`,
        borderRadius: getBorderRadius(),
        fontFamily: "spartan", // THÊM FONT SPARTAN
      };
    }
  };

  // Hàm render layout dựa trên design settings
  const renderLayout = () => {
    const design = portfolio.design_settings;
    const selectedLayout = design?.selectedLayout || design?.profileLayout + 1 || 1;
    const selectedTheme = design?.selectedTheme || design?.theme || "dark";
    
    // Lấy thông tin user từ portfolio
    const username = portfolio.username || "User";
    const avatarUrl = portfolio.avatar_url || "/images/profile-pictures/pfp-black.jpg";
    const portfolioTitle = portfolio.title || "Portfolio";
    
    // Lấy bio từ blocks
    const bioContent = portfolio.blocks?.find((b: any) => b.type === 'text')?.content;

    // Chuyển đổi social_links từ object sang array để hiển thị
    const socialLinks: SocialLink[] = portfolio.social_links
      ? Object.entries(portfolio.social_links).map(([key, value]: any) => {
          if (typeof value === 'object' && value !== null) {
            return {
              id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: key.charAt(0).toUpperCase() + key.slice(1),
              url: value.url || "",
              clicks: value.clicks || 0,
              isEnabled: value.isEnabled !== undefined ? value.isEnabled : Boolean(value.url),
              color: value.color || "#6e6e6e",
              icon: value.icon || "🔗",
              displayName: value.displayName || key.charAt(0).toUpperCase() + key.slice(1),
            };
          }
          // Fallback for simple string URLs (legacy format)
        return {
            id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            url: String(value || ""),
            clicks: 0,
            isEnabled: Boolean(value),
            color: "#6e6e6e",
            icon: "🔗",
            displayName: key.charAt(0).toUpperCase() + key.slice(1),
          };
        }).filter(link => link.isEnabled === true && link.url)
      : [];

    const textColor = getTextColor();
    const bioTextColor = getBioTextColor(selectedTheme);

    console.log('👤 Rendering with data:', {
      username,
      avatarUrl,
      portfolioTitle,
      bioContent,
      socialLinksCount: socialLinks.length,
      selectedLayout,
      selectedTheme,
      bioTextColor
    });

    // Layout 1: Avatar trên, centered
    const renderLayout1 = () => (
      <div className="flex flex-col items-center gap-6 mt-6 font-spartan">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-28 h-28 rounded-xl object-cover"
            onError={(e) => {
              console.error('❌ Avatar load error, using fallback');
              (e.target as HTMLImageElement).src = "/images/profile-pictures/pfp-black.jpg";
            }}
          />
        </div>
        
        {/* Username - LUÔN MÀU TRẮNG */}
        <h1 className="text-2xl font-semibold mb-2 drop-shadow-lg text-white font-spartan">
          {portfolioTitle}
        </h1>

        {/* Social icons row */}
        {socialLinks.length > 0 && (
          <div className="flex gap-3 justify-center mb-4">
            {socialLinks.slice(0, 6).map((link) => (
              <div 
                key={link.id}
                className="hover:opacity-80 transition-transform hover:scale-110 w-6 h-6 flex items-center justify-center"
                title={link.displayName || link.name}
              >
                {getSocialIcon(link.name)}
              </div>
            ))}
          </div>
        )}

        {/* Bio section - MÀU THEO THEME */}
        {bioContent && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-lg backdrop-blur-md border border-white/15 w-full max-w-md">
            <p 
              className="leading-relaxed text-center text-sm font-spartan"
              style={{ color: bioTextColor }}
            >
              {bioContent}
            </p>
          </div>
        )}

        {/* Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-col gap-3 w-full max-w-md">
            {socialLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full no-underline"
              >
                <button 
                  className="w-full py-4 font-medium rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-3 duration-300 font-spartan"
                  style={getButtonStyle(design)}
                >
                  {getSocialIcon(link.name)}
                  <span>{link.displayName || link.name}</span>
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    );

    // Layout 2: Avatar bên trái với username
    const renderLayout2 = () => (
      <div className="flex flex-col gap-6 mt-6 font-spartan">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 mx-auto w-fit">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-xl object-cover"
              onError={(e) => {
                console.error('❌ Avatar load error, using fallback');
                (e.target as HTMLImageElement).src = "/images/profile-pictures/pfp-black.jpg";
              }}
            />
          </div>
          <div className="flex flex-col items-center md:items-start">
            {/* Username - LUÔN MÀU TRẮNG */}
            <h1 className="text-2xl font-semibold mb-2 drop-shadow-lg text-white font-spartan">
              {portfolioTitle}
            </h1>
            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2 mt-1">
                {socialLinks.slice(0, 4).map((link) => (
                  <div key={link.id} className="w-5 h-5 flex items-center justify-center">
                    {getSocialIcon(link.name)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Bio section - MÀU THEO THEME */}
        {bioContent && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-lg backdrop-blur-sm border border-white/15 w-full max-w-md mx-auto">
            <p 
              className="leading-relaxed text-center text-sm font-spartan"
              style={{ color: bioTextColor }}
            >
              {bioContent}
            </p>
          </div>
        )}

        {/* Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
            {socialLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full no-underline"
              >
                <button 
                  className="w-full py-3 font-medium rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-3 duration-300 font-spartan"
                  style={getButtonStyle(design)}
                >
                  {getSocialIcon(link.name)}
                  <span>{link.displayName || link.name}</span>
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    );

    // Layout 3: Username trên, avatar wide ở giữa
    const renderLayout3 = () => (
      <div className="flex flex-col items-center gap-4 mt-6 w-full font-spartan">
        {/* Username - LUÔN MÀU TRẮNG */}
        <h1 className="text-2xl font-semibold mb-2 drop-shadow-lg text-white font-spartan">
          {portfolioTitle}
        </h1>
        
        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div className="flex gap-2 justify-center mb-4">
            {socialLinks.slice(0, 5).map((link) => (
              <div 
                key={link.id}
                className="hover:opacity-80 transition-transform hover:scale-110 w-5 h-5 flex items-center justify-center"
                title={link.displayName || link.name}
              >
                {getSocialIcon(link.name)}
              </div>
            ))}
          </div>
        )}

        {/* Avatar large middle */}
        <div className="w-32 h-24 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20 mb-4">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-28 h-20 rounded-xl object-cover"
            onError={(e) => {
              console.error('❌ Avatar load error, using fallback');
              (e.target as HTMLImageElement).src = "/images/profile-pictures/pfp-black.jpg";
            }}
          />
        </div>

        {/* Bio section - MÀU THEO THEME */}
        {bioContent && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-lg backdrop-blur-sm border border-white/15 w-full max-w-md">
            <p 
              className="leading-relaxed text-center text-sm font-spartan"
              style={{ color: bioTextColor }}
            >
              {bioContent}
            </p>
          </div>
        )}

        {/* Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-col gap-3 w-full max-w-md">
            {socialLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full no-underline"
              >
                <button 
                  className="w-full py-3 font-medium rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-3 duration-300 font-spartan"
                  style={getButtonStyle(design)}
                >
                  {getSocialIcon(link.name)}
                  <span>{link.displayName || link.name}</span>
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    );

    // Layout 4: Background avatar style - SỬA LẠI ĐỂ AVATAR LÀ ĐIỂM NHẤN
const renderLayout4 = () => (
  <div className="relative h-full flex flex-col items-center justify-start min-h-[500px]">
    {/* Background avatar - LỚN và NỔI BẬT */}
    <div className="absolute inset-0 flex items-center justify-center opacity-50 mb-52">
      <div className="w-64 h-64 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 shadow-2xl">
        <img
          className="w-full h-full object-cover"
          alt="Avatar background"
          src={avatarUrl}
          onError={(e) => {
            console.error('❌ Avatar load error, using fallback');
            (e.target as HTMLImageElement).src = "/images/profile-pictures/pfp-black.jpg";
          }}
        />
      </div>
    </div>

    {/* Foreground content - NẰM Ở TRÊN CÙNG */}
    <div className="relative z-10 w-full flex flex-col items-center mt-8">
      {/* Username - NỔI BẬT Ở TRÊN CÙNG */}
      <h1 className="text-3xl font-bold mb-4 drop-shadow-2xl text-white font-spartan text-center">
        {portfolioTitle}
      </h1>
      
      {/* Social Icons - NẰM NGAY DƯỚI USERNAME */}
      {socialLinks.length > 0 && (
        <div className="flex gap-4 justify-center mb-8">
          {socialLinks.slice(0, 6).map((link) => (
            <div 
              key={link.id}
              className="hover:opacity-80 transition-transform hover:scale-110 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm border border-white/30"
              title={link.displayName || link.name}
            >
              {getSocialIcon(link.name)}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Bio and links at bottom - NẰM Ở DƯỚI CÙNG */}
    <div className="relative z-10 w-full mt-64 space-y-6 pb-8 ">
      {/* Bio Section - CHỈ HIỆN KHI CÓ NỘI DUNG */}
      {bioContent && (
        <div className="bg-white rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/20 w-full max-w-md mx-auto">
          <p 
              className="leading-relaxed text-center text-sm font-spartan"
              style={{ color: bioTextColor }}
            >
              {bioContent}
            </p>
        </div>
      )}

      {/* Links - NẰM DƯỚI BIO */}
      {socialLinks.length > 0 && (
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
          {socialLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full no-underline"
            >
              <button 
                className="w-full py-4 font-medium rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-3 duration-300 border border-white/30"
                style={getButtonStyle(design)}
              >
                {getSocialIcon(link.name)}
                <span className="text-white">{link.displayName || link.name}</span>
              </button>
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);

    switch (selectedLayout) {
      case 1: return renderLayout1();
      case 2: return renderLayout2();
      case 3: return renderLayout3();
      case 4: return renderLayout4();
      default: return renderLayout1();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center font-spartan">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Đang tải portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center font-spartan">
        <div className="text-center">
          <div className="bg-white/10 rounded-lg shadow-lg p-8 max-w-md mx-auto backdrop-blur-sm">
            <div className="text-white text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-white mb-2">Không tìm thấy portfolio</h2>
            <p className="text-white/80 mb-4">{error || "Portfolio này không tồn tại hoặc chưa được công khai."}</p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-spartan"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const backgroundStyle = getBackgroundStyle();
  console.log('🎨 Final background style:', backgroundStyle);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white relative overflow-hidden font-spartan">
      {/* Background với design settings - ĐẢM BẢO ÁP DỤNG ĐÚNG */}
      <div 
        className="absolute inset-0"
        style={backgroundStyle}
      />

      {/* Noise Texture nhẹ - chỉ hiển thị nếu không phải background image */}
      {!portfolio?.design_settings?.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Vignette nhẹ nhàng - chỉ hiển thị nếu không phải background image */}
      {!portfolio?.design_settings?.backgroundImage && (
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)`
          }}
        />
      )}

      {/* Header đơn giản */}
      <div className="absolute top-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-b border-white/20 z-10 font-spartan">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-white hover:text-white hover:bg-white/20 border-white/30 font-spartan"
            >
              ← Về trang chủ
            </Button>
            <div className="text-sm text-white/80 truncate max-w-[200px] font-spartan">
              {portfolio?.username ? `@${portfolio.username}` : 'Portfolio'}
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl my-20 px-4">
        {renderLayout()}

        {/* Footer với logo 2Share */}
        <div className="mt-12 flex flex-col items-center">
          <div className="w-20 h-8 mb-2 opacity-80">
            <img 
              src="/images/2share01.png" 
              alt="2Share Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='%23ffffff'/%3E%3Ctext x='50' y='30' text-anchor='middle' fill='%23000000' font-family='Arial' font-size='14'%3E2Share%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="text-xs text-white/60 font-spartan">
            Powered by 2Share
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicPortfolioPage;