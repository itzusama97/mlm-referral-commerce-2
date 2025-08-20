// src/pages/BuyProduct.js

import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const BuyProduct = () => {
    // useAuth hook se user aur updateUser function ko lein
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Ye products ki price Numbers honi chahiye
    const products = [
        { id: 1, name: 'Premium Package', price: 99.00, rating: 4.8, features: ['Feature 1', 'Feature 2', 'Feature 3'], popular: true },
        { id: 2, name: 'Basic Package', price: 49.00, rating: 4.5, features: ['Feature 1', 'Feature 2'], popular: false },
        { id: 3, name: 'Enterprise Package', price: 199.00, rating: 4.9, features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'], popular: false }
    ];

    const handleBuyProduct = async (product) => {
        // User ka balance check karen
        if (!user || user.balance < product.price) {
            alert('Insufficient balance. Please add funds to your wallet.');
            return;
        }

        setLoading(true);

        try {
            // Transaction API call jo balance cut karegi aur commission distribute karegi
            // Backend par naya route '/transactions/buy' banega
            await api.post('/transactions/buy', { amount: product.price });

            // Transaction ke baad, server se updated user ka profile fetch karen
            // Ye ek tareeqa hai balance ko refresh karne ka, agar API response mein updated user data nahi hai
            const updatedProfileResponse = await api.get('/users/profile');
            
            // Context mein user data ko update karen
            updateUser(updatedProfileResponse.data);

            alert(`Successfully purchased ${product.name}! Your new balance is $${updatedProfileResponse.data.balance.toFixed(2)}.`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to complete transaction.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Buy Products</h1>
            {/* Yahan par user ka current balance show karen */}
            <p className="mb-4 text-xl font-medium">Your Current Balance: ${user?.balance?.toFixed(2) || '0.00'}</p>
            
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
                            {/* Price ko fixed decimal places ke saath display karen */}
                            <div className="text-3xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</div>
                            
                            {/* Rating */}
                            <div className="flex items-center justify-center mb-4">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-6">
                            {product.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Buy Button always at bottom */}
                        <button
                            onClick={() => handleBuyProduct(product)}
                            className={`
                                w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center mt-auto
                                ${product.popular 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }
                            `}
                            disabled={loading}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {loading ? 'Processing...' : 'Buy Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyProduct;