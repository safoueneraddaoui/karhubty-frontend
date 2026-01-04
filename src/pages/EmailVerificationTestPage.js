import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail, Copy } from 'lucide-react';
import api from '../services/api';

const EmailVerificationTestPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // success, error, info

  const handleVerifyClick = async () => {
    if (!token.trim()) {
      setMessage('Please paste or enter the verification token');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      const data = response.data;

      setMessageType('success');
      setMessage('✅ Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Failed to verify email. Please check the token.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      // Extract token from URL if it's pasted as full URL
      const urlPattern = /\/verify-email\/([a-f0-9]+)$/;
      const match = clipboardText.match(urlPattern);
      
      if (match) {
        setToken(match[1]);
        setMessage('');
      } else if (/^[a-f0-9]+$/.test(clipboardText)) {
        setToken(clipboardText);
        setMessage('');
      } else {
        setMessage('Invalid token format. Please copy the verification link or token from your email.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Unable to access clipboard. Please paste manually.');
      setMessageType('error');
    }
  };

  const copyExampleLink = () => {
    const exampleLink = 'http://localhost:3000/verify-email/3545524a9b92c959ea30f0ecd0d333d01c27440e9f8ba742eb9aefa38f6ff84c';
    navigator.clipboard.writeText(exampleLink);
    setMessage('Example link copied to clipboard!');
    setMessageType('info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-12 text-center">
            <Mail className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
            <p className="text-orange-100">Test your email verification</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Token Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Verification Token or Link
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste the full verification link or just the token..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                rows="4"
              />
            </div>

            {/* Helper Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={handlePaste}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                title="Paste from clipboard"
              >
                <Copy className="w-4 h-4" />
                Paste
              </button>
              <button
                onClick={copyExampleLink}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                title="Copy example token"
              >
                📋 Example
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex gap-3 ${
                  messageType === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : messageType === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      messageType === 'error' ? 'text-red-600' : 'text-blue-600'
                    }`}
                  />
                )}
                <p
                  className={`text-sm ${
                    messageType === 'success'
                      ? 'text-green-800'
                      : messageType === 'error'
                      ? 'text-red-800'
                      : 'text-blue-800'
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyClick}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Verify Email
                </>
              )}
            </button>

            {/* Info */}
            <p className="mt-6 text-center text-sm text-gray-600">
              The verification link from your email will automatically verify your account when clicked.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-6 text-gray-600">
          Go back to{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-orange-600 font-semibold hover:text-orange-700 underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationTestPage;
