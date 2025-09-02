import { api } from '../utils/api';   // make sure path is correct
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Wallet, DollarSign, ShoppingCart, User, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Main component that serves as the entry point for the application.
// This is the default export for the Canvas environment.
export default function App() {
  return <Analytics />;
}

// The Analytics dashboard component.
const Analytics = () => {
  const { user } = useAuth();   // for showing name/email etc.
  // State to hold the analytics data, manage loading state, and handle errors.
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
      const navigate = useNavigate();


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get('/analytics/dashboard'); // 🔗 backend route
        setAnalyticsData(res.data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Function to handle commission box click
  const handleCommissionClick = () => {
    // You can replace this with your routing method
    // For React Router: navigate('/commission-analytics');
    // For now, I'll show an alert to demonstrate

    // Example with React Router (if you're using it):
    
    navigate('/commission');
  };

  // Utility function to format currency values.
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Utility function to format numbers.
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Utility function to format date strings.
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Custom Tooltip component for Recharts, providing a styled popup on hover.
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20">
          <p className="font-bold text-gray-900 mb-3 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 font-medium capitalize">
                  {entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {entry.dataKey === 'transactionCount' ? formatNumber(entry.value) : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render a loading state while data is being fetched.
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading analytics...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing your dashboard</p>
        </div>
      </div>
    );
  }

  // Render an error state if data fetching fails.
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-3xl">⚠</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Analytics</h3>
          <p className="text-red-600 mb-6 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Do not render if data is still null (should be handled by loading state, but a good safeguard).
  if (!analyticsData) return null;

  // Array of stats objects to easily map and render the top-level cards.
  const stats = [
    {
      title: 'Total Purchases',
      value: formatCurrency(analyticsData.stats.totalSales?.value || 0),
      change: analyticsData.stats.totalSales?.change || '+0%',
      trend: analyticsData.stats.totalSales?.trend || 'up',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/20',
      isClickable: false
    },
    {
      title: 'Commission Earned',
      value: formatCurrency(analyticsData.stats.totalRevenue?.value || 0),
      change: analyticsData.stats.totalRevenue?.change || '+0%',
      trend: analyticsData.stats.totalRevenue?.trend || 'up',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-500/20',
      isClickable: true, // This makes it clickable
      onClick:handleCommissionClick
    },
    {
      title: 'Current Balance',
      value: formatCurrency(analyticsData.stats.currentBalance?.value || 0),
      change: analyticsData.stats.currentBalance?.change || '+0%',
      trend: analyticsData.stats.currentBalance?.trend || 'up',
      icon: Wallet,
      gradient: 'from-violet-500 to-violet-600',
      shadowColor: 'shadow-violet-500/20',
      isClickable: false
    },
    {
      title: 'Total Transactions',
      value: formatNumber(analyticsData.stats.transactionCount?.value || 0),
      change: analyticsData.stats.transactionCount?.change || '+0%',
      trend: analyticsData.stats.transactionCount?.trend || 'up',
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/20',
      isClickable: false
    }
  ];

  // The main JSX for the dashboard UI.
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8" style={{ outline: 'none' }}>
      <style>{`
        * {
          outline: none !important;
        }
        *:focus {
          outline: none !important;
        }
        svg {
          outline: none !important;
        }
        .recharts-wrapper {
          outline: none !important;
        }
        .recharts-surface {
          outline: none !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section with User Info */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className=''>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 pb-1 to-gray-600 bg-clip-text text-transparent">
                  Weekly Progress
                </h1>
                <p className="text-gray-600 text-lg mt-1">Welcome back, {analyticsData.userInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm border border-white/30">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">Last 7 days</span>
            </div>
          </div>
          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { label: 'Member Since', value: formatDate(analyticsData.userInfo.joinDate), color: 'text-blue-600' },
              { label: 'Email', value: analyticsData.userInfo.email, color: 'text-gray-900' },
              { label: 'Referral Code', value: analyticsData.userInfo.referralCode, color: 'text-emerald-600' }
            ].map((item, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <p className="text-sm text-gray-500 mb-2 font-semibold">{item.label}</p>
                <p className={`font-bold text-xl ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid - UPDATED WITH CLICKABLE LOGIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';
            const TrendIcon = isPositive ? ArrowUp : ArrowDown;

            return (
              <div
                key={index}
                className={`bg-white/90 backdrop-blur-xl rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${stat.shadowColor} shadow-xl border border-white/20 ${stat.isClickable ? 'cursor-pointer hover:shadow-emerald-500/30' : ''
                  }`}
                onClick={stat.isClickable ? stat.onClick : undefined}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-xl`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold ${isPositive
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                    <TrendIcon className="w-3.5 h-3.5" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-semibold">{stat.title}</p>
                  {stat.isClickable && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Click for details →</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Progress Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Weekly Purchases Area Chart */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Purchases</h3>
                <p className="text-gray-600">Your spending progress this week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="h-80" style={{ outline: 'none' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData.weeklyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  style={{ outline: 'none' }}
                >
                  <defs>
                    {/* Blue gradient for fill */}
                    <linearGradient id="purchaseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>

                    {/* Blue gradient for stroke */}
                    <linearGradient id="purchaseLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1D4ED8" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                    axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                    tickLine={{ stroke: '#D1D5DB' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                    axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="purchases"
                    stroke="url(#purchaseLineGradient)"
                    strokeWidth={4}
                    fill="url(#purchaseAreaGradient)"
                    name="Purchases"
                    dot={{ fill: '#3B82F6', strokeWidth: 3, stroke: '#ffffff', r: 5 }}
                    activeDot={{ r: 7, stroke: '#1D4ED8', strokeWidth: 3, fill: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Weekly Commissions Area Chart */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Commissions</h3>
                <p className="text-gray-600">Your earnings progress this week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="h-80" style={{ outline: 'none' }}>
              <ResponsiveContainer width="100%" height="100%" >
                <AreaChart data={analyticsData.weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} style={{ outline: 'none' }}>
                  <defs>
                    <linearGradient id="commissionAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="commissionLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                    axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                    tickLine={{ stroke: '#D1D5DB' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                    axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="commissions"
                    stroke="url(#commissionLineGradient)"
                    strokeWidth={4}
                    fill="url(#commissionAreaGradient)"
                    name="Commissions"
                    dot={{ fill: '#10B981', strokeWidth: 3, stroke: '#ffffff', r: 5 }}
                    activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 3, fill: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Combined Progress Overview */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Performance Overview</h3>
            <p className="text-gray-600">Combined view of your purchases and commission earnings this week</p>
          </div>

          <div className="h-96" style={{ outline: 'none' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} style={{ outline: 'none' }}>
                <defs>
                  <linearGradient id="multiPurchaseGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="multiCommissionGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                  tickLine={{ stroke: '#D1D5DB' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                  tickLine={{ stroke: '#D1D5DB' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  axisLine={{ stroke: '#D1D5DB', strokeWidth: 2 }}
                  tickLine={{ stroke: '#D1D5DB' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="purchases"
                  stroke="url(#multiPurchaseGradient)"
                  strokeWidth={4}
                  dot={{ fill: '#3B82F6', strokeWidth: 3, stroke: '#ffffff', r: 6 }}
                  activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 4, fill: '#ffffff' }}
                  name="Purchases"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="commissions"
                  stroke="url(#multiCommissionGradient)"
                  strokeWidth={4}
                  dot={{ fill: '#10B981', strokeWidth: 3, stroke: '#ffffff', r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 4, fill: '#ffffff' }}
                  name="Commissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};