import api from './api';

const userService = {
  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise} User profile data
   */
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated user data
   */
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise} Success message
   */
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.put(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to change password';
    }
  },

  /**
   * Get user's rentals
   * @param {number} userId - User ID
   * @returns {Promise} Array of rentals
   */
  getRentals: async (userId) => {
    try {
      const response = await api.get(`/rentals/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch rentals';
    }
  },

  /**
   * Cancel a rental
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
   * Get user's reviews
   * @param {number} userId - User ID
   * @returns {Promise} Array of reviews
   */
  getReviews: async (userId) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },
};

export default userService;