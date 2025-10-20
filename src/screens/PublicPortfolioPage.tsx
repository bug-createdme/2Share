import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { getPortfolioByUsername } from "../lib/api";
import type { SocialLink } from "./MyLinksPage/sections/SocialLinksSection/SocialLinksSection";

// Component để lấy và hiển thị avatar từ social link
const SocialAvatar = ({ url, name, icon }: { url: string; name: string; icon: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setAvatarUrl(null);
      return;
    }

    const getSocialAvatar = async (socialUrl: string) => {
      setLoading(true);
      try {
        // Cách tiếp cận đơn giản và đáng tin cậy hơn: sử dụng unavatar.io cho hầu hết các platform
        if (socialUrl.includes('youtube.com') || socialUrl.includes('youtu.be')) {
          // Với YouTube, thử unavatar service trước
          const videoMatch = socialUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          if (videoMatch) {
            const videoId = videoMatch[1];
            setAvatarUrl(`https://img.youtube.com/vi/${videoId}/default.jpg`);
          } else {
            // Với channel, sử dụng ảnh đại diện chung
            setAvatarUrl(`https://www.youtube.com/favicon.ico`);
          }
        }
        else if (socialUrl.includes('tiktok.com')) {
          const usernameMatch = socialUrl.match(/tiktok\.com\/@([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];
            // Sử dụng unavatar cho TikTok
            setAvatarUrl(`https://unavatar.io/tiktok/${username}`);
          }
        }
        else if (socialUrl.includes('soundcloud.com')) {
          const usernameMatch = socialUrl.match(/soundcloud\.com\/([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];
            setAvatarUrl(`https://unavatar.io/soundcloud/${username}`);
          }
        }
        else if (socialUrl.includes('pinterest.com')) {
          const usernameMatch = socialUrl.match(/pinterest\.com\/([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];
            setAvatarUrl(`https://unavatar.io/pinterest/${username}`);
          }
        }
        else if (socialUrl.includes('instagram.com')) {
          const usernameMatch = socialUrl.match(/instagram\.com\/([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];
            setAvatarUrl(`https://unavatar.io/instagram/${username}`);
          }
        }
        else if (socialUrl.includes('twitter.com') || socialUrl.includes('x.com')) {
          const usernameMatch = socialUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];
            setAvatarUrl(`https://unavatar.io/twitter/${username}`);
          }
        }
        else if (socialUrl.includes('facebook.com')) {
          const usernameMatch = socialUrl.match(/facebook\.com\/([^\/\?]+)/);
          if (usernameMatch) {
            const username = usernameMatch[1];
            setAvatarUrl(`https://unavatar.io/facebook/${username}`);
          }
        }
        // Nếu không match được platform nào hoặc unavatar không hoạt động
        else {
          setAvatarUrl(null);
        }
      } catch (error) {
        console.error('Error getting social avatar:', error);
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      getSocialAvatar(url);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [url]);

  return (
    <div className="absolute top-[11px] left-[11px] w-[18px] h-[18px] rounded-full overflow-hidden bg-white flex items-center justify-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="w-full h-full object-cover"
          onError={() => setAvatarUrl(null)} // Fallback nếu ảnh lỗi
        />
      ) : (
        <span className="text-lg">{icon}</span>
      )}
    </div>
  );
};

const PublicPortfolioPage = (): JSX.Element => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      if (!username) {
        setError("Không tìm thấy username");
        setLoading(false);
        return;
      }

      try {
        const portfolioData = await getPortfolioByUsername(username);
        setPortfolio(portfolioData);
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [username]);

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
        if (typeof value === 'object' && value !== null && value.url) {
          return {
            id: `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            url: value.url,
            clicks: 0,
            isEnabled: true,
            color: "#6e6e6e",
            icon: "🔗",
            displayName: value.displayName || key.charAt(0).toUpperCase() + key.slice(1),
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
          displayName: key.charAt(0).toUpperCase() + key.slice(1),
        };
      }).filter(link => link.isEnabled && link.url)
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
            <div className="text-sm text-gray-600">
              Portfolio của @{username}
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
                  @{portfolio.username || username}
                </div>

                {/* Bio section */}
                {portfolio.bio && (
                  <div className="mt-4 mx-6">
                    <div className="relative w-full min-h-[60px] flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-full min-h-[60px] bg-white rounded-[10px] shadow-[0px_0px_58px_12px_#c76a6a40]" />
                      <div className="relative w-full px-4 py-3 text-center">
                        <div className="[font-family:'Itim',Helvetica] font-normal text-pink-600 text-sm tracking-[1.40px] leading-relaxed">
                          {portfolio.bio}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="px-6 pb-8">
                  <div className="flex flex-col items-center gap-3">
                    {socialLinks.map((link, index) => (
                      <div key={link.id || index} className="w-full max-w-[212px]">
                        <Button
                          variant="outline"
                          className="w-full h-[45px] rounded-[10px] border-2 border-solid border-pink-200 bg-white/80 hover:bg-white transition-all duration-200 text-gray-700 hover:text-gray-800 font-medium"
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
