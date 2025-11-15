import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PhonePreview from "../components/PhonePreview";
import { FaFillDrip, FaRegCircle } from "react-icons/fa";
import {
  TbBorderCornerSquare,
  TbBorderCornerRounded,
  TbBorderCornerPill,
} from "react-icons/tb";
import { getMyProfile, getMyPortfolio, updatePortfolio, DesignSettings, getPortfolioBySlug } from "../lib/api";
import { showToast } from "../lib/toast";
import { AIChatBox } from "../components/AIChatBox/AIChatBox";
import { AIChatButton } from "../components/AIChatBox/AIChatButton";

const DESIGN_SETTINGS_KEY = 'portfolio_design_settings';

const PortfolioDesignPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  // const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [uploadingBackground, setUploadingBackground] = useState(false);
  
  // Design states
  const [selectedTheme, setSelectedTheme] = useState("classic-rose");
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [fontFamily, setFontFamily] = useState("spartan");
  const [buttonFill, setButtonFill] = useState(0);
  const [buttonCorner, setButtonCorner] = useState(1);
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  // Color mappings
  const avatarColors: Record<string, string> = {
    'classic-rose': "bg-[#E8B4B4]",
    'fresh-mint': "bg-[#A7E9AF]",
    'dark-slate': "bg-[#4A5568]",
    'purple-green': "bg-[#C084FC]",
    'sunset': "bg-[#FB923C]",
    'custom': "bg-[#6B7280]",
  };

  const textColors: Record<string, string> = {
    'classic-rose': 'text-[#E8B4B4]',
    'fresh-mint': 'text-[#A7E9AF]',
    'dark-slate': 'text-[#4A5568]',
    'purple-green': 'text-[#C084FC]',
    'sunset': 'text-[#FB923C]',
    'custom': 'text-[#6B7280]',
  };

  const themeClasses: Record<string, string> = {
    'classic-rose': "from-[#E8B4B4] to-[#E8B4B4]",
    'fresh-mint': "from-[#A7E9AF] to-[#A7E9AF]",
    'dark-slate': "from-[#4A5568] to-[#2D3748]",
    'purple-green': "from-[#C084FC] via-[#60A5FA] to-[#4ADE80]",
    'sunset': "from-[#60A5FA] to-[#FB923C]",
  };

  // Thêm các hàm xử lý chat
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isChatMinimized) {
      setIsChatMinimized(false);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  // Helper function để lấy class font family
  // const getFontFamilyClass = (font: string) => {
  //   switch (font) {
  //     case 'spartan': return 'font-spartan';
  //     case 'Carlito': return 'font-carlito';
  //     case 'Inter': return 'font-inter';
  //     case 'Montserrat': return 'font-montserrat';
  //     case 'Be Vietnam Pro': return 'font-be-vietnam';
  //     case 'Spline Sans': return 'font-spline-sans';
  //     default: return 'font-spartan';
  //   }
  // };

  // Helper function để lấy font family cho inline style
  // const getFontFamilyStyle = (font: string) => {
  //   switch (font) {
  //     case 'spartan': return 'spartan, sans-serif';
  //     case 'Carlito': return 'Carlito, sans-serif';
  //     case 'Inter': return 'Inter, sans-serif';
  //     case 'Montserrat': return 'Montserrat, sans-serif';
  //     case 'Be Vietnam Pro': return 'Be Vietnam Pro, sans-serif';
  //     case 'Spline Sans': return 'Spline Sans, sans-serif';
  //     default: return 'spartan, sans-serif';
  //   }
  // };

  // Hàm lưu state vào localStorage - TỐI ƯU
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
      lastSaved: Date.now(),
      portfolioSlug,
      version: '1.0'
    };
    
    try {
      localStorage.setItem(DESIGN_SETTINGS_KEY, JSON.stringify(state));
      console.log('💾 Đã backup vào localStorage');
    } catch (error) {
      console.error('❌ Lỗi backup localStorage:', error);
    }
  };

  // Hàm load state từ localStorage - SILENT
  const loadStateFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(DESIGN_SETTINGS_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        
        const currentSlug = portfolioSlug || localStorage.getItem('currentPortfolioSlug');
        const savedSlug = state.portfolioSlug;
        
        const isRecent = state.lastSaved && (Date.now() - state.lastSaved < 24 * 60 * 60 * 1000);
        const isSamePortfolio = !currentSlug || !savedSlug || currentSlug === savedSlug;
        
        if (isRecent && isSamePortfolio) {
          console.log('📥 Đang khôi phục thiết kế từ bản lưu...');
          
          // Khôi phục tất cả state
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
          
          setHasChanges(false);
          console.log('✅ Đã khôi phục thiết kế thành công');
        }
      }
    } catch (error) {
      console.error('❌ Lỗi khôi phục từ localStorage:', error);
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

  // Hàm lưu design settings lên server - SILENT MODE (merge keeping saving state & retry logic)
  const [saving, setSaving] = useState(false);
  const saveDesignSettings = async (settings: Partial<DesignSettings> = {}, retryCount = 0): Promise<void> => {
    if (!portfolioSlug) {
      console.warn('⚠️ No portfolio slug, cannot save design settings');
      return;
    }

    // Nếu đang saving, không save lại
    if (saving) {
      console.log('⏳ Đang lưu, bỏ qua request mới');
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

      console.log('💾 Auto-saving design settings...');

      await updatePortfolio(portfolioSlug, { 
        design_settings: designSettings 
      });

      console.log('✅ Auto-save thành công');
      setHasChanges(false);
      
      // Cập nhật lastSaved trong localStorage
      saveStateToLocalStorage();
      
      // Dispatch event để các component khác biết
      window.dispatchEvent(new CustomEvent('design-updated'));
      
    } catch (error: any) {
      console.error('❌ Lỗi auto-save:', error);
      
      // Retry logic - thử lại tối đa 1 lần (silent)
      if (retryCount < 1) {
        console.log(`🔄 Tự động thử lại...`);
        setTimeout(() => {
          saveDesignSettings(settings, retryCount + 1);
        }, 2000);
        return;
      }
      
      // KHÔNG hiển thị thông báo lỗi cho người dùng
      // Data đã được backup trong localStorage
      
    } finally {
      setSaving(false);
    }
  };

  // Hàm save đồng bộ khi rời trang - SILENT
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
      
      // Sử dụng fetch với keepalive để đảm bảo gửi được ngay cả khi trang đóng
      await fetch(`https://2share.icu/portfolios/update-portfolio/${portfolioSlug}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ design_settings: designSettings }),
        keepalive: true // QUAN TRỌNG: giữ connection alive
      });
      
      console.log('✅ Đã lưu thay đổi trước khi rời trang');
      setHasChanges(false);
    } catch (error) {
      console.error('❌ Lỗi lưu cuối cùng:', error);
      // KHÔNG hiển thị lỗi, đã có backup trong localStorage
    }
  };

  useEffect(() => {
    const savedChatState = localStorage.getItem('ai_chat_box_state');
    if (savedChatState) {
      try {
        const { isOpen, isMinimized } = JSON.parse(savedChatState);
        setIsChatOpen(isOpen);
        setIsChatMinimized(isMinimized);
      } catch (error) {
        console.error('Error loading chat state:', error);
      }
    }
  }, []);

  // Lưu trạng thái chat box vào localStorage khi thay đổi
  useEffect(() => {
    const chatState = { isOpen: isChatOpen, isMinimized: isChatMinimized };
    localStorage.setItem('ai_chat_box_state', JSON.stringify(chatState));
  }, [isChatOpen, isChatMinimized]);

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

// THAY THẾ TOÀN BỘ useEffect auto-save hiện tại
  useEffect(() => {
    if (!portfolioSlug) return;

    console.log('🔄 Phát hiện thay đổi thiết kế, tự động lưu...');
    
    // Lưu ngay vào localStorage để backup
    saveStateToLocalStorage();
    
    // Debounce auto-save để tránh save quá nhiều
    const saveTimeout = setTimeout(async () => {
      try {
        await saveDesignSettings();
        console.log('✅ Đã tự động lưu thiết kế');
      } catch (error) {
        console.error('❌ Lỗi auto-save:', error);
        // Không hiển thị thông báo lỗi cho người dùng
        // Sẽ thử lại ở lần save tiếp theo
      }
    }, 1000); // Giảm thời gian chờ xuống 1 giây

    return () => clearTimeout(saveTimeout);
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

  // Handlers cho các design changes
  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setBackgroundType('theme');
    setBackgroundImage('');
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

  // HÀM XỬ LÝ UPLOAD ẢNH NỀN - HOÀN CHỈNH NHƯ AVATAR
  const handleBackgroundImageUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploadingBackground(true);
      
      console.log('🚀 Starting background image upload...', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      // Kiểm tra định dạng
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
        return;
      }

      // SỬ DỤNG HÀM UPLOADIMAGE ĐÃ SỬA
      const { uploadImage } = await import("../lib/api");
      const imageUrl = await uploadImage(file);
      
      console.log('✅ Background image uploaded successfully:', imageUrl);
      
      // KIỂM TRA URL CÓ PHẢI BLOB KHÔNG
      if (imageUrl.startsWith('blob:')) {
        console.warn('⚠️ Received blob URL, this is temporary');
        showToast.warning('Ảnh tạm thời - không lưu vĩnh viễn');
      } else {
        console.log('🎯 Received permanent URL, saving...');
        showToast.success('Đã tải ảnh nền lên thành công!');
      }
      
      // CẬP NHẬT STATE VÀ LƯU LÊN SERVER
      setBackgroundImage(imageUrl);
      setBackgroundType('image');
      setSelectedTheme('custom');
      
      // LƯU NGAY LÊN SERVER
      await saveDesignSettings({ 
        backgroundImage: imageUrl, 
        backgroundType: 'image',
        theme: 'custom'
      });
      
    } catch (error: any) {
      console.error('❌ Background upload failed:', error);
      
      // FALLBACK: Hiển thị lỗi chi tiết
      const errorMessage = error.message || 'Lỗi không xác định';
      showToast.error('Lỗi tải ảnh nền: ' + errorMessage);
      
    } finally {
      setUploadingBackground(false);
    }
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
                  {/* Custom Image Theme - SỬA LẠI ĐỂ UPLOAD ẢNH HOÀN CHỈNH */}
                  <div className="text-center">
                    <input
                      type="file"
                      id="background-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handleBackgroundImageUpload(file);
                        }
                      }}
                    />
                    <label 
                      htmlFor="background-upload"
                      className={`
                        w-24 h-32 bg-gray-100 rounded-2xl mb-2 cursor-pointer border-2 border-dashed border-gray-300
                        flex items-center justify-center hover:bg-gray-50 transition-colors  relative
                        ${backgroundType === 'image' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        ${uploadingBackground ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {uploadingBackground ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-1"></div>
                          <span className="text-xs text-gray-600 block">Đang tải...</span>
                        </div>
                      ) : backgroundType === 'image' && backgroundImage ? (
                        <div 
                          className="w-full h-full rounded-2xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${backgroundImage})` }}
                        />
                      ) : (
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-600 block">Tải ảnh lên</span>
                        </div>
                      )}
                    </label>
                    <span className="text-sm font-medium">Hình nền của tôi</span>
                    
                    {/* Nút xóa hình nền đang chọn */}
                    {backgroundType === 'image' && backgroundImage && !uploadingBackground && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBackgroundType('theme');
                          setBackgroundImage('');
                          setSelectedTheme('classic-rose');
                          saveDesignSettings({
                            backgroundType: 'theme',
                            backgroundImage: '',
                            theme: 'classic-rose'
                          });
                          showToast.success('Đã xóa hình nền');
                        }}
                        className="mt-1 text-xs text-red-500 hover:text-red-700 block mx-auto"
                      >
                        Xóa
                      </button>
                    )}
                  </div>

                  {/* Hồng Phấn Cổ điển (Classic Rose) */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('classic-rose')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-[#E8B4B4] to-[#E8B4B4] rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'classic-rose' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                    <span className="text-sm font-medium">Hồng Phấn</span>
                    <p className="text-xs text-gray-500 mt-1">Cổ điển</p>
                  </div>

                  {/* Xanh Bạc hà (Fresh Mint) */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('fresh-mint')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-[#A7E9AF] to-[#A7E9AF] rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'fresh-mint' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                    <span className="text-sm font-medium">Xanh Bạc hà</span>
                    <p className="text-xs text-gray-500 mt-1">Tươi mới</p>
                  </div>

                  {/* Xanh Than Chuyên nghiệp (Dark Slate) */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('dark-slate')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-[#4A5568] to-[#2D3748] rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'dark-slate' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                    <span className="text-sm font-medium">Xanh Than</span>
                    <p className="text-xs text-gray-500 mt-1">Chuyên nghiệp</p>
                  </div>

                  {/* Gradient Tím-Lục (Purple-Green Gradient) */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('purple-green')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-[#C084FC] via-[#60A5FA] to-[#4ADE80] rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'purple-green' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                    <span className="text-sm font-medium">Tím - Lục</span>
                    <p className="text-xs text-gray-500 mt-1">Hiện đại</p>
                  </div>

                  {/* Gradient Hoàng hôn (Sunset Gradient) */}
                  <div className="text-center">
                    <div
                      onClick={() => handleThemeChange('sunset')}
                      className={`
                        w-24 h-32 bg-gradient-to-br from-[#60A5FA] to-[#FB923C] rounded-2xl mb-2 cursor-pointer
                        ${selectedTheme === 'sunset' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                    />
                    <span className="text-sm font-medium">Hoàng hôn</span>
                    <p className="text-xs text-gray-500 mt-1">Nghệ thuật</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Custom Appearance Section */}   
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">Kiểu</h2>
              </div>
            </section>

            {/* Style Section - GỘP TẤT CẢ VÀO MỘT */}
            <section>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">

                {/* Font Family Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3">Phông chữ</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Spartan", value: "spartan", class: "font-spartan" },
                      { name: "Carlito", value: "Carlito", class: "font-carlito" },
                      { name: "Inter", value: "Inter", class: "font-inter" },
                      { name: "Montserrat", value: "Montserrat", class: "font-montserrat" },
                      { name: "Be Vietnam", value: "Be Vietnam Pro", class: "font-be-vietnam" },
                      { name: "Spline Sans", value: "Spline Sans", class: "font-spline-sans" },
                    ].map((font) => (
                      <button
                        key={font.value}
                        onClick={() => setFontFamily(font.value)}
                        className={`p-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                          fontFamily === font.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        } ${font.class}`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Fill Style */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3">Kiểu nút</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { icon: <FaFillDrip size={18} />, label: "Tô khối", value: 0 },
                      { icon: <FaRegCircle size={18} />, label: "Tô viền", value: 1 },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleButtonFillChange(item.value)}
                        className={`flex flex-col items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all ${
                          buttonFill === item.value
                            ? "bg-gray-300 border-2 border-gray-400"
                            : "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Corner Style */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Góc nút</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <TbBorderCornerSquare size={20} />, label: "Góc cứng", value: 0 },
                      { icon: <TbBorderCornerRounded size={20} />, label: "Góc mềm", value: 1 },
                      { icon: <TbBorderCornerPill size={20} />, label: "Góc tròn", value: 2 },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleButtonCornerChange(item.value)}
                        className={`flex flex-col items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all ${
                          buttonCorner === item.value
                            ? "bg-gray-300 border-2 border-gray-400"
                            : "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
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
      <AIChatButton onClick={handleToggleChat} />
    
      <AIChatBox
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        onToggle={handleToggleChat}
        isMinimized={isChatMinimized}
        onToggleMinimize={handleToggleMinimize}
        currentDesign={{
          theme: selectedTheme,
          layout: selectedProfile,
          fontFamily: fontFamily,
          buttonFill: buttonFill,
          buttonCorner: buttonCorner
        }}
      />
    </div>
  );
};

export default PortfolioDesignPage;