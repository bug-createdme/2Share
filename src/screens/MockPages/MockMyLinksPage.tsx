import { useState, useRef } from "react";
import { PlusIcon, Camera, Edit2, Save, X } from "lucide-react";

import { Button } from "../../components/ui/button";
import { SocialLinksSection, SocialLink } from "../../screens/MyLinksPage/sections/SocialLinksSection/SocialLinksSection";
import { FaLinkedin, FaBehance, FaInstagram, FaFacebookSquare, FaTiktok } from "react-icons/fa";
import MockSidebar from "../../components/MockSidebar";
import MockHeader from "../../components/MockHeader";

// Mock data
const mockUser = {
  _id: "1",
  username: "Bobby",
  name: "User Name",
  avatar_url: "/images/profile-pictures/pfp.jpg",
  email: "user@example.com"
};

// Danh sách 5 social links có sẵn để chọn - BAN ĐẦU TRỐNG
const availableSocialLinks: SocialLink[] = [
  {
    id: "1",
    name: "LinkedIn",
    url: "",
    clicks: 0,
    isEnabled: false,
    color: "#0077B5",
    icon: "💼",
    displayName: "LinkedIn"
  },
  {
    id: "2", 
    name: "Behance",
    url: "",
    clicks: 0,
    isEnabled: false,
    color: "#1769FF",
    icon: "🎨",
    displayName: "Behance"
  },
  {
    id: "3",
    name: "Instagram",
    url: "",
    clicks: 0,
    isEnabled: false,
    color: "#E4405F",
    icon: "📸",
    displayName: "Instagram"
  },
  {
    id: "4",
    name: "Facebook",
    url: "",
    clicks: 0,
    isEnabled: false,
    color: "#1877F2",
    icon: "👥",
    displayName: "Facebook"
  },
  {
    id: "5",
    name: "TikTok",
    url: "",
    clicks: 0,
    isEnabled: false,
    color: "#000000",
    icon: "🎵",
    displayName: "TikTok"
  }
];

// Mock theme data cho PhonePreview - sử dụng màu coral từ portfolio
const themeClasses: Record<string, string> = {
  coral: "from-[#E7A5A5] to-[#E7A5A5]",
  green: "from-green-300 to-green-400",
  dark: "from-gray-700 to-gray-800",
  gradient: "from-purple-400 via-blue-400 to-green-400",
  orange: "from-blue-400 to-orange-400",
};

