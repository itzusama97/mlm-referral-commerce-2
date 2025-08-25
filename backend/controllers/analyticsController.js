const User = require('../models/User');
const Transaction = require('../models/Transaction');
// const AddBalance = require('../models/AddBalance'); // Comment this line if AddBalance model doesn't exist yet

// @desc    Get user analytics data for personal dashboard
// @route   GET /api/analytics/dashboard
// @access  Private (User's personal data only)
const getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user first to ensure user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. User's Total Purchases (buy transactions by this user)
        const salesData = await Transaction.aggregate([
            { $match: { buyer: userId, type: "buy" } },
            { $group: { _id: null, totalSales: { $sum: { $abs: "$amount" } } } }
        ]);
        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        // 2. User's Total Revenue (commissions earned by this user from referrals)
        const revenueData = await Transaction.aggregate([
            { $unwind: "$commissions" },
            { $match: { "commissions.user": userId } },
            { $group: { _id: null, totalRevenue: { $sum: "$commissions.commissionAmount" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // 3. Current User Balance
        const currentBalance = user.balance || 0;

        // 4. User's Transaction Count
        const transactionCount = await Transaction.countDocuments({ buyer: userId, type: "buy" });

        // 5. Monthly Purchase Data (user's own purchases)
        const monthlyData = await Transaction.aggregate([
            { $match: { buyer: userId, type: "buy" } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalAmount: { $sum: { $abs: "$amount" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);

        // 6. Monthly Commission Data (commissions earned by user)
        const commissionData = await Transaction.aggregate([
            { $unwind: "$commissions" },
            { $match: { "commissions.user": userId } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalCommission: { $sum: "$commissions.commissionAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);

        // Calculate percentage changes (simple static values for now)
        // You can enhance this later to calculate actual percentage changes
        const responseData = {
            stats: {
                totalSales: {
                    value: totalSales,
                    change: '+12%',
                    trend: 'up'
                },
                totalRevenue: {
                    value: totalRevenue,
                    change: '+15%',
                    trend: 'up'
                },
                currentBalance: {
                    value: currentBalance,
                    change: '+5%',
                    trend: 'up'
                },
                transactionCount: {
                    value: transactionCount,
                    change: '+8%',
                    trend: 'up'
                }
            },
            monthlyData: monthlyData || [],
            commissionData: commissionData || [],
            userInfo: {
                name: user.name || '',
                email: user.email || '',
                referralCode: user.referralCode || '',
                joinDate: user.createdAt || new Date()
            }
        };

        console.log('Sending analytics data:', JSON.stringify(responseData, null, 2)); // Debug log
        res.json(responseData);

    } catch (error) {
        console.error('User analytics fetch error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching user analytics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// @desc    Get detailed sales analytics
// @route   GET /api/analytics/sales
// @access  Private
const getSalesAnalytics = async (req, res) => {
    try {
        // Daily sales for last 30 days
        const dailySales = await Transaction.aggregate([
            {
                $match: {
                    type: "buy",
                    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$createdAt" },
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalSales: { $sum: { $abs: "$amount" } },
                    totalTransactions: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Top users by purchase amount
        const topUsers = await Transaction.aggregate([
            { $match: { type: "buy" } },
            {
                $group: {
                    _id: "$buyer",
                    totalPurchases: { $sum: { $abs: "$amount" } },
                    transactionCount: { $sum: 1 }
                }
            },
            { $sort: { totalPurchases: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    userName: "$user.name",
                    userEmail: "$user.email",
                    totalPurchases: 1,
                    transactionCount: 1
                }
            }
        ]);

        res.json({
            dailySales: dailySales || [],
            topUsers: topUsers || []
        });

    } catch (error) {
        console.error('Sales analytics error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching sales analytics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    getDashboardAnalytics,
    getSalesAnalytics
};