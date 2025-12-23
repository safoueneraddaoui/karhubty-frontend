import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import rentalService from '../services/rentalService';

const NotificationIcon = ({ user }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rentals, setRentals] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const fetchNotifications = async () => {
    try {
      if (user.role === 'agentadmin' || user.role === 'agent') {
        // For agents: show pending rental requests
        const countResponse = await rentalService.getPendingRentalsCount();
        const count = countResponse.count || countResponse.data?.count || 0;
        setNotificationCount(count);

        const rentalsResponse = await rentalService.getAgentRentals();
        const rentalsData = Array.isArray(rentalsResponse) ? rentalsResponse : [];
        const pendingRentals = rentalsData.filter(r => r.status === 'pending').slice(0, 5);
        setRentals(pendingRentals);
      } else if (user.role === 'user') {
        // For users: show approved/rejected rental notifications
        const rentalsResponse = await rentalService.getUserRentals(user.id);
        const rentalsData = Array.isArray(rentalsResponse.data || rentalsResponse) ? (rentalsResponse.data || rentalsResponse) : [];
        
        // Filter recent approved or rejected rentals (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentNotifications = rentalsData.filter(r => {
          if (r.status === 'approved' || r.status === 'rejected') {
            const statusDate = new Date(r.approvalDate || r.updatedAt || r.requestDate);
            return statusDate >= sevenDaysAgo;
          }
          return false;
        }).slice(0, 5);
        
        setRentals(recentNotifications);
        setNotificationCount(recentNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  if (!user) {
    return null;
  }

  const isAgent = user.role === 'agentadmin' || user.role === 'agent';
  const isUser = user.role === 'user';

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
    // Notification count is now always visible
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 text-gray-700 hover:text-sky-500 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-sky-500 text-white px-4 py-3 rounded-t-lg border-b">
            <h3 className="font-bold text-sm">
              {isAgent ? `Pending Requests (${notificationCount})` : `Notifications (${notificationCount})`}
            </h3>
          </div>

          {rentals.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <p className="text-sm">
                {isAgent ? 'No pending requests' : 'No recent notifications'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {rentals.map(rental => (
                <div
                  key={rental.rentalId}
                  className={`px-4 py-3 hover:bg-sky-50 transition-colors border-l-4 ${
                    isAgent 
                      ? 'border-yellow-400' 
                      : rental.status === 'approved' 
                        ? 'border-green-400' 
                        : 'border-red-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isAgent ? (
                        <>
                          <p className="text-sm font-semibold text-gray-800">
                            {rental.user ? `${rental.user.firstName} ${rental.user.lastName}` : 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Unknown Car'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-gray-800">
                            {rental.status === 'approved' ? '✓ Request Approved' : '✗ Request Rejected'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Car rental'}
                          </p>
                        </>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {rental.startDate} → {rental.endDate}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                      rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      rental.status === 'approved' ? 'bg-green-100 text-green-800' :
                      rental.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))}
              {notificationCount > 5 && (
                <div className="px-4 py-2 text-center bg-gray-50 text-xs text-gray-600">
                  +{notificationCount - 5} more {isAgent ? 'requests' : 'notifications'}
                </div>
              )}
            </div>
          )}

          <div className="sticky bottom-0 bg-gray-50 px-4 py-3 rounded-b-lg border-t">
            <a
              href={isAgent ? '/agent-dashboard' : '/user-dashboard'}
              onClick={() => setShowDropdown(false)}
              className="block w-full text-center text-sm text-sky-600 hover:text-sky-700 font-medium py-2"
            >
              {isAgent ? 'View All Requests →' : 'View All Rentals →'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
