import api from './api';

const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      return response.data.count;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Subscribe to real-time notifications (polling)
  subscribeToNotifications: (callback, interval = 5000) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get('/notifications/unread');
        if (response.data && callback) {
          callback(response.data);
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, interval);

    // Return unsubscribe function
    return () => clearInterval(pollInterval);
  },

  // Get notifications for superadmin about pending documents
  getPendingDocuments: async () => {
    try {
      const response = await api.get('/documents/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default notificationService;
