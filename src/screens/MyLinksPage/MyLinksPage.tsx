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
// import { BioSection } from "./sections/BioSection/BioSection";

import type { SocialLink } from "./sections/SocialLinksSection/SocialLinksSection";
import { ProfilePictureSection } from "./sections/ProfilePictureSection/ProfilePictureSection";
import { SocialLinksSection } from "./sections/SocialLinksSection/SocialLinksSection";

import { getMyProfile, getMyPortfolio, getMyPortfolios, updateMyProfile, updatePortfolio, getCurrentPlan } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useRef } from 'react';

import ShareDialog from "../../components/ShareDialog";
import { showToast } from "../../lib/toast";

export const MyLinksPage = (): JSX.Element => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Đã xóa addStatus vì không sử dụng
  const [selectedCategory, setSelectedCategory] = useState<'social' | 'media' | 'all'>('social');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [showTitleBioModal, setShowTitleBioModal] = useState(false);
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [tmpUsername, setTmpUsername] = useState("");
  const [tmpBio, setTmpBio] = useState("");
  const [savingTitleBio, setSavingTitleBio] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const [portfolioExists, setPortfolioExists] = useState(false);
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [planActive, setPlanActive] = useState<boolean | null>(null);
  const [maxSocialLinks, setMaxSocialLinks] = useState<number | null>(null);
  const [portfoliosList, setPortfoliosList] = useState<any[]>([]);
  const [showPortfoliosModal, setShowPortfoliosModal] = useState(false);

  // Function to load portfolio data and update UI
  const loadPortfolioData = (portfolioSlug: string) => {
    try {
      console.log('📥 Loading portfolio:', portfolioSlug);
      console.log('📋 Available portfolios:', portfoliosList);
      console.log('🔍 Looking for slug:', portfolioSlug, 'in', portfoliosList.map((p: any) => ({ slug: p.slug, _id: p._id })));

      // Find portfolio from list by slug or _id (fallback)
      let portfolio = portfoliosList.find((p: any) => p.slug === portfolioSlug);

      // If not found by slug, try by _id (in case slug is not set)
      if (!portfolio) {
        console.warn('⚠️ Portfolio not found by slug, trying by _id:', portfolioSlug);
        portfolio = portfoliosList.find((p: any) => p._id === portfolioSlug);
      }

      if (!portfolio) {
        console.error('❌ Portfolio not found:', portfolioSlug);
        console.error('❌ Available portfolios:', portfoliosList.map((p: any) => ({ slug: p.slug, _id: p._id })));
        showToast.error('Portfolio không tìm thấy');
        return;
      }

      console.log('✅ Portfolio found:', portfolio);

      // Set portfolio slug
      const finalSlug = portfolio.slug || portfolio._id;
      if (finalSlug) {
        setPortfolioSlug(finalSlug);
        // Save to localStorage to remember current portfolio (use slug or _id)
        localStorage.setItem('currentPortfolioSlug', finalSlug);
        console.log('✅ Portfolio slug/id saved to localStorage:', finalSlug);
        console.log('✅ Verify localStorage:', localStorage.getItem('currentPortfolioSlug'));
      }

      // Load social links from portfolio
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
        console.log('✅ Social links loaded:', links.length);
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
    // Load from backend (source of truth)
    async function fetchProfile() {
      try {
        // Get user profile
        const profile = await getMyProfile();
      console.log(profile);
      console.log("hello");
      
      
        setUser(profile);
        if (typeof profile.bio === 'string') setBio(profile.bio);

        // Get portfolio data (which contains social_links)
        try {
          const portfolio = await getMyPortfolio();
          console.log('📋 Portfolio loaded:', portfolio);
          setPortfolioExists(true);

          // Try to get slug from portfolio object
          const slug = portfolio?.slug || portfolio?._id;
          if (slug) {
            setPortfolioSlug(slug);
            console.log('✅ Portfolio slug set:', slug);
          } else {
            console.warn('⚠️ Portfolio loaded but no slug or _id:', portfolio);
          }
          if (portfolio && portfolio.social_links) {
            const links: SocialLink[] = Object.entries(portfolio.social_links).map(([key, value]: any) => {
              // Nếu value đã có id thì giữ nguyên, nếu không thì tạo mới
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

          // Fallback to profile social_links if portfolio doesn't exist
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

  // Fetch portfolios list
  useEffect(() => {
    (async () => {
      try {
        const portfolios = await getMyPortfolios();
        console.log('📋 Portfolios list:', portfolios);
        setPortfoliosList(portfolios);
      } catch (e: any) {
        console.error('❌ Error fetching portfolios:', e);
        setPortfoliosList([]);
      }
    })();
  }, []);

  // Load saved portfolio after portfoliosList is loaded
  useEffect(() => {
    if (portfoliosList.length > 0) {
      const savedPortfolioSlug = localStorage.getItem('currentPortfolioSlug');
      if (savedPortfolioSlug) {
        console.log('📥 Attempting to load saved portfolio:', savedPortfolioSlug);
        loadPortfolioData(savedPortfolioSlug);
      }
    }
  }, [portfoliosList]);

  // Fetch current plan once
  useEffect(() => {
    (async () => {
      try {
        const planResponse = await getCurrentPlan();
        console.log('📋 Current plan response:', planResponse);

        // API trả về object hoặc array
        const plan = Array.isArray(planResponse) ? planResponse[0] : planResponse;
        console.log('📋 Current plan (after unwrap):', plan);

        // API trả về status trực tiếp hoặc trong result
        const status = plan?.status || plan?.result?.status;
        console.log('Current plan status:', status);
        const planInfo = (plan?.planInfo?.[0]) || (plan?.result?.planInfo?.[0]) || plan;

        console.log('📊 Plan status:', status, 'Plan info:', planInfo);

        // Kiểm tra status (có thể là 'active', 'Active', 'trial', hoặc các giá trị khác)
        const isActive = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'trial';
        console.log('isActive:', isActive, 'status:', status);
        setPlanActive(isActive);

        if (typeof planInfo?.maxSocialLinks === 'number') {
          setMaxSocialLinks(planInfo.maxSocialLinks);
          console.log('✅ Max social links:', planInfo.maxSocialLinks);
        }

        // Nếu không có gói active, hiển thị cảnh báo
        if (!isActive) {
          console.warn('⚠️ No active plan found');
          showToast.warning('Bạn chưa có gói nào đang hoạt động. Vui lòng đăng ký gói để cập nhật portfolio.');
        } else {
          console.log('✅ Active plan found:', planInfo?.name);
        }
      } catch (e: any) {
        // If cannot read plan, assume inactive so we avoid repeated 403
        console.error('❌ Error fetching current plan:', e);
        setPlanActive(false);
        showToast.error('Không thể kiểm tra gói của bạn. Vui lòng thử lại sau.');
      }
    })();
  }, []);

  // Auto-save social links to backend when they change
  useEffect(() => {
    if (!user?._id || socialLinks.length === 0) return;

    // Debounce the save to avoid too many API calls
    const timer = setTimeout(async () => {
      try {
        // Check plan before saving to avoid 403 loop
        // Only skip if we KNOW plan is inactive (planActive === false)
        // Don't skip if planActive is null (still loading)
        if (planActive === false) {
          console.warn('⚠️ Skip save: no active plan');
          showToast.warning('Không thể lưu: bạn chưa có gói nào đang hoạt động');
          return;
        }

        if (planActive === null) {
          console.log('⏳ Plan status still loading, will retry...');
          // Don't return, let it try to save - backend will return 403 if needed
        }
        // Convert socialLinks array back to object format for backend
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

        // Optional: enforce maxSocialLinks if known
        if (typeof maxSocialLinks === 'number') {
          const enabledCount = Object.values(socialLinksObj).filter((v: any) => v?.isEnabled && v?.url).length;
          if (enabledCount > maxSocialLinks) {
            console.warn(`Vượt quá số link cho phép (${enabledCount}/${maxSocialLinks}), bỏ qua lưu.`);
            showToast.warning(`Bạn chỉ được phép tối đa ${maxSocialLinks} link trong gói hiện tại`);
            return;
          }
        }
        console.log('📊 Auto-save state - portfolioExists:', portfolioExists, 'portfolioSlug:', portfolioSlug);

        // Must have slug to update portfolio
        if (!portfolioSlug) {
          console.warn('⚠️ Cannot save: no portfolio slug available');
          console.log('📝 Waiting for portfolio to be created...');
          return;
        }

        // Save to backend
        console.log('📤 Updating portfolio with slug:', portfolioSlug);
        await updatePortfolio(portfolioSlug, { social_links: socialLinksObj });
        console.log('✅ Social links saved to backend');
      } catch (error: any) {
        console.error('Error saving social links:', error);
        showToast.error('Lỗi lưu social links: ' + (error?.message || 'Không xác định'));
      }
    }, 1000); // Wait 1 second after last change before saving

    return () => clearTimeout(timer);
  }, [socialLinks, user?._id, portfolioExists, planActive, maxSocialLinks]);

  // 4) Handle click tracking for social links
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


  async function handleSaveTitleBio() {
    if (!user) return;
    setSavingTitleBio(true);
    try {
      console.log('💾 Saving username:', tmpUsername, 'bio:', tmpBio);

      // Save to user profile
      const result = await updateMyProfile({ username: tmpUsername, bio: tmpBio });
      console.log('✅ User profile updated:', result);
      setUser({ ...user, username: tmpUsername });
      setBio(tmpBio);

      // Also save to portfolio
      const blocks = [{ type: "text", content: tmpBio || "", order: 1 }];

      if (portfolioSlug) {
        console.log('📤 Updating portfolio with slug:', portfolioSlug);
        await updatePortfolio(portfolioSlug, { blocks });
        console.log('✅ Portfolio bio updated');
      } else {
        console.warn('⚠️ Cannot update portfolio: no slug available');
        console.log('📊 Portfolio state - exists:', portfolioExists, 'slug:', portfolioSlug);
      }

      setShowTitleBioModal(false);
      showToast.success('Đã lưu thông tin');
    } catch (error: any) {
      console.error('❌ Error saving title/bio:', error);
      showToast.error('Lỗi lưu thông tin: ' + error.message);
    } finally {
      setSavingTitleBio(false);
    }
  }

  // Hàm mở dialog chia sẻ
  const handleOpenShareDialog = () => {
    setShowShareDialog(true);
  };
  // Hàm đóng dialog chia sẻ
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
      {/* Sidebar trái */}
      <div className="fixed top-0 left-0 h-full min-h-screen w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 flex flex-col z-20">
        <Sidebar user={user} />
      </div>

      {/* Main content */}
      <div className="ml-[265px] mr-[395px] bg-[#f7f7f7] min-h-screen flex flex-col items-center">
        <main className="flex-1 w-full flex flex-col items-center pt-20">
          {/* Header */}
          <Header onShare={handleOpenShareDialog} shareBtnRef={shareBtnRef} />
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
            {/* Banner cảnh báo nếu không có gói active */}
            {planActive === false && (
              <div className="w-full max-w-[700px] px-9 pt-6">
                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">!</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-800 mb-1">Chưa có gói đang hoạt động</h3>
                      <p className="text-sm text-orange-700">Bạn cần đăng ký gói để có thể cập nhật và lưu portfolio. Các thay đổi sẽ không được lưu.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hiển thị quota nếu có maxSocialLinks */}
            {planActive === true && typeof maxSocialLinks === 'number' && (
              <div className="w-full max-w-[700px] px-9 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  📊 Gói của bạn: tối đa <strong>{maxSocialLinks}</strong> social links
                </div>
              </div>
            )}
            
            <section className="w-full max-w-[700px] flex flex-col items-center px-9 pt-12">
              <div className="flex flex-col items-center gap-4 mb-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar với nút upload ảnh */}
                  <div className="relative">
                    <Avatar className="w-[77px] h-[77px]">
                      <AvatarImage
                        src={user.avatar_url || undefined}
                        alt="Profile picture"
                      />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    {/* Icon camera nhỏ gọn */}
                    <button
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-lg border-2 border-white"
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
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="[font-family:'Carlito',Helvetica] font-normal text-black text-2xl tracking-[2.40px] leading-[normal] hover:underline"
                      onClick={() => {
                        setTmpUsername(user.username || "");
                        setTmpBio(bio || "");
                        setShowTitleBioModal(true);
                      }}
                      aria-label="Chỉnh sửa title và bio"
                    >
                      @{user.username}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-[#6e6e6e] text-sm hover:underline"
                    onClick={() => {
                      setTmpUsername(user.username || "");
                      setTmpBio(bio || "");
                      setShowTitleBioModal(true);
                    }}
                  >
                    {bio ? bio : "bio"}
                  </button>
                </div>
              </div>


              {/* Add Social Button */}
              <div className="flex gap-3 w-full max-w-[400px] mb-8">
                <Button
                  className="flex-1 h-auto bg-[#639fff] hover:bg-[#5a8fee] rounded-[35px] py-4 flex items-center justify-center gap-2 shadow-lg"
                  onClick={() => navigate("/my-links/add-social")}
                >
                  <PlusIcon className="w-6 h-6 text-white" />
                  <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-xl tracking-[2.00px]">
                    Thêm
                  </span>
                </Button>
                <Button
                  className="flex-1 h-auto bg-[#6e6e6e] hover:bg-[#5a5a5a] rounded-[35px] py-4 flex items-center justify-center gap-2 shadow-lg"
                  onClick={() => setShowPortfoliosModal(true)}
                >
                  <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-xl tracking-[2.00px]">
                    Portfolio ({portfoliosList.length})
                  </span>
                </Button>
              </div>
              {/* Modal as a route */}
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
                      window.dispatchEvent(new CustomEvent("add-social-link", { detail: { name, color } }));
                      navigate("/my-links");
                      setSearchQuery("");
                      setSelectedCategory("social");
                    }}
                  />
                } />
              </Routes>
            </section>
            <section className="w-full max-w-[700px] flex flex-col items-center px-9">
              <SocialLinksSection socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
            </section>
          </div>
        </main>
      </div>

      {/* Sidebar phải */}
      <div className="fixed top-0 right-0 h-full min-h-screen w-[395px] bg-white border-l border-[#d9d9d9] flex-shrink-0 flex flex-col items-center justify-center z-20">
        <ProfilePictureSection user={user} bio={bio} socialLinks={socialLinks.filter(link => link.isEnabled)} />
      </div>

      {/* Modal chỉnh sửa title/bio */}
      {showTitleBioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] p-6 relative">
            <button 
              onClick={() => setShowTitleBioModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500 text-xl leading-none">×</span>
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Title and bio</h3>
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Title</div>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={tmpUsername}
                onChange={e => setTmpUsername(e.target.value)}
                maxLength={30}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{tmpUsername.length} / 30</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Bio</div>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows={4}
                value={tmpBio}
                onChange={e => setTmpBio(e.target.value.slice(0, 160))}
                maxLength={160}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{tmpBio.length} / 160</div>
            </div>
            <Button className="w-full" onClick={handleSaveTitleBio} disabled={savingTitleBio}>
              {savingTitleBio ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}

      {/* Portfolios Modal */}
      {showPortfoliosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPortfoliosModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500 text-xl leading-none">×</span>
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Danh sách Portfolio ({portfoliosList.length})</h3>

            {portfoliosList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Bạn chưa tạo portfolio nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {portfoliosList.map((portfolio: any, index: number) => (
                  <div
                    key={portfolio._id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      const portfolioIdentifier = portfolio.slug || portfolio._id;
                      console.log('🖱️ Clicked portfolio:', portfolioIdentifier, 'Full portfolio:', portfolio);
                      loadPortfolioData(portfolioIdentifier);
                      setShowPortfoliosModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{portfolio.title || 'Untitled'}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Slug: <code className="bg-gray-100 px-2 py-1 rounded">{portfolio.slug || portfolio._id}</code>
                        </p>
                        {portfolio.blocks && portfolio.blocks.length > 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            Blocks: {portfolio.blocks.length}
                          </p>
                        )}
                        {portfolio.social_links && Object.keys(portfolio.social_links).length > 0 && (
                          <p className="text-sm text-gray-500">
                            Social links: {Object.keys(portfolio.social_links).length}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <a
                          href={`${window.location.origin}/portfolio/${portfolio.slug || portfolio._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
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
