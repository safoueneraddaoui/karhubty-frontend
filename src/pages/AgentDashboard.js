import React, { useState, useEffect } from 'react';
import { Car, Calendar, DollarSign, Plus, Edit, Trash2, CheckCircle, XCircle, Eye, Users, TrendingUp } from 'lucide-react';

const AgentDashboard = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
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
    features: []
  });

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const carsResponse = await axios.get(`http://localhost:8080/api/cars/agent/${user.id}`);
      // const rentalsResponse = await axios.get(`http://localhost:8080/api/rentals/agent/${user.id}`);
      
      // Mock data
      const mockCars = [
        { 
          carId: 1, 
          brand: 'Tesla', 
          model: 'Model 3', 
          year: 2024,
          pricePerDay: 85, 
          guaranteePrice: 500,
          isAvailable: true,
          category: 'Electric',
          transmission: 'Automatic',
          seats: 5,
          image: 'https://via.placeholder.com/400x300?text=Tesla+Model+3'
        },
        { 
          carId: 2, 
          brand: 'BMW', 
          model: 'X5', 
          year: 2023,
          pricePerDay: 120, 
          guaranteePrice: 600,
          isAvailable: true,
          category: 'SUV',
          transmission: 'Automatic',
          seats: 7,
          image: 'https://via.placeholder.com/400x300?text=BMW+X5'
        }
      ];
      
      const mockRentals = [
        { 
          rentalId: 1, 
          car: { brand: 'Tesla', model: 'Model 3', carId: 1 }, 
          user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, 
          startDate: '2024-02-15', 
          endDate: '2024-02-20',
          status: 'pending', 
          totalPrice: 425,
          requestDate: '2024-02-10'
        },
        { 
          rentalId: 2, 
          car: { brand: 'BMW', model: 'X5', carId: 2 }, 
          user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }, 
          startDate: '2024-02-01', 
          endDate: '2024-02-05',
          status: 'approved', 
          totalPrice: 600,
          requestDate: '2024-01-25',
          approvalDate: '2024-01-26'
        },
        { 
          rentalId: 3, 
          car: { brand: 'Tesla', model: 'Model 3', carId: 1 }, 
          user: { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' }, 
          startDate: '2024-01-10', 
          endDate: '2024-01-15',
          status: 'completed', 
          totalPrice: 425,
          requestDate: '2024-01-05',
          completionDate: '2024-01-15'
        }
      ];
      
      setCars(mockCars);
      setRentals(mockRentals);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agent data:', error);
      setLoading(false);
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
        // TODO: API call
        // await axios.put(`http://localhost:8080/api/rentals/${rentalId}/approve`);
        alert('Rental approved successfully!');
        fetchAgentData();
      } catch (error) {
        alert('Failed to approve rental');
      }
    }
  };

  const rejectRental = async (rentalId) => {
    if (window.confirm('Reject this rental request?')) {
      try {
        // TODO: API call
        // await axios.put(`http://localhost:8080/api/rentals/${rentalId}/reject`);
        alert('Rental rejected');
        fetchAgentData();
      } catch (error) {
        alert('Failed to reject rental');
      }
    }
  };

  const openCarModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setCarFormData(car);
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
        features: []
      });
    }
    setShowCarModal(true);
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        // TODO: Update car API call
        // await axios.put(`http://localhost:8080/api/cars/${editingCar.carId}`, carFormData);
        alert('Car updated successfully!');
      } else {
        // TODO: Add car API call
        // await axios.post(`http://localhost:8080/api/cars`, carFormData);
        alert('Car added successfully!');
      }
      setShowCarModal(false);
      fetchAgentData();
    } catch (error) {
      alert('Failed to save car');
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        // TODO: API call
        // await axios.delete(`http://localhost:8080/api/cars/${carId}`);
        alert('Car deleted successfully');
        fetchAgentData();
      } catch (error) {
        alert('Failed to delete car');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Agency Dashboard</h1>
          <p className="text-gray-600">Manage your fleet and rental requests</p>
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
                  className="bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-800 transition-colors border-2 border-white flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  View Rental Requests
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
                        {rental.user.firstName} {rental.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {rental.car.brand} {rental.car.model} • {rental.startDate} to {rental.endDate}
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
                  <div key={car.carId} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
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
                          onClick={() => openCarModal(car)}
                          className="flex-1 text-sky-600 hover:bg-sky-50 px-3 py-2 rounded-lg border border-sky-600 flex items-center justify-center gap-1"
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
                <p className="text-gray-600 text-lg">No rental requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.map(rental => (
                  <div key={rental.rentalId} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800">{rental.car.brand} {rental.car.model}</h3>
                            <p className="text-sm text-gray-600">
                              Customer: {rental.user.firstName} {rental.user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{rental.user.email}</p>
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
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
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
              
              <div className="flex gap-3 mt-6">
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
    </div>
  );
};

export default AgentDashboard;