import { ArrowUpIcon, PlusIcon, SettingsIcon } from "lucide-react";
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

import { getMyProfile, updateMyProfile, updatePortfolio } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

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

  useEffect(() => {
    // Load from backend first (source of truth), then overlay per-user drafts from localStorage
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
        if (typeof profile.bio === 'string') setBio(profile.bio);
        if (profile.social_links) {
          const links: SocialLink[] = Object.entries(profile.social_links).map(([key, value]: any) => {
            // Nếu value đã có id thì giữ nguyên, nếu không thì tạo mới
            if (typeof value === 'object' && value !== null && value.id) {
              return {
                ...value,
                name: key.charAt(0).toUpperCase() + key.slice(1),
              };
            }
            return {
              id: `${key}-defaultid`,
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
        // After we know the user, overlay any local draft for THIS user
        try {
          const kBio = `mylinks_${profile._id}_bio`;
          const kLinks = `mylinks_${profile._id}_socialLinks`;
          const kUsername = `mylinks_${profile._id}_username`;
          const localBio = localStorage.getItem(kBio);
          const localLinks = localStorage.getItem(kLinks);
          const localUsername = localStorage.getItem(kUsername);
          if (localBio !== null) setBio(localBio);
          if (localLinks) {
            // Parse và chỉ gán id nếu chưa có, giữ nguyên id cũ nếu đã tồn tại
            let parsedLinks = JSON.parse(localLinks);
            let changed = false;
            parsedLinks = parsedLinks.map((link: any) => {
              if (!link.id) {
                changed = true;
                return {
                  ...link,
                  id: `${link.name || 'link'}-defaultid`,
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
          }
          if (localUsername) {
            setUser((prev: any) => ({ ...prev, username: localUsername }));
          }
        } catch {}
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // 3) Auto-persist to localStorage on change (per-user keys)
  useEffect(() => {
    if (!user?._id) return;
    try {
      localStorage.setItem(`mylinks_${user._id}_bio`, bio || "");
      localStorage.setItem(`mylinks_${user._id}_socialLinks`, JSON.stringify(socialLinks));
    } catch {}
  }, [bio, socialLinks, user?._id]);


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
      try { await updatePortfolio({ blocks }); } catch {}
      setShowTitleBioModal(false);
    } catch (error) {
      console.error('Error saving title/bio:', error);
    } finally {
      setSavingTitleBio(false);
    }
  }

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
          <Header />
          {/* Content Section */}
          <div className="w-full flex flex-col items-center flex-1">
            <section className="w-full max-w-[700px] flex flex-col items-center px-9 pt-12">
              <div className="flex flex-col items-center gap-4 mb-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-[77px] h-[77px]">
                    <AvatarImage
                      src={user.avatar_url || undefined}
                      alt="Profile picture"
                    />
                    <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
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
              <Button
                className="h-auto w-full max-w-[400px] bg-[#639fff] hover:bg-[#5a8fee] rounded-[35px] py-4 flex items-center justify-center gap-2 shadow-lg mb-8"
                onClick={() => navigate("/my-links/add-social")}
              >
                <PlusIcon className="w-6 h-6 text-white" />
                <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-xl tracking-[2.00px]">
                  Thêm
                </span>
              </Button>
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
