import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Home, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import authService from '../services/authService';
import TermsAndPrivacyModal from '../components/TermsAndPrivacyModal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('user'); // 'user' or 'agent'
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    // Agent-specific fields
    agencyName: '',
    agencyAddress: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    // Reset form when switching types
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      city: '',
      agencyName: '',
      agencyAddress: ''
    });
    setError('');
    setAcceptedTerms(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check terms acceptance
    if (!acceptedTerms) {
      setError('You must accept the Terms & Conditions and Privacy Policy to continue');
      setLoading(false);
      return;
    }

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check for password strength (optional - adjust based on backend requirements)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, and numbers');
      setLoading(false);
      return;
    }

    try {
      // Prepare data without confirmPassword - only send what API expects
      const registrationData = accountType === 'user' 
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            agencyName: formData.agencyName,
            agencyAddress: formData.agencyAddress,
            city: formData.city
          };

      const endpoint = accountType === 'user' 
        ? authService.registerUser
        : authService.registerAgent;
      
      console.log('Registering with data:', registrationData);
      await endpoint(registrationData);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-3">
            {accountType === 'agent' 
              ? 'Your agent account request has been submitted. Please wait for admin approval.'
              : 'Your account has been created successfully!'}
          </p>
          <p className="text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
            📧 <strong>Check your email:</strong> We've sent you a verification link. Please click it to confirm your email address and complete your registration.
          </p>
          <p className="text-gray-500 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us and start your journey</p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              I want to register as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleAccountTypeChange('user')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  accountType === 'user'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-300 hover:border-sky-300'
                }`}
              >
                <User className={`w-8 h-8 mx-auto mb-2 ${accountType === 'user' ? 'text-sky-600' : 'text-gray-400'}`} />
                <p className={`font-semibold ${accountType === 'user' ? 'text-sky-600' : 'text-gray-700'}`}>
                  Customer
                </p>
                <p className="text-xs text-gray-500 mt-1">Rent cars for personal use</p>
              </button>
              
              <button
                type="button"
                onClick={() => handleAccountTypeChange('agent')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  accountType === 'agent'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-300 hover:border-sky-300'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-2 ${accountType === 'agent' ? 'text-sky-600' : 'text-gray-400'}`} />
                <p className={`font-semibold ${accountType === 'agent' ? 'text-sky-600' : 'text-gray-700'}`}>
                  Agency
                </p>
                <p className="text-xs text-gray-500 mt-1">List and rent out cars</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="John"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Agent-Specific: Agency Name */}
            {accountType === 'agent' && (
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Premium Car Rentals"
                    required
                  />
                </div>
              </div>
            )}

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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 6 characters, must include uppercase, lowercase, and numbers
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>
            </div>

            {/* Address & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {accountType === 'agent' ? 'Agency Address' : 'Address'}
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name={accountType === 'agent' ? 'agencyAddress' : 'address'}
                    value={accountType === 'agent' ? formData.agencyAddress : formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="123 Main St"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Le Mans"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Agent Info Notice */}
            {accountType === 'agent' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Agent accounts require admin approval. You will be notified via email once your account is approved.
                </p>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 mt-1 flex-shrink-0"
              />
              <label className="text-sm text-gray-700 cursor-pointer flex-1">
                <span>I have read and agree to the <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-sky-600 hover:underline font-semibold"
                >
                  Terms & Conditions and Privacy Policy
                </button></span>
              </label>
            </div>

            {!acceptedTerms && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">
                  You must accept the Terms & Conditions and Privacy Policy to create an account
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : `Create ${accountType === 'user' ? 'Customer' : 'Agency'} Account`}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setAcceptedTerms(true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
};

export default RegisterPage;