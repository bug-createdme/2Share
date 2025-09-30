import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import {
  Settings,
  Upload,
  GalleryHorizontalEnd,
  Plus,
  Zap,
} from "lucide-react";

const PortfolioDesignPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState("coral");
  const [selectedProfile, setSelectedProfile] = useState(0);
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
  return (
    <div className="min-h-screen bg-gray-50 font-spartan">
      {/* Header */}
      <header
        className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 px-6 py-4 z-50" // ⭐ changed: fixed header
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">2Share của tôi</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-xl hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span className="">Chia sẻ</span>
            </button>
            <button className="p-3 border border-gray-400 rounded-xl hover:bg-gray-50">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        <Sidebar />

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
                        {/* avatar mock */}
                        <div className="w-8 h-8 bg-gray-50 rounded-lg mb-2 flex flex-col items-center justify-end">
                        <div
                            className={`w-3 h-3 rounded-full ${avatarColors[selectedTheme]}`}
                        />
                        <div
                            className={`w-5 h-2 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`}
                        />
                        </div>

                        {/* mock text lines */}
                        <div className="w-10 h-2 bg-white rounded mb-1"></div>
                        <div className="w-16 h-2 bg-white rounded mb-2"></div>

                        {/* mock button */}
                        <div className="w-16 h-6 bg-white rounded"></div>
                    </div>
                    );
                })}
                </div>

                <button className="w-full p-4 border border-gray-400 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50">
                <GalleryHorizontalEnd className="w-6 h-6" />
                <span className=" text-lg">Chỉnh hình ảnh</span>
                </button>
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
                        <div className="w-24 h-32 border-2 border-dashed border-gray-400 rounded-2xl bg-white flex flex-col items-center justify-center mb-2">
                            <GalleryHorizontalEnd className="w-8 h-8 text-gray-400 mb-2" />
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm ">
                            <Plus className="w-3 h-3" />
                            Hình ảnh
                        </div>
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

                        {/* Stripes Pattern */}
                        <div className="text-center">
                        <div className="w-24 h-32 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
                            <div className="absolute inset-0">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                key={i}
                                className="absolute w-full h-1 bg-white opacity-30 transform rotate-45"
                                style={{ top: `${i * 15}%` }}
                                />
                            ))}
                            </div>
                        </div>
                        <span className="text-sm ">Kẻ sọc</span>
                        </div>
                    </div>
                    </div>
                </div>
                </section>



              {/* Style Section */}
              <section>
              <div className="bg-white rounded-3xl border border-gray-400 p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold  mb-6">Kiểu</h3>
                
                {/* Tab buttons */}
                <div className="flex border-b border-gray-300 mb-6">
                  <button className="px-6 py-3 font-bold  border-b-2 border-black">
                    Chữ viết
                  </button>
                  <button className="px-6 py-3 font-bold  text-gray-500">
                    Nút
                  </button>
                </div>

                {/* Font Selection */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm  mb-2">Phông chữ</label>
                    <div className="w-full p-4 bg-gray-200 rounded-2xl">
                      <span className="font-bold ">Carlito</span>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm  mb-2">Màu chữ viết trên trang</label>
                    <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                      <div className="w-5 h-5 bg-black rounded"></div>
                      <span className="font-bold ">#000000</span>
                    </div>
                  </div>

                  {/* Button Text Color */}
                  <div>
                    <label className="block text-sm  mb-2">Màu chữ viết trên nút</label>
                    <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                      <div className="w-5 h-5 bg-black rounded"></div>
                      <span className="font-bold ">#000000</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Mobile Preview */}
        <div
          className="w-70 py-4 px-20 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-hidden z-40" // ⭐ changed: fixed preview, removed scroll
        >
          <div
            className={`w-60 h-[580px] bg-gradient-to-br ${themeClasses[selectedTheme]} 
            rounded-3xl border-4 border-gray-600 p-6 relative overflow-hidden mt-20`} // ⭐ mt-20 to drop below header
          >
            {/* Profile Section */}
            <div className="mt-8 text-center">
            <div className="w-20 h-20 bg-white/90 rounded-2xl mx-auto mb-4 flex flex-col items-center justify-end shadow-lg">
                <div className={`w-7 h-7 rounded-full ${avatarColors[selectedTheme]}`} />
                <div className={`w-12 h-6 rounded-t-full mt-1 ${avatarColors[selectedTheme]}`} />
            </div>
            <h3 className="text-white text-sm tracking-wide">username_123</h3>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-3 mt-4 mb-4">
            {["♪", "in", "📷", "f", "Be"].map((icon, index) => (
                <div
                key={index}
                className="w-4 h-4 bg-white rounded flex items-center justify-center text-[10px]"
                >
                {icon}
                </div>
            ))}
            </div>

            {/* Bio */}
            <div className="bg-white/90 rounded-2xl p-3 mb-4 shadow-lg">
            <p className={`text-[10px] leading-relaxed ${textColors[selectedTheme]}`}>
                Mình là username_123, sinh viên thiết kế đồ họa với niềm yêu thích sáng tạo và sự chỉn chu trong từng chi tiết. Mình tập trung vào thiết kế thương hiệu, UI và minh họa số, với mong muốn tạo ra những trải nghiệm có chiều sâu. Theo dõi mình để cùng khám phá hành trình thiết kế và phát triển bản thân mỗi ngày nhé!
            </p>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
            {["LinkedIn", "Behance", "Instagram"].map((platform) => (
                <button
                key={platform}
                className="w-full py-2 bg-white/10 border-2 border-white rounded-2xl text-white text-xs"
                >
                {platform}
                </button>
            ))}
            </div>
        </div>
        </div>

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
