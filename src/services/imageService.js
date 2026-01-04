import api from './api';

const imageService = {
  /**
   * Get all images for a car
   * @param {number} carId - Car ID
   * @returns {Promise} Array of car images
   */
  getCarImages: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}/images`);
      return response.data;
    } catch (error) {
      console.error('Error fetching car images:', error);
      return [];
    }
  },

  /**
   * Get primary/cover image for a car
   * @param {number} carId - Car ID
   * @returns {Promise} Primary car image
   */
  getPrimaryImage: async (carId) => {
    try {
      const response = await api.get(`/cars/${carId}/images/primary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching primary image:', error);
      return null;
    }
  },

  /**
   * Upload images to a car
   * @param {number} carId - Car ID
   * @param {FormData} formData - FormData with 'images' files
   * @returns {Promise} Array of uploaded images
   */
  uploadImages: async (carId, formData) => {
    try {
      const response = await api.post(`/cars/${carId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error.response?.data?.message || 'Failed to upload images';
    }
  },

  /**
   * Set image as primary
   * @param {number} carId - Car ID
   * @param {number} imageId - Image ID
   * @returns {Promise} Updated image
   */
  setPrimaryImage: async (carId, imageId) => {
    try {
      const response = await api.put(
        `/cars/${carId}/images/${imageId}/primary`,
      );
      return response.data;
    } catch (error) {
      console.error('Error setting primary image:', error);
      throw error.response?.data?.message || 'Failed to set primary image';
    }
  },

  /**
   * Delete specific image
   * @param {number} carId - Car ID
   * @param {number} imageId - Image ID
   * @returns {Promise}
   */
  deleteImage: async (carId, imageId) => {
    try {
      const response = await api.delete(`/cars/${carId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error.response?.data?.message || 'Failed to delete image';
    }
  },

  /**
   * Reorder images for display
   * @param {number} carId - Car ID
   * @param {Array} imageIds - Array of image IDs in desired order
   * @returns {Promise} Array of reordered images
   */
  reorderImages: async (carId, imageIds) => {
    try {
      const response = await api.put(`/cars/${carId}/images/reorder`, {
        imageIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error.response?.data?.message || 'Failed to reorder images';
    }
  },

  /**
   * Get image URL for display
   * @param {string} imagePath - Image path from server
   * @returns {string} Full URL to image
   */
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;

    // If already a full URL, return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Get API host URL dynamically
    const getAPIHost = () => {
      const env = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL;
      if (env) {
        return env.replace(/\/api\/?$/, '');
      }
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port.replace('3000', '8080')}` : '';
        return `${protocol}//${hostname}${port}`;
      }
      return 'http://localhost:8080';
    };
    
    const apiBaseUrl = getAPIHost();
    return `${apiBaseUrl}/uploads/${imagePath}`;
  },

  /**
   * Validate image before upload
   * @param {File} file - File to validate
   * @returns {Object} { valid: boolean, error?: string }
   */
  validateImage: (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        error: 'Image size must be less than 5MB',
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPG, PNG, and WebP images are allowed',
      };
    }

    return { valid: true };
  },

  /**
   * Create optimized thumbnail URL (if backend supports image resizing)
   * @param {string} imagePath - Original image path
   * @param {number} width - Desired width in pixels
   * @param {number} height - Desired height in pixels
   * @returns {string} URL to resized image
   */
  getThumbnailUrl: (imagePath, width = 300, height = 300) => {
    const baseUrl = imageService.getImageUrl(imagePath);
    if (!baseUrl) return null;

    // For now, return original URL
    // In future, this can add query parameters like ?w=300&h=300 for backend image processing
    return baseUrl;
  },

  /**
   * Get responsive image URLs for different screen sizes
   * @param {string} imagePath - Original image path
   * @returns {Object} Object with different sized URLs
   */
  getResponsiveImageUrls: (imagePath) => {
    const baseUrl = imageService.getImageUrl(imagePath);
    if (!baseUrl) return {};

    return {
      thumbnail: baseUrl, // 300x300 (or smaller)
      small: baseUrl, // 600x400
      medium: baseUrl, // 800x600
      large: baseUrl, // 1200x800
      original: baseUrl, // Full resolution
    };
  },
};

export default imageService;
