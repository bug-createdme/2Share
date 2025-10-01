import { ArrowUpIcon, PlusIcon, SettingsIcon, SearchIcon, HeartIcon, PlayIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
// import { BioSection } from "./sections/BioSection/BioSection";
import type { SocialLink } from "./sections/SocialLinksSection/SocialLinksSection";
import { NavigationMenuSection } from "./sections/NavigationMenuSection/NavigationMenuSection";
import { ProfilePictureSection } from "./sections/ProfilePictureSection/ProfilePictureSection";
import { SocialLinksSection } from "./sections/SocialLinksSection/SocialLinksSection";
import { getMyProfile, updateMyProfile, updatePortfolio } from "../../lib/api";

export const MyLinksPage = (): JSX.Element => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Đã xóa addStatus vì không sử dụng
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'social' | 'media' | 'all'>('social');
  const [searchQuery, setSearchQuery] = useState('');
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
          const links: SocialLink[] = Object.entries(profile.social_links).map(([key, value]: any) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            url: String(value || ""),
            clicks: 0,
            isEnabled: Boolean(value),
            color: "#6e6e6e",
            icon: "🔗",
          }));
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
          if (localLinks) setSocialLinks(JSON.parse(localLinks));
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
    <div className="bg-[#f7f7f7] w-full min-h-screen">
      {/* Left Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[265px] bg-white z-20 border-r border-[#d9d9d9]">
  <NavigationMenuSection user={user} />
      </div>

      {/* Right Sidebar */}
      <div className="fixed top-0 right-0 h-screen w-[395px] bg-white z-20 border-l border-[#d9d9d9] flex items-center justify-center">
  <ProfilePictureSection user={user} bio={bio} socialLinks={socialLinks} />
      </div>

      {/* Main Content Area */}
      <div className="ml-[265px] mr-[395px] h-screen overflow-y-auto flex flex-col items-center">
        {/* Header */}
        <header className="sticky top-0 z-10 h-[95px] bg-[#f7f7f7] border-b border-[#ebebeb] flex items-center justify-between px-9 w-full max-w-[700px]">
          <h1 className="[font-family:'League_Spartan',Helvetica] font-bold text-black text-[32px] tracking-[0] leading-[normal]">
            2Share của tôi
          </h1>

          <div className="flex items-center gap-4">
            {/* Đã gỡ nút Lưu theo yêu cầu */}
            <Button
              variant="outline"
              size="sm"
              className="h-auto w-[113px] bg-white rounded-[10px] border border-[#6e6e6e] flex items-center gap-2 px-4 py-3"
            >
              <ArrowUpIcon className="w-3.5 h-3.5" />
              <span className="[font-family:'Carlito',Helvetica] font-normal text-black text-base tracking-[1.60px]">
                Chia sẻ
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 bg-white rounded-[10px] border border-[#6e6e6e] p-0 flex items-center justify-center"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </header>

        {/* Profile Section */}
        <div className="w-full max-w-[700px] flex flex-col items-center px-9 pt-12">
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
                {/* <Button variant="ghost" size="sm" className="h-auto p-0">
                  <EditIcon className="w-6 h-6" />
                </Button> */}
              </div>
              {/* Bio inline clickable text */}
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
              {/* Social icons giữ nguyên */}
            </div>
          </div>
          {/* Add Button */}
          <Button
            className="h-auto w-full max-w-[400px] bg-[#639fff] hover:bg-[#5a8fee] rounded-[35px] py-4 flex items-center justify-center gap-2 shadow-lg"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="w-6 h-6 text-white" />
            <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-xl tracking-[2.00px]">
              Thêm
            </span>
          </Button>

          {/* New Figma-style Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-[24px] shadow-[0px_8px_10px_rgba(0,0,0,0.10),0px_20px_25px_rgba(0,0,0,0.10)] w-full max-w-[880px] h-[600px] relative animate-fade-in flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6">
                  <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>Add</h2>
                  <button
                    className="text-[#57534e] hover:text-gray-700 transition-colors"
                    onClick={() => {
                      setShowModal(false);
                      setSearchQuery('');
                      setSelectedCategory('social');
                    }}
                    aria-label="Đóng"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 mb-4">
                  <div className="relative bg-[#f5f5f4] rounded-full px-4 py-3 flex items-center gap-3">
                    <SearchIcon className="w-4 h-4 text-[#a8a29e]" />
                    <input
                      type="text"
                      placeholder="Paste or search a link"
                      className="flex-1 bg-transparent outline-none text-base text-black placeholder:text-[#a8a29e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden px-6 pb-6 gap-6">
                  {/* Left Sidebar - Categories */}
                  <div className="flex flex-col gap-1 w-[212px]">
                    <button
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        selectedCategory === 'social' ? 'bg-[#f5f5f4]' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory('social')}
                    >
                      <HeartIcon className="w-4 h-4 text-black" />
                      <span className="text-base font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Social
                      </span>
                    </button>
                    <button
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        selectedCategory === 'media' ? 'bg-[#f5f5f4]' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory('media')}
                    >
                      <PlayIcon className="w-4 h-4 text-[#292524]" />
                      <span className="text-base font-medium text-[#292524]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Media
                      </span>
                    </button>
                    <button
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        selectedCategory === 'all' ? 'bg-[#f5f5f4]' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      <span className="text-base font-medium text-[#292524] ml-7" style={{ fontFamily: 'Inter, sans-serif' }}>
                        View all
                      </span>
                    </button>
                  </div>

                  {/* Right Content - Social Items */}
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {selectedCategory === 'social' ? 'Social' : selectedCategory === 'media' ? 'Media' : 'All'}
                    </h3>
                    
                    <div className="flex flex-col gap-0">
                      {selectedCategory === 'social' && (
                        <>
                          <button
                            className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("add-social-link", { 
                                detail: { name: "Instagram", color: "#e4405f", icon: "📷" } 
                              }));
                              setShowModal(false);
                              setSearchQuery('');
                            }}
                          >
                            <img src="/images/social/instagram-logo.png" alt="Instagram" className="w-10 h-10 rounded-full" />
                            <div className="flex-1 text-left">
                              <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Instagram
                              </div>
                              <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Display up to six of your Instagram posts and reels, right on your L...
                              </div>
                            </div>
                            <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                          </button>

                          <button
                            className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("add-social-link", { 
                                detail: { name: "TikTok", color: "#69c9d0", icon: "🎵" } 
                              }));
                              setShowModal(false);
                              setSearchQuery('');
                            }}
                          >
                            <img src="/images/social/tiktok-logo.png" alt="TikTok" className="w-10 h-10 rounded-full" />
                            <div className="flex-1 text-left">
                              <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                                TikTok
                              </div>
                              <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Share your TikToks directly on your Linktree to gain exposure and ...
                              </div>
                            </div>
                            <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                          </button>

                          <button
                            className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("add-social-link", { 
                                detail: { name: "TikTok Profile", color: "#69c9d0", icon: "🎵" } 
                              }));
                              setShowModal(false);
                              setSearchQuery('');
                            }}
                          >
                            <img src="/images/social/tiktok-profile-logo.png" alt="TikTok Profile" className="w-10 h-10 rounded-full border border-[#e5e7eb]" />
                            <div className="flex-1 text-left">
                              <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                                TikTok Profile
                              </div>
                              <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Share TikTok profiles with your audience. Perfect for content creat...
                              </div>
                            </div>
                            <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                          </button>

                          <button
                            className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("add-social-link", { 
                                detail: { name: "X", color: "#000000", icon: "✖️" } 
                              }));
                              setShowModal(false);
                              setSearchQuery('');
                            }}
                          >
                            <img src="/images/social/x-logo.png" alt="X" className="w-10 h-10 rounded-full" />
                            <div className="flex-1 text-left">
                              <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                                X
                              </div>
                              <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Use X app to select your own (or your favorite) posts to display on...
                              </div>
                            </div>
                            <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                          </button>

                          <button
                            className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("add-social-link", { 
                                detail: { name: "Threads", color: "#000000", icon: "🧵" } 
                              }));
                              setShowModal(false);
                              setSearchQuery('');
                            }}
                          >
                            <img src="/images/social/threads-logo.png" alt="Threads" className="w-10 h-10 rounded-full" />
                            <div className="flex-1 text-left">
                              <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Threads
                              </div>
                              <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Driving your audience to follow you on Threads just got easier, Sel...
                              </div>
                            </div>
                            <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                          </button>
                        </>
                      )}

                      {selectedCategory === 'media' && (
                        <div className="text-center py-8 text-[#78716c]">
                          Media options coming soon...
                        </div>
                      )}

                      {selectedCategory === 'all' && (
                        <div className="text-center py-8 text-[#78716c]">
                          All categories coming soon...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Sections */}

        <div className="w-full max-w-[700px] flex flex-col items-center px-9">
          <SocialLinksSection socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
        </div>
      </div>

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
