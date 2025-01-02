// src/pages/Signup.jsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Signup.css'; // Create and style accordingly

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
      navigate('/dashboard');
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <motion.div
      className="signup-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Signup</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <TextField
          label="Full Name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Username"
          name="username"
          value={userData.username}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={userData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <button type="submit" className="submit-button">Signup</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </motion.div>
  );
};

export default Signup;
