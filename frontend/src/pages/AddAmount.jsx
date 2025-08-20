// src/components/Pages/AddAmount.js
import React, { useState } from 'react';
import { Plus, CreditCard, Wallet, DollarSign } from 'lucide-react';
// Zaroori hooks aur utilities import karen
import { useAuth } from '../context/AuthContext';

import { api } from '../utils/api';

const AddAmount = () => {
  // useAuth hook se user aur updateUser function ko lein
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false); // Naya loading state

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const handleAddAmount = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // Backend API ko call karen naye balance ke liye
      // Ye backend route `api/users/add-balance` hoga jaisa pehle bataya gaya hai
      const response = await api.post('/users/add-balance', { amount: Number(amount) });

      // API se updated user data (jis mein naya balance hoga) lein aur state update karen
      updateUser(response.data);

      alert(`Successfully added $${amount} to your wallet.`);
      setAmount(''); // Input field ko clear karen
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add amount.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Amount</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Amount Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add Money to Wallet</h2>

          <form onSubmit={handleAddAmount}>
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickAmount(value)}
                    className={`
                                            py-2 px-4 rounded-lg border transition-colors
                                            ${amount == value
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }
                                        `}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  Credit/Debit Card
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Wallet className="w-5 h-5 mr-2 text-gray-600" />
                  Digital Wallet
                </label>
              </div>
            </div>

            {/* Add Amount Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              disabled={loading} // Loading state par button ko disable karen
            >
              <Plus className="w-5 h-5 mr-2" />
              {loading ? 'Adding...' : 'Add Amount'}
            </button>
          </form>
        </div>

        {/* Wallet Info */}
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Current Balance</h3>
            {/* User ka balance yahan show karen */}
            <p className="text-3xl font-bold">${user?.balance?.toFixed(2) || '0.00'}</p>                    </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
            {/* Dummy transaction data ki bajaye actual API se data fetch karen */}
            <div className="space-y-3">
              {[
                { type: 'Added', amount: '+$100', date: '2 hours ago' },
                { type: 'Purchase', amount: '-$25', date: '1 day ago' },
                { type: 'Added', amount: '+$50', date: '3 days ago' },
                { type: 'Purchase', amount: '-$75', date: '5 days ago' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <span className={`font-bold ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAmount;