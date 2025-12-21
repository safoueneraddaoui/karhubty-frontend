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
   * Get reviews by car (latest 5)
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

  /**
   * Get car average rating
   * @param {number} carId - Car ID
   * @returns {Promise} { averageRating, totalReviews }
   */
  getCarRating: async (carId) => {
    try {
      const response = await api.get(`/reviews/car/${carId}/rating`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch car rating';
    }
  },

  /**
   * Get reviews for agent's cars
   * @returns {Promise} Array of reviews for agent's cars
   */
  getAgentReviews: async () => {
    try {
      const response = await api.get('/reviews/agent/my-reviews');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch agent reviews';
    }
  },

  /**
   * Agent reply to review
   * @param {number} reviewId - Review ID
   * @param {string} reply - Agent's reply message
   * @returns {Promise} Updated review data
   */
  replyToReview: async (reviewId, reply) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/reply`, { reply });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reply to review';
    }
  },
};

export default reviewService;