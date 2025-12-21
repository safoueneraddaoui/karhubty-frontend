import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

const CarImageUpload = ({
  images = [],
  onImagesChange,
  maxImages = 5,
  disabled = false,
}) => {
  const [preview, setPreview] = useState(images);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const validateFiles = (files) => {
    const fileArray = Array.from(files);
    let totalFiles = preview.length;

    for (let file of fileArray) {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are allowed');
        return [];
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size must be less than 5MB. ${file.name} is too large`);
        return [];
      }

      totalFiles++;
    }

    // Check max files limit
    if (totalFiles > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return [];
    }

    setError('');
    return fileArray;
  };

  const handleFileChange = (e) => {
    const files = validateFiles(e.target.files);
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const addFiles = (files) => {
    const newPreviews = [];
    const newFiles = [];

    files.forEach((file) => {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          const updated = [...preview, ...newPreviews];
          setPreview(updated);
          onImagesChange([...images, ...files]);
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });
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

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const removeImage = (index) => {
    const updatedPreview = preview.filter((_, i) => i !== index);
    const updatedImages = images.filter((_, i) => i !== index);
    setPreview(updatedPreview);
    onImagesChange(updatedImages);
    setError('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Car Images ({preview.length}/{maxImages})
        </label>

        {/* Drag and Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            type="file"
            id="car-images"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled || preview.length >= maxImages}
            className="hidden"
          />

          <label htmlFor="car-images" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Drag images here or click to upload
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or WebP • Max 5MB each
            </p>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {preview.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {preview.map((src, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                {typeof src === 'string' && src.startsWith('data:') ? (
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : typeof src === 'string' && src.startsWith('http') ? (
                  <img
                    src={src}
                    alt={`Car ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : typeof src === 'string' && (src.startsWith('cars/') || src.includes('.')) ? (
                  <img
                    src={`http://localhost:8080/uploads/${src}`}
                    alt={`Car ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Car ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* First image badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarImageUpload;
