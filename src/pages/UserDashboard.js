import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, XCircle, Eye, MessageSquare, X } from 'lucide-react';
import rentalService from '../services/rentalService';
import reviewService from '../services/reviewService';

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchUserRentals();
  }, []);

  const fetchUserRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalService.getUserRentals(user.id);
      const rentalsData = response.data || response;
      setRentals(Array.isArray(rentalsData) ? rentalsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setRentals([]);
      setLoading(false);
    }
  };

  const cancelRental = async (rentalId) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      try {
        await rentalService.cancelRental(rentalId);
        alert('Rental cancelled successfully');
        fetchUserRentals();
      } catch (error) {
        console.error('Error cancelling rental:', error);
        alert(error || 'Failed to cancel rental. Please try again.');
      }
    }
  };

  const openReviewModal = (rental) => {
    setSelectedRental(rental);
    setShowReviewModal(true);
    setReviewData({ rating: 5, comment: '' });
  };

  const submitReview = async () => {
    if (!reviewData.comment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      await reviewService.createReview({
        rentalId: selectedRental.rentalId,
        carId: selectedRental.car.carId,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment
      });
      
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      fetchUserRentals();
    } catch (error) {
      console.error('Review submission error:', error);
      alert(error || 'Failed to submit review. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <Calendar className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filterRentalsByStatus = (status) => {
    switch(status) {
      case 'active':
        return rentals.filter(r => r.status === 'approved');
      case 'pending':
        return rentals.filter(r => r.status === 'pending');
      case 'completed':
        return rentals.filter(r => r.status === 'completed');
      case 'cancelled':
        return rentals.filter(r => r.status === 'cancelled' || r.status === 'rejected');
      default:
        return rentals;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600">Manage your rentals and explore more vehicles</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Rentals</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {rentals.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {rentals.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {rentals.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-sky-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold text-sky-600 mt-1">
                  €{rentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalPrice, 0)}
                </p>
              </div>
              <div className="bg-sky-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-sky-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/cars')}
              className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors"
            >
              Browse Cars
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-800 transition-colors border-2 border-white"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Filter Tabs - Redesigned */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
            {[
              { key: 'overview', label: 'All Rentals', icon: <Calendar className="w-4 h-4" /> },
              { key: 'active', label: 'Active', icon: <Calendar className="w-4 h-4" /> },
              { key: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
              { key: 'completed', label: 'Completed', icon: <Star className="w-4 h-4" /> },
              { key: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-sky-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.key !== 'overview' && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.key
                      ? 'bg-white bg-opacity-30'
                      : 'bg-gray-200'
                  }`}>
                    {filterRentalsByStatus(tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Rentals List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {activeTab === 'overview' ? 'All Rentals' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Rentals`}
          </h2>
          
          {filterRentalsByStatus(activeTab).length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No rentals found</p>
              <button 
                onClick={() => navigate('/cars')}
                className="mt-4 text-sky-600 hover:text-sky-700 font-medium"
              >
                Browse available cars
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filterRentalsByStatus(activeTab).map(rental => (
                <div key={rental.rentalId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Car Image */}
                    {rental.car && (
                      <img 
                        src={rental.car.images && rental.car.images[0] ? `http://localhost:8080/uploads/${rental.car.images[0]}` : '/placeholder-car.jpg'} 
                        alt={`${rental.car.brand} ${rental.car.model}`}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                    )}
                    
                    {/* Rental Details */}
                    <div className="flex-1">
                      {rental.car ? (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{rental.car.brand} {rental.car.model}</h3>
                              <p className="text-sm text-gray-600">€{rental.car.pricePerDay}/day</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(rental.status)}`}>
                              {getStatusIcon(rental.status)}
                              {rental.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Pick-up:</span> {rental.startDate}
                            </div>
                            <div>
                              <span className="font-medium">Drop-off:</span> {rental.endDate}
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span> {rental.requestDate}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">
                                Rental: €{(rental.totalPrice - rental.guaranteeAmount).toFixed(2)} + Guarantee: €{rental.guaranteeAmount}
                              </p>
                              <p className="text-lg font-bold text-sky-600">Total: €{rental.totalPrice}</p>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/cars/${rental.car.carId}`)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View Car
                              </button>
                              
                              {rental.status === 'pending' && (
                                <button
                                  onClick={() => cancelRental(rental.rentalId)}
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Cancel
                                </button>
                              )}
                              
                              {(rental.status === 'completed' || rental.status === 'approved') && !rental.hasReview && (
                                <button
                                  onClick={() => openReviewModal(rental)}
                                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors flex items-center gap-1"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Add Review
                                </button>
                              )}
                              
                              {rental.hasReview && (
                                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  Reviewed
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Car information not available</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute -top-3 -right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h3>
            {selectedRental.car ? (
              <p className="text-gray-600 mb-4">
                {selectedRental.car.brand} {selectedRental.car.model}
              </p>
            ) : (
              <p className="text-gray-500 mb-4">Rental</p>
            )}
            
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({...reviewData, rating: star})}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= reviewData.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                rows="4"
                placeholder="Share your experience..."
                required
              ></textarea>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="flex-1 bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;