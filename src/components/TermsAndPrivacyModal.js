import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const TermsAndPrivacyModal = ({ isOpen, onClose, onAccept }) => {
  const [expandedSections, setExpandedSections] = useState({
    terms: false,
    privacy: false
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAccept = () => {
    if (acceptedTerms && acceptedPrivacy) {
      onAccept();
      // Reset for next time
      setAcceptedTerms(false);
      setAcceptedPrivacy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Terms & Conditions and Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Terms & Conditions Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('terms')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">Terms & Conditions</h3>
              {expandedSections.terms ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {expandedSections.terms && (
              <div className="px-4 pb-4 border-t border-gray-200 max-h-64 overflow-y-auto bg-gray-50">
                <div className="text-sm text-gray-700 space-y-3 py-4">
                  <h4 className="font-semibold text-gray-800">1. Acceptance of Terms</h4>
                  <p>By registering and using KarHubty, you agree to abide by these terms and conditions. If you do not accept these terms, please do not use the service.</p>

                  <h4 className="font-semibold text-gray-800">2. User Accounts</h4>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and password. You agree to notify us immediately of any unauthorized use of your account.</p>

                  <h4 className="font-semibold text-gray-800">3. Rental Agreements</h4>
                  <p>All car rentals are subject to the terms and conditions agreed upon at the time of booking. Customers are responsible for the condition of rented vehicles.</p>

                  <h4 className="font-semibold text-gray-800">4. Payment Terms</h4>
                  <p>Payment for rentals must be completed as specified during the booking process. KarHubty is not responsible for late fees or penalties imposed by financial institutions.</p>

                  <h4 className="font-semibold text-gray-800">5. Liability</h4>
                  <p>KarHubty acts as a platform connecting renters with car owners. We are not liable for damages, losses, or disputes arising from rental transactions.</p>

                  <h4 className="font-semibold text-gray-800">6. Termination</h4>
                  <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>

                  <h4 className="font-semibold text-gray-800">7. Modifications</h4>
                  <p>KarHubty reserves the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Policy Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('privacy')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">Privacy Policy</h3>
              {expandedSections.privacy ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {expandedSections.privacy && (
              <div className="px-4 pb-4 border-t border-gray-200 max-h-64 overflow-y-auto bg-gray-50">
                <div className="text-sm text-gray-700 space-y-3 py-4">
                  <h4 className="font-semibold text-gray-800">1. Information We Collect</h4>
                  <p>We collect personal information such as name, email, phone number, and address to provide and improve our services.</p>

                  <h4 className="font-semibold text-gray-800">2. How We Use Your Information</h4>
                  <p>Your information is used to process bookings, send confirmations, manage your account, and improve our platform. We do not sell your personal data to third parties.</p>

                  <h4 className="font-semibold text-gray-800">3. Data Security</h4>
                  <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>

                  <h4 className="font-semibold text-gray-800">4. Cookies</h4>
                  <p>Our platform uses cookies to enhance your experience. You can control cookie settings through your browser preferences.</p>

                  <h4 className="font-semibold text-gray-800">5. Third-Party Services</h4>
                  <p>We may use third-party services for payment processing and email delivery. These services have their own privacy policies.</p>

                  <h4 className="font-semibold text-gray-800">6. Your Rights</h4>
                  <p>You have the right to access, modify, or delete your personal information. Contact our support team for assistance.</p>

                  <h4 className="font-semibold text-gray-800">7. Contact Us</h4>
                  <p>If you have questions about our privacy practices, please contact us at privacy@karhubty.com</p>
                </div>
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-sky-500 rounded focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <span className="font-semibold">Terms & Conditions</span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 text-sky-500 rounded focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <span className="font-semibold">Privacy Policy</span>
              </span>
            </label>
          </div>

          {/* Error Message */}
          {(!acceptedTerms || !acceptedPrivacy) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ You must accept both Terms & Conditions and Privacy Policy to continue
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={!acceptedTerms || !acceptedPrivacy}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              acceptedTerms && acceptedPrivacy
                ? 'bg-sky-500 text-white hover:bg-sky-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyModal;
