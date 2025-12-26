import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api';
import DocumentViewer from './DocumentViewer';
import Toast from './Toast';

/**
 * DocumentsReview Component
 * SuperAdmin interface for reviewing and approving/rejecting agent documents
 * Best practices:
 * - Confirmation dialogs before approval/rejection
 * - Error handling with user feedback
 * - Real-time updates
 * - Accessible form inputs
 */
const DocumentsReview = ({ agentId, agentName, onDocumentsVerified }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    fetchDocuments();
  }, [agentId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/documents/agent/${agentId}`);
      setDocuments(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      addToast('Failed to load documents', 'error');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDocument = async (documentId) => {
    if (!window.confirm('Approve this document?')) {
      return;
    }

    try {
      setVerifying(true);
      await api.put(`/documents/${documentId}/verify`, { approved: true });
      addToast('✓ Document approved successfully', 'success');
      await fetchDocuments();
    } catch (error) {
      console.error('Error approving document:', error);
      addToast(error.response?.data?.message || 'Failed to approve document', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleRejectDocument = async (documentId) => {
    if (!rejectionReason.trim()) {
      addToast('Please provide a rejection reason', 'error');
      return;
    }

    if (!window.confirm('Reject this document? The agent will need to resubmit.')) {
      return;
    }

    try {
      setVerifying(true);
      await api.put(`/documents/${documentId}/verify`, {
        approved: false,
        rejectionReason: rejectionReason.trim(),
      });
      addToast('Document rejected. Agent will be notified.', 'info');
      setRejectionReason('');
      await fetchDocuments();
    } catch (error) {
      console.error('Error rejecting document:', error);
      addToast(error.response?.data?.message || 'Failed to reject document', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleViewDocument = (index) => {
    setSelectedDocumentIndex(index);
    setViewerOpen(true);
  };

  const pendingDocuments = documents.filter((doc) => doc.status === 'pending');
  const verifiedDocuments = documents.filter((doc) => doc.status === 'verified');
  const rejectedDocuments = documents.filter((doc) => doc.status === 'rejected');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Pending Documents */}
      {pendingDocuments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Pending Review ({pendingDocuments.length})
          </h3>

          <div className="space-y-4">
            {pendingDocuments.map((doc, idx) => (
              <div
                key={doc.documentId}
                className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{doc.documentType}</h4>
                    <p className="text-sm text-gray-600">{doc.fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDocument(idx)}
                    className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View
                  </button>
                </div>

                {/* Rejection Reason Input */}
                {selectedDocumentIndex === idx && (
                  <div className="mb-4 p-4 bg-white rounded-lg border border-red-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why the document is being rejected..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveDocument(doc.documentId)}
                    disabled={verifying}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectDocument(doc.documentId)}
                    disabled={verifying || !rejectionReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Documents */}
      {verifiedDocuments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Verified ({verifiedDocuments.length})
          </h3>

          <div className="space-y-2">
            {verifiedDocuments.map((doc, idx) => (
              <div key={doc.documentId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{doc.documentType}</p>
                  <p className="text-sm text-gray-600">{doc.fileName}</p>
                </div>
                <button
                  onClick={() => handleViewDocument(idx)}
                  className="px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-700 transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Documents */}
      {rejectedDocuments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Rejected ({rejectedDocuments.length})
          </h3>

          <div className="space-y-3">
            {rejectedDocuments.map((doc, idx) => (
              <div key={doc.documentId} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{doc.documentType}</p>
                    <p className="text-sm text-gray-600">{doc.fileName}</p>
                  </div>
                  <button
                    onClick={() => handleViewDocument(idx)}
                    className="px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-700 transition-colors"
                  >
                    View
                  </button>
                </div>
                {doc.rejectionReason && (
                  <p className="text-sm text-red-700">
                    <strong>Reason:</strong> {doc.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Documents */}
      {documents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No documents submitted yet</p>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewerOpen && selectedDocumentIndex !== null && (
        <DocumentViewer
          documents={documents}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          initialIndex={selectedDocumentIndex}
        />
      )}
    </div>
  );
};

export default DocumentsReview;
