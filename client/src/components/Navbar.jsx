import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Home, Calendar, Users, Activity, Bell } from 'lucide-react';


const Navbar = () => {
  const { user, logout, notifications, clearNotifications } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HealthConnect</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              {user.role === 'patient' && (
                <>
                  <Link
                    to="/doctors"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Browse Doctors
                  </Link>
                  <Link
                    to="/appointments"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    My Appointments
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/doctors"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Doctors
                  </Link>
                  <Link
                    to="/admin/appointments"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    All Appointments
                  </Link>
                </>
              )}




            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => {
                  if (notifications.length > 0) {
                    const lastSenderId = notifications[0].senderId;
                    navigate(`/chat/${lastSenderId}`);
                    clearNotifications();
                  }
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            <Link to="/profile" className="flex items-center group cursor-pointer">

              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-blue-50 transition-colors">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <User className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {user.role}
                </span>
              </div>
            </Link>
            <div className="flex-shrink-0">
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
