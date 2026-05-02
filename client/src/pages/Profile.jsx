import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Save, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = React.useRef(null);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePic: '',
    password: '',
    confirmPassword: '',
    // Doctor specific fields
    specialization: '',
    experience: '',
    fees: '',
    about: '',
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          profilePic: data.profilePic || '',
          password: '',
          confirmPassword: '',
          specialization: data.doctorProfile?.specialization || '',
          experience: data.doctorProfile?.experience || '',
          fees: data.doctorProfile?.fees || '',
          about: data.doctorProfile?.about || '',
        });

      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', formData);
      
      // Update global auth state
      updateUser(data);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUpdating(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/upload', formDataUpload, config);
      setFormData({ ...formData, profilePic: `http://localhost:5000${data}` });
      setMessage({ type: 'success', text: 'Image uploaded! Remember to save changes.' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Image upload failed' });
    } finally {
      setUpdating(false);
    }
  };


  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="w-full py-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        <div className="md:flex">
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100">
            <div className="text-center">
              <div className="relative inline-block">
                {formData.profilePic ? (
                  <img
                    src={formData.profilePic}
                    alt={formData.name}
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-16 h-16 text-blue-600" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={uploadFileHandler}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-sm text-gray-500 font-medium capitalize">{authUser.role}</p>
              
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                  <Mail className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="truncate">{formData.email}</span>
                </div>
                {formData.phone && (
                  <div className="flex items-center text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                    <Phone className="w-4 h-4 mr-3 text-green-500" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-8 lg:p-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                {authUser.role} Settings
              </span>
            </div>



            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center border ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Profile Picture URL</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.profilePic}
                    onChange={(e) => setFormData({...formData, profilePic: e.target.value})}
                  />
                </div>
              </div>

              {authUser.role === 'doctor' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Specialization</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Experience (Years)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Consultation Fees ($)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.fees}
                        onChange={(e) => setFormData({...formData, fees: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">About / Biography</label>
                    <textarea
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      value={formData.about}
                      onChange={(e) => setFormData({...formData, about: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Residential Address</label>

                <textarea
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password (Optional)</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
