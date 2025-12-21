import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import imageService from '../services/imageService';

/**
 * CarImageGallery Component
 * Displays car images with lightbox capability and best practices
 *
 * Features:
 * - Lazy loading of images
 * - Responsive image display
 * - Image navigation (next/previous)
 * - Fullscreen lightbox view
 * - Fallback image support
 * - Loading states
 */
const CarImageGallery = ({
  carId,
  images = [],
  canEdit = false,
  onImageDelete,
  onImageReorder,
  className = '',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageErrors, setImageErrors] = useState({});

  // Get primary image first, then other images
  const sortedImages =
    images.length > 0
      ? [...images].sort((a, b) => {
          if (a.isPrimary) return -1;
          if (b.isPrimary) return 1;
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        })
      : [];

  const currentImage = sortedImages[currentImageIndex];
  const imageUrl = currentImage
    ? imageService.getImageUrl(currentImage.imagePath)
    : null;

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
  };

  const handleImageError = (imageId) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageId]: true,
    }));
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setShowLightbox(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sortedImages.length]);

  const handleDelete = async (imageId) => {
    if (window.confirm('Delete this image?')) {
      try {
        await imageService.deleteImage(carId, imageId);
        if (onImageDelete) {
          onImageDelete(imageId);
        }
      } catch (error) {
        alert('Failed to delete image: ' + error);
      }
    }
  };

  if (!currentImage) {
    return (
      <div
        className={`w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-2">No images available</p>
          <p className="text-sm text-gray-500">
            {canEdit && 'Upload images to get started'}
          </p>
        </div>
      </div>
    );
  }

  const isImageError = imageErrors[currentImage.imageId];
  const isImageLoaded = loadedImages.has(currentImage.imageId);

  return (
    <div className={`relative w-full bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-video bg-gray-200 flex items-center justify-center group">
        {/* Loading State */}
        {!isImageLoaded && !isImageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {isImageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Image failed to load</p>
              <button
                onClick={() => setImageErrors((prev) => ({
                  ...prev,
                  [currentImage.imageId]: false,
                }))}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Image */}
        {imageUrl && !isImageError && (
          <img
            src={imageUrl}
            alt={`Car ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowLightbox(true)}
            onLoad={() => handleImageLoad(currentImage.imageId)}
            onError={() => handleImageError(currentImage.imageId)}
            loading="lazy"
          />
        )}

        {/* Navigation Buttons - Visible on Hover */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {sortedImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {sortedImages.length}
          </div>
        )}

        {/* Edit Controls - Visible if can edit */}
        {canEdit && (
          <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!currentImage.isPrimary && (
              <button
                onClick={async () => {
                  try {
                    await imageService.setPrimaryImage(
                      carId,
                      currentImage.imageId,
                    );
                    if (onImageReorder) onImageReorder();
                  } catch (error) {
                    alert('Failed to set primary image');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Set Primary
              </button>
            )}
            {sortedImages.length > 1 && (
              <button
                onClick={() => handleDelete(currentImage.imageId)}
                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
          {sortedImages.map((img, index) => (
            <button
              key={img.imageId}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-blue-500 ring-2 ring-blue-300'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={imageService.getImageUrl(img.imagePath)}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(img.imageId)}
              />
              {img.isPrimary && (
                <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  Primary
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
            >
              <X size={24} />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center justify-center">
              <img
                src={imageUrl}
                alt={`Car ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Navigation */}
              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {sortedImages.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarImageGallery;
