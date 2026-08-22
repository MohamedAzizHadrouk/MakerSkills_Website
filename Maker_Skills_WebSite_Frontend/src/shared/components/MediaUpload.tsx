import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Video, Upload, Loader } from 'lucide-react';
import { useStore } from '../../stores/useStore';

export interface MediaUploadProps {
  images: File[];
  setImages: (images: File[]) => void;
  existingImages?: string[];
  onRemoveExistingImage?: (index: number) => void;
  showVideo?: boolean;
  video?: File | null;
  setVideo?: (video: File | null) => void;
  existingVideo?: string;
  onRemoveExistingVideo?: () => void;
  uploadingVideo?: boolean;
  videoUploadError?: string | null;
  onVideoUpload?: (file: File) => Promise<void>;
  label?: string;
  acceptImages?: string;
  acceptVideo?: string;
  showImage?: boolean; // Ajout de la prop showImage
  multiple?: boolean; // Ajout de la prop multiple
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  images,
  setImages,
  existingImages = [],
  onRemoveExistingImage,
  showVideo = false,
  video,
  setVideo,
  existingVideo,
  onRemoveExistingVideo,
  uploadingVideo = false,
  videoUploadError,
  onVideoUpload,
  label = 'Images',
  acceptImages = 'image/*',
  acceptVideo = 'video/*',
  showImage = true,
  multiple = true, // Par défaut true
}) => {
  const { theme } = useStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (multiple) {
      setImages([...images, ...imageFiles]);
    } else {
      setImages(imageFiles.length > 0 ? [imageFiles[0]] : []);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  // Vidéo
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      if (onVideoUpload) {
        await onVideoUpload(file);
      } else if (setVideo) {
        setVideo(file);
      }
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    if (setVideo) setVideo(null);
  };

  return (
    <div className="space-y-6">
      {/* Images Section (optionnelle) */}
      {showImage && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {label}
          </h3>
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={typeof image === 'string' ? image : getFilePreview(image as any)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {onRemoveExistingImage && (
                    <button
                      type="button"
                      onClick={() => onRemoveExistingImage(index)}
                      className="absolute top-2 right-2 p-1 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* New Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={getFilePreview(image)}
                    alt={`Nouvelle image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Upload Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => imageInputRef.current?.click()}
              className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                  : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600'
              }`}
            >
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Ajouter Image</span>
            </motion.button>
          </div>
          <input
            ref={imageInputRef}
            type="file"
            multiple={multiple}
            accept={acceptImages}
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className={`text-xs mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Vous pouvez sélectionner plusieurs images. Formats acceptés : JPG, PNG, GIF
          </p>
        </div>
      )}

      {/* Video Section */}
      {showVideo && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Vidéo
          </h3>
          {/* Video Upload Error */}
          {videoUploadError && (
            <div className={`p-3 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
            } border`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                {videoUploadError}
              </p>
            </div>
          )}
          {/* Existing Video */}
          {existingVideo && (
            <div className="relative group mb-4">
              <video
                src={existingVideo}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
              {onRemoveExistingVideo && (
                <button
                  type="button"
                  onClick={onRemoveExistingVideo}
                  className="absolute top-2 right-2 p-2 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {/* New Video */}
          {video && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group mb-4"
            >
              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                {uploadingVideo && (
                  <div className="p-2 bg-blue-500 text-white rounded-full">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeVideo}
                  className="p-2 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
          {/* Video Upload Button */}
          {!video && !existingVideo && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300'
                  : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600'
              } ${uploadingVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploadingVideo ? (
                <Loader className="h-8 w-8 mb-2 animate-spin" />
              ) : (
                <Video className="h-8 w-8 mb-2" />
              )}
              <span className="text-sm">
                {uploadingVideo ? 'Upload en cours...' : 'Ajouter Vidéo'}
              </span>
            </motion.button>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept={acceptVideo}
            onChange={handleVideoUpload}
            className="hidden"
            disabled={uploadingVideo}
          />
        </div>
      )}
    </div>
  );
};

export default MediaUpload; 