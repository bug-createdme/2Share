import React from "react";
import { FaFacebookSquare, FaTiktok } from "react-icons/fa";

interface MockPortfolioProps {
  themeClasses?: Record<string, string>;
  selectedTheme?: string;
  bio?: string;
  user?: { username?: string; avatar?: string };
  socialLinks?: { name: string; url: string; icon?: JSX.Element }[];
}

const MockPortfolioPage: React.FC<MockPortfolioProps> = ({
  bio,
  user,
}) => {
  // Dark theme cố định
  const darkTheme = {
    type: 'solid' as const,
    main: "#1a1a1a", 
    lighter: "#2a2a2a", 
    darker: "#0d0d0d",
    text: "#e0e0e0",
    background: "bg-gradient-to-br from-gray-900 to-black"
  };

  const currentTheme = darkTheme;

  // Danh sách social links với React Icons và URLs
  const socialIcons = [
    { 
      name: "Facebook", 
      icon: <FaFacebookSquare className="text-white" />, 
      url: "https://www.facebook.com/profile.php?id=61582005475148" 
    },
    { 
      name: "TikTok", 
      icon: <FaTiktok className="text-white" />, 
      url: "https://www.tiktok.com/@2share_fpt?_t=ZS-90kuyEOVaiG&_r=1" 
    }
  ];

  // Hàm render background dark theme smooth hơn
  const renderBackground = () => {
    return (
      <>
        {/* Solid Dark Background với smooth gradient */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.main} 0%, ${currentTheme.darker} 100%)`
          }}
        />
        
        {/* Smooth Mesh Gradient Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${currentTheme.lighter} 0px, transparent 60%),
              radial-gradient(circle at 80% 10%, ${currentTheme.lighter} 0px, transparent 60%),
              radial-gradient(circle at 10% 70%, ${currentTheme.lighter} 0px, transparent 60%),
              radial-gradient(circle at 85% 70%, ${currentTheme.darker} 0px, transparent 60%)
            `,
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay'
          }}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
      {/* Background dark theme smooth */}
      {renderBackground()}

      {/* Noise Texture nhẹ hơn */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette nhẹ nhàng hơn */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)`
        }}
      />

      {/* Nội dung */}
      <div className="relative z-10 flex flex-col items-center max-w-xl my-20 px-4 w-full">
        {/* Phần avatar và thông tin bên cạnh - CĂN GIỮA */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 mx-auto w-fit">

          {/* Avatar hình vuông bo tròn góc - bên trái */}
          <div className="w-40 h-40 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20 flex-shrink-0">
            <img
              src={user?.avatar || "/images/profile-pictures/pfp-black.jpg"}
              alt="avatar"
              className="w-40 h-40 rounded-xl object-cover opacity-90"
            />
          </div>

          {/* Thông tin bên phải avatar - CĂN GIỮA NỘI DUNG */}
          <div className="flex flex-col items-center md:items-start justify-center flex-1">
            {/* Username - giữ nguyên kích thước text-2xl */}
            <h1 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
              {user?.username || "Bobby"}
            </h1>

            {/* Social icons row - giữ nguyên kích thước ban đầu */}
            <div className="flex gap-2 justify-center md:justify-start">
              {socialIcons.map((social) => (
                <a 
                  key={social.name}
                  href="#" 
                  className="hover:opacity-80 transition-transform hover:scale-110 w-10 h-10 flex items-center justify-center"
                  title={social.name}
                >
                  {React.cloneElement(social.icon, { 
                    className: "text-white text-2xl" 
                  })}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bio box với màu chữ dark theme - giữ nguyên */}
        <div 
          className="bg-white/10 text-sm rounded-2xl p-5 mb-6 mt-8 shadow-lg backdrop-blur-sm border border-white/15"
          style={{ color: currentTheme.text }}
        >
          <p className="leading-relaxed">
            {bio ||
              "Mình là một Kỹ sư phần mềm muốn gây ấn tượng với portfolio tích hợp trong thẻ NFC."}
          </p>
        </div>

        {/* Link buttons - thêm URLs */}
        <div className="flex flex-col gap-3 w-full mt-4">
          {socialIcons.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-full">
              <button 
                className="w-full py-3 border border-white/40 text-white font-medium rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-3 duration-300"
              >
                <span className="text-white">{social.icon}</span>
                <span>{social.name}</span>
              </button>
            </a>
          ))}
        </div>

        {/* Footer với logo 2Share - giữ nguyên */}
        <div className="mt-20 flex flex-col items-center">
          <div className="w-20 h-8 mb-2 opacity-80">
            <img 
              src="/images/2share01.png" 
              alt="2Share Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='%231a1a1a'/%3E%3Ctext x='50' y='30' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='14'%3E2Share%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating particles effect - giảm số lượng và opacity */}
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

export default MockPortfolioPage;