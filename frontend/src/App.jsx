
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DashboardLayout from './components/Dashboard/Dashboard';
import Profile from './pages/Profile';
import BuyProduct from './pages/BuyProduct';
import Analytics from './pages/Analytics';
import AddAmount from './pages/AddAmount';

import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
     
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
     
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
     
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
     
  return user ? <Navigate to="/profile" /> : children;
};

// Dashboard Routes with Layout
const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/buy-product" element={<BuyProduct />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/add-amount" element={<AddAmount />} />
      </Routes>
    </DashboardLayout>
  );
};

// Main App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />
             
      {/* Protected Dashboard Routes */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        } 
      />
             
      {/* Default redirect to profile */}
      <Route path="/" element={<Navigate to="/profile" />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;



















// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import Dashboard from './components/Dashboard/Dashboard';
// import './index.css';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
//         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
//           <div className="flex items-center justify-center">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
//             <span className="text-gray-700 font-medium">Loading...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return user ? children : <Navigate to="/login" />;
// };

// // Public Route Component (redirects to dashboard if already logged in)
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
//         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
//           <div className="flex items-center justify-center">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
//             <span className="text-gray-700 font-medium">Loading...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return user ? <Navigate to="/dashboard" /> : children;
// };

// // Main App Routes Component
// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route 
//         path="/login" 
//         element={
//           <PublicRoute>
//             <Login />
//           </PublicRoute>
//         } 
//       />
//       <Route 
//         path="/signup" 
//         element={
//           <PublicRoute>
//             <Signup />
//           </PublicRoute>
//         } 
//       />
      
//       {/* Protected Routes */}
//       <Route 
//         path="/dashboard" 
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } 
//       />
      
//       {/* Default redirect */}
//       <Route path="/" element={<Navigate to="/dashboard" />} />
      
//       {/* 404 Page */}
//       <Route 
//         path="*" 
//         element={
//           <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
//             <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-white text-2xl font-bold">404</span>
//               </div>
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
//               <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
//               <Navigate to="/login" />
//             </div>
//           </div>
//         } 
//       />
//     </Routes>
//   );
// };

// // Main App Component
// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <AppRoutes />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;