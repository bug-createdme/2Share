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

import { getMyProfile, updateMyProfile, updatePortfolio, getMyPortfolio, createPortfolio } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useRef } from 'react';

import ShareDialog from '../../components/ShareDialog';


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
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag để biết data đã load xong từ server

  useEffect(() => {
    // Load from backend first (source of truth), then overlay per-user drafts from localStorage
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
        
        // Load bio từ server
        if (typeof profile.bio === 'string') setBio(profile.bio);
        
        // Ưu tiên lấy social links từ PORTFOLIO (nguồn dữ liệu chuẩn)
        let loadedFromPortfolio = false;
        try {
          const myPortfolio = await getMyPortfolio();
          if (myPortfolio?.social_links && Object.keys(myPortfolio.social_links).length > 0) {
            const links: SocialLink[] = Object.entries(myPortfolio.social_links).map(([key, value]: any) => {
              if (typeof value === 'object' && value !== null) {
                return {
                  id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                  url: value.url || "",
                  displayName: value.displayName,
                  clicks: value.clicks || 0,
                  isEnabled: value.isEnabled !== undefined ? value.isEnabled : Boolean(value.url),
                  color: value.color || "#6e6e6e",
                  icon: value.icon || "🔗",
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
            setSocialLinks(links);
            console.log('✅ Loaded social links from portfolio:', links);
            loadedFromPortfolio = true;
          }
          // Cập nhật bio từ block text đầu tiên nếu có
          if (myPortfolio?.blocks?.length) {
            const textBlock = myPortfolio.blocks.find((b: any) => b.type === 'text');
            if (textBlock?.content && typeof textBlock.content === 'string') {
              setBio(textBlock.content);
            }
          }
        } catch (err) {
          // Không có portfolio hoặc lỗi -> sẽ thử các nguồn khác
        }

        // Nếu chưa load được từ portfolio, fallback: user.social_links (nếu backend có lưu ở user)
        if (!loadedFromPortfolio && profile.social_links && Object.keys(profile.social_links).length > 0) {
          const links: SocialLink[] = Object.entries(profile.social_links).map(([key, value]: any) => {
            if (typeof value === 'object' && value !== null) {
              return {
                id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: key.charAt(0).toUpperCase() + key.slice(1),
                url: value.url || "",
                displayName: value.displayName,
                clicks: value.clicks || 0,
                isEnabled: value.isEnabled !== undefined ? value.isEnabled : Boolean(value.url),
                color: value.color || "#6e6e6e",
                icon: value.icon || "🔗",
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
          setSocialLinks(links);
          console.log('✅ Loaded social links from user profile:', links);
        }

        if (!loadedFromPortfolio && (!profile.social_links || Object.keys(profile.social_links).length === 0)) {
          // Nếu server không có data, thử load từ localStorage (draft)
          try {
            const kLinks = `mylinks_${profile._id}_socialLinks`;
            const localLinks = localStorage.getItem(kLinks);
            if (localLinks) {
              let parsedLinks = JSON.parse(localLinks);
              let changed = false;
              parsedLinks = parsedLinks.map((link: any) => {
                if (!link.id) {
                  changed = true;
                  return {
                    ...link,
                    id: `${link.name || 'link'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  };
                }
                return link;
              });
              if (changed) {
                setSocialLinks(parsedLinks);
                localStorage.setItem(kLinks, JSON.stringify(parsedLinks));
              } else {
                setSocialLinks(parsedLinks);
              }
              console.log('ℹ️ Loaded social links from localStorage (draft):', parsedLinks);
            }
          } catch (err) {
            console.error('Failed to load from localStorage:', err);
          }
  }
        
        // Load username overlay từ localStorage nếu có draft
        try {
          const kUsername = `mylinks_${profile._id}_username`;
          const localUsername = localStorage.getItem(kUsername);
          if (localUsername && localUsername !== profile.username) {
            setUser((prev: any) => ({ ...prev, username: localUsername }));
            console.log('ℹ️ Using draft username from localStorage:', localUsername);
          }
        } catch {}
        
        // Đánh dấu data đã load xong
        setIsDataLoaded(true);
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // 3) Auto-persist to localStorage on change (per-user keys) AND sync to server
  useEffect(() => {
    if (!user?._id || !isDataLoaded) return; // CHỈ sync khi data đã load xong từ server
    
    try {
      localStorage.setItem(`mylinks_${user._id}_bio`, bio || "");
      localStorage.setItem(`mylinks_${user._id}_socialLinks`, JSON.stringify(socialLinks));
      
      // Đồng bộ social links lên server (portfolio là nguồn chính). Nếu chưa có portfolio, tự tạo.
      const syncToServer = async () => {
        try {
          // Chuyển đổi socialLinks array thành object format cho API
          // Lưu đầy đủ metadata: url, displayName, color, icon, isEnabled
          const socialLinksObject = socialLinks.reduce((acc, link) => {
            const key = link.name.toLowerCase();
            // Lưu dạng object nếu có metadata, hoặc string nếu chỉ có URL
            if (link.displayName || link.color !== "#6e6e6e" || link.icon !== "🔗") {
              acc[key] = {
                url: link.url || "",
                displayName: link.displayName,
                color: link.color,
                icon: link.icon,
                isEnabled: link.isEnabled,
              };
            } else if (link.url && link.url.trim() !== "") {
              // Chỉ lưu URL nếu không có metadata đặc biệt
              acc[key] = link.url;
            }
            return acc;
          }, {} as Record<string, any>);
          
          // 1) Cập nhật user profile (tương thích ngược nếu backend hỗ trợ)
          try {
            await updateMyProfile({ social_links: socialLinksObject });
          } catch {}

          // 2) Cập nhật portfolio (nguồn dữ liệu chuẩn). Nếu 404 -> tạo mới
          try {
            await updatePortfolio({ social_links: socialLinksObject });
            console.log('✅ Social links synced to server (portfolio):', socialLinksObject);
          } catch (err: any) {
            const msg = String(err?.message || err);
            if (msg.includes('HTTP_404') || msg.toLowerCase().includes('not found')) {
              // Tạo portfolio lần đầu
              try {
                await createPortfolio({
                  title: user?.username ? `${user.username}'s Links` : 'My Links',
                  blocks: bio ? [{ type: 'text', content: bio, order: 1 }] : [],
                  social_links: socialLinksObject,
                  avatar_url: user?.avatar_url,
                });
                console.log('🆕 Created portfolio and saved social links.');
              } catch (createErr) {
                console.error('❌ Failed to create portfolio:', createErr);
              }
            } else {
              console.error('❌ Failed to update portfolio:', err);
            }
          }
        } catch (err) {
          console.error('❌ Failed to sync social links to server:', err);
        }
      };
      
      // Debounce: chỉ sync sau 1 giây không có thay đổi
      const timeoutId = setTimeout(syncToServer, 1000);
      return () => clearTimeout(timeoutId);
    } catch {}
  }, [bio, socialLinks, user?._id, isDataLoaded]);

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
      console.log('Saving username:', tmpUsername, 'bio:', tmpBio);
      const result = await updateMyProfile({ username: tmpUsername, bio: tmpBio });
      console.log('Update result:', result);
      setUser({ ...user, username: tmpUsername });
      setBio(tmpBio);
      // Also persist to localStorage for this user
      if (user._id) {
        localStorage.setItem(`mylinks_${user._id}_username`, tmpUsername);
      }
      const blocks = [{ type: "text", content: tmpBio || "", order: 1 }];
      try {
        await updatePortfolio({ blocks });
      } catch (err: any) {
        const msg = String(err?.message || err);
        if (msg.includes('HTTP_404') || msg.toLowerCase().includes('not found')) {
          try {
            // Tạo portfolio lần đầu với bio và các social links hiện có
            const socialLinksObject = socialLinks.reduce((acc, link) => {
              const key = link.name.toLowerCase();
              acc[key] = link.displayName || link.color !== '#6e6e6e' || link.icon !== '🔗'
                ? {
                    url: link.url || "",
                    displayName: link.displayName,
                    color: link.color,
                    icon: link.icon,
                    isEnabled: link.isEnabled,
                  }
                : (link.url || "");
              return acc;
            }, {} as Record<string, any>);

            await createPortfolio({
              title: tmpUsername ? `${tmpUsername}'s Links` : 'My Links',
              blocks,
              social_links: socialLinksObject,
              avatar_url: user?.avatar_url,
            });
            console.log('🆕 Created portfolio with bio and social links.');
          } catch (createErr) {
            console.error('❌ Failed to create portfolio when saving bio/title:', createErr);
          }
        }
      }
      setShowTitleBioModal(false);
    } catch (error) {
      console.error('Error saving title/bio:', error);
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
    <div>
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
          portfolioLink={user?.username ? `${window.location.origin}/portfolio/${user.username}` : ''}
          anchorRef={shareBtnRef}
          username={user?.username}
          avatarUrl={user?.avatar_url}
        />
      )}
          {/* Content Section */}
          <div className="w-full flex flex-col items-center flex-1">
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
    </div>
  );
};
