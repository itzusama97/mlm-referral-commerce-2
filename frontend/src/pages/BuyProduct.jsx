// src/components/Pages/BuyProduct.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

// Simple in-file message box with auto-dismiss functionality
const MessageBox = ({ type, message, onClose }) => {
  // Auto-dismiss after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const title = isSuccess ? 'Success!' : 'Error!';

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${bgColor}`}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

const BuyProduct = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // Transaction state (unchanged)
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Demo products (unchanged)
  const products = [
    { id: 1, name: 'Premium Package', price: 99.0, rating: 4.8, features: ['Feature 1', 'Feature 2', 'Feature 3'], popular: true },
    { id: 2, name: 'Basic Package', price: 49.0, rating: 4.5, features: ['Feature 1', 'Feature 2'], popular: false },
    { id: 3, name: 'Enterprise Package', price: 199.0, rating: 4.9, features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'], popular: false },
  ];

  // Fetch recent transactions (unchanged)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const response = await api.get('/transactions/recent');
        setTransactions(response.data.slice(0, 4)); // show 4 recent
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setTransactionsLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user?.balance]);

  // Buy flow (unchanged)
  const handleBuyProduct = async (product) => {
    if (!user || user.balance < product.price) {
      setMessageType('error');
      setMessage('Insufficient balance. Please add funds to your wallet.');
      return;
    }

    setLoading((prev) => ({ ...prev, [product.id]: true }));
    setMessage(null);

    try {
      await api.post('/transactions/buy', { amount: product.price });

      // refresh profile to update balance
      const updatedProfileResponse = await api.get('/users/profile');
      updateUser(updatedProfileResponse.data);

      setMessageType('success');
      setMessage(
        `Successfully purchased ${product.name}! Your new balance is $${updatedProfileResponse.data.balance.toFixed(
          2
        )}.`
      );

      // refresh transactions list
      const txRes = await api.get('/transactions/recent');
      setTransactions(txRes.data.slice(0, 4));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to complete transaction.';
      setMessageType('error');
      setMessage(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-sans p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Buy Products</h1>

      <MessageBox type={messageType} message={message} onClose={() => setMessage(null)} />

      {/* Current Balance */}
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-sm mb-8">
        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">Your Current Balance</p>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-gray-900">$</span>
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {user?.balance?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      {/* Products Grid - Ensuring 3 cards per row on all screen sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border p-6 relative flex flex-col h-full ${
              product.popular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
            }`}
          >
            {product.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-3">
                ${product.price.toFixed(2)}
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex-grow mb-6">
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleBuyProduct(product)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center outline-none transform hover:scale-[1.02] ${
                product.popular 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
              } ${loading[product.id] ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={loading[product.id]}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {loading[product.id] ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Recent Transactions Section - Full width with improved design */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
            <p className="text-sm text-gray-500 mt-1">Your latest transaction history</p>
          </div>
          {transactionsLoading && (
            <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          )}
        </div>

        {!transactionsLoading && transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((transaction, index) => (
              <div 
                key={transaction._id} 
                className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'add-balance' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <ShoppingCart className={`w-5 h-5 ${
                      transaction.type === 'add-balance' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {transaction.type === 'add-balance' ? 'Balance Added' : 'Product Purchase'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  {transaction.type === 'buy' && transaction.totalCommission > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Commission: ${transaction.totalCommission.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyProduct;