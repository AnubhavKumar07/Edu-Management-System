// AuthContext — manages authentication state across the app
// Security: token management, secure API calls, lockout handling
import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Validate token format before using it
  const isValidToken = (t) => {
    if (!t || typeof t !== 'string') return false;
    // JWT format: xxxxx.xxxxx.xxxxx
    const parts = t.split('.');
    return parts.length === 3;
  };

  // Fetch current user profile
  const fetchUser = async () => {
    try {
      if (!isValidToken(token)) {
        logout();
        return;
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.data);
      } else {
        // Token invalid — clear it
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login — returns lockout and attempt data for UI handling
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        const newToken = data.data.token;

        if (!isValidToken(newToken)) {
          return { success: false, message: 'Received invalid token from server.' };
        }

        setToken(newToken);
        setUser(data.data);
        localStorage.setItem('token', newToken);
        return { success: true, user: data.data };
      } else {
        return {
          success: false,
          message: data.message,
          lockout: data.lockout || false,
          remainingMinutes: data.remainingMinutes,
          attemptsRemaining: data.attemptsRemaining,
        };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (data.success) {
        const newToken = data.data.token;

        if (!isValidToken(newToken)) {
          return { success: false, message: 'Received invalid token from server.' };
        }

        setToken(newToken);
        setUser(data.data);
        localStorage.setItem('token', newToken);
        return { success: true, user: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  // Logout — clear all auth state
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
