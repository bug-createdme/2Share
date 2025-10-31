import { PlusIcon, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import SocialModalPage from "./SocialModalPage";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import type { SocialLink } from "./sections/SocialLinksSection/SocialLinksSection";
import { ProfilePictureSection } from "./sections/ProfilePictureSection/ProfilePictureSection";
import { SocialLinksSection } from "./sections/SocialLinksSection/SocialLinksSection";
import { getMyProfile, getMyPortfolio, getMyPortfolios, updateMyProfile, updatePortfolio, getCurrentPlan } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useRef } from 'react';
import ShareDialog from "../../components/ShareDialog";
import { showToast } from "../../lib/toast";
import PhonePreview from "../../components/PhonePreview";

export const MyLinksPage = (): JSX.Element => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'social' | 'media' | 'all'>('social');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [showTitleBioModal, setShowTitleBioModal] = useState(false);
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [tmpPortfolioTitle, setTmpPortfolioTitle] = useState("");
  const [tmpBio, setTmpBio] = useState("");
  const [savingTitleBio, setSavingTitleBio] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const creatingSlugRef = useRef<string | null>(null);
  const [portfolioExists, setPortfolioExists] = useState(false);
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [planActive, setPlanActive] = useState<boolean | null>(null);
  const [maxSocialLinks, setMaxSocialLinks] = useState<number | null>(null);
  const [maxBusinessCard, setMaxBusinessCard] = useState<number | null>(null);
  const [portfoliosList, setPortfoliosList] = useState<any[]>([]);
  const [showPortfoliosModal, setShowPortfoliosModal] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState("My Portfolio");
    // State cho mobile sidebar - PHẢI khai báo cùng các state khác
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // State cho mobile preview sidebar phải
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  // State cho design settings - SỬA LAYOUT BAN ĐẦU
  const [designSettings, setDesignSettings] = useState({
    buttonFill: 0,
    buttonCorner: 1,
    buttonColor: "#ffffff",
    buttonTextColor: "#ffffff",
    textColor: "#ffffff",
    fontFamily: "spartan",
    backgroundType: "theme",
    backgroundImage: "",
    backgroundSolidColor: "#ffffff",
    backgroundGradient: "from-gray-600 to-gray-400",
    selectedTheme: "coral",
    selectedLayout: 1 // Layout 1 tương ứng với profileLayout 0
  });

  // Theme classes cho PhonePreview - KHỚP VỚI PORTFOLIODESIGN
  const themeClasses: Record<string, string> = {
    "coral": "from-[#E7A5A5] to-[#E7A5A5]",
    "green": "from-green-300 to-green-400", 
    "dark": "from-gray-700 to-gray-800",
    "gradient": "from-purple-400 via-blue-400 to-green-400",
    "orange": "from-blue-400 to-orange-400",
  };

  const textColors: Record<string, string> = {
    "coral": "#ffffff",
    "green": "#ffffff",
    "dark": "#ffffff",
    "gradient": "#ffffff", 
    "orange": "#ffffff",
  };

  // Function to load portfolio data và design settings
  const loadPortfolioData = async (portfolioSlug: string) => {
    try {
      console.log('📥 Loading portfolio:', portfolioSlug);

      let portfolio = portfoliosList.find((p: any) => p.slug === portfolioSlug);
      if (!portfolio) {
        portfolio = portfoliosList.find((p: any) => p._id === portfolioSlug);
      }

      if (!portfolio) {
        console.error('❌ Portfolio not found:', portfolioSlug);
        showToast.error('Portfolio không tìm thấy');
        return;
      }

      console.log('✅ Portfolio found:', portfolio);

      const finalSlug = portfolio.slug || portfolio._id;
      if (finalSlug) {
        setPortfolioSlug(finalSlug);
        localStorage.setItem('currentPortfolioSlug', finalSlug);
      }

      if (portfolio?.title) {
        setPortfolioTitle(portfolio.title);
      }

      if (portfolio?.blocks && Array.isArray(portfolio.blocks)) {
        const textBlock = portfolio.blocks.find((b: any) => b.type === 'text');
        if (textBlock && textBlock.content) {
          setBio(textBlock.content);
        }
      }

      // QUAN TRỌNG: Load design settings từ portfolio - SỬA LAYOUT
      if (portfolio.design_settings) {
        const design = portfolio.design_settings;
        console.log('🎨 Loading design settings for MyLinks:', design);
        
        let themeKey = design.selectedTheme || design.theme || "coral";
        
        // QUAN TRỌNG: Sửa layout mapping
        const profileLayout = design.profileLayout || 0;
        const selectedLayout = design.selectedLayout || profileLayout + 1;
        
        setDesignSettings({
          buttonFill: design.buttonFill ?? 0,
          buttonCorner: design.buttonCorner ?? 1,
          buttonColor: design.buttonColor || "#ffffff",
          buttonTextColor: design.buttonTextColor || "#ffffff",
          textColor: design.textColor || "#ffffff",
          fontFamily: design.fontFamily || "spartan",
          backgroundType: design.backgroundType || "theme",
          backgroundImage: design.backgroundImage || "",
          backgroundSolidColor: design.backgroundSolidColor || "#ffffff",
          backgroundGradient: design.backgroundGradient || "from-gray-600 to-gray-400",
          selectedTheme: themeKey,
          selectedLayout: selectedLayout // QUAN TRỌNG: +1 để khớp
        });
        
        console.log('✅ Design settings loaded:', {
          theme: themeKey,
          layout: selectedLayout,
          profileLayout: profileLayout
        });
      }

      if (portfolio && portfolio.social_links) {
        const links: SocialLink[] = Object.entries(portfolio.social_links).map(([key, value]: any) => {
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
            isEnabled: Boolean(value?.url || value),
            color: value?.color || "#6e6e6e",
            icon: value?.icon || "🔗",
            displayName: value?.displayName,
          };
        });
        setSocialLinks(links);
      } else {
        setSocialLinks([]);
      }

      setPortfolioExists(true);
      
    } catch (err: any) {
      console.error('❌ Error loading portfolio:', err);
      showToast.error('Lỗi tải portfolio');
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
        if (typeof profile.bio === 'string') setBio(profile.bio);

        try {
          const portfolio = await getMyPortfolio();
          setPortfolioExists(true);

          const slug = portfolio?.slug || portfolio?._id;
          if (slug) {
            setPortfolioSlug(slug);
            localStorage.setItem('currentPortfolioSlug', slug);
          }
          
          if (portfolio?.title) {
            setPortfolioTitle(portfolio.title);
          }
          
          if (portfolio?.blocks && Array.isArray(portfolio.blocks)) {
            const textBlock = portfolio.blocks.find((b: any) => b.type === 'text');
            if (textBlock && textBlock.content) {
              setBio(textBlock.content);
            }
          }

          // Load design settings từ portfolio - SỬA LAYOUT
          if (portfolio.design_settings) {
            const design = portfolio.design_settings;
            let themeKey = design.selectedTheme || design.theme || "coral";
            const profileLayout = design.profileLayout || 0;
            const selectedLayout = design.selectedLayout || profileLayout + 1;

            setDesignSettings(prev => ({
              ...prev,
              buttonFill: design.buttonFill ?? 0,
              buttonCorner: design.buttonCorner ?? 1,
              buttonColor: design.buttonColor || "#ffffff",
              buttonTextColor: design.buttonTextColor || "#ffffff",
              textColor: design.textColor || "#ffffff",
              fontFamily: design.fontFamily || "spartan",
              backgroundType: design.backgroundType || "theme",
              backgroundImage: design.backgroundImage || "",
              backgroundSolidColor: design.backgroundSolidColor || "#ffffff",
              backgroundGradient: design.backgroundGradient || "from-gray-600 to-gray-400",
              selectedTheme: themeKey,
              selectedLayout: selectedLayout
            }));
          }
          
          if (portfolio && portfolio.social_links) {
            const links: SocialLink[] = Object.entries(portfolio.social_links).map(([key, value]: any) => {
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
                isEnabled: Boolean(value?.url || value),
                color: value?.color || "#6e6e6e",
                icon: value?.icon || "🔗",
                displayName: value?.displayName,
              };
            });
            if (links.length) setSocialLinks(links);
          }
        } catch (portfolioErr: any) {
          console.log('⚠️ Portfolio not found:', portfolioErr.message);
          setPortfolioExists(false);

          if (profile.social_links) {
            const links: SocialLink[] = Object.entries(profile.social_links).map(([key, value]: any) => {
              if (typeof value === 'object' && value !== null && value.id) {
                return {
                  ...value,
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                };
              }
              return {
                id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                url: String(value || ""),
                clicks: 0,
                isEnabled: Boolean(value),
                color: "#6e6e6e",
                icon: "🔗",
              };
            });
            if (links.length) setSocialLinks(links);
          }
        }
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const portfolios = await getMyPortfolios();
        setPortfoliosList(portfolios);
      } catch (e: any) {
        console.error('❌ Error fetching portfolios:', e);
        setPortfoliosList([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (portfoliosList.length > 0) {
      const savedPortfolioSlug = localStorage.getItem('currentPortfolioSlug');
      if (savedPortfolioSlug) {
        loadPortfolioData(savedPortfolioSlug);
      }
    }
  }, [portfoliosList]);

  useEffect(() => {
    (async () => {
      try {
        const planResponse = await getCurrentPlan();
        const plan = Array.isArray(planResponse) ? planResponse[0] : planResponse;
        const status = plan?.status || plan?.result?.status;
        const planInfo = (plan?.planInfo?.[0]) || (plan?.result?.planInfo?.[0]) || plan;

        const isActive = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'trial';
        setPlanActive(isActive);

        if (typeof planInfo?.maxSocialLinks === 'number') {
          setMaxSocialLinks(planInfo.maxSocialLinks);
        }
        
        if (typeof planInfo?.maxBusinessCard === 'number') {
          setMaxBusinessCard(planInfo.maxBusinessCard);
        }

        if (!isActive) {
          showToast.warning('Bạn chưa có gói nào đang hoạt động. Vui lòng đăng ký gói để cập nhật portfolio.');
        }
      } catch (e: any) {
        console.error('❌ Error fetching current plan:', e);
        setPlanActive(false);
        showToast.error('Không thể kiểm tra gói của bạn. Vui lòng thử lại sau.');
      }
    })();
  }, []);

  // Listen for design updates từ PortfolioDesignPage - SỬA LAYOUT
  useEffect(() => {
    const handleDesignUpdate = async () => {
      console.log('🔄 MyLinksPage: Design update received from PortfolioDesign');
      if (portfolioSlug) {
        try {
          const portfolio = await getMyPortfolio();
          if (portfolio?.design_settings) {
            const design = portfolio.design_settings;
            let themeKey = design.selectedTheme || design.theme || "coral";
            const profileLayout = design.profileLayout || 0;
            const selectedLayout = design.selectedLayout || profileLayout + 1;

            setDesignSettings(prev => ({
              ...prev,
              buttonFill: design.buttonFill ?? 0,
              buttonCorner: design.buttonCorner ?? 1,
              buttonColor: design.buttonColor || "#ffffff",
              buttonTextColor: design.buttonTextColor || "#ffffff",
              textColor: design.textColor || "#ffffff",
              fontFamily: design.fontFamily || "spartan",
              backgroundType: design.backgroundType || "theme",
              backgroundImage: design.backgroundImage || "",
              backgroundSolidColor: design.backgroundSolidColor || "#ffffff",
              backgroundGradient: design.backgroundGradient || "from-gray-600 to-gray-400",
              selectedTheme: themeKey,
              selectedLayout: selectedLayout
            }));
          }
        } catch (error) {
          console.warn('⚠️ Could not reload design settings:', error);
        }
      }
    };

    window.addEventListener('design-updated', handleDesignUpdate);
    return () => window.removeEventListener('design-updated', handleDesignUpdate);
  }, [portfolioSlug]);

  // Listen for portfolio updates tổng thể - SỬA LAYOUT
  useEffect(() => {
    const handlePortfolioUpdate = async () => {
      console.log('🔄 MyLinksPage: Portfolio update received');
      if (portfolioSlug) {
        try {
          const portfolio = await getMyPortfolio();
          if (portfolio) {
            if (portfolio.title) {
              setPortfolioTitle(portfolio.title);
            }
            if (portfolio.blocks && Array.isArray(portfolio.blocks)) {
              const textBlock = portfolio.blocks.find((b: any) => b.type === 'text');
              if (textBlock && textBlock.content) {
                setBio(textBlock.content);
              }
            }
            if (portfolio.design_settings) {
              const design = portfolio.design_settings;
              let themeKey = design.selectedTheme || design.theme || "coral";
              const profileLayout = design.profileLayout || 0;
              const selectedLayout = design.selectedLayout || profileLayout + 1;

              setDesignSettings(prev => ({
                ...prev,
                buttonFill: design.buttonFill ?? 0,
                buttonCorner: design.buttonCorner ?? 1,
                buttonColor: design.buttonColor || "#ffffff",
                buttonTextColor: design.buttonTextColor || "#ffffff",
                textColor: design.textColor || "#ffffff",
                fontFamily: design.fontFamily || "spartan",
                backgroundType: design.backgroundType || "theme",
                backgroundImage: design.backgroundImage || "",
                backgroundSolidColor: design.backgroundSolidColor || "#ffffff",
                backgroundGradient: design.backgroundGradient || "from-gray-600 to-gray-400",
                selectedTheme: themeKey,
                selectedLayout: selectedLayout
              }));
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not reload portfolio data:', error);
        }
      }
    };

    window.addEventListener('portfolio-updated', handlePortfolioUpdate);
    return () => window.removeEventListener('portfolio-updated', handlePortfolioUpdate);
  }, [portfolioSlug]);

  // Auto-save social links to backend when they change
  useEffect(() => {
    if (!user?._id || socialLinks.length === 0) return;

    const hasValidLinks = socialLinks.some(link => link.url && link.url.trim() !== '');
    if (!hasValidLinks) return;

    const timer = setTimeout(async () => {
      try {
        if (planActive === false) {
          showToast.warning('Không thể lưu: bạn chưa có gói nào đang hoạt động');
          return;
        }
        
        const socialLinksObj: Record<string, any> = {};
        socialLinks.forEach(link => {
          if (link.url && link.url.trim() !== '') {
            const key = link.name.toLowerCase();
            socialLinksObj[key] = {
              url: link.url,
              clicks: link.clicks,
              isEnabled: link.isEnabled,
              color: link.color,
              icon: link.icon,
              displayName: link.displayName,
              id: link.id,
            };
          }
        });

        if (Object.keys(socialLinksObj).length === 0) return;

        if (typeof maxSocialLinks === 'number') {
          const enabledCount = Object.values(socialLinksObj).filter((v: any) => v?.isEnabled && v?.url).length;
          if (enabledCount > maxSocialLinks) {
            showToast.warning(`Bạn chỉ được phép tối đa ${maxSocialLinks} link trong gói hiện tại`);
            return;
          }
        }

        if (!portfolioSlug) {
          if (creatingSlugRef.current) {
            setPortfolioSlug(creatingSlugRef.current);
            setPortfolioExists(true);
          }

          if (maxBusinessCard !== null && portfoliosList.length >= maxBusinessCard) {
            if (portfoliosList.length > 0) {
              const firstPortfolio = portfoliosList[0];
              const firstSlug = firstPortfolio.slug || firstPortfolio._id;
              setPortfolioSlug(firstSlug);
              setPortfolioExists(true);
              localStorage.setItem('currentPortfolioSlug', firstSlug);
              loadPortfolioData(firstSlug);
              showToast.warning(`Bạn đã có ${portfoliosList.length} danh thiếp (vượt giới hạn ${maxBusinessCard}). Đang cập nhật danh thiếp đầu tiên.`);
              setTimeout(async () => {
                try {
                  await updatePortfolio(firstSlug, { 
                    social_links: socialLinksObj,
                    avatar_url: user.avatar_url
                  });
                  window.dispatchEvent(new CustomEvent('portfolio-updated'));
                } catch (err) {
                  console.error('❌ Error saving to first portfolio:', err);
                }
              }, 500);
              return;
            } else {
              showToast.error(`Không thể tạo danh thiếp mới. Giới hạn: ${maxBusinessCard} danh thiếp.`);
              return;
            }
          }
          
          try {
            const { createPortfolio } = await import('../../lib/api');
            const newPortfolio = await createPortfolio({
              title: user.username || 'My Portfolio',
              blocks: [{ type: 'text', content: bio || 'Welcome to my portfolio', order: 1 }],
              social_links: socialLinksObj,
              avatar_url: user.avatar_url,
            });

            const createdId = newPortfolio?.result?.insertedId || newPortfolio?.insertedId || newPortfolio?.result?._id || newPortfolio?._id;
            const newSlug = newPortfolio?.result?.slug || newPortfolio?.slug || createdId;

            if (newSlug) {
              creatingSlugRef.current = newSlug;
              setPortfolioSlug(newSlug);
              setPortfolioExists(true);
              localStorage.setItem('currentPortfolioSlug', newSlug);
              showToast.success('Đã tạo portfolio mới');
              window.dispatchEvent(new CustomEvent('portfolio-updated'));

              try {
                const portfolios = await import('../../lib/api').then(m => m.getMyPortfolios());
                setPortfoliosList(portfolios);
              } catch (reloadErr) {
                console.warn('⚠️ Could not reload portfolios after creation:', reloadErr);
              }
            }
            return;
          } catch (createError: any) {
            console.error('❌ Error creating portfolio:', createError);
            showToast.error('Lỗi tạo portfolio: ' + (createError?.message || 'Không xác định'));
            return;
          }
        }

        await updatePortfolio(portfolioSlug, { 
          social_links: socialLinksObj,
          avatar_url: user.avatar_url
        });
        window.dispatchEvent(new CustomEvent('portfolio-updated'));
        
      } catch (error: any) {
        console.error('Error saving social links:', error);
        showToast.error('Lỗi lưu social links: ' + (error?.message || 'Không xác định'));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [socialLinks, user?._id, portfolioExists, portfolioSlug, planActive, maxSocialLinks, user?.username, user?.avatar_url, bio]);

  // Handle click tracking for social links
  useEffect(() => {
    function handleIncreaseClick(e: any) {
      const { id } = e.detail;
      setSocialLinks(prevLinks =>
        prevLinks.map(link =>
          link.id === id
            ? { ...link, clicks: link.clicks + 1 }
            : link
        )
      );
    }

    window.addEventListener('increase-click', handleIncreaseClick);
    return () => window.removeEventListener('increase-click', handleIncreaseClick);
  }, []);

  // Handle open portfolios modal from sidebar
  useEffect(() => {
    function handleOpenPortfoliosModal() {
      setShowPortfoliosModal(true);
    }

    window.addEventListener('open-portfolios-modal', handleOpenPortfoliosModal);
    return () => window.removeEventListener('open-portfolios-modal', handleOpenPortfoliosModal);
  }, []);

  async function handleSaveTitleBio() {
  if (!user) return;
  setSavingTitleBio(true);
  try {
    const result = await updateMyProfile({ bio: tmpBio });
    setBio(tmpBio);
    setPortfolioTitle(tmpPortfolioTitle);

    const blocks = [{ type: "text", content: tmpBio || "Welcome to my portfolio", order: 1 }];

    if (!portfolioSlug) {
      if (maxBusinessCard !== null && portfoliosList.length >= maxBusinessCard) {
        showToast.warning(`Gói của bạn chỉ cho phép tạo tối đa ${maxBusinessCard} danh thiếp. Vui lòng nâng cấp gói để tạo thêm.`);
        setSavingTitleBio(false);
        return;
      }
      
      try {
        const { createPortfolio } = await import('../../lib/api');
        const socialLinksObj: Record<string, any> = {};
        socialLinks.forEach(link => {
          const key = link.name.toLowerCase();
          socialLinksObj[key] = {
            url: link.url,
            clicks: link.clicks,
            isEnabled: link.isEnabled,
            color: link.color,
            icon: link.icon,
            displayName: link.displayName,
            id: link.id,
          };
        });
        
        const newPortfolio = await createPortfolio({
          title: tmpPortfolioTitle || 'My Portfolio',
          blocks,
          social_links: socialLinksObj,
          avatar_url: user.avatar_url,
        });
        
        const createdId = newPortfolio?.result?.insertedId || newPortfolio?.insertedId || newPortfolio?.result?._id || newPortfolio?._id;
        const newSlug = newPortfolio?.result?.slug || newPortfolio?.slug || createdId;

        if (newSlug) {
          creatingSlugRef.current = newSlug;
          setPortfolioSlug(newSlug);
          setPortfolioExists(true);
          localStorage.setItem('currentPortfolioSlug', newSlug);
          window.dispatchEvent(new CustomEvent('portfolio-updated'));

          (async () => {
            try {
              const portfolios = await import('../../lib/api').then(m => m.getMyPortfolios());
              setPortfoliosList(portfolios);
            } catch (reloadErr) {
              console.warn('⚠️ Could not reload portfolios after creation:', reloadErr);
            }
          })();
        }
      } catch (createError: any) {
        console.error('❌ Error creating portfolio:', createError);
        showToast.error('Lỗi tạo portfolio: ' + (createError?.message || 'Không xác định'));
      }
    } else {
      await updatePortfolio(portfolioSlug, { 
        title: tmpPortfolioTitle || 'My Portfolio',
        blocks,
          avatar_url: user.avatar_url
      });
      window.dispatchEvent(new CustomEvent('portfolio-updated'));
    }

    setShowTitleBioModal(false);
  } catch (error: any) {
    console.error('❌ Error saving title/bio:', error);
    showToast.error('Lỗi lưu thông tin: ' + error.message);
  } finally {
    setSavingTitleBio(false);
  }
}

  const handleOpenShareDialog = () => {
    setShowShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải thông tin...</div>;
  }
  if (error || !user) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error || "Không có thông tin người dùng"}</div>;
  }

  return (
    <div className="font-spartan">
      {/* Mobile Menu Button - Chỉ hiện trên mobile, đặt dưới header */}
      <button
        className="lg:hidden fixed top-3 left-3 z-20 bg-white rounded-lg p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={() => setShowMobileSidebar(true)}
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar trái - Responsive */}
      <div className={`
        fixed top-0 left-0 h-full min-h-screen bg-white border-r border-[#d9d9d9] flex-shrink-0 transition-transform duration-300
        ${showMobileSidebar ? 'translate-x-0 z-50' : '-translate-x-full lg:translate-x-0'}
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

  {/* Header - Fixed responsive (reserve space for right preview on xl) */}
  <Header onShare={handleOpenShareDialog} shareBtnRef={shareBtnRef} rightOffsetOnXL />

      {/* Main content - Responsive margins */}
      <div className="lg:ml-[200px] xl:ml-[265px] lg:mr-0 xl:mr-[395px] bg-[#f7f7f7] min-h-screen flex flex-col items-center">
        <main className="flex-1 w-full flex flex-col items-center pt-14 sm:pt-16 lg:pt-20">
      {/* Share Dialog */}
      {showShareDialog && (
        <ShareDialog
          open={showShareDialog}
          onClose={handleCloseShareDialog}
          portfolioLink={portfolioSlug ? `${window.location.origin}/portfolio/${portfolioSlug}` : ''}
          anchorRef={shareBtnRef}
          username={user?.username}
          avatarUrl={user?.avatar_url}
        />
      )}
          {/* Content Section */}
          <div className="w-full flex flex-col items-center flex-1">
            {planActive === false && (
              <div className="w-full max-w-[700px] px-4 sm:px-6 lg:px-9 pt-6">
                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-3 sm:p-4 shadow-md">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">!</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-800 mb-1 text-sm sm:text-base">Chưa có gói đang hoạt động</h3>
                      <p className="text-xs sm:text-sm text-orange-700">Bạn cần đăng ký gói để có thể cập nhật và lưu portfolio. Các thay đổi sẽ không được lưu.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {planActive === true && typeof maxSocialLinks === 'number' && (
              <div className="w-full max-w-[700px] px-4 sm:px-6 lg:px-9 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-blue-800">
                  📊 Gói của bạn: tối đa <strong>{maxSocialLinks}</strong> social links
                </div>
              </div>
            )}
            
            {planActive === true && maxBusinessCard !== null && portfoliosList.length > maxBusinessCard && (
              <div className="w-full max-w-[700px] px-4 sm:px-6 lg:px-9 pt-6">
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 sm:p-4 shadow-md">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">!</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-red-800 mb-1 text-sm sm:text-base">Vượt quá giới hạn danh thiếp</h3>
                      <p className="text-xs sm:text-sm text-red-700 mb-2">
                        Bạn hiện có <strong>{portfoliosList.length} danh thiếp</strong> nhưng gói của bạn chỉ cho phép <strong>{maxBusinessCard} danh thiếp</strong>.
                      </p>
                      <p className="text-xs sm:text-sm text-red-700">
                        Vui lòng xóa bớt {portfoliosList.length - maxBusinessCard} danh thiếp hoặc nâng cấp gói để tiếp tục sử dụng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <section className="w-full max-w-[700px] flex flex-col items-center px-4 sm:px-6 lg:px-9 pt-8 sm:pt-12">
              <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 sm:w-[77px] sm:h-[77px]">
                      <AvatarImage
                        src={user.avatar_url || undefined}
                        alt="Profile picture"
                      />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <button
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-lg border-2 border-white"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            try {
                              const { uploadImage } = await import('../../lib/api');
                              const imageUrl = await uploadImage(file);
                              await updateMyProfile({ avatar_url: imageUrl });
                              setUser({ ...user, avatar_url: imageUrl });
                              window.dispatchEvent(new CustomEvent('portfolio-updated'));
                            } catch (error) {
                              console.error('Error updating avatar:', error);
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      className="[font-family:'Carlito',Helvetica] font-normal text-black text-xl sm:text-2xl tracking-[1.5px] sm:tracking-[2.40px] leading-[normal] hover:underline text-center"
                      onClick={() => {
                        setTmpPortfolioTitle(portfolioTitle || "");
                        setTmpBio(bio || "");
                        setShowTitleBioModal(true);
                      }}
                      aria-label="Chỉnh sửa title và bio"
                    >
                      {portfolioTitle || "My Portfolio"}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-[#6e6e6e] text-xs sm:text-sm hover:underline text-center px-4"
                    onClick={() => {
                      setTmpPortfolioTitle(portfolioTitle || "");
                      setTmpBio(bio || "");
                      setShowTitleBioModal(true);
                    }}
                  >
                    {bio ? bio : "bio"}
                  </button>
                  
                  {maxBusinessCard !== null && maxBusinessCard > 1 && (
                    <button
                      type="button"
                      className={`mt-2 sm:mt-3 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all ${
                        portfoliosList.length < maxBusinessCard
                          ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-md'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (portfoliosList.length >= maxBusinessCard) {
                          showToast.error(`Bạn đã đạt giới hạn ${maxBusinessCard} danh thiếp của gói hiện tại.`);
                          return;
                        }
                        setPortfolioSlug(null);
                        setPortfolioExists(false);
                        setSocialLinks([]);
                        setBio('');
                        setPortfolioTitle('My Portfolio');
                        localStorage.removeItem('currentPortfolioSlug');
                        showToast.success('Đã tạo danh thiếp mới. Hãy thêm thông tin của bạn!');
                      }}
                      disabled={portfoliosList.length >= maxBusinessCard}
                    >
                      ➕ Tạo danh thiếp mới ({portfoliosList.length}/{maxBusinessCard})
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-[400px] mb-8">

              {/* Add Social Button & Preview Button */}
              <div className="flex gap-3 w-full max-w-[400px] mb-6 sm:mb-8 px-4 sm:px-0">
                <Button
                  className="flex-1 h-auto bg-[#639fff] hover:bg-[#5a8fee] rounded-[25px] sm:rounded-[35px] py-3 sm:py-4 flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                  onClick={() => navigate("/my-links/add-social")}
                >
                  <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-lg sm:text-xl tracking-[1.5px] sm:tracking-[2.00px]">
                    Thêm
                  </span>
                </Button>
                {/* Preview Button - Chỉ hiện trên mobile/tablet */}
                <Button
                  className="xl:hidden h-auto bg-purple-500 hover:bg-purple-600 rounded-[25px] sm:rounded-[35px] py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                  onClick={() => setShowMobilePreview(true)}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-lg sm:text-xl hidden sm:inline">
                    Xem
                  </span>
                </Button>
              </div>
              </div>
              
              <Routes>
                <Route path="add-social" element={
                  <SocialModalPage
                    show={true}
                    onClose={() => {
                      navigate("/my-links");
                      setSearchQuery("");
                      setSelectedCategory("social");
                    }}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onAddSocial={(name, color) => {
                      if (maxBusinessCard !== null && portfoliosList.length > maxBusinessCard) {
                        showToast.error(`Bạn đã vượt quá giới hạn danh thiếp (${portfoliosList.length}/${maxBusinessCard}). Vui lòng xóa bớt danh thiếp hoặc nâng cấp gói.`);
                        navigate("/my-links");
                        return;
                      }
                      
                      if (!portfolioSlug && maxBusinessCard !== null && portfoliosList.length >= maxBusinessCard) {
                        showToast.error(`Gói của bạn chỉ cho phép tạo tối đa ${maxBusinessCard} danh thiếp. Bạn đã có ${portfoliosList.length} danh thiếp. Vui lòng nâng cấp gói hoặc xóa bớt danh thiếp hiện tại.`);
                        navigate("/my-links");
                        return;
                      }
                      window.dispatchEvent(new CustomEvent("add-social-link", { detail: { name, color } }));
                      navigate("/my-links");
                      setSearchQuery("");
                      setSelectedCategory("social");
                    }}
                  />
                } />
              </Routes>
            </section>
            
            <section className="w-full max-w-[700px] flex flex-col items-center px-4 sm:px-6 lg:px-9 mb-10 pb-8">
              <SocialLinksSection socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
            </section>
          </div>
        </main>
      </div>

      {/* Sidebar phải - Phone Preview - Desktop: fixed bên phải, Mobile: hidden */}
      <div className="hidden xl:flex fixed top-0 right-0 h-full min-h-screen w-[395px] bg-white border-l border-[#d9d9d9] flex-shrink-0 flex-col z-12">
        <div className="w-full h-full flex flex-col">
          <div className="w-70 p-4 border-b border-gray-200 ">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Live Preview</h3>
            <p className="text-xs text-gray-500">
              Changes update in real-time
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <PhonePreview
              themeClasses={themeClasses}
              textColors={textColors}
              selectedTheme={designSettings.selectedTheme}
              selectedLayout={designSettings.selectedLayout}
              user={user}
              bio={bio}
              socialLinks={socialLinks.filter(link => link.isEnabled && link.url)}
              designSettings={designSettings}
            />
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={handleOpenShareDialog}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium"
              >
                Share Portfolio
              </button>
              <button
                onClick={() => navigate("/portfolio-design")}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors font-medium"
              >
                Customize Design
              </button>
            </div>
            
            {portfolioSlug && (
              <div className="mt-3 text-xs text-gray-500 text-center">
                <div>Portfolio: <strong>{portfolioTitle}</strong></div>
                <div className="truncate">Slug: {portfolioSlug}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Preview Modal */}
      {showMobilePreview && (
        <>
          {/* Overlay */}
          <div 
            className="xl:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobilePreview(false)}
          />
          {/* Preview Content */}
          <div className="xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[80vh] overflow-y-auto relative">
              {/* Close button */}
              <button
                onClick={() => setShowMobilePreview(false)}
                className="sticky top-0 right-0 ml-auto mr-4 mt-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <span className="text-gray-600 text-xl leading-none">×</span>
              </button>
              {/* Preview content */}
              <div className="px-4 pb-6">
                <ProfilePictureSection user={user} bio={bio} socialLinks={socialLinks.filter(link => link.isEnabled)} portfolioTitle={portfolioTitle} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal chỉnh sửa title/bio */}
      {showTitleBioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowTitleBioModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500 text-xl leading-none">×</span>
            </button>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center pr-6">Portfolio Title and Bio</h3>
            <div className="mb-3">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Portfolio Title</div>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tmpPortfolioTitle}
                onChange={e => setTmpPortfolioTitle(e.target.value)}
                maxLength={50}
                placeholder="My Portfolio"
              />
              <div className="text-right text-xs text-gray-500 mt-1">{tmpPortfolioTitle.length} / 50</div>
            </div>
            <div className="mb-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Bio</div>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={tmpBio}
                onChange={e => setTmpBio(e.target.value.slice(0, 160))}
                maxLength={160}
                placeholder="Tell people about yourself..."
              />
              <div className="text-right text-xs text-gray-500 mt-1">{tmpBio.length} / 160</div>
            </div>
            <Button className="w-full text-sm sm:text-base" onClick={handleSaveTitleBio} disabled={savingTitleBio}>
              {savingTitleBio ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}

      {/* Portfolios Modal */}
      {showPortfoliosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] p-4 sm:p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPortfoliosModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500 text-xl leading-none">×</span>
            </button>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center pr-6">Danh sách Portfolio ({portfoliosList.length})</h3>

            {portfoliosList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base">Bạn chưa tạo portfolio nào</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {portfoliosList.map((portfolio: any, index: number) => (
                  <div
                    key={portfolio._id || index}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      const portfolioIdentifier = portfolio.slug || portfolio._id;
                      loadPortfolioData(portfolioIdentifier);
                      setShowPortfoliosModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{portfolio.title || 'Untitled'}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">
                          Slug: <code className="bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{portfolio.slug || portfolio._id}</code>
                        </p>
                        {portfolio.blocks && portfolio.blocks.length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                            Blocks: {portfolio.blocks.length}
                          </p>
                        )}
                        {portfolio.social_links && Object.keys(portfolio.social_links).length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            Social links: {Object.keys(portfolio.social_links).length}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <a
                          href={`${window.location.origin}/portfolio/${portfolio.slug || portfolio._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};