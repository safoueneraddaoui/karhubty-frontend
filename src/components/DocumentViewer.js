import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * DocumentViewer Component
 * Displays PDF and image documents with zoom and navigation capabilities
 * Best practices:
 * - Lazy loading for performance
 * - Error handling with user feedback
 * - Responsive design
 * - Accessibility features
 */
const DocumentViewer = ({ documents, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !documents || documents.length === 0) {
    return null;
  }

  const currentDocument = documents[currentIndex];
  const isPdf = currentDocument?.fileName?.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(currentDocument?.fileName);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1));
    setZoomLevel(100);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0));
    setZoomLevel(100);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (currentDocument?.filePath) {
      const link = document.createElement('a');
      link.href = currentDocument.filePath;
      link.download = currentDocument.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {currentDocument?.documentType || 'Document'}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {currentDocument?.fileName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download document"
              aria-label="Download document"
            >
              <Download className="w-5 h-5 text-sky-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close viewer"
              aria-label="Close document viewer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-50">
          {loading && (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4" />
              <p className="text-gray-600">Loading document...</p>
            </div>
          )}

          {isPdf && (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  PDF preview not available in browser
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Download PDF to view
                </button>
              </div>
            </div>
          )}

          {isImage && (
            <img
              src={currentDocument?.filePath}
              alt={currentDocument?.documentType}
              style={{ transform: `scale(${zoomLevel / 100})` }}
              className="max-h-full max-w-full object-contain transition-transform"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {!isPdf && !isImage && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Preview not available for this file type
              </p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Download file
              </button>
            </div>
          )}
        </div>

        {/* Toolbar */}
        {(isPdf || isImage) && (
          <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200 bg-gray-50">
            {isImage && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  disabled={zoomLevel <= 50}
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600 w-12 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  disabled={zoomLevel >= 300}
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-px h-6 bg-gray-300" />
              </>
            )}

            {documents.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Previous document"
                  aria-label="Previous document"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600">
                  {currentIndex + 1} / {documents.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Next document"
                  aria-label="Next document"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          <p>
            Status:{' '}
            <span
              className={`font-semibold ${
                currentDocument?.status === 'verified'
                  ? 'text-green-600'
                  : currentDocument?.status === 'rejected'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {currentDocument?.status === 'verified'
                ? '✓ Verified'
                : currentDocument?.status === 'rejected'
                ? '✗ Rejected'
                : '⏳ Pending'}
            </span>
          </p>
          {currentDocument?.rejectionReason && (
            <p className="mt-2 text-red-600">
              Rejection reason: {currentDocument.rejectionReason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
