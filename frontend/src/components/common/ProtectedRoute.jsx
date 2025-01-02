// src/components/common/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }




  // if (isAuthenticated ===  false) {
  //   // Redirect to login page and preserve the current location
  //   return <Navigate to="/login" />;
  // }          // This is why the person is being redirected to the login page everytime.

  return children;
};

export default ProtectedRoute;


