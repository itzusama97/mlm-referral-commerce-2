const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    // Is user ki ID jo transaction kar raha hai
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User model se reference
        required: true,
        
    },
    // Transaction ki total amount
    totalAmount: {
        type: Number,
        required: true,
    },
    // Total commission amount (totalAmount ka 20%)
    totalCommission: {
        type: Number,
        required: true,
    },
    // Referral commissions ki details
    commissions: [{
        level: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            
        },
        commissionAmount: {
            type: Number,
            required: true,
        }
    }],
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;