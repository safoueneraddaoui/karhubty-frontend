import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import api from '../services/api';

const DocumentsUpload = ({ user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('License');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const documentTypes = ['License', 'Insurance', 'Registration', 'Inspection', 'Other'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents/my-documents');
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load documents',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    if (!documentType) {
      setMessage({ type: 'error', text: 'Please select a document type' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', documentType);

      const response = await api.post('/documents/upload', formData);

      setMessage({
        type: 'success',
        text: response.data.message || 'Document uploaded successfully',
      });
      setSelectedFile(null);
      setDocumentType('License');
      
      // Refetch documents
      await fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload document',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${documentId}`);
      setMessage({
        type: 'success',
        text: 'Document deleted successfully',
      });
      await fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete document',
      });
    }
  };

  const handleSubmitDocuments = async () => {
    if (documents.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please upload at least one document before submitting',
      });
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/documents/submit-for-review');
      
      setMessage({
        type: 'success',
        text: '✅ Documents submitted successfully! SuperAdmin will review them shortly.',
      });
      setIsSubmitted(true);
      
      // Refetch documents to update status
      await fetchDocuments();
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit documents',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Pending Review
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Verified
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {message.text && (
        <div
          className={`px-4 py-3 rounded-lg flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ type: '', text: '' })}
            className="hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Section */}
      {(user?.accountStatus === 'in_verification' || user?.accountStatus === 'pending') && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-sky-600" />
            Upload Documents
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* File Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-300 hover:border-sky-400'
              }`}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-2">
                {selectedFile ? selectedFile.name : 'Drag and drop your document here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse (PDF, JPG, PNG max 5MB)
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
              >
                Select File
              </label>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                !selectedFile || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-600" />
          Your Documents
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
            </div>
            <p className="text-gray-600 mt-2">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No documents uploaded yet. Please upload your documents above.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.documentId}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-sky-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{doc.documentType}</p>
                    <p className="text-sm text-gray-600">{doc.fileName}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    {doc.rejectionReason && (
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Rejection Reason:</strong> {doc.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  {doc.status === 'pending' || doc.status === 'rejected' ? (
                    <button
                      onClick={() => handleDelete(doc.documentId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        {documents.length > 0 && !isSubmitted && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmitDocuments}
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Documents for Review
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Submit your documents for SuperAdmin verification. They will review and approve your account.
            </p>
          </div>
        )}

        {isSubmitted && (
          <div className="mt-6 pt-6 border-t border-gray-200 bg-green-50 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-semibold">Documents Submitted Successfully!</p>
            <p className="text-green-700 text-sm mt-1">
              Your documents are now under review. You'll be notified once they're verified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsUpload;
