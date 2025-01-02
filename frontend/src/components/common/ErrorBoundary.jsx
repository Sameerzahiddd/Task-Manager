// src/components/common/ErrorBoundary.jsx

import React from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    toast.error('Something went wrong.');
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
