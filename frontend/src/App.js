// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import ListPage from './pages/ListPage';
import './styles/App.css';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
            path="/dashboard/list/:listId"
            element={
              <ProtectedRoute>
                <ListPage />
              </ProtectedRoute>
            }
          />
        {/* Add more routes as needed */}

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
