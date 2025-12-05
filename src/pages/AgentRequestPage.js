import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const AgentRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    agencyName: '',
    agencyAddress: '',
    city: '',
    phone: '',
    approvalDocument: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      approvalDocument: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.approvalDocument) {
      setError('Please upload your agency approval document');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   formDataToSend.append(key, formData[key]);
      // });
      // const response = await axios.post('http://localhost:8080/api/agent-request', formDataToSend);
      
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || 'Request submission failed. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">Your agent account request has been submitted successfully. Our team will review it and get back to you within 2-3 business days.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Go to Login
          </button>
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
              <Building2 className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Agency Account Request</h2>
            <p className="text-gray-600 mt-2">Apply to become a car rental agent</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
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
                  placeholder="agency@email.com"
                  required
                />
              </div>
            </div>

            {/* Agency Name */}
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

            {/* Address & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="agencyAddress"
                    value={formData.agencyAddress}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="123 Business St"
                    required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Le Mans"
                  required
                />
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

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency Approval Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sky-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-block bg-sky-50 text-sky-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-sky-100"
                >
                  Choose File
                </label>
                {formData.approvalDocument && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {formData.approvalDocument.name}
                  </p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <p className="text-sm text-sky-800">
                <strong>Note:</strong> Your application will be reviewed by our admin team. You will receive an email notification once your account is approved.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Request...' : 'Submit Request'}
            </button>
          </form>

          {/* Back to Login */}
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
    </div>
  );
};

export default AgentRequestPage;