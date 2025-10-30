import React, { useEffect, useState } from "react";
import { Eye, Link2, Percent } from "lucide-react";
import { FaInstagram, FaBehance, FaLinkedin, FaFacebook, FaTwitter, FaGithub, FaYoutube, FaTiktok } from "react-icons/fa";
import InsightsHeader from "../components/InsightHeader";
import Sidebar from "../components/Sidebar";
import { getMyAnalytics, type AnalyticsData } from "../lib/api";

// Map icon names to React Icons
const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'instagram': <FaInstagram className="w-6 h-6" />,
    'behance': <FaBehance className="w-6 h-6" />,
    'linkedin': <FaLinkedin className="w-6 h-6" />,
    'facebook': <FaFacebook className="w-6 h-6" />,
    'twitter': <FaTwitter className="w-6 h-6" />,
    'github': <FaGithub className="w-6 h-6" />,
    'youtube': <FaYoutube className="w-6 h-6" />,
    'tiktok': <FaTiktok className="w-6 h-6" />,
  };
  
  const key = iconName?.toLowerCase() || '';
  return iconMap[key] || <Link2 className="w-6 h-6" />;
};

const InsightsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const data = await getMyAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Lỗi khi tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // Calculate max clicks for progress bar scaling
  const maxClicks = analytics?.socialStats.reduce((max, stat) => Math.max(max, stat.clicks), 0) || 1;

  return (
    <div className="ml-64 mt-20 bg-[#f9f9f9] min-h-screen px-10 py-8 text-gray-800 font-spartan">
      <InsightsHeader />
      <div>
        <Sidebar />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Đang tải dữ liệu thống kê...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Tổng quát Section */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Tổng quát</h2>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Eye className="w-5 h-5 mb-2 text-gray-700" />
                  <p className="text-gray-600 text-sm">{analytics?.totalViews || 0} Lượt xem</p>
                </div>
                <div className="flex flex-col items-center">
                  <Link2 className="w-5 h-5 mb-2 text-gray-700" />
                  <p className="text-gray-600 text-sm">{analytics?.totalClicks || 0} Lượt bấm</p>
                </div>
                <div className="flex flex-col items-center">
                  <Percent className="w-5 h-5 mb-2 text-gray-700" />
                  <p className="text-gray-600 text-sm">{analytics?.clickRate.toFixed(1) || 0}% Tỉ lệ bấm</p>
                </div>
              </div>
            </section>

            {/* Nội dung Section */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Nội dung</h2>

              {analytics?.socialStats && analytics.socialStats.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {analytics.socialStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50 transition"
                    >
                      {/* Left: Icon + Name */}
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center text-gray-800">
                          {getIconComponent(stat.name)}
                        </div>
                        <span className="font-medium">{stat.displayName || stat.name}</span>
                      </div>

                      {/* Right: Click count + Progress bar */}
                      <div className="flex items-center gap-4 w-1/3 justify-end">
                        <p className="text-gray-500 text-sm whitespace-nowrap">{stat.clicks} Lượt bấm</p>
                        <div className="w-28 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8A9EFF] rounded-full transition-all duration-300"
                            style={{ width: `${maxClicks > 0 ? (stat.clicks / maxClicks) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có dữ liệu thống kê</p>
                  <p className="text-sm mt-2">Thêm các liên kết mạng xã hội để bắt đầu theo dõi</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
