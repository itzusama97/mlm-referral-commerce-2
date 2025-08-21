import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

// A simple message component to show success or error messages
const MessageBox = ({ type, message, onClose }) => {
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
    const [message, setMessage] = useState(null); // State for the message box
    const [messageType, setMessageType] = useState(''); // State for message type (success/error)

    const products = [
        { id: 1, name: 'Premium Package', price: 99.00, rating: 4.8, features: ['Feature 1', 'Feature 2', 'Feature 3'], popular: true },
        { id: 2, name: 'Basic Package', price: 49.00, rating: 4.5, features: ['Feature 1', 'Feature 2'], popular: false },
        { id: 3, name: 'Enterprise Package', price: 199.00, rating: 4.9, features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'], popular: false }
    ];

    const handleBuyProduct = async (product) => {
        // Check for insufficient balance before making the API call
        if (!user || user.balance < product.price) {
            setMessageType('error');
            setMessage('Insufficient balance. Please add funds to your wallet.');
            return;
        }

        setLoading(prev => ({ ...prev, [product.id]: true }));
        setMessage(null);

        try {
            await api.post('/transactions/buy', { amount: product.price });
            const updatedProfileResponse = await api.get('/users/profile');
            updateUser(updatedProfileResponse.data);

            setMessageType('success');
            setMessage(`Successfully purchased ${product.name}! Your new balance is $${updatedProfileResponse.data.balance.toFixed(2)}.`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to complete transaction.';
            setMessageType('error');
            setMessage(errorMessage);
        } finally {
            setLoading(prev => ({ ...prev, [product.id]: false }));
        }
    };

    return (
        <div className="max-w-6xl mx-auto font-sans p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Buy Products</h1>

            <MessageBox type={messageType} message={message} onClose={() => setMessage(null)} />

            <div className="bg-white rounded-xl shadow-sm p-6 max-w-sm mb-6">
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">Your Current Balance</p>
                <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-gray-900">$</span>
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {user?.balance?.toFixed(2) || '0.00'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className={`
                            bg-white rounded-lg shadow-sm border p-6 relative flex flex-col
                            ${product.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''}
                        `}
                    >
                        {product.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Popular
                                </span>
                            </div>
                        )}

                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</div>

                            <div className="flex items-center justify-center mb-4">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6">
                            {product.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleBuyProduct(product)}
                            className={`
                                w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center mt-auto outline-none
                                ${product.popular
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }
                            `}
                            disabled={loading[product.id]}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {loading[product.id] ? 'Processing...' : 'Buy Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyProduct;
