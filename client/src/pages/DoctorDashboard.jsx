import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Check, X, ClipboardList, AlertCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';



const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments/doctor');
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { status });
      fetchAppointments(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-10">Loading patient requests...</div>;

  const pendingApts = appointments.filter(a => a.status === 'pending');
  const otherApts = appointments.filter(a => a.status !== 'pending');

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium">New Requests</p>
              <h2 className="text-4xl font-bold mt-1">{pendingApts.length}</h2>
            </div>
            <div className="bg-blue-500 p-3 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start text-gray-900">
            <div>
              <p className="text-gray-500 font-medium">Scheduled Today</p>
              <h2 className="text-4xl font-bold mt-1">
                {appointments.filter(a => a.status === 'accepted').length}
              </h2>
            </div>
            <div className="bg-green-50 p-3 rounded-2xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start text-gray-900">
            <div>
              <p className="text-gray-500 font-medium">Total Completed</p>
              <h2 className="text-4xl font-bold mt-1">
                {appointments.filter(a => a.status === 'completed').length}
              </h2>
            </div>
            <div className="bg-purple-50 p-3 rounded-2xl">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/* Pending Requests */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ClipboardList className="w-6 h-6 mr-2 text-blue-600" />
            Pending Patient Requests
          </h2>
          {pendingApts.length === 0 ? (
            <p className="text-gray-500 bg-white p-8 rounded-3xl text-center border border-dashed border-gray-200">No new requests at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApts.map((apt) => (
                <div key={apt._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl">
                        {apt.patientId.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{apt.patientId.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{apt.problemType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{format(new Date(apt.date), 'MMM dd')}</p>
                      <p className="text-xs text-gray-500">{apt.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600 line-clamp-2">{apt.description || 'No description provided.'}</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Link 
                      to={`/chat/${apt.patientId._id}`}
                      className="flex-1 flex items-center justify-center py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Link>
                    <button 
                      onClick={() => handleStatusUpdate(apt._id, 'accepted')}
                      className="flex-1 flex items-center justify-center py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(apt._id, 'rejected')}
                      className="flex-1 flex items-center justify-center py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

        {/* Other Appointments */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Schedule</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Patient</th>
                    <th className="px-6 py-4 font-bold">Date & Time</th>
                    <th className="px-6 py-4 font-bold">Problem</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {otherApts.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {apt.patientId.name[0]}
                          </div>
                          <span className="font-medium text-gray-900">{apt.patientId.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-medium">{format(new Date(apt.date), 'MMM dd, yyyy')}</p>
                        <p className="text-xs text-gray-500">{apt.time}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{apt.problemType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          apt.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          apt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Link 
                            to={`/chat/${apt.patientId._id}`}
                            className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Chat with Patient"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </Link>
                          {apt.status === 'accepted' && (
                            <button 
                              onClick={() => handleStatusUpdate(apt._id, 'completed')}
                              className="text-blue-600 text-sm font-bold hover:underline cursor-pointer"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
