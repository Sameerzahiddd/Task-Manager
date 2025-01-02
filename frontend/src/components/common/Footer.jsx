// src/components/common/Footer.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css'; // Create and style accordingly

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <p>&copy; {new Date().getFullYear()} Sameer. All rights reserved.</p>
    </motion.footer>
  );
};

export default Footer;
