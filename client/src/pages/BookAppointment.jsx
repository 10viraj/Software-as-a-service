import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, AlertCircle, CheckCircle2, User, ArrowLeft } from 'lucide-react';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    problemType: '',
    description: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
        setDoctor(data);
      } catch (err) {
        setError('Doctor not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        doctorId: doctor.userId._id, // Send the User ID of the doctor
        ...formData
      });
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading doctor details...</div>;
  if (!doctor) return <div className="text-center py-10 text-red-500 font-bold">Doctor not found!</div>;

  return (
    <div className="w-full py-4">
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white text-gray-500 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
      </div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">


        <div className="md:flex">
          {/* Doctor Info Sidebar */}
          <div className="md:w-1/3 bg-blue-600 p-8 text-white">
            <div className="text-center">
              {doctor.userId.profilePic ? (
                <img
                  src={doctor.userId.profilePic}
                  alt={doctor.userId.name}
                  className="w-32 h-32 rounded-2xl mx-auto object-cover border-4 border-blue-400 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-blue-500 mx-auto flex items-center justify-center border-4 border-blue-400 shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              <h2 className="mt-4 text-2xl font-bold">{doctor.userId.name}</h2>
              <p className="text-blue-100 font-medium">{doctor.specialization}</p>
              <div className="mt-6 space-y-4 text-left">
                <div className="flex items-center text-sm bg-blue-700 p-3 rounded-xl">
                  <Clock className="w-4 h-4 mr-3 text-blue-200" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                <div className="flex items-center text-sm bg-blue-700 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 mr-3 text-blue-200" />
                  <span>${doctor.fees} Consultation Fee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:w-2/3 p-8 lg:p-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
            <p className="text-gray-500 mb-8">Please fill in the details below to schedule your visit.</p>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-bounce">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900">Booking Successful!</h3>
                <p className="text-green-700 mt-2">Redirecting to your appointments...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center border border-red-100">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Problem Type</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={formData.problemType}
                    onChange={(e) => setFormData({...formData, problemType: e.target.value})}
                  >
                    <option value="">Select a type...</option>
                    <option value="Consultation">General Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Diagnostic">Diagnostic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    rows="4"
                    placeholder="Briefly describe your symptoms..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-200 cursor-pointer"
                >
                  {booking ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
