import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import Header from "../components/Header";
import PhonePreview from "../components/PhonePreview";
import {
  Zap,
} from "lucide-react";
import { FaFillDrip, FaRegCircle } from "react-icons/fa";
import {
  TbBorderCornerSquare,
  TbBorderCornerRounded,
  TbBorderCornerPill,
} from "react-icons/tb";
import { getMyProfile } from "../lib/api";
import { ImageUpload } from "../components/ui/image-upload";

const PortfolioDesignPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [activeTab, setActiveTab] = useState<"text" | "button">("text");
  const [buttonFill, setButtonFill] = useState(0); // 0 = solid, 1 = outline
  const [buttonCorner, setButtonCorner] = useState(1); // 0 = hard, 1 = soft, 2 = round
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

const avatarColors: Record<string, string> = {
  coral: "bg-[#E7A5A5]",
  green: 'bg-green-300',
  dark: 'bg-gray-500',
  gradient: 'bg-purple-400',
  orange: 'bg-orange-400',
};

const textColors: Record<string, string> = {
  coral: 'text-[#E7A5A5]',
  green: 'text-green-400',
  dark: 'text-gray-500',
  gradient: 'text-purple-400',
  orange: 'text-orange-400',
};

  const themeClasses: Record<string, string> = {
    coral: "from-[#E7A5A5] to-[#E7A5A5]",
    green: "from-green-300 to-green-400",
    dark: "from-gray-700 to-gray-800",
    gradient: "from-purple-400 via-blue-400 to-green-400",
    orange: "from-blue-400 to-orange-400",
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
        
        // Load bio
        if (typeof profile.bio === 'string') {
          setBio(profile.bio);
        }
        
        // Load social links
        if (profile.social_links) {
          const links = Object.entries(profile.social_links).map(([key, value]: any) => {
            if (typeof value === 'object' && value !== null && value.id) {
              return {
                ...value,
                name: key.charAt(0).toUpperCase() + key.slice(1),
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
            };
          });
          setSocialLinks(links);
        }
        
        // Load from localStorage if available
        if (profile._id) {
          const localBio = localStorage.getItem(`mylinks_${profile._id}_bio`);
          const localLinks = localStorage.getItem(`mylinks_${profile._id}_socialLinks`);
          if (localBio !== null) setBio(localBio);
          if (localLinks) setSocialLinks(JSON.parse(localLinks));
        }
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải thông tin...</div>;
  }
  if (error || !user) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error || "Không có thông tin người dùng"}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-spartan">
      {/* Header */}
      <Header />

      <div className="flex pt-20">
        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main Content */}
        <main className="flex ml-72 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Section */}
            <section>
            <h2 className="text-2xl font-bold mb-6">Hồ sơ</h2>
            <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <div className="flex justify-center gap-6 mb-8">
  {[0, 1, 2, 3].map((index) => {
    const baseBg =
      selectedProfile === index
        ? "bg-gray-300"
        : "bg-gray-100";

    return (
      <div
        key={index}
        onClick={() => setSelectedProfile(index)}
        className={`
          w-24 h-32 rounded-2xl cursor-pointer transition-all 
          ${baseBg} 
          hover:bg-gray-200
          ${selectedProfile === index ? "border-2 border-blue-400" : "border border-gray-300"}
          flex flex-col items-center justify-start p-3
        `}
      >
        {/* index-specific mini-layout mocks */}
        {index === 0 && (
          <>
            {/* Avatar */}
            <div className="w-8 h-8 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">
              <div className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`} />
              <div className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
            </div>
            {/* Username */}
            <div className="w-10 h-2 bg-white rounded mb-1"></div>
            {/* Socials */}
            <div className="w-16 h-2 bg-white rounded mb-2"></div>
            {/* Bio block */}
            <div className="w-16 h-6 bg-white rounded"></div>
          </>
        )}

        {index === 1 && (
          <>
            {/* Avatar + username/social row */}
            <div className="flex items-center gap-1 mb-2">
              <div className="w-6 h-6 bg-gray-50 rounded-md flex flex-col items-center justify-end">                
                <div className={`w-2 h-2 rounded-full ${avatarColors[selectedTheme]}`} />
                <div className={`w-3 h-1 rounded-t-full mt-0.5 ${avatarColors[selectedTheme]}`} />

              </div>
              <div className="flex flex-col gap-1">
                <div className="w-8 h-2 bg-white rounded"></div>
                <div className="w-10 h-2 bg-white rounded"></div>
              </div>
            </div>
            {/* Bio */}
            <div className="w-full h-6 bg-white rounded mb-2"></div>
            {/* Links */}
            <div className="w-14 h-4 bg-white rounded mb-1"></div>
            <div className="w-14 h-4 bg-white rounded"></div>
          </>
        )}

        {index === 2 && (
          <>
            {/* Username */}
            <div className="w-12 h-2 bg-white rounded mb-1"></div>
            {/* Socials */}
            <div className="w-16 h-2 bg-white rounded mb-2"></div>
            {/* Avatar large middle */}
            <div className="w-12 h-10 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">                
                <div className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`} />
                <div className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />

            </div>
            {/* Bio */}
            <div className="w-full h-6 bg-white rounded mb-2"></div>
            {/* Links */}
            <div className="w-14 h-4 bg-white rounded"></div>
          </>
        )}

        {index === 3 && (
          <>
            {/* Background avatar style */}
            <div className="w-full h-24 bg-gray-200 rounded-xl mb-2 relative flex flex-col items-center justify-center">
              <div className="w-12 h-2 mt-2 bg-white rounded mb-1"></div>
              <div className="w-16 h-2 bg-white rounded mb-2"></div>
              <div className={`w-5 h-5 rounded-full  opacity-70 ${avatarColors[selectedTheme]}`} />
              <div className={`w-8 h-4 rounded-t-full mt-1  opacity-70 ${avatarColors[selectedTheme]}`} />

            </div>
                        
            {/* Link buttons */}
            <div className="w-14 h-4 bg-white rounded mb-1"></div>
          </>
        )}
      </div>
    );
  })}
