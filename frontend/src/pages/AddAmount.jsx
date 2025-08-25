// src/components/Pages/AddAmount.js
import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Wallet, DollarSign, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

const AddAmount = () => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  // Fetch transactions function
  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const response = await api.get('/add-balance/recent');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const handleAddAmount = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/add-balance/', { 
        amount: Number(amount) 
      });

      // Update user balance in context
      updateUser({ 
        ...user, 
        balance: user.balance + Number(amount) 
      });

      toast.success(`Successfully added $${amount} to your wallet!`);
      setAmount('');
      
      // Refresh transactions after successful balance addition
      fetchTransactions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add amount.';
      toast.error(errorMessage);
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
              disabled={loading}
            >
              <Plus className="w-5 h-5 mr-2" />
              {loading ? 'Adding...' : 'Add Amount'}
            </button>
          </form>
        </div>

        {/* Wallet Info */}
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl shadow-lg p-8">
            <p className="text-sm font-medium opacity-80 mb-2">Your Current Balance</p>
            <div className="flex items-end">
              <span className="text-4xl font-bold">$</span>
              <span className="text-5xl font-extrabold tracking-wide ml-1">
                {user?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Recent Add Balance History */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Top-ups</h3>
              <button 
                onClick={fetchTransactions}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                disabled={transactionsLoading}
              >
                <RefreshCw className={`w-4 h-4 ${transactionsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {transactionsLoading ? (
              <div className="flex items-center justify-center py-6 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                <span>Loading transactions...</span>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Money Added</p>
                      <p className="text-sm text-gray-500">
                        Added to wallet • {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-green-600">
                        +${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <DollarSign className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <p className="text-gray-500 text-sm">No top-ups yet.</p>
                <p className="text-gray-400 text-xs">Your top-up history will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAmount;