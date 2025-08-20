import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

// 1. Context banate hain
const AuthContext = createContext();

// 2. AuthProvider component - ye sara app ko wrap karega
export const AuthProvider = ({ children }) => {
    // State variables - ye sab data store karte hain
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Default loading to true
    const [error, setError] = useState(null);

    // 3. Page load hone par check karna hai ki user pehle se logged in hai ya nahi
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false); // Loading complete on initial load
    }, []);

    // ✅ Naya function: User data ko update karne ke liye
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
    };

    // 4. LOGIN FUNCTION
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/users/login', {
                email,
                password
            });

            const { token, ...userData } = response.data;

            setToken(token);
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setLoading(false);
            return { success: true };

        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Login failed!';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    // 5. SIGNUP FUNCTION
    const signup = async (name, email, password, referralCode) => {
        try {
            setLoading(true);
            setError(null);

            await api.post('/users/signup', {
                name,
                email,
                password,
                referredBy: referralCode
            });

            setLoading(false);
            return { success: true };

        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Signup failed!';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    // 6. LOGOUT FUNCTION
    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // 7. Value object - ye sab components ko milega
    const contextValue = {
        // Data
        user,
        token,
        loading,
        error,

        // Functions
        login,
        signup,
        logout,
        updateUser, // ✅ update karne wala function yahan shamil kiya gaya

        // Helper
        isLoggedIn: !!user
    };

    // 8. Provider return karte hain
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 9. Custom hook - components mein use karne ke liye
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth hook AuthProvider ke andar hi use kar sakte hain!');
    }

    return context;
};

/* HOW TO USE (Kaise use karna hai):

1. App.js mein wrap karo:
   <AuthProvider>
     <App />
   </AuthProvider>

2. Kisi bhi component mein use karo:
   const { user, login, logout, loading, error, updateUser } = useAuth();

3. Login karne ke liye:
   const result = await login(email, password);
   if (result.success) {
     // Login successful
   }

4. Check karna hai logged in hai ya nahi:
   const { isLoggedIn, user } = useAuth();
   if (isLoggedIn) {
     console.log('User logged in:', user.name);
   }
*/