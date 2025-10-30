import React from "react";
import { SearchIcon, HeartIcon, PlayIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { SOCIAL_PLATFORMS } from "../../lib/socialConfig";

interface SocialModalPageProps {
  show: boolean;
  onClose: () => void;
  selectedCategory: 'social' | 'media' | 'all';
  setSelectedCategory: (cat: 'social' | 'media' | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddSocial: (name: string, color: string) => void;
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

  // Use shared platform configuration
  const socialItems = SOCIAL_PLATFORMS.filter(p => !p.type);
  const mediaItems = SOCIAL_PLATFORMS.filter(p => p.type === 'video' || p.type === 'audio');

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
                    <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color)}>
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
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color)}>
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
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color)}>
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
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color)}>
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
                        <button key={item.name} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors group" onClick={() => onAddSocial(item.name, item.color)}>
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
