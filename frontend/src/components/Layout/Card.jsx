// src/components/Layout/Card.js
import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className={`
        w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl 
        border border-white/20 p-8 animate-slide-up hover:shadow-3xl 
        transition-all duration-300 hover:-translate-y-1 ${className}
      `}>
        {children}
      </div>
    </div>
  );
};

export default Card;