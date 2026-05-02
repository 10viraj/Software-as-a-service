import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/appointments');
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'rejected': return <XCircle className="w-4 h-4 mr-1" />;
      case 'completed': return <CheckCircle className="w-4 h-4 mr-1" />;
      default: return <Clock4 className="w-4 h-4 mr-1" />;
    }
  };

  if (loading) return <div className="text-center py-10">Loading your appointments...</div>;

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-medium">
          Total: {appointments.length}
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No appointments found</h2>
          <p className="text-gray-500 mt-2">You haven't booked any appointments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                    {apt.doctorId.profilePic ? (
                      <img src={apt.doctorId.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                        <span className="text-2xl font-bold">{apt.doctorId.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{apt.doctorId.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">{apt.problemType}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {format(new Date(apt.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {apt.time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(apt.status)}`}>
                    {getStatusIcon(apt.status)}
                    <span className="capitalize">{apt.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    {apt.status === 'accepted' && !apt.isPaid && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 cursor-pointer">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
