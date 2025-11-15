"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NFCCardPreview from "../components/NfcCardPreview";
import { Zap, Lock, Unlock, ChevronDown, Sparkles, Search } from "lucide-react";
import { getMyProfile } from "../lib/api";
import { ImageUpload } from "../components/ui/image-upload";

interface MbtiTemplate {
  id: string;
  name: string;
  group: string;
  groupVi: string;
  previewUrl: string;
  isLocked: boolean;
}

const NfcDesignPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [userName, setUserName] = useState("username_123");
  const [userCategory, setUserCategory] = useState("Thiết kế đồ họa");
  const [selectedMbtiTemplate, setSelectedMbtiTemplate] = useState<MbtiTemplate | null>(null);
  const [showMbtiDropdown, setShowMbtiDropdown] = useState(false);
  const [userMbti, setUserMbti] = useState("");
  const [searchMbti, setSearchMbti] = useState("");

  // Danh sách đầy đủ 16 MBTI templates với đường dẫn đúng
  const [mbtiTemplates, setMbtiTemplates] = useState<MbtiTemplate[]>([
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const themeClasses: Record<string, string> = {
    coral: "from-[#E7A5A5] to-[#E7A5A5]",
    green: "from-green-300 to-green-400", 
    dark: "from-gray-700 to-gray-800",
    gradient: "from-purple-400 via-blue-400 to-green-400",
    orange: "from-blue-400 to-orange-400",
  };

  // Lọc MBTI templates theo search
  const filteredMbtiTemplates = mbtiTemplates.filter(template =>
    template.id.toLowerCase().includes(searchMbti.toLowerCase()) ||
    template.groupVi.toLowerCase().includes(searchMbti.toLowerCase())
  );

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
        
        // Mở khóa tất cả MBTI templates để test
        const updatedTemplates = mbtiTemplates.map(template => ({
          ...template,
          isLocked: false
        }));
        setMbtiTemplates(updatedTemplates);

      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải thông tin...</div>;
  }
  if (error || !user) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error || "Không có thông tin người dùng"}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-spartan">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-30 bg-white rounded-lg p-2 shadow-md border border-gray-200 hover:bg-gray-50"
        onClick={() => setShowMobileSidebar(true)}
        aria-label="Mở menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {showMobileSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - Desktop fixed, Mobile slide-in */}
      <div className="hidden lg:block fixed top-0 left-0 h-full min-h-screen w-[200px] xl:w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 z-20">
        <Sidebar user={user} />
      </div>

      {/* Mobile slide-in sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white border-r border-[#d9d9d9] z-40 transition-transform duration-300 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar user={user} />
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          aria-label="Đóng menu"
          onClick={() => setShowMobileSidebar(false)}
        >
          <span className="text-gray-600 text-xl leading-none">×</span>
        </button>
      </div>

      {/* Header - Full width on desktop */}
      <Header title="Thiết kế thẻ NFC" />

      <div className="flex pt-16 sm:pt-20 lg:ml-[200px] xl:ml-[265px]">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex w-full gap-8 max-w-7xl mx-auto">
            <div className="flex-1 space-y-8 max-w-2xl">
              {/* SECTION 3: MBTI TEMPLATES - ĐƠN GIẢN & GỌN GÀNG */}
              <section>
                <div className="flex items-center gap-3 mb-6">
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
                        
                      {/* Dropdown MBTI - Z-INDEX CAO ĐỂ NẰM TRÊN CÁC THẺ */}
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
                                            ? 'bg-[#a259ff] text-white shadow-md ring-2 ring-[#a259ff] ring-opacity-50' // Highlight khi đang chọn
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

                    {/* Preview MBTI Templates (Xếp chồng - CẢ NHÓM CĂN GIỮA) */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Đại diện 4 nhóm tính cách</label>
                      <div className="relative h-32 flex justify-center">
                        {/* Container cho cả nhóm 4 thẻ - CĂN GIỮA TOÀN BỘ NHÓM */}
                        <div className="relative" style={{ width: '140px' }}> {/* Width = (4 thẻ * 28px khoảng cách) */}
                          {/* 4 thẻ đại diện cho 4 nhóm - CẢ NHÓM CĂN GIỮA */}
                          {groupRepresentatives.map((template, index) => (
                            <div
                              key={template.id}
                              className={`absolute top-0 w-24 h-32 rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
                                activeGroupRepresentative?.id === template.id
                                  ? 'border-[#a259ff] z-20 transform scale-110'
                                  : 'border-white z-10 hover:z-30 hover:scale-105'
                              }`}
                              style={{
                                left: `${index * 28}px`, // Mỗi thẻ cách nhau 28px
                                transform: `rotate(${index % 2 === 0 ? '-3' : '3'}deg) ${activeGroupRepresentative?.id === template.id ? 'scale(1.1)' : ''}`,
                              }}
                              onClick={() => handleSelectMbti(template.id)}
                            >
                              {/* Hiển thị hình ảnh thực tế */}
                              <img
                                src={template.previewUrl}
                                alt={`MBTI ${template.name}`}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                  // Fallback nếu hình ảnh không load được
                                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150' viewBox='0 0 100 150'%3E%3Crect width='100' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50' y='75' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'%3E" + template.id + "%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              {/* MBTI Badge */}
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

            {/* RIGHT SECTION: NFC PREVIEW - GIỮ NGUYÊN */}
            <div className="flex-shrink-0">
              <NFCCardPreview
                themeClasses={themeClasses}
                selectedTheme={selectedTheme} 
                userName={userName}
                userCategory={userCategory}
                selectedMbtiTemplate={selectedMbtiTemplate}
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

export default NfcDesignPage;