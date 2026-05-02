import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import ManageDoctors from './pages/ManageDoctors';
import AdminDashboard from './pages/AdminDashboard';
import AdminAppointments from './pages/AdminAppointments';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';

import { useAuth } from './context/AuthContext';

const socket = io('http://localhost:5000');

function App() {
  const { user, addNotification } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      socket.emit('join', user._id);

      socket.on('receiveMessage', (data) => {
        // If user is not on the chat page with THIS specific person
        if (!location.pathname.includes(`/chat/${data.senderId}`)) {
          addNotification(data);
        }
      });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [user, location.pathname]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {user && <Navbar />}
      <main className={user ? "px-4 py-4" : ""}>
        <Routes>


        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/chat/:userId" element={user ? <Chat /> : <Navigate to="/login" />} />


        
        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
          </>
        )}



        {/* Doctor Routes */}
        {user?.role === 'doctor' && (
          <>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          </>
        )}

        {/* Patient Routes */}
        {user?.role === 'patient' && (
          <>
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/book/:doctorId" element={<BookAppointment />} />
            <Route path="/appointments" element={<MyAppointments />} />
          </>
        )}


      </Routes>
      </main>
    </div>
  );
}


export default App;
