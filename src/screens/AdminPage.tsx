import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import showToast from '@/lib/toast';
import { adminGetAllUsers, adminCreateUser, adminUpdateUser, adminDeleteUser, type AdminUser } from '@/lib/api';
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
  LogOut
} from 'lucide-react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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
    topUsersByPortfolios: Array<{ _id: string; count: number; username?: string; name?: string; email?: string }>;
  };
}

interface RevenueStats {
  result: {
    dailyRevenue: Array<any>;
    monthlyRevenue: Array<any>;
    revenueBySource: Array<any>;
    revenueByGateway: Array<any>;
    txSuccess: number;  // Changed from txnSuccess
    txFailed: number;   // Changed from txnFailed
    ARPU: number;
    activeSubscriptions: number;
    topPlans: Array<any>; // Use any to handle various response structures
  };
}

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  // Users CRUD state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<{ name?: string; email: string; password?: string; role?: string }>(
    { name: '', email: '', password: '', role: 'user' }
  );

  const fetchAllStats = async () => {
    try {
      await Promise.all([
        fetchUserStats(),
        fetchPortfolioStats(),
        fetchRevenueStats(),
      ]);
      showToast.success('Dữ liệu đã được tải thành công!');
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
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
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await adminGetAllUsers();
      setUsers(data);
    } catch (e: any) {
      console.error(e);
      showToast.error(e.message || 'Không tải được danh sách người dùng');
    } finally {
      setUsersLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', role: 'user' });
    setShowUserModal(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setForm({ name: u.name || '', email: u.email, password: '', role: u.role || 'user' });
    setShowUserModal(true);
  };

  const submitUser = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      if (editingUser) {
        // Only send fields that actually changed to avoid validation like "Email already exists"
        const payload: any = {
          name: form.name,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        };
        if (form.email && form.email !== editingUser.email) {
          payload.email = form.email;
        }
        await adminUpdateUser(editingUser._id, payload);
        showToast.success('Cập nhật người dùng thành công');
      } else {
        if (!form.password) {
          showToast.warning('Vui lòng nhập mật khẩu cho người dùng mới');
          return;
        }
        await adminCreateUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        showToast.success('Tạo người dùng thành công');
      }
      setShowUserModal(false);
      await loadUsers();
    } catch (e: any) {
      console.error(e);
      showToast.error(e.message || 'Lỗi lưu người dùng');
    }
  };

  const onDeleteUser = async (u: AdminUser) => {
    const ok = window.confirm(`Xoá người dùng ${u.email}?`);
    if (!ok) return;
    try {
      await adminDeleteUser(u._id);
      showToast.success('Đã xoá người dùng');
      await loadUsers();
    } catch (e: any) {
      console.error(e);
      showToast.error(e.message || 'Không thể xoá');
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'users', label: 'Người dùng', icon: Users, color: 'bg-green-500' },
    { id: 'portfolios', label: 'Portfolio', icon: FolderOpen, color: 'bg-purple-500' },
    { id: 'top-users', label: 'Người dùng hàng đầu', icon: Crown, color: 'bg-yellow-500' },
    { id: 'revenue', label: 'Doanh thu', icon: DollarSign, color: 'bg-emerald-500' },
  ];

  // Helper function để tính phần trăm thay đổi so với tháng trước
  const calculateMonthlyGrowth = (monthlyData: Array<{ _id: string; count: number }>) => {
    if (!monthlyData || monthlyData.length < 2) return null;
    
    // Sắp xếp theo tháng (mới nhất trước)
    const sorted = [...monthlyData].sort((a, b) => b._id.localeCompare(a._id));
    const currentMonth = sorted[0]?.count || 0;
    const previousMonth = sorted[1]?.count || 0;
    
    if (previousMonth === 0) return currentMonth > 0 ? '+100%' : '0%';
    
    const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;
    const sign = growthRate >= 0 ? '+' : '';
    return `${sign}${growthRate.toFixed(0)}%`;
  };

  // Tính growth rate cho user từ monthly data
  const userGrowth = React.useMemo(() => {
    return calculateMonthlyGrowth(userStats?.result?.newUsersMonthly || []);
  }, [userStats]);

  // Tính growth rate cho portfolio từ monthly data (chuyển đổi từ daily sang monthly)
  const portfolioGrowth = React.useMemo(() => {
    if (portfolioStats?.result?.newPortfoliosDaily) {
      // Nhóm daily data thành monthly
      const dailyData = portfolioStats.result.newPortfoliosDaily;
      const monthlyMap = new Map<string, number>();
      
      dailyData.forEach(item => {
        const monthKey = item._id.substring(0, 7); // Lấy YYYY-MM
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + item.count);
      });
      
      const monthlyData = Array.from(monthlyMap.entries()).map(([_id, count]) => ({ _id, count }));
      return calculateMonthlyGrowth(monthlyData);
    }
    return null;
  }, [portfolioStats]);
  
  // Tính premium user growth từ monthly data
  const premiumGrowth = React.useMemo(() => {
    if (!userStats?.result?.premiumUsers || !userStats?.result?.newUsersMonthly) return null;
    
    const monthlyUsers = userStats.result.newUsersMonthly;
    if (monthlyUsers && monthlyUsers.length >= 2) {
      // Giả sử tỷ lệ premium users là constant
      const premiumRatio = userStats.result.premiumUsers / (userStats.result.totalUsers || 1);
      const premiumMonthly = monthlyUsers.map(item => ({
        _id: item._id,
        count: Math.floor(item.count * premiumRatio)
      }));
      return calculateMonthlyGrowth(premiumMonthly);
    }
    
    return null;
  }, [userStats]);

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
                <p className="text-blue-100 text-sm mt-1">
                  {userGrowth ? `${userGrowth} từ tháng trước` : 'Chưa có dữ liệu'}
                </p>
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
                <p className="text-purple-100 text-sm mt-1">
                  {portfolioGrowth ? `${portfolioGrowth} từ tháng trước` : 'Chưa có dữ liệu'}
                </p>
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
                <p className="text-emerald-100 text-sm mt-1">
                  {premiumGrowth ? `${premiumGrowth} từ tháng trước` : 'Chưa có dữ liệu'}
                </p>
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
              <span className="font-semibold text-lg text-green-600">{revenueStats?.result?.txSuccess ?? '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giao dịch thất bại</span>
              <span className="font-semibold text-lg text-red-600">{revenueStats?.result?.txFailed ?? '0'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* User stats quick tiles */}
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6 text-blue-500" />
              Quản lý người dùng
            </CardTitle>
            <CardDescription>Thống kê và CRUD người dùng</CardDescription>
          </div>
          <Button onClick={openCreateModal}>+ Tạo người dùng</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{userStats?.result?.totalUsers ?? users.length}</p>
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

          {/* Users table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {usersLoading ? (
                  <tr><td className="px-4 py-6 text-center" colSpan={5}>Đang tải...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td className="px-4 py-6 text-center" colSpan={5}>Chưa có người dùng</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm">{u.name || '-'}</td>
                      <td className="px-4 py-3 text-sm">{u.role || 'user'}</td>
                      <td className="px-4 py-3 text-sm">{u.verify === 1 ? '✔️' : '❌'}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(u)}>Sửa</Button>
                          <Button variant="destructive" size="sm" onClick={() => onDeleteUser(u)}>Xoá</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for create/update user */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUserModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{editingUser ? 'Cập nhật người dùng' : 'Tạo người dùng'}</h3>
            <form className="space-y-4" onSubmit={submitUser}>
              <div>
                <label className="text-sm text-gray-600">Email {editingUser && <span className="text-gray-400">(không thể đổi)</span>}</label>
                <Input required type="email" disabled={!!editingUser} value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tên</label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Mật khẩu {editingUser && <span className="text-gray-400">(để trống nếu không đổi)</span>}</label>
                <Input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <Input value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>Huỷ</Button>
                <Button type="submit">{editingUser ? 'Lưu thay đổi' : 'Tạo'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
            {portfolioStats.result.topUsersByPortfolios.map((userPortfolio, index) => {
              // Find the corresponding user from the users list to get their details
              const userDetails = users.find(u => u._id === userPortfolio._id);
              const displayName = userDetails?.name || userDetails?.email || `User #${userPortfolio._id.slice(-6)}`;
              
              return (
                <div key={userPortfolio._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{displayName}</div>
                      <div className="text-sm text-gray-600">
                        {userDetails?.email && userDetails.name ? userDetails.email : `ID: ${userPortfolio._id.slice(-8)}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-orange-600">{userPortfolio.count}</div>
                    <div className="text-sm text-gray-500">Portfolio</div>
                  </div>
                </div>
              );
            })}
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
              <p className="text-2xl font-bold text-green-600">{revenueStats?.result?.txSuccess ?? '0'}</p>
              <p className="text-sm text-gray-600">Giao dịch thành công</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{revenueStats?.result?.txFailed ?? '0'}</p>
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
                revenueStats.result.topPlans.map((planData: any, index: number) => {
                  // Handle the structure: each item has _id, count, and optionally a 'plan' object
                  const planInfo = planData.plan || {}; // The actual plan details are in the 'plan' property
                  const planId = planData._id || '';
                  const displayName = planInfo.name || `Gói #${planId.slice(-6)}`;
                  
                  // Get price from plan object
                  let planPrice = 'N/A';
                  if (planInfo.price !== undefined && planInfo.price !== null) {
                    planPrice = `${planInfo.price.toLocaleString('vi-VN')}đ`;
                  }
                  
                  // Get duration from plan object
                  const duration = planInfo.duration_in_days || 'N/A';
                  
                  // Get count from root level
                  const count = planData.count || 0;
                  
                  return (
                    <div key={planId || index} className="flex justify-between items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div>
                        <div className="font-medium">{displayName}</div>
                        <div className="text-sm text-gray-500">
                          {planPrice} - {duration} ngày
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600 text-lg">{count}</div>
                        <div className="text-sm text-gray-500">đăng ký</div>
                      </div>
                    </div>
                  );
                })
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
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <BarChart3 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin Panel</span>
                  <span className="truncate text-xs">2Share Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => setActiveSection(item.id)}
                      tooltip={item.label}
                      className="h-10 hover:shadow-md transition-shadow duration-200"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-blue-500 text-white">
                        {(user?.name || user?.email || 'AD').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || 'Admin'}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg" side="right" align="end" sideOffset={4}>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-blue-500 text-white">
                          {(user?.name || user?.email || 'AD').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name || 'Admin'}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Chào mừng quay trở lại, {user?.name || user?.email}
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block pr-4">
            <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminPage;
