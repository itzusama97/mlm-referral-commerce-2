import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Main component that serves as the entry point
export default function App() {
  return <CommissionAnalytics />;
}

const CommissionAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});







  useEffect(() => {
    const fetchTodayCommissions = async () => {
      try {
        setLoading(true);
        setError(null);
              const weeklyRes = await api.get('/commissions/summary'); // 👈 ab ye weekly data dega


        // Fetch today's commission summary
        const summaryRes = await api.get('/commissions/today-summary');
        
        // Fetch detailed commission data
        const detailedRes = await api.get('/commissions/today-detailed');
        
        setAnalyticsData({
                    weekly: weeklyRes.data,

          summary: summaryRes.data,
          detailed: detailedRes.data
        });
      } catch (err) {
        console.error('Commission analytics fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load commission data');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayCommissions();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatTime = (hour) => {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

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
                <span className="text-sm text-gray-600 font-medium">
                  {entry.dataKey === 'totalCommission' ? 'Commission' : 
                   entry.dataKey === 'transactionCount' ? 'Transactions' : 
                   entry.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {entry.dataKey === 'transactionCount' ? 
                  entry.value : 
                  formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 font-semibold text-lg">Loading commission analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-3xl">⚠</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Data</h3>
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

  if (!analyticsData) return null;

  const { summary, detailed } = analyticsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
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
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => window.history.back()}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Today's Commission Analytics
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                {detailed?.summary?.dateFormatted || 'Today'}
              </p>
            </div>
          </div>

          {/* Today's Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-emerald-100 text-sm font-medium">Today's Total</p>
<p className="text-3xl font-bold">
  {formatCurrency(summary?.todayCommission || 0)}
</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-100">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{summary?.changePercentage ??0} vs yesterday</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium">Transactions</p>
                  <p className="text-3xl font-bold">{summary?.transactionCount ??0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Commission-generating purchases</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-violet-100 text-sm font-medium">Trend</p>
                  <p className="text-2xl font-bold capitalize">{summary?.trend ??0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-violet-100">
                <span className="text-sm font-medium">Compared to yesterday</span>
              </div>
            </div>
          </div>
        </div>


        {/* Weekly Commission Trend */}
<div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
  <div className="mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Commission Trend</h3>
    <p className="text-gray-600">Commission earned in the last 7 days</p>
  </div>

  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={analyticsData.weekly || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
        <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} tickFormatter={(value) => `$${value}`} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalCommission"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ fill: '#10B981', strokeWidth: 2, stroke: '#ffffff', r: 5 }}
          activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 3, fill: '#ffffff' }}
          name="Commission"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>



        {/* Commission by Level */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Commission by Level</h3>
              <p className="text-gray-600">Breakdown by referral levels</p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={detailed?.commissionByLevel || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="totalCommission"
                    nameKey="_id"
                    label={({ _id, totalCommission }) => `Level ${_id}: ${formatCurrency(totalCommission)}`}
                  >
                    {(detailed?.commissionByLevel || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Commission']}
                    labelFormatter={(label) => `Level ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Commission Timeline */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Commission Timeline</h3>
              <p className="text-gray-600">Hourly commission trend</p>
            </div>

            <div className="h-80" >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={detailed?.hourlyCommissions || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="timelineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                    tickFormatter={(hour) => formatTime(hour)}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="totalCommission"
                    stroke="url(#timelineGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff', r: 5 }}
                    activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 3, fill: '#ffffff' }}
                    name="Commission"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Commission by Users - List Style */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Commission by Users</h3>
            <p className="text-gray-600">Detailed breakdown of commission earned from each user's purchases</p>
          </div>

          <div className="space-y-4"  style={{ outline: 'none' }}>
            {detailed?.commissionByUsers && detailed.commissionByUsers.length > 0 ? (
              detailed.commissionByUsers.map((userCommission, index) => (
                <div key={userCommission.buyerId} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleUserExpansion(userCommission.buyerId)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{userCommission.buyerName}</h4>
                        <p className="text-gray-600 text-sm">{userCommission.buyerEmail}</p>
                        <p className="text-blue-600 text-sm font-medium">Code: {userCommission.buyerReferralCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(userCommission.totalCommissionFromUser)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {userCommission.transactionCount} transaction{userCommission.transactionCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Avg Level: {userCommission.averageLevel?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                      {expandedUsers[userCommission.buyerId] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedUsers[userCommission.buyerId] && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-gray-600 text-sm mb-1">Total Commission</p>
                          <p className="text-xl font-bold text-emerald-600">
                            {formatCurrency(userCommission.totalCommissionFromUser)}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-gray-600 text-sm mb-1">Transactions</p>
                          <p className="text-xl font-bold text-blue-600">
                            {userCommission.transactionCount}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-gray-600 text-sm mb-1">Levels</p>
                          <div className="flex flex-wrap gap-2">
                            {[...new Set(userCommission.levels)].map(level => (
                              <span key={level} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                                Level {level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No commissions earned today yet</p>
                <p className="text-gray-500 text-sm mt-2">Start referring users to earn commissions!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Commission Transactions</h3>
            <p className="text-gray-600">Latest transactions that generated commission for you</p>
          </div>

          <div className="space-y-3">
            {detailed?.recentTransactions && detailed.recentTransactions.length > 0 ? (
              detailed.recentTransactions.map((transaction, index) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{transaction.level}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.buyer?.name || 'Unknown User'}</p>
                      <p className="text-gray-600 text-sm">
                        Purchase: {formatCurrency(transaction.purchaseAmount)} • Level {transaction.level}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-lg">
                      {formatCurrency(transaction.myCommission)}
                    </p>
                    <p className="text-gray-600 text-sm">Commission</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No commission transactions today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};