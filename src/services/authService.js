import api from './api';
import tokenService from './tokenService';

const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} User data with token and role
   */
  login: async (credentials) => {
    try {
      console.log('🔐 [AuthService] Logging in with email:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('🔐 [AuthService] Login response received:', response.data);
      
      // Handle different response structures
      // Backend returns: { success: true, user: { token, id, email, ... } }
      const userData = response.data.user || response.data.data || response.data;
      
      console.log('🔍 [AuthService] Login response structure:', Object.keys(response.data));
      console.log('🔍 [AuthService] User data:', userData);
      
      // Extract token from response (handle different field names)
      const token = userData.token || userData.accessToken || userData.access_token || response.data.token;
      
      if (!token) {
        console.error('❌ [AuthService] No token in login response!');
        console.error('Response.data:', response.data);
        console.error('userData:', userData);
        console.error('Available fields in response.data:', Object.keys(response.data));
        console.error('Available fields in userData:', userData ? Object.keys(userData) : 'userData is null');
        
        // Check if there's a token in the response headers
        const headerToken = response.headers['authorization'] || response.headers['Authorization'];
        if (headerToken) {
          console.log('✅ [AuthService] Token found in response headers');
          const extractedToken = headerToken.replace('Bearer ', '');
          console.log('   - Token length:', extractedToken.length);
          console.log('   - Token (first 30 chars):', extractedToken.substring(0, 30) + '...');
          
          // Use the token from headers
          const userToStore = {
            id: userData.userId || userData.id,
            email: userData.email,
            role: userData.role,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            agencyName: userData.agencyName || '',
            agencyAddress: userData.agencyAddress || '',
            token: extractedToken
          };
          
          tokenService.setUser(userToStore);
          tokenService.setToken(extractedToken);
          
          console.log('🔐 [AuthService] User stored with token from headers:', userToStore.id);
          return userToStore;
        }
        
        throw new Error('No authentication token received from server. Please check backend login response.');
      }
      
      console.log('✅ [AuthService] Token found in response');
      console.log('   - Token length:', token.length);
      console.log('   - Token (first 30 chars):', token.substring(0, 30) + '...');
      console.log('✅ [AuthService] Token found in response');
      console.log('   - Token length:', token.length);
      console.log('   - Token (first 30 chars):', token.substring(0, 30) + '...');
      
      // Use tokenService to save user and token
      // Backend uses userId, but we normalize to id
      const userToStore = {
        id: userData.userId || userData.id,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        agencyName: userData.agencyName || '',
        agencyAddress: userData.agencyAddress || '',
        token: token // Store token in user object
      };
      
      // Save to tokenService (which also saves to localStorage)
      tokenService.setUser(userToStore);
      tokenService.setToken(token);
      
      console.log('🔐 [AuthService] User stored in tokenService:', userToStore.id);
      
      return userToStore;
    } catch (error) {
      console.error('🔐 [AuthService] Login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
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
      // Handle 204 No Content response
      return response.data || { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Register user error:', error);
      // Better error handling for CORS and other errors
      if (error.response?.status === 204) {
        return { success: true, message: 'Registration successful' };
      }
      throw error.response?.data?.message || error.message || 'Registration failed';
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
      // Handle 204 No Content response
      return response.data || { success: true, message: 'Agent registration successful' };
    } catch (error) {
      console.error('Register agent error:', error);
      // Better error handling for CORS and other errors
      if (error.response?.status === 204) {
        return { success: true, message: 'Agent registration successful' };
      }
      throw error.response?.data?.message || error.message || 'Agent registration failed';
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
    console.log('🔓 [AuthService] Logging out user');
    tokenService.clearAuth();
    window.location.href = '/login';
  },

  /**
   * Get current user from tokenService
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const user = tokenService.getUser();
    console.log('👤 [AuthService] getCurrentUser:', user ? `User ID: ${user.id}` : 'No user');
    return user;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const isAuth = tokenService.isAuthenticated();
    console.log(`🔑 [AuthService] isAuthenticated: ${isAuth}`);
    return isAuth;
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check (user, agent, superadmin)
   * @returns {boolean}
   */
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    const hasRole = user?.role === role;
    console.log(`👮 [AuthService] hasRole(${role}): ${hasRole}`);
    return hasRole;
  },

  /**
   * Update user data in tokenService
   * @param {Object} updates - Partial user updates
   * @returns {Object|null} Updated user object
   */
  updateUser: (updates) => {
    console.log('📝 [AuthService] Updating user data');
    return tokenService.updateUser(updates);
  },

  /**
   * Get valid auth token
   * @returns {string|null} Auth token or null
   */
  getToken: () => {
    return tokenService.getToken();
  }
};

export default authService;