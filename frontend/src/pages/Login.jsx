// src/pages/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Login.css'; // Create and style accordingly


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = { 
        login: credentials.username, // Rename for backend compatibility 
        password: credentials.password 
      };
      await login(loginData); // Pass the modified data structure
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };
  

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <TextField
          label="Username or Email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={credentials.password}
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
        <button type="submit" className="submit-button">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </motion.div>
  );
};

export default Login;
