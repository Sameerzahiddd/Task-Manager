// src/contexts/ApiContext.jsx

import React, { createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Your Flask backend URL
    withCredentials: true, // Important for cookie-based authentication
  });

  // Optional: Add interceptors for request/response
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle global errors
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
      return Promise.reject(error);
    }
  );

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
