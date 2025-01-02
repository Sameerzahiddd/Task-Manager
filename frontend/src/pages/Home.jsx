// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './Home.css'; // Create and style accordingly

const Home = () => {
  return (
    <>
      <Navbar />
      <motion.div
        className="home-page"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome to Task Manager</h1>
        <p>Your ultimate tool for managing tasks and to-do lists efficiently.</p>
        <div className="cta-buttons">
          <Link to="/login" className="btn">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Signup
          </Link>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Home;
