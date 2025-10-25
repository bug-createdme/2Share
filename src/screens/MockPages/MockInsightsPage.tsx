// src/screens/MockPages/MockInsightsPage.tsx
import React from "react";
import { Eye, Link2, Percent, TrendingUp, Users, Calendar } from "lucide-react";
import { 
  FaInstagram, 
  FaBehance, 
  FaLinkedin, 
  FaFacebook, 
  FaTiktok,
  FaYoutube,
  FaTwitter,
  FaGithub,
  FaDribbble,
  FaSpotify,
  FaPinterest,
  FaSnapchat,
  FaReddit,
  FaTwitch,
  FaDiscord
} from "react-icons/fa";
import InsightsHeader from "../../components/InsightHeader";
import MockSidebar from "../../components/MockSidebar";
import Header from "../../components/Header";

// Mock data từ MockMyLinksPage với bổ sung thêm social links
const mockSocialLinks = [
  {
    id: "1",
    name: "LinkedIn",
    url: "https://linkedin.com/in/username",
    clicks: 45,
    isEnabled: true,
    color: "#0077B5",
    icon: "💼",
    displayName: "LinkedIn"
  },
  {
    id: "2", 
    name: "Behance",
    url: "https://behance.net/username",
    clicks: 23,
    isEnabled: true,
    color: "#1769FF",
    icon: "🎨",
    displayName: "Behance"
  },
  {
    id: "3",
    name: "Instagram",
    url: "https://instagram.com/username",
    clicks: 156,
    isEnabled: true,
    color: "#E4405F",
    icon: "📸",
    displayName: "Instagram"
  },
  {
    id: "4",
    name: "Facebook",
    url: "https://facebook.com/username",
    clicks: 89,
    isEnabled: true,
    color: "#1877F2",
    icon: "👥",
    displayName: "Facebook"
  },
  {
    id: "5",
    name: "TikTok",
    url: "https://tiktok.com/@username",
    clicks: 234,
    isEnabled: true,
    color: "#000000",
    icon: "🎵",
    displayName: "TikTok"
  },
  // Bổ sung thêm social links
];

// Map icon components
const getPlatformIcon = (platformName: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    Instagram: <FaInstagram className="w-6 h-6 text-[#E4405F]" />,
    Behance: <FaBehance className="w-6 h-6 text-[#1769FF]" />,
    LinkedIn: <FaLinkedin className="w-6 h-6 text-[#0077B5]" />,
    Facebook: <FaFacebook className="w-6 h-6 text-[#1877F2]" />,
    TikTok: <FaTiktok className="w-6 h-6 text-black" />,
    YouTube: <FaYoutube className="w-6 h-6 text-[#FF0000]" />,
    Twitter: <FaTwitter className="w-6 h-6 text-[#1DA1F2]" />,
    GitHub: <FaGithub className="w-6 h-6 text-[#333333]" />,
    Dribbble: <FaDribbble className="w-6 h-6 text-[#EA4C89]" />,
    Spotify: <FaSpotify className="w-6 h-6 text-[#1DB954]" />,
    Pinterest: <FaPinterest className="w-6 h-6 text-[#BD081C]" />,
    Snapchat: <FaSnapchat className="w-6 h-6 text-[#FFFC00]" />,
    Reddit: <FaReddit className="w-6 h-6 text-[#FF4500]" />,
    Twitch: <FaTwitch className="w-6 h-6 text-[#9146FF]" />,
    Discord: <FaDiscord className="w-6 h-6 text-[#5865F2]" />
  };
  return iconMap[platformName] || <Link2 className="w-6 h-6 text-gray-600" />;
};

