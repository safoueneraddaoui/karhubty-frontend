import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Users, Fuel, Settings2, Calendar } from 'lucide-react';
import carService from '../services/carService';

const CarsPage = ({ user }) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    transmission: 'all',
    fuelType: 'all'
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, cars]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      // Fetch all available cars for users
      const response = await carService.getAllAvailableCars();
      const carsArray = Array.isArray(response) ? response : response.data || [];
      setCars(carsArray);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(car => car.category === filters.category);
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(car => car.pricePerDay >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.pricePerDay <= parseFloat(filters.maxPrice));
    }

    // Transmission filter
    if (filters.transmission !== 'all') {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }

    // Fuel type filter
    if (filters.fuelType !== 'all') {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }

    setFilteredCars(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      transmission: 'all',
      fuelType: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Available Cars</h1>
          <p className="text-gray-600">Find your perfect ride from our collection</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-sky-600 hover:text-sky-700 text-sm font-medium"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by brand or model..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Sports">Sports</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
              <option value="Compact">Compact</option>
            </select>

            {/* Transmission */}
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>

            {/* Fuel Type */}
            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min €"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max €"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredCars.length}</span> cars
          </p>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No cars found matching your criteria.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 text-sky-600 hover:text-sky-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.carId} car={car} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CarCard = ({ car, navigate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer" onClick={() => navigate(`/cars/${car.carId}`)}>
      <div className="relative h-60 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        <img 
          src={car.images?.[0] ? `http://localhost:8080/uploads/${car.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-contain object-center"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-sky-600">
          €{car.pricePerDay}/day
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{car.brand} {car.model}</h3>
            <p className="text-sm text-gray-600">{car.year} • {car.category}</p>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm font-semibold">{car.averageRating}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {car.seats} seats
          </div>
          <div className="flex items-center">
            <Settings2 className="w-4 h-4 mr-1" />
            {car.transmission}
          </div>
          <div className="flex items-center">
            <Fuel className="w-4 h-4 mr-1" />
            {car.fuelType}
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cars/${car.carId}`);
          }}
          className="w-full bg-sky-500 text-white py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          View Details & Book
        </button>
      </div>
    </div>
  );
};

export default CarsPage;