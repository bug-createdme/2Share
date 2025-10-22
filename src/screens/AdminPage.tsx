import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  FolderOpen,
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  UserCheck,
  Crown,
  Calendar,
  Target,
  Award,
  LogOut,
  Menu,
  X
} from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

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

  const navigationItems = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'users', label: 'Người dùng', icon: Users, color: 'bg-green-500' },
    { id: 'portfolios', label: 'Portfolio', icon: FolderOpen, color: 'bg-purple-500' },
    { id: 'top-users', label: 'Người dùng hàng đầu', icon: Crown, color: 'bg-yellow-500' },
    { id: 'revenue', label: 'Doanh thu', icon: DollarSign, color: 'bg-emerald-500' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tổng người dùng</p>
                <p className="text-3xl font-bold">{userStats?.result?.totalUsers ?? '0'}</p>
                <p className="text-blue-100 text-sm mt-1">+12% từ tháng trước</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Tổng Portfolio</p>
                <p className="text-3xl font-bold">{portfolioStats?.result?.totalPortfolios ?? '0'}</p>
                <p className="text-purple-100 text-sm mt-1">+8% từ tháng trước</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Người dùng Premium</p>
                <p className="text-3xl font-bold">{userStats?.result?.premiumUsers ?? '0'}</p>
                <p className="text-emerald-100 text-sm mt-1">+15% từ tháng trước</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Doanh thu tháng</p>
                <p className="text-3xl font-bold">${revenueStats?.result?.ARPU ?? '0'}</p>
                <p className="text-orange-100 text-sm mt-1">ARPU trung bình</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-500" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Người dùng mới</p>
                  <p className="text-xs text-gray-500">Hôm nay</p>
                </div>
              </div>
              <span className="font-bold text-green-600">+{userStats?.result?.activeUsersDaily ?? '0'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Portfolio mới</p>
                  <p className="text-xs text-gray-500">Hôm nay</p>
                </div>
              </div>
              <span className="font-bold text-blue-600">+{portfolioStats?.result?.newPortfoliosDaily?.[0]?.count ?? '0'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Crown className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Premium đăng ký</p>
                  <p className="text-xs text-gray-500">Tuần này</p>
                </div>
              </div>
              <span className="font-bold text-purple-600">+{userStats?.result?.premiumUsers ?? '0'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-purple-500" />
              Thống kê nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thẻ NFC đang hoạt động</span>
              <span className="font-semibold text-lg">{portfolioStats?.result?.nfcCards ?? '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Đăng ký hoạt động</span>
              <span className="font-semibold text-lg">{revenueStats?.result?.activeSubscriptions ?? '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giao dịch thành công</span>
              <span className="font-semibold text-lg text-green-600">{revenueStats?.result?.txnSuccess ?? '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giao dịch thất bại</span>
              <span className="font-semibold text-lg text-red-600">{revenueStats?.result?.txnFailed ?? '0'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-blue-500" />
            Thống kê người dùng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{userStats?.result?.totalUsers ?? '0'}</p>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{userStats?.result?.activeUsersDaily ?? '0'}</p>
              <p className="text-sm text-gray-600">Hoạt động hàng ngày</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{userStats?.result?.premiumUsers ?? '0'}</p>
              <p className="text-sm text-gray-600">Premium users</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Đăng ký mới hàng ngày
            </h3>
            <div className="space-y-3">
              {userStats?.result?.newUsersDaily && userStats.result.newUsersDaily.length > 0 ? (
                userStats.result.newUsersDaily.map((dailyData, index) => (
                  <div key={dailyData._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium">Ngày {dailyData._id}</div>
                      <div className="text-sm text-gray-500">#{index + 1}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 text-lg">+{dailyData.count}</div>
                      <div className="text-sm text-gray-500">người dùng mới</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có dữ liệu đăng ký hàng ngày
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPortfolios = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="h-6 w-6 text-purple-500" />
            Thống kê Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FolderOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{portfolioStats?.result?.totalPortfolios ?? '0'}</p>
              <p className="text-sm text-gray-600">Tổng Portfolio</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{portfolioStats?.result?.avgBlocksPerPortfolio ?? '0'}</p>
              <p className="text-sm text-gray-600">TB khối/Portfolio</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{portfolioStats?.result?.nfcCards ?? '0'}</p>
              <p className="text-sm text-gray-600">Thẻ NFC</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Portfolio mới hàng ngày
            </h3>
            <div className="space-y-3">
              {portfolioStats?.result?.newPortfoliosDaily && portfolioStats.result.newPortfoliosDaily.length > 0 ? (
                portfolioStats.result.newPortfoliosDaily.map((dailyData, index) => (
                  <div key={dailyData._id} className="flex justify-between items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div>
                      <div className="font-medium">Ngày {dailyData._id}</div>
                      <div className="text-sm text-gray-500">#{index + 1}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600 text-lg">+{dailyData.count}</div>
                      <div className="text-sm text-gray-500">Portfolio mới</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có dữ liệu tạo Portfolio hàng ngày
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTopUsers = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Crown className="h-6 w-6 text-yellow-500" />
          Người dùng hàng đầu theo Portfolio
        </CardTitle>
        <CardDescription>Những người dùng có nhiều Portfolio nhất</CardDescription>
      </CardHeader>
      <CardContent>
        {portfolioStats?.result?.topUsersByPortfolios && portfolioStats.result.topUsersByPortfolios.length > 0 ? (
          <div className="space-y-4">
            {portfolioStats.result.topUsersByPortfolios.map((userPortfolio, index) => (
              <div key={userPortfolio._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">User ID: {userPortfolio._id}</div>
                    <div className="text-sm text-gray-600">
                      {userPortfolio.count} Portfolio
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl text-orange-600">{userPortfolio.count}</div>
                  <div className="text-sm text-gray-500">Portfolio</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            Không có dữ liệu Portfolio người dùng
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-emerald-500" />
            Thống kê doanh thu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-600">${revenueStats?.result?.ARPU ?? '0'}</p>
              <p className="text-sm text-gray-600">ARPU trung bình</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{revenueStats?.result?.activeSubscriptions ?? '0'}</p>
              <p className="text-sm text-gray-600">Đăng ký hoạt động</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{revenueStats?.result?.txnSuccess ?? '0'}</p>
              <p className="text-sm text-gray-600">Giao dịch thành công</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{revenueStats?.result?.txnFailed ?? '0'}</p>
              <p className="text-sm text-gray-600">Giao dịch thất bại</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Gói phổ biến nhất
            </h3>
            <div className="space-y-3">
              {revenueStats?.result?.topPlans && revenueStats.result.topPlans.length > 0 ? (
                revenueStats.result.topPlans.map((plan, index) => (
                  <div key={plan._id || index} className="flex justify-between items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div>
                      <div className="font-medium">Gói ID: {plan._id}</div>
                      <div className="text-sm text-gray-500">Hạng #{index + 1}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 text-lg">{plan.count || plan.value || 'N/A'}</div>
                      <div className="text-sm text-gray-500">đăng ký</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có dữ liệu gói
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'portfolios': return renderPortfolios();
      case 'top-users': return renderTopUsers();
      case 'revenue': return renderRevenue();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-500">2Share Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    activeSection === item.id
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile menu button */}
          <div className="lg:hidden p-4 bg-white shadow-sm border-b">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
              className="gap-2"
            >
              <Menu className="h-5 w-5" />
              Menu
            </Button>
          </div>

          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Chào mừng quay trở lại, {user?.name || user?.email}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p className="font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;
