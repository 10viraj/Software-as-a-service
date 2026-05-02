import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Star, Calendar, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return <div className="text-center py-10">Loading doctors...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Available Doctors</h1>
        <div className="text-sm text-gray-500">{doctors.length} doctors found</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  {doctor.userId.profilePic ? (
                    <img
                      src={doctor.userId.profilePic}
                      alt={doctor.userId.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{doctor.userId.name}</h3>
                  <p className="text-sm font-medium text-blue-600">{doctor.specialization}</p>
                  <div className="mt-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-700">{doctor.averageRating || 'New'}</span>
                    <span className="text-xs text-gray-400">({doctor.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Experience</p>
                  <p className="text-sm font-bold text-gray-900">{doctor.experience} Years</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fees</p>
                  <p className="text-sm font-bold text-gray-900">${doctor.fees}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to={`/book/${doctor._id}`}

                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Link>
                <Link 
                  to={`/chat/${doctor.userId._id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
