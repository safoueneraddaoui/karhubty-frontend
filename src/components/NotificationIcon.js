import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import rentalService from '../services/rentalService';

const NotificationIcon = ({ user }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    if (user && (user.role === 'agentadmin' || user.role === 'agent')) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Fetch pending count
      const countResponse = await rentalService.getPendingRentalsCount();
      const count = countResponse.count || countResponse.data?.count || 0;
      setPendingCount(count);

      // Fetch agent rentals for dropdown
      const rentalsResponse = await rentalService.getAgentRentals();
      const rentalsData = Array.isArray(rentalsResponse) ? rentalsResponse : [];
      const pendingRentals = rentalsData.filter(r => r.status === 'pending').slice(0, 5);
      setRentals(pendingRentals);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  if (!user || (user.role !== 'agentadmin' && user.role !== 'agent')) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-sky-500 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {pendingCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-sky-500 text-white px-4 py-3 rounded-t-lg border-b">
            <h3 className="font-bold text-sm">Pending Requests ({pendingCount})</h3>
          </div>

          {rentals.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <p className="text-sm">No pending requests</p>
            </div>
          ) : (
            <div className="divide-y">
              {rentals.map(rental => (
                <div
                  key={rental.rentalId}
                  className="px-4 py-3 hover:bg-sky-50 transition-colors border-l-4 border-yellow-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {rental.user ? `${rental.user.firstName} ${rental.user.lastName}` : 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Unknown Car'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {rental.startDate} → {rental.endDate}
                      </p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))}
              {pendingCount > 5 && (
                <div className="px-4 py-2 text-center bg-gray-50 text-xs text-gray-600">
                  +{pendingCount - 5} more requests
                </div>
              )}
            </div>
          )}

          <div className="sticky bottom-0 bg-gray-50 px-4 py-3 rounded-b-lg border-t">
            <a
              href="/agent-dashboard"
              onClick={() => setShowDropdown(false)}
              className="block w-full text-center text-sm text-sky-600 hover:text-sky-700 font-medium py-2"
            >
              View All Requests →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
