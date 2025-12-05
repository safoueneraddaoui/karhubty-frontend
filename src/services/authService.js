import api from './api';

const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} User data with token and role
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Success message
   */
  registerUser: async (userData) => {
    try {
      const response = await api.post('/auth/register/user', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  /**
   * Register new agent
   * @param {Object} agentData - Agent registration data
   * @returns {Promise} Success message
   */
  registerAgent: async (agentData) => {
    try {
      const response = await api.post('/auth/register/agent', agentData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Agent registration failed';
    }
  },

  /**
   * Submit agent request
   * @param {FormData} formData - Agent request with documents
   * @returns {Promise} Success message
   */
  submitAgentRequest: async (formData) => {
    try {
      const response = await api.post('/agent-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Agent request submission failed';
    }
  },

  /**
   * Forgot password - send reset link
   * @param {string} email - User email
   * @returns {Promise} Success message
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to send reset link';
    }
  },

  /**
   * Reset password with token
   * @param {Object} data - { token, newPassword }
   * @returns {Promise} Success message
   */
  resetPassword: async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Password reset failed';
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return user !== null;
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check (user, agent, superadmin)
   * @returns {boolean}
   */
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },
};

export default authService;