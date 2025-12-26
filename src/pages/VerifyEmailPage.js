import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, Mail } from 'lucide-react';
import Toast from '../components/Toast';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          const errorMsg = 'No verification token provided. Please check the link.';
          setError(errorMsg);
          addToast(errorMsg, 'error');
          setLoading(false);
          return;
        }

        addToast('Verifying your email...', 'info');

        const response = await fetch(`http://localhost:8080/api/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerified(true);
          setLoading(false);
          addToast('✅ Email verified successfully!', 'success');
          
          // Redirect to login after 5 seconds
          setTimeout(() => {
            navigate('/login');
          }, 5000);
        } else {
          const errorMsg = data.message || 'Failed to verify email. Please try again.';
          setError(errorMsg);
          setLoading(false);
          addToast(errorMsg, 'error');
        }
      } catch (err) {
        const errorMsg = 'An error occurred while verifying your email. Please check your connection.';
        setError(errorMsg);
        setLoading(false);
        addToast(errorMsg, 'error');
        console.error('Verification error:', err);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 pt-16">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={7000}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {loading ? (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email...</p>
            <div className="mt-6 flex justify-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        ) : verified ? (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
              <CheckCircle className="w-16 h-16 text-green-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h2>
            <p className="text-gray-600 mb-4">
              Your email has been verified successfully. Your account is now fully activated.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                ✅ You can now login with your email and password
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login page in few seconds...
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Go to Login Now
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-red-100 rounded-full"></div>
              <AlertCircle className="w-16 h-16 text-red-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            
            <div className="space-y-3">
              <div className="text-left text-sm text-gray-600">
                <p className="font-semibold text-gray-900 mb-2">What you can do:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Check the email link for typos</li>
                  <li>The link may have expired (24 hour limit)</li>
                  <li>Try registering again with the same email</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate('/register')}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Register Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