export const MockMyLinksPage = (): JSX.Element => {
  const [user, setUser] = useState(mockUser);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [bio, setBio] = useState("Hãy nhập bio của bạn ở đây!");
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State cho inline editing
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editingUsername, setEditingUsername] = useState(user.username);
  const [editingBio, setEditingBio] = useState(bio);

  // Mock selected theme và layout cho preview - sử dụng coral theme từ portfolio
  const [selectedTheme] = useState("coral");

  // Social icons cho phần preview - sử dụng React Icons giống portfolio
  const socialIcons = [
    { name: "LinkedIn", icon: <FaLinkedin className="text-white text-xl" /> },
    { name: "Behance", icon: <FaBehance className="text-white text-xl" /> },
    { name: "Instagram", icon: <FaInstagram className="text-white text-xl" /> },
    { name: "Facebook", icon: <FaFacebookSquare className="text-white text-xl" /> },
    { name: "TikTok", icon: <FaTiktok className="text-white text-xl" /> }
  ];

  // Xử lý upload avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      // Tạo URL tạm thời cho ảnh
      const imageUrl = URL.createObjectURL(file);
      
      // Cập nhật avatar cho user
      setUser(prev => ({
        ...prev,
        avatar_url: imageUrl
      }));

      // Cleanup: có thể thêm logic để revoke URL khi component unmount
    }
  };

  // Mở modal chọn social links
  const handleOpenAddSocialModal = () => {
    setShowAddSocialModal(true);
  };

  // Đóng modal chọn social links
  const handleCloseAddSocialModal = () => {
    setShowAddSocialModal(false);
  };

  // Chọn social link từ modal
  const handleSelectSocialLink = (selectedLink: SocialLink) => {
    // Kiểm tra xem link đã được thêm chưa
    const alreadyAdded = socialLinks.some(link => link.name === selectedLink.name);
    
    if (alreadyAdded) {
      alert(`${selectedLink.name} đã được thêm rồi!`);
      return;
    }

    // Thêm link mới với isEnabled: true và URL trống
    const newLink: SocialLink = {
      ...selectedLink,
      id: `${selectedLink.name}-${Date.now()}`,
      isEnabled: true,
      url: ""
    };

    setSocialLinks(prev => [...prev, newLink]);
    setShowAddSocialModal(false);
  };

  // Xử lý edit username
  const handleStartEditUsername = () => {
    setEditingUsername(user.username);
    setIsEditingUsername(true);
  };

  const handleSaveUsername = () => {
    if (editingUsername.trim()) {
      setUser(prev => ({ ...prev, username: editingUsername.trim() }));
    }
    setIsEditingUsername(false);
  };

  const handleCancelEditUsername = () => {
    setEditingUsername(user.username);
    setIsEditingUsername(false);
  };

  // Xử lý edit bio
  const handleStartEditBio = () => {
    setEditingBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    if (editingBio.trim()) {
      setBio(editingBio.trim());
    }
    setIsEditingBio(false);
  };

  const handleCancelEditBio = () => {
    setEditingBio(bio);
    setIsEditingBio(false);
  };

  // Xử lý key press cho input
  const handleKeyPress = (e: React.KeyboardEvent, onSave: () => void, onCancel: () => void) => {
    if (e.key === 'Enter') {
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  // Lọc social icons chỉ hiển thị những link đã được thêm
  const enabledSocialIcons = socialIcons.filter(social => {
    const link = socialLinks.find(link => link.name === social.name);
    return link;
  });

  return (
    <div className="font-spartan">
      {/* Hidden file input cho avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="fixed top-0 left-0 h-full min-h-screen w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 flex flex-col z-20">
        <MockSidebar user={user} />
      </div>

      <div className="ml-[265px] mr-[395px] bg-[#f7f7f7] min-h-screen flex flex-col items-center">
        <main className="flex-1 w-full flex flex-col items-center pt-20">
          {/* Sử dụng MockHeader thay vì Header gốc */}
          <MockHeader 
            username={user.username}
            avatarUrl={user.avatar_url}
          />

          {/* Content Section */}
          <div className="w-full flex flex-col items-center flex-1">
            <section className="w-full max-w-[700px] flex flex-col items-center px-9 pt-12">
              <div className="flex flex-col items-center gap-4 mb-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar hình vuông bo tròn góc giống portfolio với upload functionality */}
                  <div className="w-24 h-24 rounded-2xl bg-white/50 flex items-center justify-center mb-2 backdrop-blur-sm border border-white/30 relative">
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-20 h-20 rounded-xl object-cover opacity-90"
                    />
                    <button
                      onClick={handleAvatarClick}
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-lg border-2 border-white cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Username với inline editing */}
                  <div className="relative group">
                    {isEditingUsername ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingUsername}
                          onChange={(e) => setEditingUsername(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, handleSaveUsername, handleCancelEditUsername)}
                          className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent text-center"
                          autoFocus
                          maxLength={30}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={handleSaveUsername}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEditUsername}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-semibold text-gray-800 text-center">
                          {user.username}
                        </h1>
                        <button
                          onClick={handleStartEditUsername}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-200 mt-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Bio với inline editing */}
                  <div className="relative group w-full max-w-md">
                    {isEditingBio ? (
                      <div className="bg-white/90 rounded-2xl p-5 shadow-lg backdrop-blur-sm border border-blue-300 w-full max-w-md">
                        <textarea
                          value={editingBio}
                          onChange={(e) => setEditingBio(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, handleSaveBio, handleCancelEditBio)}
                          className="w-[400px] bg-transparent text-gray-700 text-sm leading-relaxed focus:outline-none resize-none min-h-[120px]"
                          rows={4}
                          autoFocus
                          maxLength={160}
                        />
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">
                            {editingBio.length} / 160
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveBio}
                              className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={handleCancelEditBio}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/90 text-gray-700 text-sm rounded-2xl p-5 shadow-lg backdrop-blur-sm border border-white/50 w-full max-w-md text-center relative">
                        <p className="leading-relaxed">
                          {bio}
                        </p>
                        <button
                          onClick={handleStartEditBio}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1 bg-white border border-gray-300 rounded-full text-gray-400 hover:text-gray-600 transition-all duration-200 shadow-sm"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Social Button */}
              <div className="flex gap-3 w-full max-w-[400px] mb-8">
                <Button
                  className="flex-1 h-auto bg-[#639fff] hover:bg-[#5a8fee] rounded-[35px] py-4 flex items-center justify-center gap-2 shadow-lg"
                  onClick={handleOpenAddSocialModal}
                >
                  <PlusIcon className="w-6 h-6 text-white" />
                  <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-xl tracking-[2.00px]">
                    Thêm
                  </span>
                </Button>
              </div>
            </section>

            {/* Social Links Section - CHỈ HIỂN THỊ KHI CÓ LINK */}
            {socialLinks.length > 0 && (
              <section className="w-full max-w-[700px] flex flex-col items-center px-9 mb-10">
                <SocialLinksSection 
                  socialLinks={socialLinks} 
                  setSocialLinks={setSocialLinks} 
                />
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Sidebar phải - Phone Preview với real-time updates */}
      <div className="fixed top-0 right-0 h-full min-h-screen w-[395px] bg-white border-l border-[#d9d9d9] flex-shrink-0 z-20">
        <div className="w-70 py-4 px-20 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-hidden z-40">
          <div
            className={`w-60 h-[580px] bg-gradient-to-br ${themeClasses[selectedTheme]} 
              rounded-3xl border-4 border-gray-600 p-6 relative overflow-hidden mt-20`}
          >
            {/* Layout 1: Avatar ở trên, centered với social icons */}
            <div className="flex flex-col items-center gap-4 mt-6">
              {/* Avatar - ĐƯỢC ĐỒNG BỘ TỰ ĐỘNG */}
              <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <img
                  src={user.avatar_url} // Sử dụng cùng avatar_url từ state
                  alt="avatar"
                  className="w-14 h-14 rounded-xl object-cover opacity-90"
                />
              </div>
              
              {/* Username */}
              <h3 className="text-white text-sm font-bold tracking-wide">{user.username}</h3>

              {/* SOCIAL ICONS ROW - CHỈ HIỂN THỊ KHI CÓ LINK */}
              {enabledSocialIcons.length > 0 && (
                <div className="flex gap-2 justify-center mb-2">
                  {enabledSocialIcons.map((social) => (
                    <div 
                      key={social.name}
                      className="hover:opacity-80 transition-transform hover:scale-110 w-4 h-4 flex items-center justify-center"
                      title={social.name}
                    >
                      {social.icon}
                    </div>
                  ))}
                </div>
              )}

              {/* Bio Section */}
              <div className="relative w-full flex items-center justify-center">
                <div className="w-full bg-white rounded-[12px] shadow-lg p-3 min-h-0">
                  <p className="text-[10px] leading-relaxed text-gray-600 text-center break-words"
                     style={{ wordBreak: 'break-word' }}>
                    {bio}
                  </p>
                </div>
              </div>

              {/* Links - CHỈ HIỂN THỊ KHI CÓ LINK VÀ CÓ URL */}
              <div className="space-y-2 w-full mt-2">
                {socialLinks
                  .filter(link => link.url) // Chỉ hiển thị link có URL
                  .map((link) => (
                    <button
                      key={link.id}
                      className="w-full py-1.5 bg-white/20 border border-white/30 rounded-[12px] text-white text-[12px] font-medium hover:bg-white/30 transition-colors"
                    >
                      {link.displayName || link.name}
                    </button>
                  ))}
                
                {/* Hiển thị thông báo khi không có link nào có URL */}
                {socialLinks.filter(link => link.url).length === 0 && socialLinks.length > 0 && (
                  <div className="text-center py-4">
                    <p className="text-white/70 text-[10px] italic">
                      Chưa có link nào được thiết lập URL
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn social links */}
      {showAddSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={handleCloseAddSocialModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500 text-xl leading-none">×</span>
            </button>
            
            <h3 className="text-lg font-bold mb-4 text-center">Chọn Social Link</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Chọn một social link để thêm vào trang của bạn ({socialLinks.length}/5)
            </p>
            
            <div className="space-y-3">
              {availableSocialLinks
                .filter(link => !socialLinks.some(addedLink => addedLink.name === link.name))
                .map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleSelectSocialLink(link)}
                    className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: link.color }}
                    >
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{link.displayName}</p>
                      <p className="text-gray-500 text-sm">Thêm {link.displayName} vào trang</p>
                    </div>
                    <PlusIcon className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};