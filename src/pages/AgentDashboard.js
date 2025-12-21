import React, { useState, useEffect, useCallback } from 'react';
import { Car, Calendar, DollarSign, Plus, Edit, Trash2, CheckCircle, XCircle, TrendingUp, X } from 'lucide-react';
import carService from '../services/carService';
import rentalService from '../services/rentalService';
import CarImageGallery from '../components/CarImageGallery';
import CarImageUpload from '../components/CarImageUpload';

const AgentDashboard = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [formImages, setFormImages] = useState([]); // Images being uploaded in the form
  const [carFormData, setCarFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: '',
    guaranteePrice: '',
    category: 'Sedan',
  });

  const fetchAgentData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch agent's own cars only
      const carsResponse = await carService.getAgentCars();
      const carsArray = Array.isArray(carsResponse) ? carsResponse : [];
      setCars(carsArray);
      
      // Images are now stored directly in car.images
      
      // Fetch rentals for agent
      const rentalsResponse = await rentalService.getAgentRentals();
      setRentals(Array.isArray(rentalsResponse) ? rentalsResponse : []);
      
      // Fetch pending count
      await fetchPendingCount();
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agent data:', error);
      setCars([]);
      setRentals([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgentData();
    // Poll for pending rentals every 30 seconds
    const interval = setInterval(() => {
      fetchPendingCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAgentData]);

  const fetchPendingCount = async () => {
    try {
      const response = await rentalService.getPendingRentalsCount();
      const count = response.count || response.data?.count || 0;
      setPendingCount(count);
    } catch (error) {
      console.error('Error fetching pending count:', error);
      setPendingCount(0);
    }
  };

  const calculateRevenue = () => {
    return rentals
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0);
  };

  const approveRental = async (rentalId) => {
    if (window.confirm('Approve this rental request?')) {
      try {
        await rentalService.approveRental(rentalId);
        
        // Find the rental to get car info and update car availability
        const rental = rentals.find(r => r.rentalId === rentalId);
        if (rental && rental.car) {
          try {
            await carService.updateCarAvailability(rental.car.carId || rental.car.id, false);
            console.log('✅ Car marked as unavailable');
          } catch (err) {
            console.warn('⚠️ Could not update car availability:', err);
          }
        }
        
        // Update the rental status locally instead of refetching all data
        setRentals(prevRentals => 
          prevRentals.map(r => 
            r.rentalId === rentalId 
              ? { ...r, status: 'approved', approvalDate: new Date().toISOString().split('T')[0] }
              : r
          )
        );
        
        // Update pending count
        setPendingCount(prev => Math.max(0, prev - 1));
        
        alert('Rental approved successfully!');
      } catch (error) {
        console.error('Error approving rental:', error);
        alert(error || 'Failed to approve rental');
      }
    }
  };

  const rejectRental = async (rentalId) => {
    if (window.confirm('Reject this rental request?')) {
      try {
        await rentalService.rejectRental(rentalId);
        
        // Update the rental status locally instead of refetching all data
        setRentals(prevRentals => 
          prevRentals.map(r => 
            r.rentalId === rentalId 
              ? { ...r, status: 'rejected' }
              : r
          )
        );
        
        // Update pending count
        setPendingCount(prev => Math.max(0, prev - 1));
        
        alert('Rental rejected');
      } catch (error) {
        console.error('Error rejecting rental:', error);
        alert(error || 'Failed to reject rental');
      }
    }
  };

  const openCarModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setCarFormData({
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        licensePlate: car.licensePlate,
        fuelType: car.fuelType,
        transmission: car.transmission,
        seats: car.seats,
        pricePerDay: car.pricePerDay,
        guaranteePrice: car.guaranteePrice,
        category: car.category,
        features: car.features || [],
      });
      // Load existing images when editing
      setFormImages(car.images || []);
    } else {
      setEditingCar(null);
      setCarFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        licensePlate: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        pricePerDay: '',
        guaranteePrice: '',
        category: 'Sedan',
        features: [],
      });
      setFormImages([]); // Reset form images for new car
    }
    setShowCarModal(true);
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🚗 [handleCarSubmit] Starting car submission...');
      console.log('  - Editing car:', editingCar);
      console.log('  - Form data:', carFormData);
      console.log('  - Form images:', formImages);

      const carData = {
        brand: carFormData.brand,
        model: carFormData.model,
        year: parseInt(carFormData.year),
        color: carFormData.color,
        licensePlate: carFormData.licensePlate,
        fuelType: carFormData.fuelType,
        transmission: carFormData.transmission,
        seats: parseInt(carFormData.seats),
        pricePerDay: parseFloat(carFormData.pricePerDay) || 0,
        guaranteePrice: parseFloat(carFormData.guaranteePrice) || 0,
        category: carFormData.category,
      };
      
      console.log('  - Prepared car data:', carData);
      
      // Validate required fields
      if (!carData.brand || !carData.model || !carData.licensePlate) {
        alert('Please fill in all required fields (Brand, Model, License Plate)');
        return;
      }
      
      if (carData.pricePerDay <= 0) {
        alert('Price per day must be greater than 0');
        return;
      }
      
      if (carData.guaranteePrice < 0) {
        alert('Guarantee price must be 0 or greater');
        return;
      }
      
      // Extract actual File objects from formImages (in case they're mixed with URLs)
      const filesToUpload = formImages.filter(img => img instanceof File);
      console.log('  - Files to upload:', filesToUpload.map(f => ({ name: f.name, size: f.size })));
      
      if (editingCar) {
        // Update car with optional new images
        console.log('  - Updating car ID:', editingCar.id || editingCar.carId);
        // The backend will append new images to existing ones
        await carService.modifyCar(editingCar.id || editingCar.carId, carData, filesToUpload);
        alert('Car updated successfully!');
      } else {
        // Add new car with images
        console.log('  - Creating new car');
        await carService.addCar(carData, filesToUpload);
        alert('Car added successfully!');
      }
      
      setShowCarModal(false);
      setFormImages([]);
      fetchAgentData();
    } catch (error) {
      console.error('Error saving car:', error);
      
      // Extract validation errors from response
      const errorData = error.response?.data;
      let errorMessage = 'Failed to save car. Please try again.';
      let errorDisplay = [];

      if (errorData?.errors && typeof errorData.errors === 'object') {
        // Format: { field: [messages] }
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => {
              errorDisplay.push(`${field}: ${msg}`);
            });
          }
        });
        if (errorDisplay.length > 0) {
          errorMessage = errorDisplay.join('\n');
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carService.deleteCar(carId);
        alert('Car deleted successfully');
        fetchAgentData();
      } catch (error) {
        console.error('Error deleting car:', error);
        alert(error || 'Failed to delete car');
      }
    }
  };

  const toggleCarAvailability = async (carId, currentStatus) => {
    try {
      // TODO: API call
      // await axios.put(`http://localhost:8080/api/cars/${carId}/availability`, { isAvailable: !currentStatus });
      alert(`Car ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchAgentData();
    } catch (error) {
      alert('Failed to update car availability');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.agencyName || 'Agency Dashboard'}</h1>
              <p className="text-gray-600">Manage your fleet and rental requests</p>
            </div>
            {pendingCount > 0 && (
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-center">
                <p className="text-red-800 font-bold text-sm">🔔 New Requests</p>
                <p className="text-3xl font-bold text-red-600">{pendingCount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-sky-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Cars</p>
                <p className="text-3xl font-bold text-sky-600 mt-1">{cars.length}</p>
              </div>
              <div className="bg-sky-100 p-3 rounded-full">
                <Car className="w-8 h-8 text-sky-600" />
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
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenue (Completed)</p>
                <p className="text-3xl font-bold text-green-600 mt-1">€{calculateRevenue()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Rentals</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {rentals.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {['overview', 'cars', 'rentals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-600 hover:text-sky-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => openCarModal()}
                  className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Car
                </button>
                <button 
                  onClick={() => setActiveTab('rentals')}
                  className="bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-800 transition-colors border-2 border-white flex items-center gap-2 relative"
                >
                  <Calendar className="w-5 h-5" />
                  View Rental Requests
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Rental Requests</h2>
              {rentals.slice(0, 5).map(rental => (
                <div key={rental.rentalId} className="border-b last:border-0 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {rental.user ? `${rental.user.firstName} ${rental.user.lastName}` : 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Unknown Car'} • {rental.startDate} to {rental.endDate}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">My Fleet</h2>
              <button 
                onClick={() => openCarModal()}
                className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Car
              </button>
            </div>
            
            {cars.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No cars added yet</p>
                <button 
                  onClick={() => openCarModal()}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
                >
                  Add Your First Car
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
                  <div key={car.carId} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Car Image Gallery */}
                    <div className="h-60 bg-gradient-to-b from-gray-100 to-gray-200 relative overflow-hidden flex items-center justify-center">
                      {car.images && car.images.length > 0 ? (
                        <>
                          <img 
                            src={`http://localhost:8080/uploads/${car.images[0]}`}
                            alt={`${car.brand} ${car.model}`} 
                            className="h-full w-full object-contain object-center"
                            loading="lazy"
                          />
                          {car.images.length > 1 && (
                            <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                              {car.images.length} 📷
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center">
                          <Car className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">No images yet</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">{car.brand} {car.model}</h3>
                          <p className="text-sm text-gray-600">{car.year} • {car.category}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {car.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-sky-600 font-bold mb-3">€{car.pricePerDay}/day</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCar(car);
                            setShowCarModal(true);
                          }}
                          className="flex-1 text-sky-600 hover:bg-sky-50 px-3 py-2 rounded-lg border border-sky-600 flex items-center justify-center gap-1 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleCarAvailability(car.carId, car.isAvailable)}
                          className="flex-1 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        >
                          {car.isAvailable ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => deleteCar(car.carId)}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Images Management Link */}
                      <div className="mt-3 pt-3 border-t">
                        <button
                          onClick={() => {
                            setEditingCar(car);
                            setShowCarModal(true);
                          }}
                          className="w-full text-center text-xs text-blue-600 hover:text-blue-800 py-1"
                        >
                          📷 Manage Images ({car.images?.length || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Rental Requests</h2>
            
            {rentals.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No rental requests available</p>
                <p className="text-gray-500 text-sm mb-6">
                  Rental requests from customers will appear here
                </p>
                <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg max-w-2xl mx-auto text-left">
                  <h4 className="text-sm font-bold text-yellow-800 mb-3">⚠️ Backend Configuration Required</h4>
                  <p className="text-xs text-gray-700 mb-3">
                    The agent rental endpoints are not accessible. Please implement one of the following on your backend:
                  </p>
                  <div className="bg-white p-3 rounded border border-yellow-300 space-y-2 text-xs font-mono">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <code className="text-blue-600">GET /api/rentals/agent</code>
                      <span className="text-gray-600">- Returns logged-in agent's rentals (JWT based)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">OR</span>
                      <code className="text-blue-600">GET /api/rentals/agent/:agentId</code>
                      <span className="text-gray-600">- Returns specific agent's rentals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">OR</span>
                      <code className="text-blue-600">GET /api/rentals?agentId=X</code>
                      <span className="text-gray-600">- Filter rentals by agent ID</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Check browser console (F12) for detailed error logs.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.map(rental => (
                  <div key={rental.rentalId} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800">{rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Unknown Car'}</h3>
                            <p className="text-sm text-gray-600">
                              Customer: {rental.user ? `${rental.user.firstName} ${rental.user.lastName}` : 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-600">{rental.user?.email || 'N/A'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(rental.status)}`}>
                            {rental.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Pick-up:</strong> {rental.startDate}</p>
                          <p><strong>Drop-off:</strong> {rental.endDate}</p>
                          <p><strong>Requested:</strong> {rental.requestDate}</p>
                          {rental.approvalDate && <p><strong>Approved:</strong> {rental.approvalDate}</p>}
                        </div>
                        <p className="text-lg font-bold text-sky-600 mt-2">€{rental.totalPrice}</p>
                      </div>
                      
                      {rental.status === 'pending' && (
                        <div className="flex flex-col gap-2 md:w-48">
                          <button
                            onClick={() => approveRental(rental.rentalId)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectRental(rental.rentalId)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Car Modal */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8 relative">
            <button
              onClick={() => setShowCarModal(false)}
              className="absolute -top-3 -right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </h3>
            
            <form onSubmit={handleCarSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={carFormData.brand}
                    onChange={(e) => setCarFormData({...carFormData, brand: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={carFormData.model}
                    onChange={(e) => setCarFormData({...carFormData, model: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={carFormData.year}
                    onChange={(e) => setCarFormData({...carFormData, year: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={carFormData.color}
                    onChange={(e) => setCarFormData({...carFormData, color: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                  <input
                    type="text"
                    value={carFormData.licensePlate}
                    onChange={(e) => setCarFormData({...carFormData, licensePlate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={carFormData.category}
                    onChange={(e) => setCarFormData({...carFormData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Sports</option>
                    <option>Luxury</option>
                    <option>Electric</option>
                    <option>Compact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    value={carFormData.transmission}
                    onChange={(e) => setCarFormData({...carFormData, transmission: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={carFormData.fuelType}
                    onChange={(e) => setCarFormData({...carFormData, fuelType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                  <input
                    type="number"
                    value={carFormData.seats}
                    onChange={(e) => setCarFormData({...carFormData, seats: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    min="2"
                    max="9"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price/Day (€)</label>
                  <input
                    type="number"
                    value={carFormData.pricePerDay}
                    onChange={(e) => setCarFormData({...carFormData, pricePerDay: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guarantee (€)</label>
                  <input
                    type="number"
                    value={carFormData.guaranteePrice}
                    onChange={(e) => setCarFormData({...carFormData, guaranteePrice: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Images (JPG, PNG, WebP - Max 5MB each)
                </label>
                <CarImageUpload
                  images={formImages}
                  onImagesChange={setFormImages}
                  maxImages={5}
                  disabled={false}
                />
              </div>
              
              <div className="flex gap-3 mt-6 col-span-2">
                <button
                  type="button"
                  onClick={() => setShowCarModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600"
                >
                  {editingCar ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Management Modal - REMOVED - Image upload now integrated in Car Modal */}
    </div>
  );
};

export default AgentDashboard;