// src/components/common/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import './Navbar.css'; // Create and style accordingly

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-brand">
        <Link to="/">Task Manager</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
