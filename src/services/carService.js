import api from './api';

const carService = {
  /**
   * Get all available cars
   * @param {Object} filters - Optional filters { category, minPrice, maxPrice, transmission, fuelType }
   * @returns {Promise} Array of cars
   */
  getAllCars: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      const response = await api.get(`/cars?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cars';
    }
  },

  /**
   * Get car by ID
   * @param {number} carId - Car ID
   * @returns {Promise} Car details
   */
  getCarById: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch car details';
    }
  },

  /**
   * Search cars
   * @param {string} query - Search query
   * @returns {Promise} Array of matching cars
   */
  searchCars: async (query) => {
    try {
      const response = await api.get(`/cars/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Search failed';
    }
  },

  /**
   * Check car availability
   * @param {number} carId - Car ID
   * @param {Object} dates - { startDate, endDate }
   * @returns {Promise} Availability status
   */
  checkAvailability: async (carId, dates) => {
    try {
      const response = await api.post(`/cars/${carId}/check-availability`, dates);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to check availability';
    }
  },

  /**
   * Get car reviews
   * @param {number} carId - Car ID
   * @returns {Promise} Array of reviews
   */
  getCarReviews: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },

  /**
   * Get featured/popular cars
   * @returns {Promise} Array of featured cars
   */
  getFeaturedCars: async () => {
    try {
      const response = await api.get('/cars/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch featured cars';
    }
  },

  /**
   * Get cars by category
   * @param {string} category - Car category
   * @returns {Promise} Array of cars
   */
  getCarsByCategory: async (category) => {
    try {
      const response = await api.get(`/cars/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cars by category';
    }
  },

  /**
   * Add a new car (Agent Admin only)
   * @param {Object} carData - Car details { brand, model, year, dailyRate, category, transmission, fuelType, seats, features, imageUrl, description }
   * @returns {Promise} Created car data
   */
  addCar: async (carData) => {
    try {
      console.log('🚗 carService.addCar() - Adding new car:', carData);
      const response = await api.post('/cars', carData);
      console.log('✅ carService.addCar() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.addCar() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to add car';
    }
  },

  /**
   * Update/modify a car (Agent Admin only)
   * @param {number} carId - Car ID
   * @param {Object} carData - Updated car details
   * @returns {Promise} Updated car data
   */
  modifyCar: async (carId, carData) => {
    try {
      console.log('🚗 carService.modifyCar() - Updating car:', carId, carData);
      const response = await api.put(`/cars/${carId}`, carData);
      console.log('✅ carService.modifyCar() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.modifyCar() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to update car';
    }
  },

  /**
   * Delete a car (Agent Admin only)
   * @param {number} carId - Car ID
   * @returns {Promise} Success message
   */
  deleteCar: async (carId) => {
    try {
      console.log('🚗 carService.deleteCar() - Deleting car:', carId);
      const response = await api.delete(`/cars/${carId}`);
      console.log('✅ carService.deleteCar() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.deleteCar() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to delete car';
    }
  },
};

export default carService;