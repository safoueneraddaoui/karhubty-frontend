import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import rentalService from '../services/rentalService';

const ReservedCarsPage = ({ user }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserRentals();
  }, []);

  const fetchUserRentals = async () => {
    try {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      const data = await rentalService.getUserRentals(user.id);
      setRentals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRental = async (rentalId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      await rentalService.cancelRental(rentalId);
      setMessage({ type: 'success', text: 'Reservation cancelled successfully' });
      fetchUserRentals();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to cancel reservation' });
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Voitures Réservées</h1>
          <p className="text-gray-600">Manage your car reservations</p>
        </div>

        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg mb-6">No reservations yet</p>
            <Link to="/cars" className="inline-block bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600">
              Browse Available Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map(rental => (
              <div key={rental.rentalId || rental.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Car Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={rental.car?.image || 'https://via.placeholder.com/400x300?text=Car'} 
                    alt={`${rental.car?.brand} ${rental.car?.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(rental.status)}`}>
                    {rental.status?.charAt(0).toUpperCase() + rental.status?.slice(1)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Car Info */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {rental.car?.brand} {rental.car?.model}
                  </h3>

                  {/* Dates */}
                  <div className="space-y-3 mb-4 border-y border-gray-200 py-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>From: {new Date(rental.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>To: {new Date(rental.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Total: ${rental.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link 
                      to={`/cars/${rental.car?.carId}`}
                      className="flex-1 flex items-center justify-center bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                    {['pending', 'approved'].includes(rental.status?.toLowerCase()) && (
                      <button
                        onClick={() => handleCancelRental(rental.rentalId || rental.id)}
                        className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservedCarsPage;
