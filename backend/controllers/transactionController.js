const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Commission percentages for different levels
const COMMISSION_PERCENTAGES = {
    '1-3': 0.15,
    '4-7': 0.10,
    '8-10': 0.03,
};

// @desc    Create a new transaction and distribute commissions
// @route   POST /api/transactions/buy
// @access  Private (User should be logged in)
const createTransaction = async (req, res) => {
    // User ID jo transaction kar raha hai, yeh auth middleware se aayegi
    const buyerId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Please provide a valid transaction amount.' });
    }

    try {
        // Step 1: Buyer ka balance check aur update karen
        const buyer = await User.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found.' });
        }

        if (buyer.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance to complete the transaction.' });
        }

        // Buyer ke balance se amount minus karen
        buyer.balance -= amount;
        await buyer.save();

        // Step 2: Commissions calculate aur distribute karen
        const totalCommission = amount * 0.20; // 20% commission on the total amount

        let commissionsArray = [];
        let currentUserId = buyerId;
        
        // Loop through the referral chain up to 10 levels
        for (let level = 1; level <= 10; level++) {
            const currentUser = await User.findById(currentUserId);
            if (!currentUser || !currentUser.referredBy) {
                // If there's no user or no referrer, the chain ends
                break;
            }

            const referrerUser = await User.findById(currentUser.referredBy);

            // Calculate commission for the current level
            let levelCommissionPercentage;
            if (level >= 1 && level <= 3) {
                levelCommissionPercentage = COMMISSION_PERCENTAGES['1-3'];
            } else if (level >= 4 && level <= 7) {
                levelCommissionPercentage = COMMISSION_PERCENTAGES['4-7'];
            } else if (level >= 8 && level <= 10) {
                levelCommissionPercentage = COMMISSION_PERCENTAGES['8-10'];
            }

            if (levelCommissionPercentage) {
                const commissionAmount = totalCommission * levelCommissionPercentage;

                // Referrer ka balance update karen
                referrerUser.balance += commissionAmount;
                await referrerUser.save();

                // Add commission details to the array
                commissionsArray.push({
                    level: level,
                    user: referrerUser._id,
                    commissionAmount: commissionAmount,
                });
            }

            // Move to the next level in the chain
            currentUserId = referrerUser._id;
        }

        // Step 3: New transaction record create karen
        const transaction = await Transaction.create({
            buyer: buyerId,
            totalAmount: amount,
            totalCommission: totalCommission,
            commissions: commissionsArray,
        });

        // Response mein updated buyer ka data bhejen
        res.status(201).json({
            message: 'Transaction completed successfully and commissions have been distributed.',
            buyerBalance: buyer.balance,
            transaction,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTransaction };