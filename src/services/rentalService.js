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

  /**
   * Get user's rentals
   * @param {number} userId - User ID
   * @returns {Promise} Array of rentals
   */
  getUserRentals: async (userId) => {
    try {
      const response = await api.get(`/rentals/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user rentals';
    }
  },

  /**
   * Get agent's rentals (all rental requests for agent's cars)
   * @returns {Promise} Array of rentals for agent's cars
   */
  getAgentRentals: async () => {
    try {
      console.log('📦 rentalService.getAgentRentals() - Fetching agent rentals');
      
      // Get agent ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const agentId = parseInt(user?.id || user?.userId || 0, 10);
      
      console.log('📍 Agent ID:', agentId);
      console.log('📍 User Role:', user.role);
      
      if (!agentId) {
        console.warn('⚠️ No agent ID found');
        return [];
      }
      
      // Strategy 1: Try /rentals/agent (specific agent endpoint)
      try {
        console.log('📍 Attempt 1: GET /rentals/agent');
        const response = await api.get('/rentals/agent');
        console.log('✅ /rentals/agent succeeded:', response.data);
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data : [];
      } catch (err1) {
        console.warn('⚠️ /rentals/agent failed:', err1.response?.status, err1.response?.data?.message);
        
        // Strategy 2: Try /rentals/agent/{agentId}
        try {
          console.log('📍 Attempt 2: GET /rentals/agent/' + agentId);
          const response = await api.get(`/rentals/agent/${agentId}`);
          console.log('✅ /rentals/agent/{id} succeeded:', response.data);
          const data = response.data.data || response.data;
          return Array.isArray(data) ? data : [];
        } catch (err2) {
          console.warn('⚠️ /rentals/agent/{id} failed:', err2.response?.status, err2.response?.data?.message);
          
          // Strategy 3: Try with query parameters
          try {
            console.log('📍 Attempt 3: GET /rentals?agentId=' + agentId);
            const response = await api.get(`/rentals?agentId=${agentId}`);
            console.log('✅ /rentals?agentId succeeded:', response.data);
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : [];
          } catch (err3) {
            console.warn('⚠️ /rentals?agentId failed:', err3.response?.status, err3.response?.data?.message);
            
            // Log final failure and return empty array
            console.error('❌ All strategies failed to fetch agent rentals');
            console.error('📋 Please ensure backend has one of these endpoints:');
            console.error('   - GET /rentals/agent (returns logged-in agent\'s rentals)');
            console.error('   - GET /rentals/agent/{agentId} (returns specific agent\'s rentals)');
            console.error('   - GET /rentals?agentId={agentId} (filters rentals by agent)');
            return [];
          }
        }
      }
    } catch (error) {
      console.error('❌ rentalService.getAgentRentals() - Error:', error.message);
      return [];
    }
  },

  /**
   * Approve rental request (Agent only)
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Updated rental data
   */
  approveRental: async (rentalId) => {
    try {
      console.log('📝 rentalService.approveRental() - Approving rental:', rentalId);
      const response = await api.put(`/rentals/${rentalId}/approve`);
      console.log('✅ rentalService.approveRental() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ rentalService.approveRental() - Error:', error);
      throw error.response?.data?.message || 'Failed to approve rental';
    }
  },

  /**
   * Reject rental request (Agent only)
   * @param {number} rentalId - Rental ID
   * @returns {Promise} Updated rental data
   */
  rejectRental: async (rentalId) => {
    try {
      console.log('📝 rentalService.rejectRental() - Rejecting rental:', rentalId);
      const response = await api.put(`/rentals/${rentalId}/reject`);
      console.log('✅ rentalService.rejectRental() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ rentalService.rejectRental() - Error:', error);
      throw error.response?.data?.message || 'Failed to reject rental';
    }
  },

  /**
   * Get pending rental requests count for agent
   * @returns {Promise} Count of pending rentals
   */
  getPendingRentalsCount: async () => {
    try {
      console.log('📊 rentalService.getPendingRentalsCount() - Fetching pending count');
      
      // Strategy 1: Try /rentals/agent/pending-count
      try {
        console.log('📍 Attempt 1: GET /rentals/agent/pending-count');
        const response = await api.get('/rentals/agent/pending-count');
        console.log('✅ /rentals/agent/pending-count succeeded:', response.data);
        return response.data;
      } catch (err1) {
        console.warn('⚠️ /rentals/agent/pending-count failed:', err1.response?.status);
        
        // Strategy 2: Fetch all agent rentals and count pending
        try {
          console.log('📍 Attempt 2: Manual count from getAgentRentals()');
          const rentals = await this.getAgentRentals();
          const pendingCount = Array.isArray(rentals) ? rentals.filter(r => r.status === 'pending').length : 0;
          console.log('✅ Manual count succeeded:', pendingCount);
          return { count: pendingCount };
        } catch (err2) {
          console.warn('⚠️ Manual count failed:', err2.message);
          return { count: 0 };
        }
      }
    } catch (error) {
      console.error('❌ rentalService.getPendingRentalsCount() - Error:', error);
      return { count: 0 };
    }
  },

  /**
   * Generate PDF for rental (Agent only)
   * @param {number} rentalId - Rental ID
   * @returns {Promise} PDF blob
   */
  generateRentalPdf: async (rentalId) => {
    try {
      console.log('📄 rentalService.generateRentalPdf() - Generating PDF for rental:', rentalId);
      const response = await api.get(`/rentals/${rentalId}/generate-pdf`, {
        responseType: 'blob'
      });
      console.log('✅ rentalService.generateRentalPdf() - Success');
      return response.data;
    } catch (error) {
      console.error('❌ rentalService.generateRentalPdf() - Error:', error);
      throw error.response?.data?.message || 'Failed to generate PDF';
    }
  },
};

export default rentalService;