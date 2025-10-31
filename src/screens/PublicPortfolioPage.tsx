import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { getPortfolioBySlug } from "../lib/api";
import { getSocialAvatarUrl } from "../lib/socialConfig";
import type { SocialLink } from "./MyLinksPage/sections/SocialLinksSection/SocialLinksSection";

// Component để lấy và hiển thị avatar từ social link
const SocialAvatar = ({ url, name, icon }: { url: string; name: string; icon: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);


  useEffect(() => {
    if (!url) { setAvatarUrl(null); setCandidates([]); setIdx(0); return; }

    // Use shared configuration for avatar extraction
    const debounceTimer = setTimeout(() => {
      console.log('🔍 Getting avatar for:', name, url);
      // primary from config
      const first = getSocialAvatarUrl(name, url);
      const list: string[] = [];
      if (first) list.push(first);
      // extra handling for Facebook to improve reliability
      if (name.toLowerCase().includes('facebook')) {
        try {
          const normalized = url.replace('m.facebook.com', 'www.facebook.com');
          const u = new URL(normalized);
          const idParam = u.searchParams.get('id');
          if (u.pathname.includes('profile.php') && idParam) {
            list.unshift(`https://graph.facebook.com/${idParam}/picture?type=large&width=128&height=128`); // prefer Graph ID
            list.push(`https://unavatar.io/facebook/${idParam}`);
          }
          const parts = u.pathname.split('/').filter(Boolean);
          const numericId = parts.find(p => /^\d+$/.test(p));
          if (numericId) {
            list.push(`https://graph.facebook.com/${numericId}/picture?type=large&width=128&height=128`);
            list.push(`https://unavatar.io/facebook/${numericId}`);
          }
          if (parts[0]) list.push(`https://unavatar.io/facebook/${parts[0]}`);
        } catch {}
        list.push('https://www.google.com/s2/favicons?domain=facebook.com&sz=128');
      }
      setCandidates(list);
      setIdx(0);
      setAvatarUrl(list[0] || null);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [url, name]);

  const handleImgError = () => {
    if (idx + 1 < candidates.length) {
      setIdx(idx + 1);
      setAvatarUrl(candidates[idx + 1]);
    } else {
      console.log('❌ Failed to load all avatar sources');
      setAvatarUrl(null);
    }
  };

  return (
    <div className="absolute top-[11px] left-[11px] w-[18px] h-[18px] rounded-full overflow-hidden bg-white flex items-center justify-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      ) : (
        <span className="text-[10px]">{icon}</span>
      )}
    </div>
  );
};

const PublicPortfolioPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      if (!slug) {
        setError("Không tìm thấy slug");
        setLoading(false);
        return;
      }

      try {
        const portfolioData = await getPortfolioBySlug(slug);
        console.log('📋 Portfolio data received:', portfolioData);
        console.log('📋 Username:', portfolioData?.username);
        setPortfolio(portfolioData);
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy portfolio</h2>
            <p className="text-gray-600 mb-4">{error || "Portfolio này không tồn tại hoặc chưa được công khai."}</p>
            <Button onClick={() => navigate("/")} className="bg-pink-500 hover:bg-pink-600">
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Chuyển đổi social_links từ object sang array để hiển thị
  const socialLinks: SocialLink[] = portfolio.social_links
    ? Object.entries(portfolio.social_links).map(([key, value]: any) => {
        if (typeof value === 'object' && value !== null) {
          return {
            id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            url: value.url || "",
            clicks: value.clicks || 0,
            isEnabled: value.isEnabled !== undefined ? value.isEnabled : Boolean(value.url),
            color: value.color || "#6e6e6e",
            icon: value.icon || "🔗",
            displayName: value.displayName || key.charAt(0).toUpperCase() + key.slice(1),
          };
        }
        // Fallback for simple string URLs (legacy format)
        return {
          id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          url: String(value || ""),
          clicks: 0,
          isEnabled: Boolean(value),
          color: "#6e6e6e",
          icon: "🔗",
          displayName: key.charAt(0).toUpperCase() + key.slice(1),
        };
      }).filter(link => link.isEnabled === true && link.url)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100">
      {/* Header đơn giản */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
            >
              ← Về trang chủ
            </Button>
            <div className="text-sm text-gray-600 truncate max-w-[200px]">
              {portfolio?.username ? `Portfolio của @${portfolio.username}` : 'Portfolio'}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm rounded-[25px] border-none shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Profile section */}
              <div className="flex flex-col items-center pt-10 pb-6">
                <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center border border-pink-200 mb-4">
                  <img
                    className="w-full h-full object-cover"
                    alt="Avatar"
                    src={portfolio.avatar_url || "https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-2.png"}
                  />
                </div>
                <div className="font-bold text-xl text-gray-800 tracking-wide text-center">
                  {portfolio.title || "Portfolio"}
                </div>

                {/* Bio section - Load from blocks */}
                {portfolio.blocks && portfolio.blocks.length > 0 && (() => {
                  const textBlock = portfolio.blocks.find((b: any) => b.type === 'text');
                  const bioContent = textBlock?.content;
                  
                  if (!bioContent) return null;
                  
                  return (
                    <div className="mt-4 mx-6">
                      <div className="relative w-full min-h-[60px] flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-full min-h-[60px] bg-white rounded-[10px] shadow-[0px_0px_58px_12px_#c76a6a40]" />
                        <div className="relative w-full px-4 py-3 text-center">
                          <div className="[font-family:'Itim',Helvetica] font-normal text-pink-600 text-sm tracking-[1.40px] leading-relaxed">
                            {bioContent}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="px-6 pb-8">
                  <div className="flex flex-col items-center gap-3">
                    {socialLinks.map((link, index) => (
                      <div key={link.id || index} className="w-full max-w-[212px]">
                        <Button
                          variant="outline"
                          className="relative w-full h-[45px] rounded-[10px] border-2 border-solid border-pink-200 bg-white/80 hover:bg-white transition-all duration-200 text-gray-700 hover:text-gray-800 font-medium"
                          onClick={() => {
                            if (link.url) {
                              window.open(link.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          style={{
                            cursor: link.url ? 'pointer' : 'not-allowed',
                          }}
                        >
                          <SocialAvatar url={link.url} name={link.name} icon={link.icon} />
                          <span className="[font-family:'Itim',Helvetica] font-normal text-gray-700 text-sm tracking-[1.40px] leading-[normal]">
                            {link.displayName || link.name}
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 pb-6 text-center">
                <div className="text-xs text-gray-500">
                  Powered by 2Share
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolioPage;
