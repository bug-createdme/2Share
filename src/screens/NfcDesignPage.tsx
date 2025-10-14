"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NFCCardPreview from "../components/NfcCardPreview";
import { GalleryHorizontalEnd, Plus, Zap } from "lucide-react";

const NfcDesignPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState("coral");

  const avatarColors: Record<string, string> = {
    coral: "bg-[#E7A5A5]",
    green: "bg-green-300",
    dark: "bg-gray-500",
    gradient: "bg-purple-400",
    orange: "bg-orange-400",
  };

  const textColors: Record<string, string> = {
    coral: "text-[#E7A5A5]",
    green: "text-green-400",
    dark: "text-gray-500",
    gradient: "text-purple-400",
    orange: "text-orange-400",
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
      <Header />

      <div className="flex pt-20">
        <Sidebar />

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 ml-72 p-8 overflow-y-auto">
          <div className="flex w-full gap-8 max-w-7xl mx-auto">
            {/* LEFT SECTION - Form content */}
            <div className="flex-1 space-y-8 max-w-2xl">
              {/* SECTION 1: CARD INFO */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Thông tin thẻ</h2>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tên của bạn
                      </label>
                      <input
                        type="text"
                        defaultValue="username_123"
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Lĩnh vực của bạn
                      </label>
                      <input
                        type="text"
                        defaultValue="Thiết kế đồ họa"
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Logo của bạn
                      </label>
                      <button className="w-full p-4 border border-gray-400 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50">
                        <GalleryHorizontalEnd className="w-6 h-6" />
                        <span className="text-lg">Chọn logo hoặc hình ảnh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: THEME */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Chủ đề</h2>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <div className="grid grid-cols-3 gap-6 place-items-center">
                    {/* Custom */}
                    <div className="text-center">
                      <div className="w-36 h-24 border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center mb-2 bg-white">
                        <span className="text-sm">Tự thiết kế</span>
                        <Zap
                          className="w-4 h-4 mt-2"
                          style={{ stroke: "url(#lightning-gradient)" }}
                        />
                      </div>
                    </div>

                    {Object.entries(themeClasses).map(([key, gradient]) => (
                      <div key={key} className="text-center">
                        <div
                          onClick={() => setSelectedTheme(key)}
                          className={`w-36 h-24 bg-gradient-to-br ${gradient} rounded-2xl mb-2 cursor-pointer ${
                            selectedTheme === key
                              ? "ring-2 ring-blue-400 ring-offset-2"
                              : ""
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: BACKGROUND DESIGN */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Giao diện tự thiết kế</h2>
                </div>

                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <h3 className="text-xl font-bold mb-6">Hình nền</h3>
                  <div className="grid grid-cols-3 gap-6 place-items-center">
                    {/* Add Image */}
                    <div className="text-center">
                      <div className="w-36 h-24 border-2 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center mb-2">
                        <GalleryHorizontalEnd className="w-8 h-8 text-gray-400 mb-2" />
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Plus className="w-3 h-3" />
                        Hình ảnh
                      </div>
                    </div>

                    {/* Flat */}
                    <div className="text-center">
                      <div className="w-36 h-24 bg-gray-600 rounded-2xl mb-2"></div>
                      <span className="text-sm">Màu phẳng</span>
                    </div>

                    {/* Gradient */}
                    <div className="text-center">
                      <div className="w-36 h-24 bg-gradient-to-b from-gray-600 to-gray-400 rounded-2xl mb-2"></div>
                      <span className="text-sm">Màu trộn</span>
                    </div>

                    {/* Dots - Alternative */}
                    <div className="text-center">
                      <div className="w-36 h-24 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                          {Array.from({ length: 35 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-white rounded-full"
                              style={{
                                left: `${(i % 7) * 14 + 7}%`,
                                top: `${Math.floor(i / 7) * 22 + 4}%`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm">Chấm bi</span>
                    </div>

                    {/* Stripes - Diagonal */}
                    <div className="text-center">
                      <div className="w-36 h-24 bg-gray-600 rounded-2xl mb-2 relative overflow-hidden">
                        <div className="absolute inset-0">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-40 h-2 bg-white opacity-25 transform -rotate-45"
                              style={{ 
                                top: `${i * 20 - 10}%`,
                                left: `${i * 13 - 40}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm">Kẻ sọc</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: STYLE */}
              <section>
                <div className="bg-white rounded-3xl border border-gray-400 p-8 ml-14">
                  <h3 className="text-xl font-bold mb-6">Kiểu</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm mb-2">Phông chữ</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl">
                        <span className="font-bold">Carlito</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Màu chữ</label>
                      <div className="w-full p-4 bg-gray-200 rounded-2xl flex items-center gap-3">
                        <div className="w-5 h-5 bg-black rounded"></div>
                        <span className="font-bold">#000000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT SECTION: NFC PREVIEW */}
            <div className="flex-shrink-0">
              <NFCCardPreview
                themeClasses={themeClasses}
                avatarColors={avatarColors}
                textColors={textColors}
                selectedTheme={selectedTheme}
                selectedLayout={1}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Lightning gradient */}
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