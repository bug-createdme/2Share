// ...existing code...
import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Component để lấy và hiển thị avatar từ social link
const SocialAvatar = ({ url, name, icon }: { url: string; name: string; icon: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);


  useEffect(() => {
    if (!url) { setAvatarUrl(null); setCandidates([]); setIdx(0); return; }

    const getSocialAvatar = async (socialUrl: string) => {
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
          const normalized = socialUrl.replace('m.facebook.com', 'www.facebook.com');
          const list: string[] = [];
          try {
            const u = new URL(normalized);
            const idParam = u.searchParams.get('id');
            if (u.pathname.includes('profile.php') && idParam) {
              list.push(`https://graph.facebook.com/${idParam}/picture?type=large&width=128&height=128`);
              list.push(`https://unavatar.io/facebook/${idParam}`);
            }
            const parts = u.pathname.split('/').filter(Boolean);
            const numericId = parts.find(p => /^\d+$/.test(p));
            if (numericId) {
              list.push(`https://graph.facebook.com/${numericId}/picture?type=large&width=128&height=128`);
              list.push(`https://unavatar.io/facebook/${numericId}`);
            }
            if (parts[0]) list.push(`https://unavatar.io/facebook/${parts[0]}`);
          } catch {
            const m = normalized.match(/facebook\.com\/([^\/\?]+)/);
            if (m) list.push(`https://unavatar.io/facebook/${m[1]}`);
          }
          // Always add favicon as a last resort
          list.push('https://www.google.com/s2/favicons?domain=facebook.com&sz=128');
          setCandidates(list);
          setIdx(0);
          setAvatarUrl(list[0] || null);
        }
        // Nếu không match được platform nào hoặc unavatar không hoạt động
        else {
          setAvatarUrl(null);
        }
      } catch (error) {
        console.error('Error getting social avatar:', error);
        setAvatarUrl(null);
      }
    };

    const debounceTimer = setTimeout(() => { getSocialAvatar(url); }, 300);

    return () => clearTimeout(debounceTimer);
  }, [url]);

  // Advance to next candidate if the current image errors
  const handleImgError = () => {
    if (idx + 1 < candidates.length) {
      setIdx(idx + 1);
      setAvatarUrl(candidates[idx + 1]);
    } else {
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
          onError={handleImgError} // thử nguồn khác nếu ảnh lỗi
        />
      ) : (
        <span className="text-lg">{icon}</span>
      )}
    </div>
  );
};

export const ProfilePictureSection = ({ user, bio, socialLinks, portfolioTitle }: { user: any; bio: string; socialLinks: import("../SocialLinksSection/SocialLinksSection").SocialLink[]; portfolioTitle?: string }): JSX.Element => {
  return (
    <div className="w-[300px] h-[650px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
      <Card className="w-full h-full bg-[#e7a5a5] rounded-[25px] border-none shadow-xl overflow-hidden">
        <CardContent
          className="flex flex-col p-0 h-full custom-scrollbar"
          style={{ maxHeight: 600, overflowY: 'auto' }}
        >
          <div className="flex flex-col items-center mt-[40px]">
            <div className="flex flex-col items-center">
              <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center border border-[#e0e0e0]">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  src={user.avatar_url || "https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-2.png"}
                />
              </div>
              <div className="mt-4 font-bold text-lg text-[#222] tracking-wide text-center">
                {portfolioTitle || "My Portfolio"}
              </div>
            </div>
          </div>

          {/* Đã xoá các hình social phía trên avatar */}

          <div className="flex justify-center mt-[20.6px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            <div className="relative w-[212px] min-h-[60px] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-[210px] min-h-[60px] bg-white rounded-[10px] shadow-[0px_0px_58px_12px_#c76a6a40]" />
              <div
                className="relative w-[180px] [font-family:'Itim',Helvetica] font-normal text-[#e28e8e] text-sm tracking-[1.40px] leading-[normal] transition-all duration-200 px-2 py-1"
                style={{ minHeight: 20, maxHeight: 60, overflowY: 'auto', height: 'auto', wordBreak: 'break-word' }}
              >
                {bio}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6 gap-[4.9px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
            {socialLinks.map((link, index) => (
              <div key={index} className="w-[212px] h-[39.09px] relative">
                <Button
                  variant="outline"
                  className="w-[210px] h-[39px] rounded-[10px] border-2 border-solid border-white bg-transparent hover:bg-white/10 transition-colors"
                  onClick={() => {
                    if (link.url && link.isEnabled) {
                      // Tăng số lượt click
                      window.dispatchEvent(new CustomEvent('increase-click', {
                        detail: { id: link.id }
                      }));
                      // Mở link trong tab mới
                      window.open(link.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  disabled={!link.url || !link.isEnabled}
                  style={{
                    cursor: link.url && link.isEnabled ? 'pointer' : 'not-allowed',
                    opacity: link.url && link.isEnabled ? 1 : 0.5
                  }}
                >
                  <SocialAvatar url={link.url} name={link.name} icon={link.icon} />
                  <span className="[font-family:'Itim',Helvetica] font-normal text-white text-sm tracking-[1.40px] leading-[normal]">
                    {link.displayName || link.name}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
