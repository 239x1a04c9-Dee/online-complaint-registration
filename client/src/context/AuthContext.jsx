import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ocr_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom router state
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentComplaintId, setCurrentComplaintId] = useState(null);

  const API_URL = 'http://192.168.10.73:5000/api';

  useEffect(() => {
    loadUser();
  }, [token]);

  const loadUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        // If user logged in, redirect away from landing/login/register to dashboard
        if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register') {
          setCurrentPage('dashboard');
        }
      } else {
        // Token invalid
        logout();
      }
    } catch (err) {
      console.error('Error loading user:', err);
      // Don't log out if it's a network error (server down), just keep local state
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('ocr_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setCurrentPage('dashboard');
        return true;
      } else {
        setError(data.msg || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Connection to server failed. Ensure backend is running.');
      return false;
    }
  };

  const register = async (name, email, password, role, department) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, department })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('ocr_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setCurrentPage('dashboard');
        return true;
      } else {
        setError(data.msg || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Connection to server failed. Ensure backend is running.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ocr_token');
    setToken(null);
    setUser(null);
    setCurrentPage('landing');
    setCurrentComplaintId(null);
    setError(null);
  };

  const navigateTo = (page, complaintId = null) => {
    setCurrentPage(page);
    if (complaintId) {
      setCurrentComplaintId(complaintId);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      currentPage,
      currentComplaintId,
      API_URL,
      login,
      register,
      logout,
      navigateTo,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
