import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Wallet, DollarSign, ShoppingCart, User } from 'lucide-react';
import { api } from '../utils/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/dashboard');
        console.log('Analytics response:', response.data); // Debug log
        setAnalyticsData(response.data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Analytics fetch error:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Get color classes for stats cards
  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 text-green-600 border-green-200',
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add safety checks for data structure
  if (!analyticsData || !analyticsData.stats || !analyticsData.userInfo) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-700">Analytics data is incomplete. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'My Total Purchases',
      value: formatCurrency(analyticsData.stats.totalSales?.value || 0),
      change: analyticsData.stats.totalSales?.change || '+0%',
      icon: ShoppingCart,
      color: 'green',
      description: 'Total amount spent on purchases'
    },
    {
      title: 'Commission Earned',
      value: formatCurrency(analyticsData.stats.totalRevenue?.value || 0),
      change: analyticsData.stats.totalRevenue?.change || '+0%',
      icon: TrendingUp,
      color: 'purple',
      description: 'Revenue from referrals'
    },
    {
      title: 'Current Balance',
      value: formatCurrency(analyticsData.stats.currentBalance?.value || 0),
      change: analyticsData.stats.currentBalance?.change || '+0%',
      icon: Wallet,
      color: 'blue',
      description: 'Available wallet balance'
    },
    {
      title: 'Total Transactions',
      value: formatNumber(analyticsData.stats.transactionCount?.value || 0),
      change: analyticsData.stats.transactionCount?.change || '+0%',
      icon: DollarSign,
      color: 'orange',
      description: 'Number of purchases made'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with User Info */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <User className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Analytics</h1>
            <p className="text-gray-600">Personal dashboard for {analyticsData.userInfo.name || 'User'}</p>
          </div>
        </div>
        
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-semibold text-gray-900">
                {analyticsData.userInfo.joinDate ? formatDate(analyticsData.userInfo.joinDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">{analyticsData.userInfo.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referral Code</p>
              <p className="font-semibold text-blue-600">{analyticsData.userInfo.referralCode || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-900 font-medium">{stat.title}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Purchases Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">My Monthly Purchases</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            {analyticsData.monthlyData && analyticsData.monthlyData.length > 0 ? (
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Purchase History Available</p>
                <p className="text-sm text-gray-500">{analyticsData.monthlyData.length} months of data</p>
                <p className="text-xs text-gray-400 mt-2">Chart visualization coming soon</p>
              </div>
            ) : (
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No purchase history yet</p>
                <p className="text-sm text-gray-400">Start making purchases to see trends</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Commissions Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">My Monthly Commissions</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            {analyticsData.commissionData && analyticsData.commissionData.length > 0 ? (
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Commission Data Available</p>
                <p className="text-sm text-gray-500">{analyticsData.commissionData.length} months of earnings</p>
                <p className="text-xs text-gray-400 mt-2">Chart visualization coming soon</p>
              </div>
            ) : (
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No commission earnings yet</p>
                <p className="text-sm text-gray-400">Invite friends to start earning</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Analytics;