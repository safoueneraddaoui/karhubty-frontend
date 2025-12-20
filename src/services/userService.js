import api from './api';
import tokenService from './tokenService';

const userService = {
  /**
   * Get current user profile (authenticated user)
   * @returns {Promise} Current user profile data
   */
  getProfileData: async () => {
    try {
      console.log('🔍 userService.getProfileData() - Making request to /users/profile');
      const response = await api.get('/users/profile');
      console.log('✅ userService.getProfileData() - Success response:', response.data);
      
      // Handle different response formats
      const profileData = response.data.data || response.data;
      
      // Update stored user data with fresh data from server
      const currentUser = tokenService.getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...profileData };
        tokenService.setUser(updatedUser);
      }
      
      return profileData;
    } catch (error) {
      console.error('❌ userService.getProfileData() - Error:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to fetch profile';
    }
  },

  /**
   * Get user profile by ID
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
      console.log('📝 userService.updateProfile() - Updating user:', userId);
      console.log('📝 Profile data received:', profileData);
      
      // Get current user to determine role
      const currentUser = tokenService.getUser();
      const userRole = currentUser?.role;
      
      // Filter fields based on user role to avoid backend validation errors
      let filteredData = {};
      
      if (userRole === 'agentadmin' || userRole === 'agent') {
        // Agent can update: firstName, lastName, phone, agencyName, agencyAddress
        filteredData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          agencyName: profileData.agencyName,
          agencyAddress: profileData.agencyAddress
        };
      } else if (userRole === 'user') {
        // Regular user can update: firstName, lastName, phone, address, city
        filteredData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city
        };
      } else if (userRole === 'superadmin') {
        // Superadmin can update: firstName, lastName, phone
        filteredData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone
        };
      } else {
        // Default: only basic fields
        filteredData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone
        };
      }
      
      // Remove undefined/null values
      Object.keys(filteredData).forEach(key => {
        if (filteredData[key] === undefined || filteredData[key] === null) {
          delete filteredData[key];
        }
      });
      
      console.log('📝 Filtered data for role', userRole, ':', filteredData);
      
      const response = await api.put(`/users/${userId}`, filteredData);
      console.log('✅ userService.updateProfile() - Success response:', response.data);
      
      // Handle different response formats
      const updatedData = response.data.data || response.data.user || response.data;
      
      // Update stored user data
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updatedData };
        tokenService.setUser(updatedUser);
      }
      
      return updatedData;
    } catch (error) {
      console.error('❌ userService.updateProfile() - Error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to update profile';
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