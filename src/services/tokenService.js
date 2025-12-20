/**
 * Token Service
 * Centralized token management following best practices
 * - Single source of truth for token storage
 * - Consistent token retrieval across the app
 * - Automatic token refresh handling
 * - Secure token cleanup on logout
 */

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_VALIDITY_HOURS = 1; // Token valid for 1 hour

const tokenService = {
  /**
   * Save auth token to localStorage with expiration time
   * @param {string} token - The auth token from login response
   */
  setToken: (token) => {
    if (!token) {
      console.warn('⚠️ [TokenService] Attempted to set empty/null token');
      return false;
    }
    try {
      localStorage.setItem(TOKEN_KEY, token);
      // Set expiration time (1 hour from now)
      const expiryTime = Date.now() + (TOKEN_VALIDITY_HOURS * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      console.log('✅ [TokenService] Token saved successfully');
      console.log('   - Token length:', token.length);
      console.log('   - Expires at:', new Date(expiryTime).toLocaleString());
      console.log('   - Expiry timestamp:', expiryTime);
      console.log('   - Current time:', Date.now());
      return true;
    } catch (error) {
      console.error('❌ [TokenService] Failed to save token:', error);
      return false;
    }
  },

  /**
   * Get auth token from localStorage (without checking expiration)
   * @returns {string|null} The stored auth token or null
   */
  getToken: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        console.warn('⚠️ [TokenService] No token found in localStorage');
        return null;
      }
      
      console.log('✅ [TokenService] Token retrieved from localStorage');
      console.log('   - Storage key:', TOKEN_KEY);
      console.log('   - Token length:', token.length);
      console.log('   - Token (first 20 chars):', token.substring(0, 20) + '...');
      return token;
    } catch (error) {
      console.error('❌ [TokenService] Failed to get token:', error);
      return null;
    }
  },

  /**
   * Save refresh token for token renewal
   * @param {string} refreshToken - The refresh token
   */
  setRefreshToken: (refreshToken) => {
    if (!refreshToken) return false;
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      console.log('✅ [TokenService] Refresh token saved');
      return true;
    } catch (error) {
      console.error('❌ [TokenService] Failed to save refresh token:', error);
      return false;
    }
  },

  /**
   * Get refresh token from localStorage
   * @returns {string|null} The stored refresh token or null
   */
  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('❌ [TokenService] Failed to get refresh token:', error);
      return null;
    }
  },

  /**
   * Save complete user object with token
   * @param {Object} userData - User data object that should include token
   */
  setUser: (userData) => {
    if (!userData) {
      console.warn('⚠️ [TokenService] Attempted to set empty/null user data');
      return false;
    }
    try {
      // Ensure token is in user data
      if (userData.token || userData.accessToken || userData.access_token) {
        const token = userData.token || userData.accessToken || userData.access_token;
        tokenService.setToken(token);
      }
      
      // Save user data separately for easier access
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      console.log('✅ [TokenService] User data saved with ID:', userData.id);
      return true;
    } catch (error) {
      console.error('❌ [TokenService] Failed to save user data:', error);
      return false;
    }
  },

  /**
   * Get user object from localStorage
   * @returns {Object|null} The stored user data or null
   */
  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
      console.warn('⚠️ [TokenService] No user data found in localStorage');
      return null;
    } catch (error) {
      console.error('❌ [TokenService] Failed to parse user data:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated (has valid, non-expired token)
   * @returns {boolean} True if token exists and is not expired
   */
  isAuthenticated: () => {
    const token = tokenService.getToken();
    const user = tokenService.getUser();
    const isExpired = tokenService.isTokenExpired();
    const isAuth = !!token && !!user && !isExpired;
    console.log(`📊 [TokenService] Authentication status: ${isAuth ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`, { hasToken: !!token, hasUser: !!user, isExpired });
    return isAuth;
  },

  /**
   * Clear all auth data (logout)
   */
  clearAuth: () => {
    try {
      console.log('🔓 [TokenService] Clearing authentication data');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      console.log('✅ [TokenService] All auth data cleared');
    } catch (error) {
      console.error('❌ [TokenService] Failed to clear auth data:', error);
    }
  },

  /**
   * Update user data while keeping token
   * @param {Object} updates - Partial user data to update
   */
  updateUser: (updates) => {
    const currentUser = tokenService.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      tokenService.setUser(updatedUser);
      return updatedUser;
    }
    return null;
  },

  /**
   * Get Authorization header value
   * @returns {string|null} "Bearer token" or null
   */
  getAuthHeader: () => {
    const token = tokenService.getToken();
    if (token) {
      return `Bearer ${token}`;
    }
    return null;
  },

  /**
   * Validate token format (basic check)
   * @param {string} token - Token to validate
   * @returns {boolean} True if token looks valid
   */
  isValidToken: (token) => {
    if (!token || typeof token !== 'string') return false;
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  },

  /**
   * Check if token has expired
   * @returns {boolean} True if token exists and is expired, false if no token or not expired
   */
  isTokenExpired: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      
      // If no token exists, it's not expired (just not logged in)
      if (!token) {
        return false;
      }
      
      // If token exists but no expiry, it might be from an old session
      // Re-set the expiry to give it 1 hour from now
      if (!expiry) {
        console.warn('⚠️ [TokenService] Token found without expiry, setting new expiry');
        const expiryTime = Date.now() + (TOKEN_VALIDITY_HOURS * 60 * 60 * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        return false; // Not expired now that we set a new expiry
      }
      
      // Check if current time is past expiry
      const isExpired = Date.now() > parseInt(expiry);
      if (isExpired) {
        console.warn('⚠️ [TokenService] Token has expired');
      }
      return isExpired;
    } catch (error) {
      console.error('❌ [TokenService] Failed to check token expiry:', error);
      return false;
    }
  },

  /**
   * Extend token validity (reset expiration time)
   * Call this on user activity to keep session alive
   */
  extendTokenValidity: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !tokenService.isTokenExpired()) {
      const expiryTime = Date.now() + (TOKEN_VALIDITY_HOURS * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      console.log('✅ [TokenService] Token validity extended until:', new Date(expiryTime).toLocaleString());
      return true;
    }
    return false;
  },

  /**
   * Get time remaining until token expires (in minutes)
   * @returns {number} Minutes until expiration, or 0 if expired
   */
  getTimeUntilExpiry: () => {
    try {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiry) return 0;
      const remaining = parseInt(expiry) - Date.now();
      return remaining > 0 ? Math.floor(remaining / 60000) : 0;
    } catch (error) {
      return 0;
    }
  }
};

export default tokenService;
