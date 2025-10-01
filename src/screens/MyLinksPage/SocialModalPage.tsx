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
                    onClick={() => onAddSocial('Instagram', '#e4405f', '📷')}
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
                    onClick={() => onAddSocial('TikTok', '#69c9d0', '🎵')}
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
                    onClick={() => onAddSocial('TikTok Profile', '#69c9d0', '🎵')}
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
                    onClick={() => onAddSocial('X', '#000000', '✖️')}
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
                    onClick={() => onAddSocial('Threads', '#000000', '🧵')}
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
  );
};

export default SocialModalPage;
