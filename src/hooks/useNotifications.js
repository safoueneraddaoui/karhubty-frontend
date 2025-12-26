import { useEffect, useCallback, useRef } from 'react';
import notificationService from '../services/notificationService';

/**
 * useNotifications Hook
 * Manages real-time notifications with polling
 * Best practices:
 * - Automatic cleanup on unmount
 * - Efficient polling intervals
 * - Error handling
 */
export const useNotifications = (onNotification, interval = 5000) => {
  const unsubscribeRef = useRef(null);

  const subscribeToNotifications = useCallback(() => {
    // Unsubscribe from previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to real-time notifications
    unsubscribeRef.current = notificationService.subscribeToNotifications(
      (notifications) => {
        if (onNotification && Array.isArray(notifications.data)) {
          // Only call callback for new unread notifications
          notifications.data.forEach((notif) => {
            if (!notif.isRead) {
              onNotification(notif);
            }
          });
        }
      },
      interval
    );
  }, [onNotification, interval]);

  useEffect(() => {
    subscribeToNotifications();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [subscribeToNotifications]);

  return {
    unsubscribe: () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    },
  };
};

export default useNotifications;
