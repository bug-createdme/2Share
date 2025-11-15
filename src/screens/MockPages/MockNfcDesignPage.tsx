// src/screens/MockPages/MockNfcDesignPage.tsx
import React, { useState, useEffect, useRef } from "react";
import MockSidebar from "../../components/MockSidebar";
import Header from "../../components/Header";
import NFCCardPreview from "../../components/NfcCardPreview";
import { Zap, ChevronDown, Sparkles, Search, Camera } from "lucide-react";

interface MbtiTemplate {
  id: string;
  name: string;
  group: string;
  groupVi: string;
  previewUrl: string;
  isLocked: boolean;
}

const MockNfcDesignPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [userName, setUserName] = useState("Bobby");
  const [userCategory, setUserCategory] = useState("...");
  const [selectedMbtiTemplate, setSelectedMbtiTemplate] = useState<MbtiTemplate | null>(null);
  const [showMbtiDropdown, setShowMbtiDropdown] = useState(false);
  const [userMbti, setUserMbti] = useState("");
  const [searchMbti, setSearchMbti] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user data
  const mockUser = {
    _id: "1",
    username: "Bobby",
    name: "User Name",
    avatar_url: "/images/profile-pictures/pfp.jpg",
    email: "user@example.com"
  };

  // Danh sách đầy đủ 16 MBTI templates với đường dẫn đúng
  const [mbtiTemplates] = useState<MbtiTemplate[]>([
    // Diplomats
    { id: "ENFJ", name: "ENFJ", group: "Diplomats", groupVi: "Nhà Ngoại giao", previewUrl: "/images/MBTI design/ENFJ.png", isLocked: false },
    { id: "ENFP", name: "ENFP", group: "Diplomats", groupVi: "Nhà Ngoại giao", previewUrl: "/images/MBTI design/ENFP.png", isLocked: false },
    { id: "INFJ", name: "INFJ", group: "Diplomats", groupVi: "Nhà Ngoại giao", previewUrl: "/images/MBTI design/INFJ.png", isLocked: false },
    { id: "INFP", name: "INFP", group: "Diplomats", groupVi: "Nhà Ngoại giao", previewUrl: "/images/MBTI design/INFP.png", isLocked: false },
    
    // Analysts
    { id: "ENTJ", name: "ENTJ", group: "Analysts", groupVi: "Nhà Phân tích", previewUrl: "/images/MBTI design/ENTJ.png", isLocked: false },
    { id: "ENTP", name: "ENTP", group: "Analysts", groupVi: "Nhà Phân tích", previewUrl: "/images/MBTI design/ENTP.png", isLocked: false },
    { id: "INTJ", name: "INTJ", group: "Analysts", groupVi: "Nhà Phân tích", previewUrl: "/images/MBTI design/INTJ.png", isLocked: false },
    { id: "INTP", name: "INTP", group: "Analysts", groupVi: "Nhà Phân tích", previewUrl: "/images/MBTI design/INTP.png", isLocked: false },
    
    // Sentinels
    { id: "ESFJ", name: "ESFJ", group: "Sentinels", groupVi: "Nhà Bảo hộ", previewUrl: "/images/MBTI design/ESFJ.png", isLocked: false },
    { id: "ESTJ", name: "ESTJ", group: "Sentinels", groupVi: "Nhà Bảo hộ", previewUrl: "/images/MBTI design/ESTJ.png", isLocked: false },
    { id: "ISFJ", name: "ISFJ", group: "Sentinels", groupVi: "Nhà Bảo hộ", previewUrl: "/images/MBTI design/ISFJ.png", isLocked: false },
    { id: "ISTJ", name: "ISTJ", group: "Sentinels", groupVi: "Nhà Bảo hộ", previewUrl: "/images/MBTI design/ISTJ.png", isLocked: false },
    
    // Explorers
    { id: "ESFP", name: "ESFP", group: "Explorers", groupVi: "Nhà Thám hiểm", previewUrl: "/images/MBTI design/ESFP.png", isLocked: false },
    { id: "ESTP", name: "ESTP", group: "Explorers", groupVi: "Nhà Thám hiểm", previewUrl: "/images/MBTI design/ESTP.png", isLocked: false },
    { id: "ISFP", name: "ISFP", group: "Explorers", groupVi: "Nhà Thám hiểm", previewUrl: "/images/MBTI design/ISFP.png", isLocked: false },
    { id: "ISTP", name: "ISTP", group: "Explorers", groupVi: "Nhà Thám hiểm", previewUrl: "/images/MBTI design/ISTP.png", isLocked: false },
  ]);

  // 4 thẻ đại diện cho 4 nhóm (lấy template đầu tiên của mỗi nhóm)
  const groupRepresentatives = [
    mbtiTemplates.find(t => t.group === "Diplomats")!,
    mbtiTemplates.find(t => t.group === "Analysts")!,
    mbtiTemplates.find(t => t.group === "Sentinels")!,
    mbtiTemplates.find(t => t.group === "Explorers")!,
  ];

  const themeClasses: Record<string, string> = {
    coral: "from-[#E7A5A5] to-[#E7A5A5]",
    green: "from-green-300 to-green-400", 
    dark: "from-gray-700 to-gray-800",
    gradient: "from-purple-400 via-blue-400 to-green-400",
    orange: "from-blue-400 to-orange-400",
  };

  // Xử lý upload logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setLogoUrl(imageUrl);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup URL khi component unmount
  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  // Lọc MBTI templates theo search
  const filteredMbtiTemplates = mbtiTemplates.filter(template =>
    template.id.toLowerCase().includes(searchMbti.toLowerCase()) ||
    template.groupVi.toLowerCase().includes(searchMbti.toLowerCase())
  );

  const handleSelectMbti = (mbtiType: string) => {
    const template = mbtiTemplates.find(t => t.id === mbtiType);
    if (template) {
      setSelectedMbtiTemplate(template);
      setUserMbti(mbtiType);
      setShowMbtiDropdown(false);
    }
  };

  const handleMbtiInputChange = (value: string) => {
    setUserMbti(value.toUpperCase());
    const template = mbtiTemplates.find(t => t.id === value.toUpperCase());
    if (template) {
      setSelectedMbtiTemplate(template);
    } else {
      setSelectedMbtiTemplate(null);
    }
  };

  // Lấy thẻ đại diện cho nhóm của MBTI đang chọn
  const getActiveGroupRepresentative = () => {
    if (!selectedMbtiTemplate) return null;
    return groupRepresentatives.find(rep => rep.group === selectedMbtiTemplate.group);
  };

  const activeGroupRepresentative = getActiveGroupRepresentative();

  return (
    <div className="min-h-screen bg-gray-50 font-spartan">
      <Header />

      <div className="flex pt-20">
        {/* Sử dụng MockSidebar thay vì Sidebar gốc */}
        <div className="fixed top-0 left-0 h-full min-h-screen w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 flex flex-col z-20">
          <MockSidebar user={mockUser} />
        </div>

        <main className="flex-1 ml-[265px] p-8 overflow-y-auto">
          <div className="flex w-full gap-8 max-w-7xl mx-auto">
            <div className="flex-1 space-y-8 max-w-2xl">
              
              {/* SECTION 1: CARD INFO */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Thông tin thẻ</h2>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên của bạn</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Lĩnh vực của bạn</label>
                      <input
                        type="text"
                        value={userCategory}
                        onChange={(e) => setUserCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Logo của bạn</label>
                      {/* Hidden file input cho logo upload */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <div className="w-full">
                        <div 
                          onClick={handleLogoClick}
                          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-white"
                        >
                          {logoUrl ? (
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center mb-3 relative">
                                <img
                                  src={logoUrl}
                                  alt="Logo đã chọn"
                                  className="w-16 h-16 object-contain rounded-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                  <Camera className="w-3 h-3" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">Nhấn để thay đổi logo</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600">Nhấn để chọn logo từ máy tính</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (tối đa 5MB)</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: THEME */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Chủ đề</h2>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <div className="grid grid-cols-3 gap-6 place-items-center">
                    <div className="text-center">
                      <div className="w-36 h-24 border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center mb-2 bg-white">
                        <span className="text-sm">Tự thiết kế</span>
                        <Zap className="w-4 h-4 mt-2" style={{ stroke: "url(#lightning-gradient)" }} />
                      </div>
                    </div>

                    {Object.entries(themeClasses).map(([key, gradient]) => (
                      <div key={key} className="text-center">
                        <div
                          onClick={() => {
                            setSelectedTheme(key);
                            setSelectedMbtiTemplate(null);
                            setUserMbti("");
                          }}
                          className={`w-36 h-24 bg-gradient-to-br ${gradient} rounded-2xl mb-2 cursor-pointer ${
                            selectedTheme === key && !selectedMbtiTemplate
                              ? "ring-2 ring-blue-400 ring-offset-2"
                              : ""
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: MBTI TEMPLATES */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-[#a259ff]" />
                  <h2 className="text-2xl font-bold">Mẫu MBTI</h2>
                </div>

                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <div className="space-y-6">
                    {/* MBTI Input với Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Chọn tính cách MBTI của bạn
                        <span className="text-xs text-gray-500 ml-2">(16 tính cách)</span>
                      </label>
                      <div className="relative">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userMbti}
                            onChange={(e) => handleMbtiInputChange(e.target.value)}
                            placeholder="VD: ENFJ, INTP, ISTJ..."
                            className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
                            maxLength={4}
                          />
                          <button
                            onClick={() => setShowMbtiDropdown(!showMbtiDropdown)}
                            className="px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform ${showMbtiDropdown ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                      {/* Dropdown MBTI */}
                      {showMbtiDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                          <div className="p-2">
                            {/* Search trong dropdown */}
                            <div className="relative mb-2">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Tìm MBTI..."
                                value={searchMbti}
                                onChange={(e) => setSearchMbti(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a259ff]"
                              />
                            </div>
                            
                            {/* Group MBTI theo loại */}
                            {['Diplomats', 'Analysts', 'Sentinels', 'Explorers'].map(group => {
                              const groupTemplates = filteredMbtiTemplates.filter(t => t.group === group);
                              if (groupTemplates.length === 0) return null;
                              
                              return (
                                <div key={group} className="mb-2">
                                  <p className="text-xs text-gray-500 font-medium px-3 py-1">
                                    {group === 'Diplomats' ? 'Nhà Ngoại giao' : 
                                    group === 'Analysts' ? 'Nhà Phân tích' :
                                    group === 'Sentinels' ? 'Nhà Bảo hộ' : 'Nhà Thám hiểm'}
                                  </p>
                                  <div className="grid grid-cols-4 gap-1">
                                    {groupTemplates.map((template) => (
                                      <button
                                        key={template.id}
                                        onClick={() => handleSelectMbti(template.id)}
                                        className={`p-2 rounded-xl text-sm font-medium transition-all ${
                                          selectedMbtiTemplate?.id === template.id
                                            ? 'bg-[#a259ff] text-white shadow-md ring-2 ring-[#a259ff] ring-opacity-50'
                                            : 'bg-gray-50 text-gray-700 hover:bg-[#a259ff] hover:text-white'
                                        }`}
                                      >
                                        {template.id}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      </div>
                    </div>

                    {/* Preview MBTI Templates */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Đại diện 4 nhóm tính cách</label>
                      <div className="relative h-32 flex justify-center">
                        <div className="relative" style={{ width: '140px' }}>
                          {groupRepresentatives.map((template, index) => (
                            <div
                              key={template.id}
                              className={`absolute top-0 w-24 h-32 rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
                                activeGroupRepresentative?.id === template.id
                                  ? 'border-[#a259ff] z-20 transform scale-110'
                                  : 'border-white z-10 hover:z-30 hover:scale-105'
                              }`}
                              style={{
                                left: `${index * 28}px`,
                                transform: `rotate(${index % 2 === 0 ? '-3' : '3'}deg) ${activeGroupRepresentative?.id === template.id ? 'scale(1.1)' : ''}`,
                              }}
                              onClick={() => handleSelectMbti(template.id)}
                            >
                              <img
                                src={template.previewUrl}
                                alt={`MBTI ${template.name}`}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150' viewBox='0 0 100 150'%3E%3Crect width='100' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50' y='75' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'%3E" + template.id + "%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              <div className="absolute bottom-2 left-2 right-2 text-center">
                                <span className="text-white text-xs font-bold bg-black bg-opacity-70 px-2 py-1 rounded-full backdrop-blur-sm">
                                  {template.id}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Hiển thị thông tin nhóm đang chọn */}
                      {selectedMbtiTemplate && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                          <p className="text-blue-800 text-sm">
                            Đang chọn: <span className="font-semibold">{selectedMbtiTemplate.name}</span> - {selectedMbtiTemplate.groupVi}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Mỗi nhóm có thiết kế độc đáo riêng. Chọn một MBTI để xem trước!
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT SECTION: NFC PREVIEW */}
            <div className="flex-shrink-0">
              <NFCCardPreview
                themeClasses={themeClasses}
                selectedTheme={selectedTheme} 
                userName={userName}
                userCategory={userCategory}
                selectedMbtiTemplate={selectedMbtiTemplate}
                logoUrl={logoUrl} // Truyền logoUrl xuống preview
              />
            </div>
          </div>
        </main>
      </div>

      <svg className="hidden">
        <defs>
          <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6D00D3" />
            <stop offset="100%" stopColor="#FF56FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default MockNfcDesignPage;