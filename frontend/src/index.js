// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'; // Updated import path
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider>
      <AuthProvider>
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </AuthProvider>
    </ApiProvider>
  </React.StrictMode>
);
