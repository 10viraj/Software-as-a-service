import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role-based redirection
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  if (user.role === 'doctor') {
    return <Navigate to="/doctor/dashboard" />;
  }
  if (user.role === 'patient') {
    return <Navigate to="/doctors" />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <p className="text-gray-600">Your role: {user.role}</p>
    </div>
  );
};


export default Dashboard;
