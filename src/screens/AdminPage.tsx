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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserStats(),
        fetchPortfolioStats(),
        fetchRevenueStats(),
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
            <TabsTrigger value="top-users">Top Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats?.result?.totalUsers ?? 'Error loading data'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Portfolios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {portfolioStats?.result?.totalPortfolios ?? 'Error loading data'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats?.result?.premiumUsers ?? 'Error loading data'}
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
                  <span>Total Users:</span>
                  <span className="font-semibold">{userStats?.result?.totalUsers ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users Daily:</span>
                  <span className="font-semibold">{userStats?.result?.activeUsersDaily ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Users:</span>
                  <span className="font-semibold">{userStats?.result?.premiumUsers ?? 'Error loading data'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Users Daily</CardTitle>
                <CardDescription>Daily new user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {userStats?.result?.newUsersDaily && userStats.result.newUsersDaily.length > 0 ? (
                  <div className="space-y-3">
                    {userStats.result.newUsersDaily.map((dailyData, index) => (
                      <div key={dailyData._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">Date: {dailyData._id}</div>
                          <div className="text-sm text-gray-500">Day {index + 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{dailyData.count}</div>
                          <div className="text-sm text-gray-500">new users</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No daily registration data available
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
                  <span>Total Portfolios:</span>
                  <span className="font-semibold">{portfolioStats?.result?.totalPortfolios ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Blocks Per Portfolio:</span>
                  <span className="font-semibold">{portfolioStats?.result?.avgBlocksPerPortfolio ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>NFC Cards:</span>
                  <span className="font-semibold">{portfolioStats?.result?.nfcCards ?? 'Error loading data'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Portfolios Daily</CardTitle>
                <CardDescription>Daily new portfolio creations</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioStats?.result?.newPortfoliosDaily && portfolioStats.result.newPortfoliosDaily.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioStats.result.newPortfoliosDaily.map((dailyData, index) => (
                      <div key={dailyData._id} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <div>
                          <div className="font-medium">Date: {dailyData._id}</div>
                          <div className="text-sm text-gray-500">Day {index + 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{dailyData.count}</div>
                          <div className="text-sm text-gray-500">new portfolios</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No daily portfolio creation data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Users by Portfolio Count</CardTitle>
                <CardDescription>Users with the most portfolios</CardDescription>
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
                            <div className="font-medium">User ID: {userPortfolio._id}</div>
                            <div className="text-sm text-gray-500">
                              Portfolio Count: {userPortfolio.count}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{userPortfolio.count}</div>
                          <div className="text-sm text-gray-500">portfolios</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No user portfolio data available
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
                  <span>Active Subscriptions:</span>
                  <span className="font-semibold">{revenueStats?.result?.activeSubscriptions ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>ARPU:</span>
                  <span className="font-semibold">${revenueStats?.result?.ARPU ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful Transactions:</span>
                  <span className="font-semibold">{revenueStats?.result?.txnSuccess ?? 'Error loading data'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Transactions:</span>
                  <span className="font-semibold">{revenueStats?.result?.txnFailed ?? 'Error loading data'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Plans</CardTitle>
                <CardDescription>Most popular subscription plans</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueStats?.result?.topPlans && revenueStats.result.topPlans.length > 0 ? (
                  <div className="space-y-3">
                    {revenueStats.result.topPlans.map((plan, index) => (
                      <div key={plan._id || index} className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <div>
                          <div className="font-medium">Plan ID: {plan._id}</div>
                          <div className="text-sm text-gray-500">Rank #{index + 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{plan.count || plan.value || 'N/A'}</div>
                          <div className="text-sm text-gray-500">subscriptions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No plan data available
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
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