const MockInsightsPage: React.FC = () => {
  // Mock user data
  const mockUser = {
    _id: "1",
    username: "username_123",
    name: "User Name",
    avatar_url: "/images/profile-pictures/pfp.jpg",
    email: "user@example.com"
  };

  // Tính toán tổng số liệu
  const totalClicks = mockSocialLinks.reduce((sum, link) => sum + link.clicks, 0);
  const totalViews = 1250; // Mock total views
  const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  // Sắp xếp platforms theo số lượt click giảm dần
  const sortedPlatforms = [...mockSocialLinks]
    .filter(link => link.isEnabled)
    .sort((a, b) => b.clicks - a.clicks);

  // Tìm platform có lượt click cao nhất để tính phần trăm
  const maxClicks = Math.max(...sortedPlatforms.map(p => p.clicks));

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-spartan">
      <Header />

      <div className="flex pt-20">
        {/* Mock Sidebar */}
        <div className="fixed top-0 left-0 h-full min-h-screen w-[265px] bg-white border-r border-[#d9d9d9] flex-shrink-0 flex flex-col z-20">
          <MockSidebar user={mockUser} />
        </div>

        {/* Main Content */}
        <div className="ml-[265px] flex-1 px-10 py-8 text-gray-800">
          <InsightsHeader />

          {/* Tổng quát Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Tổng quát</h2>
            <div className="grid grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                <Eye className="w-8 h-8 mb-3 text-blue-600" />
                <p className="text-2xl font-bold text-gray-800">{totalViews.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Lượt xem</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                <Link2 className="w-8 h-8 mb-3 text-green-600" />
                <p className="text-2xl font-bold text-gray-800">{totalClicks.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Lượt bấm</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
                <Percent className="w-8 h-8 mb-3 text-purple-600" />
                <p className="text-2xl font-bold text-gray-800">{clickThroughRate}%</p>
                <p className="text-gray-600 text-sm">Tỉ lệ bấm</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl">
                <TrendingUp className="w-8 h-8 mb-3 text-orange-600" />
                <p className="text-2xl font-bold text-gray-800">+12.5%</p>
                <p className="text-gray-600 text-sm">Tăng trưởng</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Người dùng hoạt động</span>
                </div>
                <span className="font-semibold">892</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Hôm nay</span>
                </div>
                <span className="font-semibold">47 lượt bấm</span>
              </div>
            </div>
          </section>

          {/* Nội dung Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Hiệu suất theo nền tảng</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Tổng: {totalClicks} lượt bấm</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {sortedPlatforms.map((platform, index) => {
                const percentage = maxClicks > 0 ? Math.round((platform.clicks / maxClicks) * 100) : 0;
                const progressColor = platform.clicks === maxClicks ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gradient-to-r from-blue-400 to-blue-300";
                
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between border border-gray-200 rounded-2xl px-6 py-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Left: Rank + Icon + Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        {getPlatformIcon(platform.name)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{platform.displayName}</span>
                        <p className="text-gray-500 text-sm">{platform.url.replace('https://', '')}</p>
                      </div>
                    </div>

                    {/* Right: Click count + Progress bar */}
                    <div className="flex items-center gap-6 w-1/3 justify-end">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{platform.clicks}</p>
                        <p className="text-gray-500 text-sm">Lượt bấm</p>
                      </div>
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">TikTok</p>
                  <p className="text-gray-600 text-sm">Nền tảng hàng đầu</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">234</p>
                  <p className="text-gray-600 text-sm">Lượt bấm cao nhất</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">10</p>
                  <p className="text-gray-600 text-sm">Nền tảng đang hoạt động</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 mt-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Hoạt động gần đây</h2>
            <div className="space-y-4">
              {[
                { platform: "TikTok", clicks: 15, time: "2 giờ trước" },
                { platform: "Instagram", clicks: 8, time: "4 giờ trước" },
                { platform: "YouTube", clicks: 12, time: "6 giờ trước" },
                { platform: "LinkedIn", clicks: 5, time: "8 giờ trước" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(activity.platform)}
                    <span className="font-medium">{activity.platform}</span>
                    <span className="text-gray-500">đã nhận</span>
                    <span className="font-semibold text-green-600">+{activity.clicks} lượt bấm</span>
                  </div>
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MockInsightsPage;