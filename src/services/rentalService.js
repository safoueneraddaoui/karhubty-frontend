import api from './api';

const rentalService = {
  /**
   * Create rental request
   * @param {Object} rentalData - { carId, startDate, endDate }
   * @returns {Promise} Created rental data
   */
  createRental: async (rentalData) => {
    try {
      const response = await api.post('/rentals', rentalData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create rental request';
    }
  },

  /**
   * Get rental by ID
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Rental details
   */
  getRentalById: async (rentalId) => {
    try {
      const response = await api.get(`/rentals/${rentalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch rental details';
    }
  },

  /**
   * Cancel rental
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Success message
   */
  cancelRental: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to cancel rental';
    }
  },

  /**
   * Complete rental (mark as completed)
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Updated rental data
   */
  completeRental: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to complete rental';
    }
  },

  /**
   * Calculate rental price
   * @param {Object} data - { carId, startDate, endDate }
   * @returns {Promise} Price calculation
   */
  calculatePrice: async (data) => {
    try {
      const response = await api.post('/rentals/calculate-price', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to calculate price';
    }
  },

  /**
   * Check if user has overlapping rentals
   * @param {number} userId - User ID
   * @param {Object} dates - { startDate, endDate }
   * @returns {Promise} Boolean indicating if overlap exists
   */
  checkOverlap: async (userId, dates) => {
    try {
      const response = await api.post(`/rentals/check-overlap/${userId}`, dates);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to check overlap';
    }
  },
};

export default rentalService;