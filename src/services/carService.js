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
};

export default carService;