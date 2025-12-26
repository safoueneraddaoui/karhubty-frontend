import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import authService from '../services/authService';
import Toast from '../components/Toast';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // 'email-not-verified', 'general'
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 7000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Don't clear email verification errors immediately - let user read the message
    if (errorType !== 'email-not-verified') {
      setError('');
      setErrorType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData);
      const userData = response;
      
      console.log('🔐 Login response (full):', userData);
      console.log('🔐 Response keys:', Object.keys(userData));
      
      // Check if agent/agentadmin is approved
      if ((userData.role === 'agent' || userData.role === 'agentadmin') && userData.isActive === false) {
        setError('Your agent account is not approved yet. Please wait for admin approval.');
        setErrorType('general');
        setLoading(false);
        return;
      }
      
      // authService now handles token storage automatically
      onLogin(userData);
      
      // Set flag for dashboard to show welcome toast
      console.log('[LoginPage] Setting welcome toast flag...');
      sessionStorage.setItem('showWelcomeToast', 'true');
      console.log('[LoginPage] Flag set:', sessionStorage.getItem('showWelcomeToast'));
      
      // Redirect based on user role
      if (userData.role === 'user') {
        navigate('/user-dashboard');
      } else if (userData.role === 'agent' || userData.role === 'agentadmin') {
        navigate('/agent-dashboard');
      } else if (userData.role === 'superadmin') {
        navigate('/superadmin-dashboard');
      } else {
        navigate('/cars');
      }
      
    } catch (err) {
      console.error('🔐 [LoginPage] Login error caught:', err);
      const errorMessage = (typeof err === 'string' ? err : err?.message || err) || 'Login failed. Please try again.';
      console.log('🔐 [LoginPage] Error message to display:', errorMessage);
      setError(errorMessage);
      
      // Check if it's an email verification error
      if (errorMessage.toLowerCase().includes('verify') || errorMessage.toLowerCase().includes('email')) {
        console.log('🔐 [LoginPage] Email verification error detected');
        setErrorType('email-not-verified');
        // Show toast for email verification error (10 seconds)
        const toastId = addToast('📧 Please verify your email before logging in. Check your inbox or spam folder.', 'error', 10000);
      } else {
        console.log('🔐 [LoginPage] General error');
        setErrorType('general');
        // Show toast for general error (7 seconds)
        const toastId = addToast(errorMessage, 'error', 7000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration || 7000}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className={`border px-4 py-4 rounded-lg mb-6 flex items-start gap-3 ${
              errorType === 'email-not-verified'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                errorType === 'email-not-verified'
                  ? 'text-amber-600'
                  : 'text-red-700'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-semibold mb-2 ${
                  errorType === 'email-not-verified'
                    ? 'text-amber-800'
                    : 'text-red-700'
                }`}>
                  {errorType === 'email-not-verified' 
                    ? '📧 Email Not Verified'
                    : 'Login Error'}
                </p>
                <p className={`text-sm ${
                  errorType === 'email-not-verified'
                    ? 'text-amber-700'
                    : 'text-red-600'
                }`}>
                  {error}
                </p>
                {errorType === 'email-not-verified' && (
                  <p className={`text-sm mt-2 ${
                    errorType === 'email-not-verified'
                      ? 'text-amber-700'
                      : 'text-red-600'
                  }`}>
                    Please check your email for a verification link. If you can't find it, check your spam folder.
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setError('');
                  setErrorType('');
                }}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password */}
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-600 hover:text-sky-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;