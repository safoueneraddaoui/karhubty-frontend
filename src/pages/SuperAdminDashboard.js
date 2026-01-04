import React, { useState, useEffect, useCallback } from 'react';
import { Users, Building2, Car, CheckCircle, XCircle, Eye, Trash2, Shield, DollarSign, X, FileText } from 'lucide-react';
import Toast from '../components/Toast';
import DocumentsVerification from '../components/DocumentsVerification';
import DocumentsReview from '../components/DocumentsReview';
import useNotifications from '../hooks/useNotifications';
import tokenService from '../services/tokenService';
import api from '../services/api';

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
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgentForDocuments, setSelectedAgentForDocuments] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchAllData = useCallback(async () => {
    try {
      const token = tokenService.getToken();
      
      console.log('[SuperAdminDashboard] fetchAllData called');
      console.log('[SuperAdminDashboard] Token retrieved:', token ? 'YES (length: ' + token.length + ')' : 'NO');
      
      if (!token) {
        console.log('[SuperAdminDashboard] ERROR: No token found');
        addToast('Not authenticated. Please login again.', 'error');
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('[SuperAdminDashboard] Making API calls with token...');
      console.log('[SuperAdminDashboard] Token (first 50 chars):', token.substring(0, 50) + '...');

      // Fetch all admin data from backend APIs
      const [statsRes, agentsRes, usersRes] = await Promise.all([
        api.get('/admin/stats')
          .then(r => {
            console.log('[SuperAdminDashboard] /admin/stats response status:', r.status);
            return r.data;
          })
          .catch(e => {
            console.error('[SuperAdminDashboard] /admin/stats fetch error:', e);
            throw e;
          }),
        api.get('/admin/agents')
          .then(r => {
            console.log('[SuperAdminDashboard] /admin/agents response status:', r.status);
            return r.data;
          })
          .catch(e => {
            console.error('[SuperAdminDashboard] /admin/agents fetch error:', e);
            throw e;
          }),
        api.get('/users')
          .then(r => {
            console.log('[SuperAdminDashboard] /api/users response status:', r.status);
            return r.data;
          })
          .catch(e => {
            console.error('[SuperAdminDashboard] /api/users fetch error:', e);
            throw e;
          }),
      ]);

      // Set stats
      const pendingCount = (agentsRes || []).filter(a => a.accountStatus === 'pending').length || 0;
      const verificationCount = (agentsRes || []).filter(a => a.accountStatus === 'in_verification').length || 0;
      setStats({
        totalUsers: statsRes.totalUsers || 0,
        activeUsers: statsRes.totalUsers - 0 || 0,
        totalAgents: statsRes.totalAgents || 0,
        totalCars: statsRes.totalCars || 0,
        totalRentals: statsRes.totalRentals || 0,
        pendingRequests: pendingCount + verificationCount,
        totalRevenue: statsRes.totalRevenue || 0
      });

      // Transform users data
      setUsers(usersRes || []);

      // Transform agents data - separate approved, pending, and in_verification
      const approvedAgents = (agentsRes || []).filter(a => a.accountStatus === 'approved') || [];
      const pendingAgents = (agentsRes || []).filter(a => a.accountStatus === 'pending') || [];
      const verificationAgents = (agentsRes || []).filter(a => a.accountStatus === 'in_verification') || [];
      
      setAgents(approvedAgents);
      setAgentRequests([
        ...pendingAgents.map(a => ({
          ...a,
          requestId: a.agentId,
          status: a.accountStatus
        })),
        ...verificationAgents.map(a => ({
          ...a,
          requestId: a.agentId,
          status: a.accountStatus
        }))
      ]);

      // TODO: Fetch cars and rentals when APIs are available
      setCars([]);
      setRentals([]);

      setLoading(false);
      console.log('[SuperAdminDashboard] fetchAllData completed successfully');
    } catch (error) {
      console.error('[SuperAdminDashboard] Error fetching admin data:', error);
      console.error('[SuperAdminDashboard] Error message:', error?.message);
      console.error('[SuperAdminDashboard] Error stack:', error?.stack);
      console.error('[SuperAdminDashboard] Full error object:', error);
      addToast('Failed to load dashboard data: ' + (error?.message || 'Unknown error'), 'error');
      setLoading(false);
    }
  }, [addToast]);

  // Handle incoming real-time notifications
  const handleNewNotification = useCallback((notification) => {
    if (notification.type === 'documents_submitted') {
      addToast(`📄 ${notification.message}`, 'info');
      // Refresh agents list to show new verification agents
      fetchAllData();
      // Mark notification as read
      api.put(`/notifications/${notification.notificationId}/read`).catch(() => {});
    } else if (notification.type === 'document_verified' || notification.type === 'document_rejected') {
      addToast(`${notification.title}: ${notification.message}`, 'info');
      // Mark notification as read
      api.put(`/notifications/${notification.notificationId}/read`).catch(() => {});
    }
  }, [fetchAllData, addToast]);

  // Use notification hook for real-time updates
  useNotifications(handleNewNotification, 4000);

  useEffect(() => {
    // Check for welcome toast flag (only run once on mount)
    const showWelcome = sessionStorage.getItem('showWelcomeToast');
    if (showWelcome === 'true') {
      addToast('🎉 Mara7ba bik fi KarHubty!', 'success');
      sessionStorage.removeItem('showWelcomeToast');
    }
    
    fetchAllData();

    // Cleanup: no interval cleanup needed since hook handles it
    return () => {};
  }, [fetchAllData, addToast]);

  const approveAgent = async (requestId) => {
    if (window.confirm('Approve this agent request?')) {
      try {
        await api.put(`/admin/agents/${requestId}/approve`, {});
        addToast('Agent approved successfully!', 'success');
        // Move agent from pending to approved in state
        setAgentRequests(prevRequests => prevRequests.filter(r => r.requestId !== requestId));
        // Find the agent and add to approved list
        const agentToApprove = agentRequests.find(r => r.requestId === requestId);
        if (agentToApprove) {
          setAgents(prevAgents => [...prevAgents, { ...agentToApprove, accountStatus: 'approved' }]);
        }
      } catch (error) {
        console.error('Error approving agent:', error);
        addToast('Failed to approve agent: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const rejectAgent = async (requestId) => {
    if (window.confirm('Reject this agent request?')) {
      try {
        await api.put(`/admin/agents/${requestId}/reject`, {});
        addToast('Agent request rejected', 'success');
        // Remove from pending requests
        setAgentRequests(prevRequests => prevRequests.filter(r => r.requestId !== requestId));
      } catch (error) {
        console.error('Error rejecting agent:', error);
        addToast('Failed to reject agent: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
        addToast(`User ${action}d successfully`, 'success');
        // Update user status in state immediately
        setUsers(prevUsers => prevUsers.map(u => 
          u.userId === userId ? { ...u, isActive: !currentStatus } : u
        ));
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        addToast(`Failed to ${action} user: ` + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        addToast('User deleted successfully', 'success');
        // Remove user from state immediately
        setUsers(prevUsers => prevUsers.filter(u => u.userId !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        addToast('Failed to delete user: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const suspendAgent = async (agentId) => {
    if (window.confirm('Suspend this agent account?')) {
      try {
        await api.put(`/admin/agents/${agentId}/suspend`, {});
        addToast('Agent suspended successfully', 'success');
        // Update agent status in state immediately
        setAgents(prevAgents => prevAgents.map(a => 
          a.agentId === agentId ? { ...a, accountStatus: 'suspended' } : a
        ));
      } catch (error) {
        console.error('Error suspending agent:', error);
        addToast('Failed to suspend agent: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const deleteAgent = async (agentId) => {
    if (window.confirm('Delete this agent and all their cars? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/agents/${agentId}`);
        addToast('Agent deleted successfully', 'success');
        // Remove agent from state immediately
        setAgents(prevAgents => prevAgents.filter(a => a.agentId !== agentId));
        setAgentRequests(prevRequests => prevRequests.filter(r => r.agentId !== agentId));
      } catch (error) {
        console.error('Error deleting agent:', error);
        addToast('Failed to delete agent: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm('Delete this car?')) {
      try {
        await api.delete(`/cars/${carId}`);
        addToast('Car deleted successfully', 'success');
        // Remove car from state immediately
        setCars(prevCars => prevCars.filter(c => c.carId !== carId));
      } catch (error) {
        console.error('Error deleting car:', error);
        addToast('Failed to delete car: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const viewAgentDetails = (agent) => {
    setSelectedAgent(agent);
    setShowAgentModal(true);
  };

  const requestAgentDocuments = async (agentEmail) => {
    const documentTypes = [
      'Business License',
      'Insurance Certificate',
      'Vehicle Registration',
      'Driver License',
      'Tax Identification'
    ];
    
    const docsToRequest = prompt(
      `Enter the documents needed (comma-separated):\n\n${documentTypes.join(', ')}\n\nOr write custom requirements:`,
      'Business License, Insurance Certificate'
    );

    if (!docsToRequest) return;

    try {
      // Send email via backend
      await api.post('/notifications/send-document-request', {
        agentEmail,
        agentName: selectedAgent?.firstName + ' ' + selectedAgent?.lastName,
        requiredDocuments: docsToRequest,
        message: `Please provide the following documents to complete your agent account verification: ${docsToRequest}`
      });
      
      addToast('Document request email sent successfully!', 'success');
      setShowAgentModal(false);
    } catch (error) {
      console.error('Error sending document request:', error);
      addToast('Failed to send document request: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_verification': return 'bg-purple-100 text-purple-800 border-purple-300';
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
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={5000}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage the entire Karhubty platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-sky-500 hover:shadow-xl transition-all hover:scale-105 hover:bg-sky-50 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-sky-600 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">↑ {stats.activeUsers} active</p>
              </div>
              <div className="bg-sky-100 p-3 rounded-full group-hover:bg-sky-200 transition-colors">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('agents')}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all hover:scale-105 hover:bg-green-50 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Agents</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalAgents}</p>
                <p className="text-xs text-yellow-600 mt-1">↑ {stats.pendingRequests} pending</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('cars')}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all hover:scale-105 hover:bg-purple-50 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Cars</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalCars}</p>
                <p className="text-xs text-gray-600 mt-1">Across all agents</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all hover:scale-105 hover:bg-orange-50 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Platform Revenue</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">€{stats.totalRevenue}</p>
                <p className="text-xs text-green-600 mt-1">↑ {stats.totalRentals} rentals</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all hover:scale-105 hover:bg-blue-50 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Documents</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">Review</p>
                <p className="text-xs text-gray-600 mt-1">Verify agent documents</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {['overview', 'users', 'agents', 'agent-requests', 'cars', 'rentals', 'documents'].map((tab) => (
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
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
            {/* Pending Agents Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Pending Agent Requests ({agentRequests.filter(r => r.status === 'pending').length})
              </h2>
              {agentRequests.filter(r => r.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No pending agent requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agentRequests.filter(r => r.status === 'pending').map(request => (
                    <div 
                      key={request.requestId} 
                      className="border rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => viewAgentDetails(request)}
                    >
                      <div>
                        <h3 className="font-bold text-gray-800">{request.agencyName}</h3>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-sm text-gray-600">{request.city} • Requested: {request.requestDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            approveAgent(request.requestId);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rejectAgent(request.requestId);
                          }}
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

            {/* Divider */}
            {agentRequests.filter(r => r.status === 'pending').length > 0 && agentRequests.filter(r => r.status === 'in_verification').length > 0 && (
              <hr className="border-gray-300" />
            )}

            {/* Agents Awaiting Document Verification Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Awaiting Document Verification ({agentRequests.filter(r => r.status === 'in_verification').length})
              </h2>
              {agentRequests.filter(r => r.status === 'in_verification').length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No agents awaiting verification</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agentRequests.filter(r => r.status === 'in_verification').map(agent => (
                    <div 
                      key={agent.requestId} 
                      className="border-2 border-blue-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors bg-blue-50"
                      onClick={() => viewAgentDetails(agent)}
                    >
                      <div>
                        <h3 className="font-bold text-gray-800">{agent.agencyName}</h3>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                        <p className="text-sm text-blue-600 font-medium">Status: Awaiting Document Review</p>
                        <p className="text-sm text-gray-600">{agent.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to documents tab for this agent
                            setActiveTab('documents');
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Review Docs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

      {/* Agent Request Details Modal */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAgentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 pr-8">Agent Request Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Agency Information */}
              <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Agency Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-700">Agency Name</p>
                    <p className="font-bold text-lg text-gray-800">{selectedAgent.agencyName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">Address</p>
                    <p className="text-gray-800">{selectedAgent.agencyAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Agent Personal Details */}
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-semibold text-gray-800">{selectedAgent.firstName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="font-semibold text-gray-800">{selectedAgent.lastName || 'N/A'}</p>
              </div>

              {/* Contact Information */}
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800 break-all">{selectedAgent.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">{selectedAgent.phone || 'N/A'}</p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-semibold text-gray-800">{selectedAgent.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  {selectedAgent.accountStatus || 'pending'}
                </span>
              </div>

              {/* Dates */}
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="font-semibold text-gray-800">
                  {selectedAgent.dateRegistered ? new Date(selectedAgent.dateRegistered).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold text-gray-800 capitalize">{selectedAgent.role || 'agent'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-8 pt-6 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    approveAgent(selectedAgent.requestId || selectedAgent.agentId);
                    setShowAgentModal(false);
                  }}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Agent
                </button>
                <button
                  onClick={() => {
                    rejectAgent(selectedAgent.requestId || selectedAgent.agentId);
                    setShowAgentModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Agent
                </button>
              </div>
              <button
                onClick={() => requestAgentDocuments(selectedAgent.email)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
              >
                📄 Request Documents
              </button>
              <button
                onClick={() => setShowAgentModal(false)}
                className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Document Verification
          </h2>
          
          {selectedAgentForDocuments ? (
            <div>
              <button
                onClick={() => setSelectedAgentForDocuments(null)}
                className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Back to Agent List
              </button>
              <DocumentsReview
                agentId={selectedAgentForDocuments.agentId}
                agentName={selectedAgentForDocuments.agencyName}
                onDocumentsVerified={() => {
                  addToast('Documents verification complete', 'success');
                  setSelectedAgentForDocuments(null);
                  fetchAllData();
                }}
              />
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Select an agent to review their documents
              </h3>
              <div className="grid gap-4">
                {agentRequests.filter(a => a.status === 'in_verification').length > 0 ? (
                  agentRequests
                    .filter(a => a.status === 'in_verification')
                    .map((agent) => (
                      <button
                        key={agent.requestId}
                        onClick={() => setSelectedAgentForDocuments(agent)}
                        className="text-left p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-800">{agent.agencyName}</h4>
                            <p className="text-sm text-gray-600">{agent.email}</p>
                            <p className="text-sm text-gray-600">{agent.city}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Awaiting Review
                          </span>
                        </div>
                      </button>
                    ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No agents awaiting document verification</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;