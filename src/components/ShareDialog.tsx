import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FileText, QrCode, Share2, ExternalLink, ChevronRight, Copy } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  portfolioLink: string;
  anchorRef?: React.RefObject<HTMLElement>;
  username?: string;
  avatarUrl?: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, portfolioLink, anchorRef, username, avatarUrl }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);

  // Rút gọn link hiển thị (chỉ hiển thị domain/username)
  const displayLink = username ? `2share.icu/${username}` : portfolioLink;

  const handleCopy = async () => {
    try {
      // Copy link đầy đủ để có thể paste vào trình duyệt
      await navigator.clipboard.writeText(portfolioLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleShareTo = async () => {
    // Kiểm tra Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Portfolio`,
          text: `Check out my portfolio on 2Share!`,
          url: portfolioLink,
        });
      } catch (err) {
        // User cancelled hoặc lỗi
        console.log('Share cancelled or error:', err);
      }
    } else {
      // Fallback: hiển thị danh sách mạng xã hội
      setShowSocialShare(true);
    }
  };
  useEffect(() => {
    if (open && anchorRef?.current && popoverRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popover = popoverRef.current;
      popover.style.position = 'fixed';
      const width = 350;
      const padding = 8;
      let left = anchorRect.right - width; // align right edges với nút
      // giới hạn trong viewport
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      popover.style.top = `${anchorRect.bottom + padding}px`;
      popover.style.left = `${left}px`;
      popover.style.zIndex = '9999';
    }
  }, [open, anchorRef]);
  // Đóng khi click ra ngoài hoặc nhấn ESC
  useEffect(() => {
    function handleDown(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (anchorRef?.current && anchorRef.current.contains(target)) return;
      onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, anchorRef]);
  if (!open) return null;
  return (
    <div ref={popoverRef} className="bg-white rounded-2xl shadow-xl w-[350px] p-4 border border-gray-200">
      {/* Header */}
      <div className="mb-3">
        <div className="font-semibold text-[15px] text-gray-900">Share your Portfolio</div>
      </div>
      {/* Preview card */}
      <div className="w-full bg-gray-900 rounded-xl p-4 mb-3 text-white relative overflow-hidden">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarUrl} alt={username || 'Avatar'} />
            <AvatarFallback>{username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold leading-none">{username || 'Tên người dùng'}</span>
          </div>
        </div>
        <div className="absolute right-3 bottom-3 bg-white/10 rounded-full p-2">
          <Share2 className="w-4 h-4" />
        </div>
      </div>
      {/* Link row */}
      <div className="w-full flex items-center gap-2 bg-gray-100 rounded-lg p-2 mb-3">
        <input
          readOnly
          value={displayLink}
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
        />
        <Button size="sm" variant={copied ? 'secondary' : 'outline'} onClick={handleCopy}>
          <Copy className="w-4 h-4" />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {/* Action rows */}
      <div className="w-full flex flex-col">
        <RowItem icon={<FileText className="w-4 h-4" />} label="Add to bio" onClick={() => {}} />
        <RowItem icon={<QrCode className="w-4 h-4" />} label="QR code" onClick={() => {}} />
        <RowItem icon={<Share2 className="w-4 h-4" />} label="Share to..." onClick={handleShareTo} />
        <RowItem icon={<ExternalLink className="w-4 h-4" />} label="Open" onClick={() => window.open(portfolioLink, '_blank')} />
      </div>

      {/* Social Share Modal - fallback khi không có Web Share API */}
      {showSocialShare && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50" onClick={() => setShowSocialShare(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-[350px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Share to...</h3>
              <button onClick={() => setShowSocialShare(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <SocialShareButton 
                name="Facebook" 
                icon="📘" 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioLink)}`, '_blank')}
              />
              <SocialShareButton 
                name="Twitter" 
                icon="🐦" 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioLink)}&text=${encodeURIComponent(`Check out my portfolio!`)}`, '_blank')}
              />
              <SocialShareButton 
                name="LinkedIn" 
                icon="💼" 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioLink)}`, '_blank')}
              />
              <SocialShareButton 
                name="WhatsApp" 
                icon="💬" 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my portfolio: ${portfolioLink}`)}`, '_blank')}
              />
              <SocialShareButton 
                name="Telegram" 
                icon="✈️" 
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(portfolioLink)}&text=${encodeURIComponent('Check out my portfolio!')}`, '_blank')}
              />
              <SocialShareButton 
                name="Email" 
                icon="✉️" 
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`Check out my portfolio`)}&body=${encodeURIComponent(portfolioLink)}`, '_self')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RowItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }>
  = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <span className="flex items-center gap-3 text-sm text-gray-700">
      <span className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-700">
        {icon}
      </span>
      {label}
    </span>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </button>
);

const SocialShareButton: React.FC<{ name: string; icon: string; onClick: () => void }>
  = ({ name, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-xs text-gray-600">{name}</span>
  </button>
);

export default ShareDialog;
