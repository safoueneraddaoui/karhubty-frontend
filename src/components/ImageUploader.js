import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import imageService from '../services/imageService';

/**
 * ImageUploader Component
 * Handles image upload with validation, preview, and best practices
 *
 * Features:
 * - Drag & drop support
 * - File validation (size, type)
 * - Image preview
 * - Multiple file selection
 * - Progress indication
 * - Error handling
 */
const ImageUploader = ({
  carId,
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = [...e.target.files];
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newErrors = [];
    const validFiles = [];

    // Check total files
    if (selectedFiles.length + files.length > maxFiles) {
      newErrors.push(
        `Maximum ${maxFiles} files allowed. ${selectedFiles.length} already selected.`,
      );
    }

    files.forEach((file) => {
      const validation = imageService.validateImage(file);
      if (!validation.valid) {
        newErrors.push(`${file.name}: ${validation.error}`);
      } else if (selectedFiles.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await imageService.uploadImages(carId, formData);

      setSelectedFiles([]);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setErrors([error]);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center pointer-events-none">
          <Upload
            className={`w-10 h-10 mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`}
          />
          <p className="text-lg font-medium text-gray-700 mb-1">
            Drop images here or click to select
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG, or WebP • Max 5MB each • Up to {maxFiles} images
          </p>
          {selectedFiles.length > 0 && (
            <p className="text-sm text-blue-600 mt-2">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-2">
            Upload Errors:
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Selected Images ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <X size={16} />
                </button>
                <p className="mt-1 text-xs text-gray-600 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* Upload Progress */}
                {uploading && uploadProgress[index] !== undefined && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <div className="text-sm font-medium">
                        {uploadProgress[index]}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Check size={18} />
                Upload {selectedFiles.length} Image(s)
              </>
            )}
          </button>
          <button
            onClick={() => setSelectedFiles([])}
            disabled={uploading}
            className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
