import api, { apiFormData } from './api';

const agentService = {
  /**
   * Get agent profile
   * @param {number} agentId - Agent ID
   * @returns {Promise} Agent profile data
   */
  getProfile: async (agentId) => {
    try {
      const response = await api.get(`/agents/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch agent profile';
    }
  },

  /**
   * Update agent profile
   * @param {number} agentId - Agent ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated agent data
   */
  updateProfile: async (agentId, profileData) => {
    try {
      const response = await api.put(`/agents/${agentId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  /**
   * Get agent's cars
   * @param {number} agentId - Agent ID
   * @returns {Promise} Array of cars
   */
  getCars: async (agentId) => {
    try {
      const response = await api.get(`/cars/agent/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cars';
    }
  },

  /**
   * Add new car
   * @param {FormData} carData - Car data with images
   * @returns {Promise} Created car data
   */
  addCar: async (carData) => {
    try {
      const response = await apiFormData.post('/cars', carData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add car';
    }
  },

  /**
   * Update car
   * @param {number} carId - Car ID
   * @param {FormData} carData - Updated car data with images
   * @returns {Promise} Updated car data
   */
  updateCar: async (carId, carData) => {
    try {
      const response = await apiFormData.put(`/cars/${carId}`, carData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update car';
    }
  },

  /**
   * Delete car
   * @param {number} carId - Car ID
   * @returns {Promise} Success message
   */
  deleteCar: async (carId) => {
    try {
      const response = await api.delete(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete car';
    }
  },

  /**
   * Set car availability
   * @param {number} carId - Car ID
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} Updated car data
   */
  setCarAvailability: async (carId, isAvailable) => {
    try {
      const response = await api.put(`/cars/${carId}/availability`, { isAvailable });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update availability';
    }
  },

  /**
   * Get agent's rental requests
   * @param {number} agentId - Agent ID
   * @returns {Promise} Array of rental requests
   */
  getRentalRequests: async (agentId) => {
    try {
      const response = await api.get(`/rentals/agent/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch rental requests';
    }
  },

  /**
   * Approve rental request
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Updated rental data
   */
  approveRental: async (rentalId) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve rental';
    }
  },

  /**
   * Reject rental request
   * @param {number} rentalId - Rental ID
   * @param {string} reason - Rejection reason (optional)
   * @returns {Promise} Updated rental data
   */
  rejectRental: async (rentalId, reason = '') => {
    try {
      const response = await api.put(`/rentals/${rentalId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reject rental';
    }
  },

  /**
   * Get agent's revenue/statistics
   * @param {number} agentId - Agent ID
   * @returns {Promise} Revenue and stats data
   */
  getStats: async (agentId) => {
    try {
      const response = await api.get(`/agents/${agentId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch statistics';
    }
  },

  /**
   * Upload agency documents
   * @param {number} agentId - Agent ID
   * @param {FormData} documents - Documents to upload
   * @returns {Promise} Success message
   */
  uploadDocuments: async (agentId, documents) => {
    try {
      const response = await apiFormData.post(`/agents/${agentId}/documents`, documents);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload documents';
    }
  },
};

export default agentService;