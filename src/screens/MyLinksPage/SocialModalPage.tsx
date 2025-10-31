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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl w-full h-full sm:h-[85vh] sm:max-w-[920px] sm:max-h-[680px] relative flex flex-col overflow-hidden">
        {/* Header - More modern with better spacing */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 bg-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>Add Link</h2>
          <button
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all duration-200 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Search Bar - Enhanced design */}
        <div className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3 sm:pb-4 bg-white border-b border-gray-100">
          <div className="relative bg-gray-50 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 border border-gray-200/50 focus-within:border-gray-300 focus-within:bg-white transition-all duration-200">
            <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search platforms..."
              className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <XIcon className="w-3.5 h-3.5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile/Tablet Category Tabs - Horizontal scroll */}
        <div className="lg:hidden flex gap-2 px-4 sm:px-5 py-3 overflow-x-auto border-b border-gray-100 bg-white scrollbar-hide">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'social' 
                ? 'bg-rose-50 text-rose-700 shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('social')}
          >
            <HeartIcon className="w-4 h-4" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>Social</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'media' 
                ? 'bg-purple-50 text-purple-700 shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('media')}
          >
            <PlayIcon className="w-4 h-4" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>Media</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all' 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <span className="flex w-4 h-4 items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3.5" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="12.5" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif' }}>All</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Categories - Desktop/Tablet vertical */}
          <div className="hidden lg:flex lg:flex-col lg:w-[200px] xl:w-[220px] border-r border-gray-100 bg-gray-50/50 p-4">
            <div className="space-y-1.5">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === 'social' 
                    ? 'bg-white shadow-sm text-gray-900 font-semibold' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
                onClick={() => setSelectedCategory('social')}
              >
                <HeartIcon className={`w-5 h-5 flex-shrink-0 ${selectedCategory === 'social' ? 'text-rose-500' : ''}`} />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>Social</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === 'media' 
                    ? 'bg-white shadow-sm text-gray-900 font-semibold' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
                onClick={() => setSelectedCategory('media')}
              >
                <PlayIcon className={`w-5 h-5 flex-shrink-0 ${selectedCategory === 'media' ? 'text-purple-500' : ''}`} />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>Media</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === 'all' 
                    ? 'bg-white shadow-sm text-gray-900 font-semibold' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                <span className={`flex w-5 h-5 items-center justify-center flex-shrink-0`}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3.5" cy="8" r="1.5" fill={selectedCategory === 'all' ? '#3b82f6' : 'currentColor'} />
                    <circle cx="8" cy="8" r="1.5" fill={selectedCategory === 'all' ? '#3b82f6' : 'currentColor'} />
                    <circle cx="12.5" cy="8" r="1.5" fill={selectedCategory === 'all' ? '#3b82f6' : 'currentColor'} />
                  </svg>
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif' }}>View All</span>
              </button>
            </div>
          </div>

          {/* Right Content - Social Items */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>{sectionTitle}</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 py-2 modal-scroll">
              {/* Nếu có searchQuery, luôn hiển thị tất cả các item đã lọc */}
              {searchQuery.trim() ? (
                <>
                  {filteredAll.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <SearchIcon className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>No results found</p>
                      <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Try searching with different keywords</p>
                    </div>
                  )}
                  {filteredAll.map(item => (
                    <button 
                      key={item.name} 
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group" 
                      onClick={() => onAddSocial(item.name, item.color)}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 flex-shrink-0 group-hover:border-gray-200 transition-all duration-200">
                        <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                        <div className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.desc}</div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors duration-200" />
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {selectedCategory === 'social' && (
                    <>
                      {filteredSocial.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <HeartIcon className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-base font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>No social platforms found</p>
                        </div>
                      )}
                      {filteredSocial.map(item => (
                        <button 
                          key={item.name} 
                          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group" 
                          onClick={() => onAddSocial(item.name, item.color)}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 flex-shrink-0 group-hover:border-gray-200 transition-all duration-200">
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors duration-200" />
                        </button>
                      ))}
                    </>
                  )}
                  {selectedCategory === 'media' && (
                    <>
                      {filteredMedia.filter(i => i.type === 'video').length > 0 && (
                        <div className="mb-2 mt-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide px-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <PlayIcon className="w-3 h-3" />
                            Video
                          </div>
                        </div>
                      )}
                      {filteredMedia.filter(i => i.type === 'video').map(item => (
                        <button 
                          key={item.name} 
                          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group" 
                          onClick={() => onAddSocial(item.name, item.color)}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 flex-shrink-0 group-hover:border-gray-200 transition-all duration-200">
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors duration-200" />
                        </button>
                      ))}
                      {filteredMedia.filter(i => i.type === 'audio').length > 0 && (
                        <div className="mb-2 mt-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide px-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            Audio
                          </div>
                        </div>
                      )}
                      {filteredMedia.filter(i => i.type === 'audio').map(item => (
                        <button 
                          key={item.name} 
                          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group" 
                          onClick={() => onAddSocial(item.name, item.color)}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 flex-shrink-0 group-hover:border-gray-200 transition-all duration-200">
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors duration-200" />
                        </button>
                      ))}
                      {filteredMedia.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <PlayIcon className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-base font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>No media platforms found</p>
                        </div>
                      )}
                    </>
                  )}
                  {selectedCategory === 'all' && (
                    <>
                      {filteredAll.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-base font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>No platforms found</p>
                        </div>
                      )}
                      {filteredAll.map(item => (
                        <button 
                          key={item.name} 
                          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group" 
                          onClick={() => onAddSocial(item.name, item.color)}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-100 flex-shrink-0 group-hover:border-gray-200 transition-all duration-200">
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                            <div className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.desc}</div>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors duration-200" />
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
