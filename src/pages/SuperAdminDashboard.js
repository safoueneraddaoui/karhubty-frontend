import React, { useState, useEffect } from 'react';
import { Users, Building2, Car, CheckCircle, XCircle, Eye, Trash2, Shield, DollarSign, X } from 'lucide-react';

const SuperAdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentRequests, setAgentRequests] = useState([]);
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const responses = await Promise.all([
      //   axios.get('http://localhost:8080/api/admin/users'),
      //   axios.get('http://localhost:8080/api/admin/agents'),
      //   axios.get('http://localhost:8080/api/admin/agent-requests'),
      //   axios.get('http://localhost:8080/api/admin/cars'),
      //   axios.get('http://localhost:8080/api/admin/rentals'),
      //   axios.get('http://localhost:8080/api/admin/stats')
      // ]);
      
      // Mock data
      const mockUsers = [
        { userId: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', isActive: true, dateCreated: '2024-01-15' },
        { userId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', isActive: true, dateCreated: '2024-01-20' },
        { userId: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', isActive: false, dateCreated: '2024-02-01' }
      ];

      const mockAgents = [
        { agentId: 1, agencyName: 'Premium Rentals', email: 'premium@example.com', accountStatus: 'approved', city: 'Le Mans', dateRegistered: '2024-01-10' },
        { agentId: 2, agencyName: 'Luxury Cars', email: 'luxury@example.com', accountStatus: 'approved', city: 'Paris', dateRegistered: '2024-01-25' }
      ];

      const mockAgentRequests = [
        { requestId: 1, email: 'newagent@example.com', agencyName: 'New Rentals', city: 'Lyon', status: 'pending', requestDate: '2024-02-10' },
        { requestId: 2, email: 'another@example.com', agencyName: 'Fast Cars', city: 'Marseille', status: 'pending', requestDate: '2024-02-12' }
      ];

      const mockCars = [
        { carId: 1, brand: 'Tesla', model: 'Model 3', agentName: 'Premium Rentals', pricePerDay: 85, isAvailable: true },
        { carId: 2, brand: 'BMW', model: 'X5', agentName: 'Premium Rentals', pricePerDay: 120, isAvailable: true },
        { carId: 3, brand: 'Mercedes', model: 'E-Class', agentName: 'Luxury Cars', pricePerDay: 150, isAvailable: true }
      ];

      const mockRentals = [
        { rentalId: 1, userName: 'John Doe', carName: 'Tesla Model 3', agentName: 'Premium Rentals', status: 'completed', totalPrice: 425, startDate: '2024-01-15' },
        { rentalId: 2, userName: 'Jane Smith', carName: 'BMW X5', agentName: 'Premium Rentals', status: 'approved', totalPrice: 600, startDate: '2024-02-01' },
        { rentalId: 3, userName: 'Bob Johnson', carName: 'Mercedes E-Class', agentName: 'Luxury Cars', status: 'pending', totalPrice: 750, startDate: '2024-02-15' }
      ];

      const mockStats = {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.isActive).length,
        totalAgents: mockAgents.length,
        totalCars: mockCars.length,
        totalRentals: mockRentals.length,
        pendingRequests: mockAgentRequests.filter(r => r.status === 'pending').length,
        totalRevenue: mockRentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalPrice, 0)
      };

      setUsers(mockUsers);
      setAgents(mockAgents);
      setAgentRequests(mockAgentRequests);
      setCars(mockCars);
      setRentals(mockRentals);
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const approveAgent = async (requestId) => {
    if (window.confirm('Approve this agent request?')) {
      try {
        // TODO: API call
        // await axios.put(`http://localhost:8080/api/admin/agent-requests/${requestId}/approve`);
        alert('Agent approved successfully!');
        fetchAllData();
      } catch (error) {
        alert('Failed to approve agent');
      }
    }
  };

  const rejectAgent = async (requestId) => {
    if (window.confirm('Reject this agent request?')) {
      try {
        // TODO: API call
        // await axios.put(`http://localhost:8080/api/admin/agent-requests/${requestId}/reject`);
        alert('Agent request rejected');
        fetchAllData();
      } catch (error) {
        alert('Failed to reject agent');
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        // TODO: API call
        // await axios.put(`http://localhost:8080/api/admin/users/${userId}/status`, { isActive: !currentStatus });
        alert(`User ${action}d successfully`);
        fetchAllData();
      } catch (error) {
        alert(`Failed to ${action} user`);
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // TODO: API call
        // await axios.delete(`http://localhost:8080/api/admin/users/${userId}`);
        alert('User deleted successfully');
        fetchAllData();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const suspendAgent = async (agentId) => {
    if (window.confirm('Suspend this agent account?')) {
      try {
        // TODO: API call
        // await axios.put(`http://localhost:8080/api/admin/agents/${agentId}/suspend`);
        alert('Agent suspended successfully');
        fetchAllData();
      } catch (error) {
        alert('Failed to suspend agent');
      }
    }
  };

  const deleteAgent = async (agentId) => {
    if (window.confirm('Delete this agent and all their cars? This action cannot be undone.')) {
      try {
        // TODO: API call
        // await axios.delete(`http://localhost:8080/api/admin/agents/${agentId}`);
        alert('Agent deleted successfully');
        fetchAllData();
      } catch (error) {
        alert('Failed to delete agent');
      }
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm('Delete this car?')) {
      try {
        // TODO: API call
        // await axios.delete(`http://localhost:8080/api/admin/cars/${carId}`);
        alert('Car deleted successfully');
        fetchAllData();
      } catch (error) {
        alert('Failed to delete car');
      }
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage the entire Karhubty platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-sky-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-sky-600 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">↑ {stats.activeUsers} active</p>
              </div>
              <div className="bg-sky-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Agents</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalAgents}</p>
                <p className="text-xs text-yellow-600 mt-1">↑ {stats.pendingRequests} pending</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Cars</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalCars}</p>
                <p className="text-xs text-gray-600 mt-1">Across all agents</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Platform Revenue</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">€{stats.totalRevenue}</p>
                <p className="text-xs text-green-600 mt-1">↑ {stats.totalRentals} rentals</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {['overview', 'users', 'agents', 'agent-requests', 'cars', 'rentals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-600 hover:text-sky-500'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                System Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm">Total Rentals</p>
                  <p className="text-2xl font-bold">{stats.totalRentals}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm">Pending Agent Requests</p>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm">Platform Health</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Users</h3>
                {users.slice(0, 5).map(user => (
                  <div key={user.userId} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Rentals</h3>
                {rentals.slice(0, 5).map(rental => (
                  <div key={rental.rentalId} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800">{rental.carName}</p>
                      <p className="text-sm text-gray-600">{rental.userName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.dateCreated}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="text-sky-600 hover:text-sky-700"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.userId, user.isActive)}
                            className={user.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteUser(user.userId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Agents ({agents.length})</h2>
            <div className="space-y-4">
              {agents.map(agent => (
                <div key={agent.agentId} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{agent.agencyName}</h3>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                    <p className="text-sm text-gray-600">{agent.city} • Joined: {agent.dateRegistered}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(agent.accountStatus)}`}>
                      {agent.accountStatus}
                    </span>
                    <button
                      onClick={() => suspendAgent(agent.agentId)}
                      className="text-yellow-600 hover:text-yellow-700 px-3 py-2 rounded-lg border border-yellow-600"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.agentId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agent Requests Tab */}
        {activeTab === 'agent-requests' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Pending Agent Requests ({agentRequests.filter(r => r.status === 'pending').length})
            </h2>
            {agentRequests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {agentRequests.filter(r => r.status === 'pending').map(request => (
                  <div key={request.requestId} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">{request.agencyName}</h3>
                      <p className="text-sm text-gray-600">{request.email}</p>
                      <p className="text-sm text-gray-600">{request.city} • Requested: {request.requestDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveAgent(request.requestId)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectAgent(request.requestId)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Cars ({cars.length})</h2>
            <div className="space-y-4">
              {cars.map(car => (
                <div key={car.carId} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">{car.brand} {car.model}</h3>
                    <p className="text-sm text-gray-600">Agent: {car.agentName}</p>
                    <p className="text-sky-600 font-semibold">€{car.pricePerDay}/day</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <button
                      onClick={() => deleteCar(car.carId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Rentals ({rentals.length})</h2>
            <div className="space-y-4">
              {rentals.map(rental => (
                <div key={rental.rentalId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{rental.carName}</h3>
                      <p className="text-sm text-gray-600">Customer: {rental.userName}</p>
                      <p className="text-sm text-gray-600">Agent: {rental.agentName}</p>
                      <p className="text-sm text-gray-600">Date: {rental.startDate}</p>
                      <p className="text-sky-600 font-semibold mt-2">€{rental.totalPrice}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute -top-3 -right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 transition-all duration-200 hover:scale-110 shadow-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">User Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="font-semibold">{selectedUser.dateCreated}</p>
              </div>
            </div>
            <button
              onClick={() => setShowUserModal(false)}
              className="w-full mt-6 bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;