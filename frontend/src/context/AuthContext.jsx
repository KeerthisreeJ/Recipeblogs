import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kittyeats_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount or token change
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('kittyeats_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.data?.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('kittyeats_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
      localStorage.removeItem('kittyeats_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.data?.success) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('kittyeats_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.data?.message || 'Login failed');
  };

  // Register
  const register = async (formData) => {
    const response = await authService.register(formData);
    if (response.data?.success) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('kittyeats_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.data?.message || 'Registration failed');
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('kittyeats_token');
    setToken(null);
    setUser(null);
  };

  // Update local user state
  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
