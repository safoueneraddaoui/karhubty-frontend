import api from './api';

const carService = {
  /**
   * Get all available cars
   * @param {Object} filters - Optional filters { category, minPrice, maxPrice, transmission, fuelType }
   * @returns {Promise} Array of cars
   */
  getAllCars: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      const response = await api.get(`/cars?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cars';
    }
  },

  /**
   * Get agent's own cars only
   * @returns {Promise} Array of agent's cars
   */
  getAgentCars: async () => {
    try {
      console.log('🚗 carService.getAgentCars() - Fetching ONLY current agent\'s cars');
      
      // Use dedicated agent endpoint that requires authentication
      // This endpoint ONLY returns the logged-in agent's cars
      const response = await api.get('/cars/agent/my-cars');
      console.log('✅ carService.getAgentCars() - Got agent cars:', response.data);
      
      let agentCars = response.data.data || response.data;
      if (!Array.isArray(agentCars)) {
        agentCars = agentCars ? [agentCars] : [];
      }
      
      console.log(`✅ Agent has ${agentCars.length} car(s)`);
      return agentCars;
    } catch (error) {
      console.error('❌ carService.getAgentCars() - Error:', error.message);
      console.error('⚠️ Make sure you are logged in as an agent');
      return [];
    }
  },

  /**
   * Get all available cars for users to browse and reserve
   * @returns {Promise} Array of available cars
   */
  getAllAvailableCars: async () => {
    try {
      console.log('🚗 carService.getAllAvailableCars() - Fetching all available cars');
      const response = await api.get('/cars');
      console.log('✅ carService.getAllAvailableCars() - Success:', response.data);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('❌ carService.getAllAvailableCars() - Error:', error.message);
      throw error.response?.data?.message || 'Failed to fetch available cars';
    }
  },

  /**
   * Get car by ID
   * @param {number} carId - Car ID
   * @returns {Promise} Car details
   */
  getCarById: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch car details';
    }
  },

  /**
   * Search cars
   * @param {string} query - Search query
   * @returns {Promise} Array of matching cars
   */
  searchCars: async (query) => {
    try {
      const response = await api.get(`/cars/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Search failed';
    }
  },

  /**
   * Check car availability
   * @param {number} carId - Car ID
   * @param {Object} dates - { startDate, endDate }
   * @returns {Promise} Availability status
   */
  checkAvailability: async (carId, dates) => {
    try {
      const response = await api.post(`/cars/${carId}/check-availability`, dates);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to check availability';
    }
  },

  /**
   * Get car reviews
   * @param {number} carId - Car ID
   * @returns {Promise} Array of reviews
   */
  getCarReviews: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch reviews';
    }
  },

  /**
   * Get featured/popular cars
   * @returns {Promise} Array of featured cars
   */
  getFeaturedCars: async () => {
    try {
      const response = await api.get('/cars/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch featured cars';
    }
  },

  /**
   * Get cars by category
   * @param {string} category - Car category
   * @returns {Promise} Array of cars
   */
  getCarsByCategory: async (category) => {
    try {
      const response = await api.get(`/cars/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cars by category';
    }
  },

  /**
   * Add a new car with images (Agent only)
   * @param {Object} carData - Car details
   * @param {Array<File>} imageFiles - Image files to upload
   * @returns {Promise} Created car data
   */
  addCar: async (carData, imageFiles = []) => {
    try {
      console.log('🚗 carService.addCar() - Adding new car:', carData);
      console.log('📸 carService.addCar() - Image files:', imageFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add car data fields
      Object.keys(carData).forEach(key => {
        if (Array.isArray(carData[key])) {
          // Handle array fields (like features)
          carData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          console.log(`  - Adding field: ${key} = ${carData[key]}`);
          formData.append(key, carData[key]);
        }
      });
      
      // Add image files
      imageFiles.forEach((file) => {
        console.log(`  - Adding image: ${file.name} (${file.size} bytes)`);
        formData.append('images', file);
      });
      
      // Don't set Content-Type header - let browser set it with boundary
      const response = await api.post('/cars', formData);
      console.log('✅ carService.addCar() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.addCar() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to add car';
    }
  },

  /**
   * Update/modify a car with optional new images (Agent only)
   * @param {number} carId - Car ID
   * @param {Object} carData - Updated car details
   * @param {Array<File>} imageFiles - New image files to upload (optional)
   * @returns {Promise} Updated car data
   */
  modifyCar: async (carId, carData, imageFiles = []) => {
    try {
      console.log('🚗 carService.modifyCar() - Updating car:', carId, carData);
      console.log('📸 carService.modifyCar() - Image files:', imageFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add car data fields
      Object.keys(carData).forEach(key => {
        if (Array.isArray(carData[key])) {
          // Handle array fields (like features)
          carData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          console.log(`  - Adding field: ${key} = ${carData[key]}`);
          formData.append(key, carData[key]);
        }
      });
      
      // Add new image files if provided
      imageFiles.forEach((file) => {
        console.log(`  - Adding image: ${file.name} (${file.size} bytes)`);
        formData.append('images', file);
      });
      
      // Don't set Content-Type header - let browser set it with boundary
      const response = await api.put(`/cars/${carId}`, formData);
      console.log('✅ carService.modifyCar() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.modifyCar() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to update car';
    }
  },

  /**
   * Delete a car (Agent Admin only)
   * @param {number} carId - Car ID
   * @returns {Promise} Success message
   */
  deleteCar: async (carId) => {
    try {
      console.log('🚗 carService.deleteCar() - Deleting car:', carId);
      const response = await api.delete(`/cars/${carId}`);
      console.log('✅ carService.deleteCar() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.deleteCar() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to delete car';
    }
  },

  /**
   * Update car availability status
   * @param {number} carId - Car ID
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} Updated car data
   */
  updateCarAvailability: async (carId, isAvailable) => {
    try {
      console.log('🚗 carService.updateCarAvailability() - Setting car', carId, 'available:', isAvailable);
      const response = await api.put(`/cars/${carId}/availability`, { isAvailable });
      console.log('✅ carService.updateCarAvailability() - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ carService.updateCarAvailability() - Error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Failed to update car availability';
    }
  },
};

export default carService;