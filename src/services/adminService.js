import api from './api';

const adminService = {
  /**
   * Get platform statistics
   * @returns {Promise} Platform stats
   */
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch stats';
    }
  },

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users
   * @returns {Promise} Array of users
   */
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User data
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user';
    }
  },

  /**
   * Activate user
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  activateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to activate user';
    }
  },

  /**
   * Deactivate user
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  deactivateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to deactivate user';
    }
  },

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  },

  // ==================== AGENT MANAGEMENT ====================
  
  /**
   * Get all agents
   * @returns {Promise} Array of agents
   */
  getAllAgents: async () => {
    try {
      const response = await api.get('/admin/agents');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch agents';
    }
  },

  /**
   * Get agent by ID
   * @param {number} agentId - Agent ID
   * @returns {Promise} Agent data
   */
  getAgentById: async (agentId) => {
    try {
      const response = await api.get(`/admin/agents/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch agent';
    }
  },

  /**
   * Suspend agent
   * @param {number} agentId - Agent ID
   * @returns {Promise} Success message
   */
  suspendAgent: async (agentId) => {
    try {
      const response = await api.put(`/admin/agents/${agentId}/suspend`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to suspend agent';
    }
  },

  /**
   * Delete agent
   * @param {number} agentId - Agent ID
   * @returns {Promise} Success message
   */
  deleteAgent: async (agentId) => {
    try {
      const response = await api.delete(`/admin/agents/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete agent';
    }
  },

  // ==================== AGENT REQUESTS ====================
  
  /**
   * Get pending agent requests
   * @returns {Promise} Array of pending requests
   */
  getPendingAgentRequests: async () => {
    try {
      const response = await api.get('/admin/agent-requests/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch agent requests';
    }
  },

  /**
   * Get all agent requests
   * @returns {Promise} Array of all requests
   */
  getAllAgentRequests: async () => {
    try {
      const response = await api.get('/admin/agent-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch agent requests';
    }
  },

  /**
   * Approve agent request
   * @param {number} requestId - Request ID
   * @returns {Promise} Success message
   */
  approveAgentRequest: async (requestId) => {
    try {
      const response = await api.put(`/admin/agent-requests/${requestId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve request';
    }
  },

  /**
   * Reject agent request
   * @param {number} requestId - Request ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} Success message
   */
  rejectAgentRequest: async (requestId, reason = '') => {
    try {
      const response = await api.put(`/admin/agent-requests/${requestId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reject request';
    }
  },

  // ==================== CAR MANAGEMENT ====================
  
  /**
   * Get all cars
   * @returns {Promise} Array of all cars
   */
  getAllCars: async () => {
    try {
      const response = await api.get('/admin/cars');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cars';
    }
  },

  /**
   * Delete car
   * @param {number} carId - Car ID
   * @returns {Promise} Success message
   */
  deleteCar: async (carId) => {
    try {
      const response = await api.delete(`/admin/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete car';
    }
  },

  // ==================== RENTAL MANAGEMENT ====================
  
  /**
   * Get all rentals
   * @returns {Promise} Array of all rentals
   */
  getAllRentals: async () => {
    try {
      const response = await api.get('/admin/rentals');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch rentals';
    }
  },

  // ==================== REVIEW MANAGEMENT ====================
  
  /**
   * Get all reviews
   * @returns {Promise} Array of all reviews
   */
  getAllReviews: async () => {
    try {
      const response = await api.get('/admin/reviews');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },

  /**
   * Approve review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Success message
   */
  approveReview: async (reviewId) => {
    try {
      const response = await api.put(`/admin/reviews/${reviewId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve review';
    }
  },

  /**
   * Delete review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Success message
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/admin/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete review';
    }
  },

  // ==================== REPORTS ====================
  
  /**
   * Generate system report
   * @param {Object} params - Report parameters { startDate, endDate, type }
   * @returns {Promise} Report data
   */
  generateReport: async (params) => {
    try {
      const response = await api.post('/admin/reports/generate', params);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to generate report';
    }
  },
};

export default adminService;