</div>


                <div className="w-full">
                  <ImageUpload
                    onImageUploaded={(imageUrl) => {
                      console.log('Profile image uploaded:', imageUrl);
                    }}
                    className="w-full"
                    size="md"
                    placeholder="Chỉnh hình ảnh"
                    maxSize={3}
                  />
                </div>
            </div>
            </section>

            {/* Theme Section */}
                <section>
                <h2 className="text-2xl font-bold  mb-6">Chủ đề</h2>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                    <div className="grid grid-cols-3 gap-6 place-items-center">
                    {/* Custom Design */}
                    <div className="text-center">
                        <div className="w-24 h-32 border-2 border-dashed border-gray-400 rounded-2xl bg-white flex flex-col items-center justify-center mb-2">
                        <span className="text-sm ">Tự thiết kế</span>
                        <Zap
                            className="w-4 h-4 mt-2"
                            style={{ stroke: 'url(#lightning-gradient)' }}
                        />
                        </div>
                    </div>

                    {/* Coral Theme */}
                    <div className="text-center">
                        <div
                        onClick={() => setSelectedTheme('coral')}
                        className={`
                            w-24 h-32 bg-gradient-to-br from-[#E7A5A5] to-[#E7A5A5] rounded-2xl mb-2 cursor-pointer
                            ${selectedTheme === 'coral' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                        />
                    </div>

                    {/* Green Theme */}
                    <div className="text-center">
                        <div
                        onClick={() => setSelectedTheme('green')}
                        className={`
                            w-24 h-32 bg-gradient-to-br from-green-300 to-green-400 rounded-2xl mb-2 cursor-pointer
                            ${selectedTheme === 'green' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                        />
                    </div>

                    {/* Dark Theme */}
                    <div className="text-center">
                        <div
                        onClick={() => setSelectedTheme('dark')}
                        className={`
                            w-24 h-32 bg-gray-600 rounded-2xl mb-2 cursor-pointer
                            ${selectedTheme === 'dark' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                        />
                    </div>

                    {/* Gradient Theme */}
                    <div className="text-center">
                        <div
                        onClick={() => setSelectedTheme('gradient')}
                        className={`
                            w-24 h-32 bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 rounded-2xl mb-2 cursor-pointer
                            ${selectedTheme === 'gradient' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                        />
                    </div>

                    {/* Orange Gradient Theme */}
                    <div className="text-center">
                        <div
                        onClick={() => setSelectedTheme('orange')}
                        className={`
                            w-24 h-32 bg-gradient-to-br from-blue-400 to-orange-400 rounded-2xl mb-2 cursor-pointer
                            ${selectedTheme === 'orange' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                        `}
                        />
                    </div>
                    </div>
                </div>
                </section>


            {/* Custom Appearance Section */}   
                <section>
                <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6" />
                    <h2 className="text-2xl font-bold ">Giao diện tự thiết kế</h2>
                </div>

                {/* Background Section */}
                <div className="bg-white rounded-3xl border border-gray-400 p-8 mb-8">
                    <h3 className="text-xl font-bold  mb-6">Hình nền</h3>

                    {/* Boxes in a grid like Figma */}
                    <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-4xl mx-auto">
                    <div className="grid grid-cols-5 gap-6">
                        {/* Add Image */}
                        <div className="text-center">
                          <ImageUpload
                            onImageUploaded={(imageUrl) => {
                              console.log('Background image uploaded:', imageUrl);
                            }}
                            size="md"
                            variant="rounded"
                            className="mb-2"
                            placeholder="Hình ảnh"
                            maxSize={5}
                          />
                        </div>

                        {/* Solid Color */}
                        <div className="text-center">
                        <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2"></div>
                        <span className="text-sm ">Màu phẳng</span>
                        </div>

                        {/* Gradient */}
                        <div className="text-center">
                        <div className="w-24 h-32 bg-gradient-to-b from-gray-600 to-gray-400 rounded-2xl mb-2"></div>
                        <span className="text-sm ">Màu trộn</span>
                        </div>

                        {/* Dots Pattern */}
                        <div className="text-center">
                        <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-30">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                key={i}
                                className="absolute w-2 h-2 bg-white rounded-full"
                                style={{
                                    left: `${(i % 4) * 25 + 10}%`,
                                    top: `${Math.floor(i / 4) * 20 + 10}%`,
                                }}
                                />
                            ))}
                            </div>
                        </div>
                        <span className="text-sm ">Chấm bi</span>
                        </div>

                        {/* Stripes - Diagonal */}
                        <div className="text-center">
                          <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
                            <div className="absolute inset-0">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-40 h-2 bg-white opacity-25 transform -rotate-45"
                                  style={{ 
                                    top: `${i * 18 - 20}%`,
                                    left: `${i * 8 - 50}%`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm">Kẻ sọc</span>
                        </div>
                    </div>
                    </div>
                </div>
                </section>

              {/* Style Section */}
<section>
  <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
    <h3 className="text-xl font-bold mb-6">Kiểu</h3>

    {/* Tabs */}
    <div className="flex border-b border-gray-300 mb-6">
      <button
        onClick={() => setActiveTab("text")}
        className={`px-6 py-3 font-bold transition-all ${
          activeTab === "text"
            ? "border-b-2 border-black text-black"
            : "text-gray-500"
        }`}
      >
        Chữ viết
      </button>
      <button
        onClick={() => setActiveTab("button")}
        className={`px-6 py-3 font-bold transition-all ${
          activeTab === "button"
            ? "border-b-2 border-black text-black"
            : "text-gray-500"
        }`}
      >
        Nút
      </button>
    </div>

    {/* TEXT TAB */}
    {activeTab === "text" && (
      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Phông chữ</label>
          <div className="w-full p-4 bg-gray-200 rounded-2xl">
            <span className="font-bold">Carlito</span>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm mb-2">Màu chữ viết trên trang</label>
          <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
            <div className="w-5 h-5 bg-black rounded"></div>
            <span className="font-bold">#000000</span>
          </div>
        </div>

        {/* Button Text Color */}
        <div>
          <label className="block text-sm mb-2">Màu chữ viết trên nút</label>
          <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
            <div className="w-5 h-5 bg-black rounded"></div>
            <span className="font-bold">#000000</span>
          </div>
        </div>
      </div>
    )}

    {/* BUTTON TAB */}
    {activeTab === "button" && (
  <div className="space-y-8">
    {/* Fill Style */}
    <div>
      <label className="block text-sm mb-2">Tô nền</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: <FaFillDrip size={18} />, label: "Tô khối" },
          { icon: <FaRegCircle size={18} />, label: "Tô viền" },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={() => setButtonFill(i)}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-2xl text-sm font-medium transition-all ${
              buttonFill === i
                ? "bg-gray-300 border border-gray-400"
                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Corner Style */}
    <div>
      <label className="block text-sm mb-2">Góc</label>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <TbBorderCornerSquare size={20} />, label: "Góc cứng" },
          { icon: <TbBorderCornerRounded size={20} />, label: "Góc mềm" },
          { icon: <TbBorderCornerPill size={20} />, label: "Góc tròn" },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={() => setButtonCorner(i)}
            className={`flex flex-col items-center justify-center gap-1 py-1   rounded-2xl text-sm font-medium transition-all ${
              buttonCorner === i
                ? "bg-gray-300 border border-gray-400"
                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Button Color */}
    <div>
      <label className="block text-sm mb-2">Màu nút</label>
      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
        <div className="w-5 h-5 bg-black rounded"></div>
        <span className="font-bold">#000000</span>
      </div>
    </div>
  </div>
)}

  </div>
</section>


          </div>
        </main>

        {/* Mobile Preview */}
        <PhonePreview
          themeClasses={themeClasses}
          textColors={textColors}
          selectedTheme={selectedTheme}
          selectedLayout={selectedProfile + 1} // 🔑 map 0–3 → 1–4
          user={user}
          bio={bio}
          socialLinks={socialLinks}
        />
      </div>

      {/* SVG Gradients */}
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

export default PortfolioDesignPage;
