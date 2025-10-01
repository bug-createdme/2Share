import React from "react";
import { SearchIcon, HeartIcon, PlayIcon, ChevronRightIcon, XIcon } from "lucide-react";

interface SocialModalPageProps {
  show: boolean;
  onClose: () => void;
  selectedCategory: 'social' | 'media' | 'all';
  setSelectedCategory: (cat: 'social' | 'media' | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddSocial: (name: string, color: string, icon: string) => void;
}

const SocialModalPage: React.FC<SocialModalPageProps> = ({
  show,
  onClose,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onAddSocial,
}) => {
  if (!show) return null;

  // Danh sách các item
  const socialItems = [
    {
      name: 'Instagram', color: '#e4405f', img: '/images/social/Instagram_icon.png',
      desc: 'Display up to six of your Instagram posts and reels, right on your 2Share page with the Instagram link app. Previewing Instagram content visually on your 2Share draws attention, and helps you grow your following by driving discovery from other platforms! In fact, you can see up to 3x more clicks using more visual link apps to promote your Instagram, compared to a regular link.'
    },
    {
      name: 'TikTok', color: '#69c9d0', img: '/images/social/Tiktok_icon.png',
      desc: 'Share your TikToks directly on your 2Share to gain exposure and followers.  Use TikTok Profile to make it easy for all your visitors to see your content, follow your account, and even connect for collaboration. Showcase your profile and up to six of your best or latest videos directly on your 2Share. Use TikTok Video to add a single TikTok from any profile directly on your 2Share. Highlight one of your own TikToks or a TikTok from one of your favorite creators.'
    },
    {
      name: 'X', color: '#000000', img: '/images/social/X_icon.png',
      desc: `Use X app to select your own (or your favorite) posts to display on your 2Share. If you're on a Pro plan on 2Share, you can showcase what's new on your feed automatically. Paste the X link, select 'Display this profile's latest post on my 2Share', and you're good to go.`
    },
    {
      name: 'Threads', color: '#000000', img: '/images/social/Threads_icon.png',
      desc: `Driving your audience to follow you on Threads just got easier, Select your own (or your favorite) Threads posts to display on your 2Share. If you're on a Pro plan, you can showcase what's new on your Threads feed automatically. Past the link to your profile, select 'Display this profile's latest Thread on my 2Share', and you're good to go.`
    },
    {
      name: 'Facebook', color: '#1877f3', img: '/images/social/Facebook_icon.png',
      desc: 'Show your visitors any Facebook video, right on your 2Share. With this app, visitors can watch your Facebook videos in full, without opening another app, browser or tab.'
    },
    {
      name: 'Pinterest', color: '#e60023', img: '/images/social/Pinterest_icon.png',
      desc: `Share what you love on Pinterest so visitors can get inspired and explore what's inspiring you. If you've saved Pins to a board, you can share it on your 2Share. You can also share as many individual Pins as you like!`
    },
  ];
  const mediaItems = [
    {
      name: 'YouTube', color: '#ff0000', img: '/images/social/Youtube_icon.png',
      desc: 'Show your visitors any YouTube video, right on your 2Share. Visitors can stay on your Linktree and watch it in full, or click through to the Youtube profile to like, subscribe or leave a comment. You can also choose to automatically show your latest YouTube video.',
      type: 'video'
    },
    {
      name: 'TikTok Video', color: '#69c9d0', img: '/images/social/Tiktok_icon.png',
      desc: 'Highlight one of your TikToks or share a TikTok from another creator. Add a single TikTok from any profile directly on your 2Share for your visitors to watch and enjoy.',
      type: 'video'
    },
    {
      name: 'Spotify', color: '#1db954', img: '/images/social/Spotify_icon.png',
      desc: `Whether you're an artist ready to show your fans what's new, or a music tastemaker sharing what you're listening to: Spotify on 2Share keeps your visitors in touch with the sounds you're putting out there. On Spotify, you get access to the world of music, curated playlists, artists, and podcasts you love - so share your own (or your favorite) Spotify sounds on your 2Share.`,
      type: 'audio'
    },
    {
      name: 'SoundCloud', color: '#ff5500', img: '/images/social/Soundcloud_icon.png',
      desc: `SoundCloud is the world's largest music streaming platform and community, where artists and fans can upload and share their tracks with millions of listeners. When you add the SoundCloud app to your Linktree, the music on your SoundCloud page can be heard everywhere your link is.`,
      type: 'audio'
    },
  ];

  let sectionTitle = '';
  if (selectedCategory === 'social') sectionTitle = 'Social';
  else if (selectedCategory === 'media') sectionTitle = 'Media';
  else sectionTitle = 'All Categories';

  // Lọc item theo searchQuery

const filterItems = <T extends { name: string; desc?: string }>(items: T[]): T[] => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.desc && item.desc.toLowerCase().includes(q))
    );
};
  const filteredSocial = filterItems(socialItems);
  const filteredMedia = filterItems(mediaItems);
  const filteredAll = [...filterItems(socialItems), ...filterItems(mediaItems)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] shadow-[0px_8px_10px_rgba(0,0,0,0.10),0px_20px_25px_rgba(0,0,0,0.10)] w-full max-w-[880px] h-[600px] relative animate-fade-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>Add</h2>
          <button
            className="text-[#57534e] hover:text-gray-700 transition-colors"
            onClick={onClose}
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${selectedCategory === 'social' ? 'bg-[#f5f5f4]' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedCategory('social')}
            >
              <HeartIcon className="w-4 h-4 text-black" />
              <span className="text-base font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                Social
              </span>
            </button>
            <button
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${selectedCategory === 'media' ? 'bg-[#f5f5f4]' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedCategory('media')}
            >
              <PlayIcon className="w-4 h-4 text-[#292524]" />
              <span className="text-base font-medium text-[#292524]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Media
              </span>
            </button>
            <button
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${selectedCategory === 'all' ? 'bg-[#f5f5f4]' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedCategory('all')}
            >
              {/* Ba chấm nhỏ, cùng kích thước với icon bên trên */}
              <span className="flex w-4 h-4 text-[#292524] items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3.5" cy="8" r="1.5" fill="#292524" />
                  <circle cx="8" cy="8" r="1.5" fill="#292524" />
                  <circle cx="12.5" cy="8" r="1.5" fill="#292524" />
                </svg>
              </span>
              <span className="text-base font-medium text-[#292524]" style={{ fontFamily: 'Inter, sans-serif' }}>
                View all
              </span>
            </button>
          </div>
          {/* Right Content - Social Items */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>{sectionTitle}</h3>
            <div className="flex flex-col gap-0">
              {/* Nếu có searchQuery, luôn hiển thị tất cả các item đã lọc */}
              {searchQuery.trim() ? (
                <>
                  {filteredAll.length === 0 && (
                    <div className="text-center py-8 text-[#78716c]">No results found.</div>
                  )}
                  {filteredAll.map(item => (
                    <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color, item.icon)}>
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1 text-left">
                        <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                        <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif', maxWidth: 490, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                      </div>
                      <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {selectedCategory === 'social' && (
                    <>
                      {filteredSocial.length === 0 && (
                        <div className="text-center py-8 text-[#78716c]">No results found.</div>
                      )}
                      {filteredSocial.map(item => (
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color, item.icon)}>
                          <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full" />
                          <div className="flex-1 text-left">
                            <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif', maxWidth: 490, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                        </button>
                      ))}
                    </>
                  )}
                  {selectedCategory === 'media' && (
                    <>
                      {filteredMedia.filter(i => i.type === 'video').length > 0 && (
                        <div className="mb-2 text-lg font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>Video</div>
                      )}
                      {filteredMedia.filter(i => i.type === 'video').map(item => (
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color, item.icon)}>
                          <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full" />
                          <div className="flex-1 text-left">
                            <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif', maxWidth: 490, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                        </button>
                      ))}
                      {filteredMedia.filter(i => i.type === 'audio').length > 0 && (
                        <div className="mb-2 mt-6 text-lg font-bold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>Audio</div>
                      )}
                      {filteredMedia.filter(i => i.type === 'audio').map(item => (
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color, item.icon)}>
                          <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full" />
                          <div className="flex-1 text-left">
                            <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif', maxWidth: 490, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                        </button>
                      ))}
                      {filteredMedia.length === 0 && (
                        <div className="text-center py-8 text-[#78716c]">No results found.</div>
                      )}
                    </>
                  )}
                  {selectedCategory === 'all' && (
                    <>
                      {filteredAll.length === 0 && (
                        <div className="text-center py-8 text-[#78716c]">No results found.</div>
                      )}
                      {filteredAll.map(item => (
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color, item.icon)}>
                          <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full" />
                          <div className="flex-1 text-left">
                            <div className="text-base font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-sm text-[#78716c]" style={{ fontFamily: 'Inter, sans-serif', maxWidth: 490, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-2.5 h-4 text-[#a8a29e] group-hover:text-gray-600" />
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialModalPage;
