import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Lock, Building2, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import userService from '../services/userService';
import tokenService from '../services/tokenService';

const ProfilePage = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    agencyName: '',
    agencyAddress: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Fetch user profile on mount only (not on user changes to prevent loops)
  useEffect(() => {
    fetchUserProfile();
  }, []); // Empty dependency array - only run once on mount

  const fetchUserProfile = async () => {
    try {
      // Verify user is authenticated before fetching
      if (!tokenService.isAuthenticated()) {
        console.warn('⚠️ [ProfilePage] User not authenticated, redirecting to login');
        setMessage({ type: 'error', text: 'Please login to view your profile.' });
        tokenService.clearAuth();
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        setInitialLoading(false);
        return;
      }

      // Get user from tokenService if not passed as prop
      const currentUser = user || tokenService.getUser();
      
      if (!currentUser) {
        console.warn('⚠️ [ProfilePage] No user data available');
        setMessage({ type: 'error', text: 'Please login to view your profile.' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        setInitialLoading(false);
        return;
      }

      // First, show cached user data immediately
      const cachedFormData = {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        agencyName: currentUser.agencyName || '',
        agencyAddress: currentUser.agencyAddress || ''
      };
      setFormData(cachedFormData);
      setInitialLoading(false);

      // Then fetch fresh data from API in the background
      console.log('=== ProfilePage: Fetching profile from /api/users/profile ===');
      console.log('User object:', currentUser);
      console.log('Auth token exists:', !!tokenService.getToken());
      console.log('Token expires in:', tokenService.getTimeUntilExpiry(), 'minutes');
      
      try {
        const profileData = await userService.getProfileData();
        console.log('✅ Profile data received from API:', profileData);
        
        // Update form data with fresh data from API
        const freshFormData = {
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          city: profileData.city || '',
          agencyName: profileData.agencyName || '',
          agencyAddress: profileData.agencyAddress || ''
        };
        console.log('Updating formData with fresh data:', freshFormData);
        
        setFormData(freshFormData);
        
        // Update user state with fresh data from API
        const updatedUser = { ...currentUser, ...profileData };
        setUser(updatedUser);
        tokenService.setUser(updatedUser);
        setMessage({ type: 'success', text: 'Profile loaded successfully!' });
      } catch (apiError) {
        // API fetch failed, but we already have cached data showing
        console.warn('⚠️ [ProfilePage] API fetch failed, using cached data:', apiError);
        
        // Handle 401 specifically - session expired
        if (apiError.response?.status === 401) {
          console.error('❌ [ProfilePage] 401 Unauthorized - Session expired');
          setMessage({ type: 'error', text: 'Session expired. Redirecting to login...' });
          tokenService.clearAuth();
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          return;
        }
        
        setMessage({ type: 'warning', text: 'Showing cached profile data. Some information may be outdated.' });
      }
    } catch (error) {
      console.error('❌ [ProfilePage] Critical error:', error);
      setMessage({ type: 'error', text: 'Unable to load profile. Please try again.' });
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Verify authentication before updating
      if (!tokenService.isAuthenticated()) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
        setTimeout(() => {
          tokenService.clearAuth();
          window.location.href = '/login';
        }, 1500);
        setLoading(false);
        return;
      }

      // Update via API
      console.log('Updating profile via API...', formData);
      const response = await userService.updateProfile(user.id, formData);
      console.log('Profile update response:', response);
      
      // Update local user state with response data
      const updatedUser = { ...user, ...response };
      setUser(updatedUser);
      tokenService.setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditMode(false);
      setLoading(false);

    } catch (error) {
      console.error('API update error:', error);
      
      // Handle 401 errors
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
        setTimeout(() => {
          tokenService.clearAuth();
          window.location.href = '/login';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: error || 'Failed to update profile. Please try again.' });
      }
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      setLoading(false);
      return;
    }

    try {
      await userService.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);

    } catch (error) {
      console.error('Password change error:', error);
      // Check if it's a 401 error
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
      } else {
        setMessage({ type: 'error', text: error || 'Failed to update password. Please try again.' });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full">
                {user.role === 'agent' ? (
                  <Building2 className="w-8 h-8 text-sky-600" />
                ) : user.role === 'superadmin' ? (
                  <User className="w-8 h-8 text-sky-600" />
                ) : (
                  <User className="w-8 h-8 text-sky-600" />
                )}
              </div>
              <div className="ml-4 text-white">
                <h1 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h1>
                <p className="text-sky-100">
                  {user.role === 'agent' ? 'Agency Admin' : user.role === 'superadmin' ? 'Super Administrator' : 'Customer'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center px-8">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-600 hover:text-sky-500'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                    activeTab === 'password'
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-600 hover:text-sky-500'
                  }`}
                >
                  Change Password
                </button>
              </div>
              {activeTab === 'profile' && (
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="py-2 px-4 text-sky-600 hover:text-sky-700 font-medium flex items-center space-x-1 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{isEditMode ? 'Cancel' : 'Edit'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Messages */}
            {message.text && (
              <div className={`mb-6 px-4 py-3 rounded-lg flex items-start ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* User Type Badge */}
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <p className="text-sm text-sky-800">
                    <strong>Account Type:</strong> {
                      user.role === 'agent' ? 'Agency Administrator' : 
                      user.role === 'superadmin' ? 'Super Administrator' : 
                      'Customer Account'
                    }
                  </p>
                </div>

                {/* Agent Specific: Agency Name */}
                {user.role === 'agent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agency Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleChange}
                        disabled={!isEditMode}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Agency Name"
                      />
                    </div>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditMode}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Address & City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {user.role === 'agent' ? 'Agency Address' : 'Address'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name={user.role === 'agent' ? 'agencyAddress' : 'address'}
                        value={user.role === 'agent' ? formData.agencyAddress : formData.address}
                        onChange={handleChange}
                        disabled={!isEditMode}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Le Mans"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                {isEditMode && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Security Notice:</strong> Make sure your password is at least 6 characters long and contains a mix of letters and numbers.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    'Updating...'
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;