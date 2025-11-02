import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PhonePreview from "../components/PhonePreview";
import { Zap } from "lucide-react";
import { FaFillDrip, FaRegCircle } from "react-icons/fa";
import {
  TbBorderCornerSquare,
  TbBorderCornerRounded,
  TbBorderCornerPill,
} from "react-icons/tb";
import { getMyProfile, getMyPortfolio, updatePortfolio, DesignSettings, getPortfolioBySlug } from "../lib/api";
import { ImageUpload } from "../components/ui/image-upload";
import { showToast } from "../lib/toast";

const DESIGN_SETTINGS_KEY = 'portfolio_design_settings';

const PortfolioDesignPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  
  // Design states
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [activeTab, setActiveTab] = useState<"text" | "button">("text");
  const [buttonFill, setButtonFill] = useState(0);
  const [buttonCorner, setButtonCorner] = useState(1);
  const [fontFamily, setFontFamily] = useState("Carlito");
  const [textColor, setTextColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [backgroundType, setBackgroundType] = useState("theme");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundSolidColor, setBackgroundSolidColor] = useState("#ffffff");
  const [backgroundGradient, setBackgroundGradient] = useState("from-gray-600 to-gray-400");
  
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [portfolioTitle, setPortfolioTitle] = useState("My Portfolio");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Color mappings
  const avatarColors: Record<string, string> = {
    coral: "bg-[#E7A5A5]",
    green: 'bg-green-300',
    dark: 'bg-gray-500',
    gradient: 'bg-purple-400',
    orange: 'bg-orange-400',
  };

  const textColors: Record<string, string> = {
    coral: 'text-[#E7A5A5]',
    green: 'text-green-400',
    dark: 'text-gray-500',
    gradient: 'text-purple-400',
    orange: 'text-orange-400',
  };

  const themeClasses: Record<string, string> = {
    coral: "from-[#E7A5A5] to-[#E7A5A5]",
    green: "from-green-300 to-green-400",
    dark: "from-gray-700 to-gray-800",
    gradient: "from-purple-400 via-blue-400 to-green-400",
    orange: "from-blue-400 to-orange-400",
  };

  // Hàm lưu state vào localStorage
  const saveStateToLocalStorage = () => {
    const state = {
      selectedTheme,
      selectedProfile,
      buttonFill,
      buttonCorner,
      fontFamily,
      textColor,
      buttonTextColor,
      buttonColor,
      backgroundType,
      backgroundImage,
      backgroundSolidColor,
      backgroundGradient,
      bio,
      socialLinks,
      portfolioTitle,
      lastSaved: Date.now()
    };
    localStorage.setItem(DESIGN_SETTINGS_KEY, JSON.stringify(state));
    console.log('💾 Saved to localStorage');
  };

  // Hàm load state từ localStorage
  const loadStateFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(DESIGN_SETTINGS_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        
        // Chỉ load nếu data còn mới (dưới 2 giờ)
        const isRecent = state.lastSaved && (Date.now() - state.lastSaved < 2 * 60 * 60 * 1000);
        
        if (isRecent) {
          console.log('📥 Loading recent design settings from localStorage');
          
          if (state.selectedTheme) setSelectedTheme(state.selectedTheme);
          if (state.selectedProfile !== undefined) setSelectedProfile(state.selectedProfile);
          if (state.buttonFill !== undefined) setButtonFill(state.buttonFill);
          if (state.buttonCorner !== undefined) setButtonCorner(state.buttonCorner);
          if (state.fontFamily) setFontFamily(state.fontFamily);
          if (state.textColor) setTextColor(state.textColor);
          if (state.buttonTextColor) setButtonTextColor(state.buttonTextColor);
          if (state.buttonColor) setButtonColor(state.buttonColor);
          if (state.backgroundType) setBackgroundType(state.backgroundType);
          if (state.backgroundImage) setBackgroundImage(state.backgroundImage);
          if (state.backgroundSolidColor) setBackgroundSolidColor(state.backgroundSolidColor);
          if (state.backgroundGradient) setBackgroundGradient(state.backgroundGradient);
          if (state.bio) setBio(state.bio);
          if (state.socialLinks) setSocialLinks(state.socialLinks);
          if (state.portfolioTitle) setPortfolioTitle(state.portfolioTitle);
          
          setHasChanges(true);
        } else {
          console.log('🗑️ LocalStorage data is too old, skipping load');
          localStorage.removeItem(DESIGN_SETTINGS_KEY);
        }
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      localStorage.removeItem(DESIGN_SETTINGS_KEY);
    }
  };

  // Hàm load portfolio data từ API
  const loadPortfolioData = async (portfolio: any) => {
    console.log('📋 Portfolio loaded for design:', portfolio);
    
    if (portfolio?.slug || portfolio?._id) {
      const slug = portfolio.slug || portfolio._id;
      setPortfolioSlug(slug);
      localStorage.setItem('currentPortfolioSlug', slug);
    }

    // Load bio từ portfolio
    if (portfolio?.blocks && Array.isArray(portfolio.blocks)) {
      const textBlock = portfolio.blocks.find((b: any) => b.type === 'text');
      if (textBlock && textBlock.content) {
        setBio(textBlock.content);
      }
    }

    // Load title từ portfolio
    if (portfolio?.title) {
      setPortfolioTitle(portfolio.title);
    }

    // Load design settings từ portfolio
    if (portfolio?.design_settings) {
      const design = portfolio.design_settings;
      console.log('🎨 Loading design settings from portfolio:', design);
      
      if (design.theme) setSelectedTheme(design.theme);
      if (design.profileLayout !== undefined) setSelectedProfile(design.profileLayout);
      if (design.buttonFill !== undefined) setButtonFill(design.buttonFill);
      if (design.buttonCorner !== undefined) setButtonCorner(design.buttonCorner);
      if (design.fontFamily) setFontFamily(design.fontFamily);
      if (design.textColor) setTextColor(design.textColor);
      if (design.buttonTextColor) setButtonTextColor(design.buttonTextColor);
      if (design.buttonColor) setButtonColor(design.buttonColor);
      if (design.backgroundType) setBackgroundType(design.backgroundType);
      if (design.backgroundImage) setBackgroundImage(design.backgroundImage);
      if (design.backgroundSolidColor) setBackgroundSolidColor(design.backgroundSolidColor);
      if (design.backgroundGradient) setBackgroundGradient(design.backgroundGradient);
    }

    // Load social links từ portfolio
    if (portfolio && portfolio.social_links) {
  const links = Object.entries(portfolio.social_links).map(([key, value]: any) => {
    if (typeof value === 'object' && value !== null && value.id) {
      return {
        ...value,
        name: key.charAt(0).toUpperCase() + key.slice(1),
      };
    }
    return {
      id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      url: String(value?.url || value || ""),
      clicks: value?.clicks || 0,
      isEnabled: Boolean(value?.url || value), // QUAN TRỌNG: chỉ hiển thị link được enabled
      color: value?.color || "#6e6e6e",
      icon: value?.icon || "🔗",
      displayName: value?.displayName,
    };
  });
  setSocialLinks(links); // CẬP NHẬT STATE
}
  };

  // Hàm lưu design settings lên server
  const saveDesignSettings = async (settings: Partial<DesignSettings> = {}) => {
  if (!portfolioSlug) {
    console.warn('⚠️ No portfolio slug, cannot save design settings');
    return;
  }

  setSaving(true);
  try {
    const designSettings: DesignSettings = {
      theme: selectedTheme,
      profileLayout: selectedProfile,
      buttonFill,
      buttonCorner,
      fontFamily,
      textColor,
      buttonTextColor,
      buttonColor,
      backgroundType,
      backgroundImage,
      backgroundSolidColor,
      backgroundGradient,
      backgroundPattern: backgroundType === 'pattern' ? 'dots' : undefined,
      ...settings
    };

    console.log('💾 Saving design settings to server:', designSettings);

    await updatePortfolio(portfolioSlug, { 
      design_settings: designSettings 
    });

    console.log('✅ Design settings saved successfully to server');
    setHasChanges(false);
    
    // Cập nhật lastSaved trong localStorage
    saveStateToLocalStorage();
    
    // ĐÃ XÓA: showToast.success('Đã lưu thiết kế');
  } catch (error: any) {
    console.error('❌ Error saving design settings:', error);
    showToast.error('Lỗi lưu thiết kế: ' + (error.message || 'Không xác định'));
  } finally {
    setSaving(false);
  }
};

  // Hàm save đồng bộ khi rời trang
  const saveDesignSettingsSync = async () => {
    if (!portfolioSlug || !hasChanges) return;
    
    try {
      const designSettings: DesignSettings = {
        theme: selectedTheme,
        profileLayout: selectedProfile,
        buttonFill,
        buttonCorner,
        fontFamily,
        textColor,
        buttonTextColor,
        buttonColor,
        backgroundType,
        backgroundImage,
        backgroundSolidColor,
        backgroundGradient,
        backgroundPattern: backgroundType === 'pattern' ? 'dots' : undefined,
      };

      const token = localStorage.getItem('token');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(`https://2share.icu/portfolios/update-portfolio/${portfolioSlug}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ design_settings: designSettings }),
        signal: controller.signal,
        keepalive: true
      });
      
      clearTimeout(timeoutId);
      console.log('✅ Design settings saved before unload');
    } catch (error) {
      console.error('❌ Error saving before unload:', error);
    }
  };

  // Load portfolio slug từ MyLinks khi component mount
  useEffect(() => {
    const savedPortfolioSlug = localStorage.getItem('currentPortfolioSlug');
    if (savedPortfolioSlug) {
      setPortfolioSlug(savedPortfolioSlug);
      console.log('📥 Loaded portfolio slug from MyLinks:', savedPortfolioSlug);
    }
  }, []);

  // Fetch profile và portfolio data
  useEffect(() => {
    const fetchProfileAndPortfolio = async () => {
      try {
        const profile = await getMyProfile();
        setUser(profile);

        const savedPortfolioSlug = localStorage.getItem('currentPortfolioSlug');
        
        if (savedPortfolioSlug) {
          setPortfolioSlug(savedPortfolioSlug);
          try {
            const portfolio = await getPortfolioBySlug(savedPortfolioSlug);
            await loadPortfolioData(portfolio);
          } catch (err) {
            console.log('❌ Error loading specific portfolio, trying getMyPortfolio');
            const fallbackPortfolio = await getMyPortfolio();
            await loadPortfolioData(fallbackPortfolio);
          }
        } else {
          const portfolio = await getMyPortfolio();
          await loadPortfolioData(portfolio);
        }
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin");
        showToast.error('Lỗi tải thông tin portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPortfolio();
  }, [lastUpdate]);

  // Load từ localStorage khi component mount (sau khi load từ server)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStateFromLocalStorage();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Real-time updates từ MyLinks
  useEffect(() => {
  const handlePortfolioUpdate = () => {
    console.log('🔄 Portfolio updated from MyLinks, refreshing...');
    setLastUpdate(Date.now());
    // ĐÃ XÓA: showToast.success('Đã cập nhật thay đổi từ MyLinks');
  };

  window.addEventListener('portfolio-updated', handlePortfolioUpdate);
  return () => {
    window.removeEventListener('portfolio-updated', handlePortfolioUpdate);
  };
}, []);

  // Auto-save nhanh hơn và lưu localStorage
  useEffect(() => {
    if (portfolioSlug) {
      setHasChanges(true);
      saveStateToLocalStorage();
      
      const timer = setTimeout(() => {
        saveDesignSettings();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    selectedTheme, selectedProfile, buttonFill, buttonCorner,
    fontFamily, textColor, buttonTextColor, buttonColor,
    backgroundType, backgroundImage, backgroundSolidColor, backgroundGradient,
    portfolioSlug
  ]);

  // Đảm bảo save khi rời trang
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (portfolioSlug && hasChanges) {
        e.preventDefault();
        saveDesignSettingsSync();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [portfolioSlug, hasChanges]);

  // Save khi component unmount (khi chuyển trang)
  useEffect(() => {
    return () => {
      if (portfolioSlug && hasChanges) {
        console.log('🚪 Component unmounting, saving changes...');
        saveDesignSettingsSync();
      }
    };
  }, [portfolioSlug, hasChanges]);

  // Auto-refresh mỗi 30 giây để catch changes

  // Handlers cho các design changes
  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setBackgroundType('theme');
  };

  const handleProfileLayoutChange = (layout: number) => {
    setSelectedProfile(layout);
  };

  const handleButtonFillChange = (fill: number) => {
    setButtonFill(fill);
  };

  const handleButtonCornerChange = (corner: number) => {
    setButtonCorner(corner);
  };

  const handleBackgroundImageUpload = async (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setBackgroundType('image');
    await saveDesignSettings({ 
      backgroundImage: imageUrl, 
      backgroundType: 'image' 
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải thông tin...</div>;
  }
  if (error || !user) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error || "Không có thông tin người dùng"}</div>;
  }

      return (
    <div className="min-h-screen bg-gray-50 font-spartan">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-30 bg-white rounded-lg p-2 shadow-md border border-gray-200 hover:bg-gray-50"
        onClick={() => setShowMobileSidebar(true)}
        aria-label="Mở menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {showMobileSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - Desktop fixed, Mobile slide-in */}
      <div className={`
        fixed top-0 left-0 h-full min-h-screen bg-white border-r border-[#d9d9d9] flex-shrink-0 transition-transform duration-300
        ${showMobileSidebar ? 'translate-x-0 z-40' : '-translate-x-full lg:translate-x-0'}
        lg:z-20 lg:w-[200px] xl:w-[265px]
        w-[280px]
      `}>
        <Sidebar user={user} />
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          onClick={() => setShowMobileSidebar(false)}
        >
          <span className="text-gray-600 text-xl leading-none">×</span>
        </button>
      </div>

      {/* Header - Fixed với z-index cao nhất */}
      <Header title="Thiết kế Portfolio" />

      {/* Main Layout Container - CÓ THÊM MARGIN TOP ĐỂ TRÁNH HEADER */}
      <div className="lg:ml-[200px] xl:ml-[265px] lg:mr-[395px] min-h-screen flex pt-16"> {/* THÊM pt-16 */}
        
        {/* Main Content - Chiếm toàn bộ không gian còn lại */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Loading indicator và unsaved changes indicator */}
            <div className="fixed top-20 right-4 z-50 space-y-2">
            </div>

            {/* Profile Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Hồ sơ</h2>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <div className="flex justify-center gap-6 mb-8">
                  {[0, 1, 2, 3].map((index) => {
                    const baseBg = selectedProfile === index ? "bg-gray-300" : "bg-gray-100";
                    return (
                      <div
                        key={index}
                        onClick={() => handleProfileLayoutChange(index)}
                        className={`
                          w-24 h-32 rounded-2xl cursor-pointer transition-all 
                          ${baseBg} 
                          hover:bg-gray-200
                          ${selectedProfile === index ? "border-2 border-blue-400" : "border border-gray-300"}
                          flex flex-col items-center justify-start p-3
                        `}
                      >
                        {index === 0 && (
                          <>
                            <div className="w-8 h-8 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">
                              <div className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`} />
                              <div className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
                            </div>
                            <div className="w-10 h-2 bg-white rounded mb-1"></div>
                            <div className="w-16 h-2 bg-white rounded mb-2"></div>
                            <div className="w-16 h-6 bg-white rounded"></div>
                          </>
                        )}
                        {index === 1 && (
                          <>
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
                            <div className="w-full h-6 bg-white rounded mb-2"></div>
                            <div className="w-14 h-4 bg-white rounded mb-1"></div>
                            <div className="w-14 h-4 bg-white rounded"></div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="w-12 h-2 bg-white rounded mb-1"></div>
                            <div className="w-16 h-2 bg-white rounded mb-2"></div>
                            <div className="w-12 h-10 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">                
                                <div className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`} />
                                <div className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
                            </div>
                            <div className="w-full h-6 bg-white rounded mb-2"></div>
                            <div className="w-14 h-4 bg-white rounded"></div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="w-full h-24 bg-gray-200 rounded-xl mb-2 relative flex flex-col items-center justify-center">
                              <div className="w-12 h-2 mt-2 bg-white rounded mb-1"></div>
                              <div className="w-16 h-2 bg-white rounded mb-2"></div>
                              <div className={`w-5 h-5 rounded-full opacity-70 ${avatarColors[selectedTheme]}`} />
                              <div className={`w-8 h-4 rounded-t-full mt-1 opacity-70 ${avatarColors[selectedTheme]}`} />
                            </div>
                            <div className="w-14 h-4 bg-white rounded mb-1"></div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Theme Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Chủ đề</h2>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <div className="grid grid-cols-3 gap-6 place-items-center">
                  {/* Coral Theme */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('coral')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-[#E7A5A5] to-[#E7A5A5] rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'coral' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                  </div>

                  {/* Green Theme */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('green')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-green-300 to-green-400 rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'green' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                  </div>

                  {/* Dark Theme */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('dark')}
                      className={`
                        w-24 h-32 bg-gray-600 rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'dark' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                  </div>

                  {/* Gradient Theme */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('gradient')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'gradient' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                  </div>

                  {/* Orange Gradient Theme */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('orange')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-blue-400 to-orange-400 rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'orange' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Custom Appearance Section */}   
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-[#a259ff]" />
                <h2 className="text-2xl font-bold">Giao diện tự thiết kế</h2>
              </div>

              {/* Background Section */}
              <div className="bg-white rounded-3xl border border-gray-400 p-8 mb-8">
                <h3 className="text-xl font-bold mb-6">Hình nền</h3>

                <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-4xl mx-auto">
                  <div className="grid grid-cols-4 gap-10">
                    {/* Solid Color */}
                    <div 
                      className="text-center cursor-pointer"
                      onClick={() => {
                        setBackgroundType('solid');
                        setBackgroundSolidColor('#6e6e6e');
                      }}
                    >
                      <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2"></div>
                      <span className="text-sm">Màu phẳng</span>
                    </div>

                    {/* Gradient */}
                    <div 
                      className="text-center cursor-pointer"
                      onClick={() => {
                        setBackgroundType('gradient');
                        setBackgroundGradient('from-gray-600 to-gray-400');
                      }}
                    >
                      <div className="w-24 h-32 bg-gradient-to-b from-gray-600 to-gray-400 rounded-2xl mb-2"></div>
                      <span className="text-sm">Màu trộn</span>
                    </div>

                    {/* Dots Pattern */}
                    <div 
                      className="text-center cursor-pointer"
                      onClick={() => setBackgroundType('pattern')}
                    >
                      <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
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
                      </div>
                      <span className="text-sm">Chấm bi</span>
                    </div>

                    {/* Stripes - Diagonal */}
                    <div className="text-center">
                      <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
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
                      </div>
                      <span className="text-sm">Kẻ sọc</span>
                    </div>
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

                    {/* Text Color */}
                    <div>
                      <label className="block text-sm mb-2">Màu chữ viết trên trang</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded cursor-pointer border border-gray-300"
                          style={{ backgroundColor: textColor }}
                        ></div>
                        <span className="font-bold">{textColor}</span>
                      </div>
                    </div>

                    {/* Button Text Color */}
                    <div>
                      <label className="block text-sm mb-2">Màu chữ viết trên nút</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded cursor-pointer border border-gray-300"
                          style={{ backgroundColor: buttonTextColor }}
                        ></div>
                        <span className="font-bold">{buttonTextColor}</span>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { icon: <FaFillDrip size={18} />, label: "Tô khối" },
                          { icon: <FaRegCircle size={18} />, label: "Tô viền" },
                        ].map((item, i) => (
                          <button
                            key={item.label}
                            onClick={() => handleButtonFillChange(i)}
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
                            onClick={() => handleButtonCornerChange(i)}
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

                    {/* Button Color */}
                    <div>
                      <label className="block text-sm mb-2">Màu nút</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded cursor-pointer border border-gray-300"
                          style={{ backgroundColor: buttonColor }}
                        ></div>
                        <span className="font-bold">{buttonColor}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Phone Preview Sidebar - Fixed bên phải, CÓ THÊM MARGIN TOP và Z-INDEX THẤP HƠN */}
      <div className="hidden xl:flex fixed top-16 right-0 h-full min-h-screen w-[395px] bg-white border-l border-[#d9d9d9] flex-shrink-0 flex-col z-12"> {/* THÊM top-16 và z-10 */}
        <div className="w-full h-full flex flex-col pt-16">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Live Preview</h3>
            <p className="text-xs text-gray-500">
              Changes update in real-time
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <PhonePreview
              themeClasses={themeClasses}
              textColors={textColors}
              selectedTheme={selectedTheme}
              selectedLayout={selectedProfile + 1}
              user={user}
              bio={bio}
              socialLinks={socialLinks}
              designSettings={{
                buttonFill,
                buttonCorner,
                buttonColor,
                buttonTextColor,
                textColor,
                fontFamily,
                backgroundType,
                backgroundImage,
                backgroundSolidColor,
                backgroundGradient
              }}
            />
          </div>
        </div>
      </div>

      {/* SVG Gradients */}
      <svg className="hidden">
        <defs>
          <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6D00D3" />
            <stop offset="100%" stopColor="#FF56FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default PortfolioDesignPage;