// Shared social platform configuration
export interface SocialPlatform {
  name: string;
  color: string;
  img: string;
  desc?: string;
  type?: 'video' | 'audio';
  // Avatar extraction logic
  getAvatarUrl?: (url: string) => string | null;
}

// Social platforms list - Single source of truth
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: 'Instagram',
    color: '#e4405f',
    img: '/images/social/Instagram_icon.png',
    desc: 'Display up to six of your Instagram posts and reels, right on your 2Share page with the Instagram link app.',
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/instagram\.com\/([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1] && usernameMatch[1].length > 0) {
        return `https://unavatar.io/instagram/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128';
    }
  },
  {
    name: 'TikTok',
    color: '#69c9d0',
    img: '/images/social/Tiktok_icon.png',
    desc: 'Share your TikToks directly on your 2Share to gain exposure and followers.',
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/tiktok\.com\/@([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1] && usernameMatch[1].length > 0) {
        return `https://unavatar.io/tiktok/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=128';
    }
  },
  {
    name: 'X',
    color: '#000000',
    img: '/images/social/X_icon.png',
    desc: `Use X app to select your own (or your favorite) posts to display on your 2Share.`,
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/(?:twitter\.com|x\.com)\/([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1]) {
        return `https://unavatar.io/twitter/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=x.com&sz=128';
    }
  },
  {
    name: 'Threads',
    color: '#000000',
    img: '/images/social/Threads_icon.png',
    desc: `Driving your audience to follow you on Threads just got easier.`,
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/threads\.net\/@?([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1]) {
        return `https://unavatar.io/threads/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=threads.net&sz=128';
    }
  },
  {
    name: 'Facebook',
    color: '#1877f3',
    img: '/images/social/Facebook_icon.png',
    desc: 'Show your visitors any Facebook video, right on your 2Share.',
    getAvatarUrl: (url: string) => {
      try {
        const u = new URL(url.replace('m.facebook.com', 'www.facebook.com'));
        // profile.php?id=1234567890
        const idParam = u.searchParams.get('id');
        if (u.pathname.includes('profile.php') && idParam) {
          // Prefer Graph image, then unavatar by id
          return `https://graph.facebook.com/${idParam}/picture?type=large&width=128&height=128`;
        }
        // pages/<page-name>/<page-id> or people/<name>/<id>
        const parts = u.pathname.split('/').filter(Boolean);
        const numericId = parts.find(p => /^\d+$/.test(p));
        if (numericId) {
          return `https://graph.facebook.com/${numericId}/picture?type=large&width=128&height=128`;
        }
        // Fallback to username (first segment)
        const username = parts[0];
        if (username) {
          return `https://unavatar.io/facebook/${username}`;
        }
      } catch {}
      return 'https://www.google.com/s2/favicons?domain=facebook.com&sz=128';
    }
  },
  {
    name: 'Pinterest',
    color: '#e60023',
    img: '/images/social/Pinterest_icon.png',
    desc: `Share what you love on Pinterest so visitors can get inspired.`,
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/pinterest\.com\/([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1]) {
        return `https://unavatar.io/pinterest/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=128';
    }
  },
  {
    name: 'YouTube',
    color: '#ff0000',
    img: '/images/social/Youtube_icon.png',
    desc: 'Show your visitors any YouTube video, right on your 2Share.',
    type: 'video',
    getAvatarUrl: (url: string) => {
      const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (videoMatch && videoMatch[1]) {
        return `https://img.youtube.com/vi/${videoMatch[1]}/default.jpg`;
      }
      return 'https://www.youtube.com/favicon.ico';
    }
  },
  {
    name: 'TikTok Video',
    color: '#69c9d0',
    img: '/images/social/Tiktok_icon.png',
    desc: 'Highlight one of your TikToks or share a TikTok from another creator.',
    type: 'video',
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/tiktok\.com\/@([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1]) {
        return `https://unavatar.io/tiktok/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=128';
    }
  },
  {
    name: 'Spotify',
    color: '#1db954',
    img: '/images/social/Spotify_icon.png',
    desc: `Whether you're an artist ready to show your fans what's new, or a music tastemaker sharing what you're listening to.`,
    type: 'audio',
    getAvatarUrl: (_url: string) => {
      return 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128';
    }
  },
  {
    name: 'SoundCloud',
    color: '#ff5500',
    img: '/images/social/Soundcloud_icon.png',
    desc: `SoundCloud is the world's largest music streaming platform and community.`,
    type: 'audio',
    getAvatarUrl: (url: string) => {
      const usernameMatch = url.match(/soundcloud\.com\/([^\/\?#]+)/);
      if (usernameMatch && usernameMatch[1]) {
        return `https://unavatar.io/soundcloud/${usernameMatch[1]}`;
      }
      return 'https://www.google.com/s2/favicons?domain=soundcloud.com&sz=128';
    }
  },
];

// Helper function to get avatar URL for a social link
export function getSocialAvatarUrl(platformName: string, url: string): string | null {
  if (!url) return null;

  // Normalize platform name (case-insensitive matching)
  const normalizedName = platformName.toLowerCase().trim();
  
  // Find matching platform
  const platform = SOCIAL_PLATFORMS.find(p => 
    p.name.toLowerCase() === normalizedName ||
    p.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(p.name.toLowerCase())
  );

  if (!platform || !platform.getAvatarUrl) {
    console.warn(`⚠️ No avatar handler for platform: ${platformName}`);
    return null;
  }

  try {
    const avatarUrl = platform.getAvatarUrl(url);
    console.log(`✅ Avatar for ${platformName}:`, avatarUrl);
    return avatarUrl;
  } catch (error) {
    console.error(`❌ Error getting avatar for ${platformName}:`, error);
    return null;
  }
}

// Helper to get platform config by name
export function getPlatformByName(name: string): SocialPlatform | undefined {
  const normalizedName = name.toLowerCase().trim();
  return SOCIAL_PLATFORMS.find(p => 
    p.name.toLowerCase() === normalizedName ||
    p.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(p.name.toLowerCase())
  );
}
