import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, Calendar, Clock, Activity, ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard stats...</div>;

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center mb-8">

        {/* <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of your healthcare system activity.</p>
        </div> */}
        <Link
          to="/admin/doctors"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-100"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Manage Doctors
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Doctors</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.doctorCount}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Registered Patients</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.patientCount}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.appointmentCount}</h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-2xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingAppointments}</h3>
            </div>
            <div className="bg-orange-50 p-3 rounded-2xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Appointments
            </h3>
            <button className="text-blue-600 text-sm font-bold hover:underline flex items-center cursor-pointer">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Patient</th>
                  <th className="px-6 py-4 font-bold">Doctor</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.patientId.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{apt.doctorId.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${apt.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          apt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(apt.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Quick Links */}
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">System Control</h3>
            <p className="text-blue-100 text-sm">Monitor performance and manage your healthcare staff.</p>
          </div>
          <div className="space-y-4">
            <Link to="/admin/doctors" className="block bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all group cursor-pointer border border-white/10">
              <div className="flex justify-between items-center">
                <span className="font-bold">Staff Directory</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <div className="block bg-white/10 p-4 rounded-2xl border border-white/10 opacity-50">
              <div className="flex justify-between items-center">
                <span className="font-bold">Analytics Reports</span>
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-blue-200">Logged in as System Admin</p>
            <p className="text-sm font-bold mt-1">HealthConnect Pro v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
