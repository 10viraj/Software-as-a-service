import axios from 'axios';
import { Calendar, Clock, User, CheckCircle, XCircle, Clock4, Filter, Search, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';


const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/appointments/all');
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching all appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredApts = appointments.filter(apt => 
    apt.patientId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctorId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.problemType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return <div className="text-center py-10">Loading all system appointments...</div>;

  return (
    <div className="w-full py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 bg-white text-gray-500 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Appointments</h1>
            <p className="text-gray-500 text-sm">Monitor all bookings and their progress across the platform.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-blue-600">
            Total: {appointments.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patient, doctor, or problem..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Patient</th>
                <th className="px-6 py-4 font-bold">Assigned Doctor</th>
                <th className="px-6 py-4 font-bold">Date & Time</th>
                <th className="px-6 py-4 font-bold">Problem Type</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApts.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{apt.patientId.name}</div>
                    <div className="text-xs text-gray-500">{apt.patientId.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-blue-600 font-medium">
                      <User className="w-4 h-4" />
                      <span>{apt.doctorId.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{format(new Date(apt.date), 'MMM dd, yyyy')}</div>
                    <div className="text-xs text-gray-500">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">{apt.problemType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${getStatusStyle(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedApt(apt)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
        {filteredApts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No appointments found matching your search.
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
              <h3 className="text-xl font-bold">Appointment Details</h3>
              <button onClick={() => setSelectedApt(null)} className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Patient Name</p>
                  <p className="font-bold text-gray-900">{selectedApt.patientId.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Doctor Name</p>
                  <p className="font-bold text-blue-600">{selectedApt.doctorId.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Date</p>
                  <p className="font-medium text-gray-700">{format(new Date(selectedApt.date), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Time Slot</p>
                  <p className="font-medium text-gray-700">{selectedApt.time}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Medical Concern</p>
                <p className="mt-1 font-bold text-gray-900">{selectedApt.problemType}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Patient Description</p>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "{selectedApt.description || 'No description provided.'}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    selectedApt.status === 'accepted' ? 'bg-green-500' :
                    selectedApt.status === 'rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-bold capitalize text-gray-700">Status: {selectedApt.status}</span>
                </div>
                <button 
                  onClick={() => setSelectedApt(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminAppointments;
