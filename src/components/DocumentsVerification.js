import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, X, Eye } from 'lucide-react';
import api from '../services/api';

const DocumentsVerification = ({ onDocumentVerified }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents/pending');
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDocuments();
    // Poll for new documents every 10 seconds
    const interval = setInterval(fetchPendingDocuments, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyDocument = async (documentId, approved) => {
    if (!approved && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setVerifying(true);
      await api.put(`/documents/${documentId}/verify`, {
        approved,
        rejectionReason: approved ? null : rejectionReason,
      });

      setRejectionReason('');
      setShowDetailModal(false);
      setSelectedDocument(null);
      
      if (onDocumentVerified) {
        onDocumentVerified();
      }

      await fetchPendingDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      alert(error.response?.data?.message || 'Failed to verify document');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="text-gray-700 font-semibold">All documents verified!</p>
        <p className="text-gray-600 text-sm mt-1">No pending documents for review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.documentId}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {doc.agent?.agencyName || 'Unknown Agency'}
                </p>
                <p className="text-sm text-gray-600">
                  {doc.documentType} • {doc.fileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedDocument(doc);
                  setShowDetailModal(true);
                  setRejectionReason('');
                }}
                className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                title="View details"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleVerifyDocument(doc.documentId, true)}
                disabled={verifying}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                title="Approve document"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedDocument(doc);
                  setShowDetailModal(true);
                }}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                title="Reject document"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      {showDetailModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold">Document Review</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedDocument(null);
                  setRejectionReason('');
                }}
                className="p-1 hover:bg-sky-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Agency</p>
                  <p className="font-semibold text-gray-800">
                    {selectedDocument.agent?.agencyName || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent Email</p>
                  <p className="font-semibold text-gray-800">
                    {selectedDocument.agent?.email || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Document Type</p>
                  <p className="font-semibold text-gray-800">{selectedDocument.documentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Name</p>
                  <p className="font-semibold text-gray-800">{selectedDocument.fileName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="font-semibold text-gray-800">
                    {(selectedDocument.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedDocument.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleVerifyDocument(selectedDocument.documentId, true)}
                  disabled={verifying}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
                <button
                  onClick={() => handleVerifyDocument(selectedDocument.documentId, false)}
                  disabled={verifying || !rejectionReason.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsVerification;
