import api from './api';

const reviewService = {
  /**
   * Create review
   * @param {Object} reviewData - { rentalId, carId, rating, comment }
   * @returns {Promise} Created review data
   */
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create review';
    }
  },

  /**
   * Update review
   * @param {number} reviewId - Review ID
   * @param {Object} reviewData - { rating, comment }
   * @returns {Promise} Updated review data
   */
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update review';
    }
  },

  /**
   * Delete review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Success message
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete review';
    }
  },

  /**
   * Get reviews by car
   * @param {number} carId - Car ID
   * @returns {Promise} Array of reviews
   */
  getReviewsByCar: async (carId) => {
    try {
      const response = await api.get(`/reviews/car/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },

  /**
   * Get reviews by user
   * @param {number} userId - User ID
   * @returns {Promise} Array of reviews
   */
  getReviewsByUser: async (userId) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },

  /**
   * Get review by rental
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Review data
   */
  getReviewByRental: async (rentalId) => {
    try {
      const response = await api.get(`/reviews/rental/${rentalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch review';
    }
  },
};

export default reviewService;