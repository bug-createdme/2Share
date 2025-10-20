import React from "react";
import { Eye, Link2, Percent } from "lucide-react";
import { FaInstagram, FaTiktok, FaBehance, FaLinkedin, FaFacebook } from "react-icons/fa";
import InsightsHeader from "../components/InsightHeader";
import Sidebar from "../components/Sidebar";

const platforms = [
  { name: "Instagram", icon: <FaInstagram className="w-6 h-6" />, clicks: 0 },
  { name: "Behance", icon: <FaBehance className="w-6 h-6" />, clicks: 0 },
  { name: "LinkedIn", icon: <FaLinkedin className="w-6 h-6" />, clicks: 0 },
];

const InsightsPage: React.FC = () => {
  return (
    <div className="ml-64 mt-20 bg-[#f9f9f9] min-h-screen px-10 py-8 text-gray-800 font-spartan">
      <InsightsHeader />
      <div >
              <Sidebar />

      {/* Tổng quát Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tổng quát</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Eye className="w-5 h-5 mb-2 text-gray-700" />
            <p className="text-gray-600 text-sm">0 Lượt xem</p>
          </div>
          <div className="flex flex-col items-center">
            <Link2 className="w-5 h-5 mb-2 text-gray-700" />
            <p className="text-gray-600 text-sm">0 Lượt bấm</p>
          </div>
          <div className="flex flex-col items-center">
            <Percent className="w-5 h-5 mb-2 text-gray-700" />
            <p className="text-gray-600 text-sm">0% Tỉ lệ bấm</p>
          </div>
        </div>
      </section>

      {/* Nội dung Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Nội dung</h2>

        <div className="flex flex-col gap-3">
          {platforms.map((p, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50 transition"
            >
              {/* Left: Icon + Name */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-gray-800">
                  {p.icon}
                </div>
                <span className="font-medium">{p.name}</span>
              </div>

              {/* Right: Click count + Progress bar */}
              <div className="flex items-center gap-4 w-1/3 justify-end">
                <p className="text-gray-500 text-sm whitespace-nowrap">{p.clicks} Lượt bấm</p>
                <div className="w-28 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8A9EFF] rounded-full transition-all duration-300"
                    style={{ width: `${p.clicks}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};

export default InsightsPage;
