// src/components/Layout/DashboardLayout.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, BarChart3, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: 'Profile',
      icon: User,
      path: '/profile',
    },
    {
      name: 'Buy Product',
      icon: ShoppingCart,
      path: '/buy-product',
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
    },
    {
      name: 'Add Amount',
      icon: Plus,
      path: '/add-amount',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        {/* Logo/Brand */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">MyApp</h1>
        </div>

        {/* Menu Items */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;











// // src/components/Dashboard/Dashboard.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LogOut, User, Mail, Users, Copy, CheckCircle } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import Card from '../Layout/Card';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [copied, setCopied] = React.useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const copyReferralCode = () => {
//     navigator.clipboard.writeText(user.referralCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(word => word.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <Card className="max-w-lg">
//       <div className="text-center mb-8">
//         <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <span className="text-white text-2xl font-bold">
//             {getInitials(user.name)}
//           </span>
//         </div>
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
//         <p className="text-gray-600">Welcome back, {user.name.split(' ')[0]}!</p>
//       </div>

//       <div className="space-y-4">
//         {/* User Name */}
//         <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
//           <div className="flex items-center">
//             <User className="w-5 h-5 text-blue-600 mr-3" />
//             <div>
//               <p className="text-sm font-medium text-gray-500">Name</p>
//               <p className="text-lg font-semibold text-gray-800">{user.name}</p>
//             </div>
//           </div>
//         </div>

//         {/* Email */}
//         <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
//           <div className="flex items-center">
//             <Mail className="w-5 h-5 text-green-600 mr-3" />
//             <div>
//               <p className="text-sm font-medium text-gray-500">Email</p>
//               <p className="text-lg font-semibold text-gray-800">{user.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Referred By */}
//         <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
//           <div className="flex items-center">
//             <Users className="w-5 h-5 text-orange-600 mr-3" />
//             <div>
//               <p className="text-sm font-medium text-gray-500">Referred By</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {user.referredBy || 'Direct Signup'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Referral Code */}
//         <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Users className="w-5 h-5 text-purple-600 mr-3" />
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Your Referral Code</p>
//                 <p className="text-lg font-semibold text-gray-800 font-mono">
//                   {user.referralCode}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={copyReferralCode}
//               className="ml-2 p-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200"
//               title="Copy referral code"
//             >
//               {copied ? (
//                 <CheckCircle className="w-4 h-4 text-green-600" />
//               ) : (
//                 <Copy className="w-4 h-4 text-purple-600" />
//               )}
//             </button>
//           </div>
//           {copied && (
//             <p className="text-sm text-green-600 mt-2 animate-fade-in">
//               Referral code copied to clipboard!
//             </p>
//           )}
//         </div>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="w-full mt-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center"
//       >
//         <LogOut className="w-5 h-5 mr-2" />
//         Logout
//       </button>
//     </Card>
//   );
// };

// export default Dashboard;