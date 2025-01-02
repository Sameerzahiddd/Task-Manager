// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, signup as signupService, logout as logoutService, getCurrentUser } from '../services/auth';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast.error('Failed to fetch user information.');
      }
    };
    fetchCurrentUser();
  }, []);

  const isAuthenticated = !!user;

  const login = async (credentials) => {
    try {
      const userData = await loginService(credentials);
      setUser(userData);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      await signupService(userData);
      // Automatically log in the user after successful signup
      const userDataForLogin = { login: userData.username, password: userData.password };
      const userLoggedInData = await loginService(userDataForLogin);
      setUser(userLoggedInData);
      toast.success('Signup successful! You are now logged in.');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
