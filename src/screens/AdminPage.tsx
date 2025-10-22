import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

interface UserStats {
  result: {
    totalUsers: number;
    newUsersDaily: Array<{ _id: string; count: number }>;
    newUsersMonthly: Array<{ _id: string; count: number }>;
    premiumUsers: number;
    activeUsersDaily: number;
    activeUsersMonthly: number;
  };
}

interface PortfolioStats {
  result: {
    totalPortfolios: number;
    newPortfoliosDaily: Array<{ _id: string; count: number }>;
    avgBlocksPerPortfolio: number;
    nfcCards: number;
    topUsersByPortfolios: Array<{ _id: string; count: number }>;
  };
}

interface RevenueStats {
  result: {
    dailyRevenue: Array<any>;
    monthlyRevenue: Array<any>;
    revenueBySource: Array<any>;
    revenueByGateway: Array<any>;
    txnSuccess: number;
    txnFailed: number;
    ARPU: number;
    activeSubscriptions: number;
    topPlans: Array<any>;
  };
}



const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);

  const [activeTab, setActiveTab] = useState('overview');

  const fetchAllStats = async () => {
    try {
      await Promise.all([
        fetchUserStats(),
        fetchPortfolioStats(),
        fetchRevenueStats(),
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://2share.icu/admins/get-user-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      } else {
        console.error('Failed to fetch user stats:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchPortfolioStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://2share.icu/admins/get-portfolio-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioStats(data);
      } else {
        console.error('Failed to fetch portfolio stats:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://2share.icu/admins/get-revenue-stats?period=week', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRevenueStats(data);
      } else {
        console.error('Failed to fetch revenue stats:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllStats();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Admin</h1>
          <p className="text-gray-600">Chào mừng quay trở lại, {user?.name || user?.email}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="portfolios">Portfolio</TabsTrigger>
            <TabsTrigger value="top-users">Người dùng hàng đầu</TabsTrigger>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats?.result?.totalUsers ?? 'Lỗi tải dữ liệu'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Portfolios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {portfolioStats?.result?.totalPortfolios ?? 'Lỗi tải dữ liệu'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats?.result?.premiumUsers ?? 'Lỗi tải dữ liệu'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tổng số người dùng:</span>
                  <span className="font-semibold">{userStats?.result?.totalUsers ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Người dùng hoạt động hàng ngày:</span>
                  <span className="font-semibold">{userStats?.result?.activeUsersDaily ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Người dùng Premium:</span>
                  <span className="font-semibold">{userStats?.result?.premiumUsers ?? 'Lỗi tải dữ liệu'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Users Daily</CardTitle>
                <CardDescription>Đăng ký người dùng mới hàng ngày</CardDescription>
              </CardHeader>
              <CardContent>
                {userStats?.result?.newUsersDaily && userStats.result.newUsersDaily.length > 0 ? (
                  <div className="space-y-3">
                    {userStats.result.newUsersDaily.map((dailyData, index) => (
                      <div key={dailyData._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">Ngày: {dailyData._id}</div>
                          <div className="text-sm text-gray-500">Ngày {index + 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{dailyData.count}</div>
                          <div className="text-sm text-gray-500">người dùng mới</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có dữ liệu đăng ký hàng ngày
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tổng số Portfolio:</span>
                  <span className="font-semibold">{portfolioStats?.result?.totalPortfolios ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trung bình khối mỗi Portfolio:</span>
                  <span className="font-semibold">{portfolioStats?.result?.avgBlocksPerPortfolio ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thẻ NFC:</span>
                  <span className="font-semibold">{portfolioStats?.result?.nfcCards ?? 'Lỗi tải dữ liệu'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Portfolios Daily</CardTitle>
                <CardDescription>Tạo Portfolio mới hàng ngày</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioStats?.result?.newPortfoliosDaily && portfolioStats.result.newPortfoliosDaily.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioStats.result.newPortfoliosDaily.map((dailyData, index) => (
                      <div key={dailyData._id} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <div>
                          <div className="font-medium">Ngày: {dailyData._id}</div>
                          <div className="text-sm text-gray-500">Ngày {index + 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{dailyData.count}</div>
                          <div className="text-sm text-gray-500">Portfolio mới</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có dữ liệu tạo Portfolio hàng ngày
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Users by Portfolio Count</CardTitle>
                <CardDescription>Người dùng có nhiều Portfolio nhất</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioStats?.result?.topUsersByPortfolios && portfolioStats.result.topUsersByPortfolios.length > 0 ? (
                  <div className="space-y-4">
                    {portfolioStats.result.topUsersByPortfolios.map((userPortfolio, index) => (
                      <div key={userPortfolio._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium">ID người dùng: {userPortfolio._id}</div>
                            <div className="text-sm text-gray-500">
                              Số Portfolio: {userPortfolio.count}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{userPortfolio.count}</div>
                          <div className="text-sm text-gray-500">Portfolio</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có dữ liệu Portfolio người dùng
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Đăng ký hoạt động:</span>
                  <span className="font-semibold">{revenueStats?.result?.activeSubscriptions ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>ARPU:</span>
                  <span className="font-semibold">${revenueStats?.result?.ARPU ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giao dịch thành công:</span>
                  <span className="font-semibold">{revenueStats?.result?.txnSuccess ?? 'Lỗi tải dữ liệu'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giao dịch thất bại:</span>
                  <span className="font-semibold">{revenueStats?.result?.txnFailed ?? 'Lỗi tải dữ liệu'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Plans</CardTitle>
                <CardDescription>Gói đăng ký phổ biến nhất</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueStats?.result?.topPlans && revenueStats.result.topPlans.length > 0 ? (
                  <div className="space-y-3">
                    {revenueStats.result.topPlans.map((plan, index) => (
                      <div key={plan._id || index} className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <div>
                          <div className="font-medium">ID gói: {plan._id}</div>
                          <div className="text-sm text-gray-500">Hạng #{index + 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{plan.count || plan.value || 'N/A'}</div>
                          <div className="text-sm text-gray-500">đăng ký</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có dữ liệu gói
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={logout}
            variant="outline"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
