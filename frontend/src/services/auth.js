// src/services/auth.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Your Flask backend URL

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData, { withCredentials: true });
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
};

export const getCurrentUser = async () => {
  // Implement an endpoint in your backend to get the current user
  // For example, GET /api/current_user
  const response = await axios.get(`${API_URL}/current_user`, { withCredentials: true });
  return response.data;
};
