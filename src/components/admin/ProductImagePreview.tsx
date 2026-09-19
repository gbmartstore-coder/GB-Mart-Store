import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  Star,
  Eye,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface ProductImagePreviewProps {
  images: string[];
  uploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetCover: (index: number) => void;
  onRemoveImage: (index: number) => void;
  onAddImageUrl?: (url: string) => void;
}

export const ProductImagePreview: React.FC<ProductImagePreviewProps> = ({
  images,
  uploading,
  onFileUpload,
  onSetCover,
  onRemoveImage,
  onAddImageUrl,
}) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (!urlInput.trim() || !onAddImageUrl) return;
    onAddImageUrl(urlInput.trim());
    setUrlInput('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        // Synthesize an input change event
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          dataTransfer.items.add(e.dataTransfer.files[i]);
        }
        fileInputRef.current.files = dataTransfer.files;
        const syntheticEvent = {
          target: fileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onFileUpload(syntheticEvent);
      }
    }
  };

  return (
    <div className="space-y-3" id="product-images-manager">
      {/* File Input & Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
            : 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
        }`}
      >
        <input
          ref={fileInputRef}
          id="product-image-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={onFileUpload}
          disabled={uploading}
          className="sr-only"
        />

        <label
          htmlFor="product-image-file-input"
          className="flex flex-col items-center justify-center cursor-pointer space-y-2 py-1"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center transition group-hover:scale-105">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-900 block">
              {uploading
                ? 'Uploading to Firebase Storage (products)...'
                : 'Click to upload or drag and drop product images'}
            </span>
            <span className="text-[11px] text-gray-500 block mt-0.5">
              Supports JPG, JPEG, PNG, WEBP (Single or Multiple)
            </span>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs">
            Browse Files
          </span>
        </label>
      </div>

      {/* Optional URL input */}
      {onAddImageUrl && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an external image URL (optional)"
            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold disabled:opacity-50 transition"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Verification Preview Component */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-800">
              Selected Images Preview & Verification
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-500">
            {images.length === 0
              ? 'No images selected'
              : `${images.length} image${images.length > 1 ? 's' : ''} ready`}
          </span>
        </div>

        {images.length > 0 ? (
          <div className="space-y-3">
            {/* Primary Cover Image Highlight */}
            <div className="relative bg-white border border-emerald-200 rounded-lg p-2.5 flex items-center gap-3 shadow-xs">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                <img
                  src={images[0]}
                  alt="Primary Cover"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                  Cover
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    Primary Storefront Cover Photo
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                  This image will be displayed on product cards in the store catalogue.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActivePreviewIndex(0)}
                  className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-md transition"
                  title="Verify full image"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveImage(0)}
                  className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid of All Images */}
            {images.length > 1 && (
              <div>
                <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                  Additional Gallery Images:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-lg overflow-hidden border group bg-white ${
                        idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-emerald-600 text-white text-[8px] font-bold rounded shadow-xs">
                          Cover
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActivePreviewIndex(idx)}
                          className="p-1 rounded bg-white text-gray-900 hover:bg-gray-100 transition"
                          title="Inspect image"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => onSetCover(idx)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            title="Set as Cover Photo"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveImage(idx)}
                          className="p-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-gray-500">
              No images selected yet. Choose a file above to verify before submitting.
            </p>
          </div>
        )}
      </div>

      {/* Full-size Image Inspection Modal */}
      {activePreviewIndex !== null && images[activePreviewIndex] && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 text-white">
              <span className="text-xs font-semibold">
                Image Verification ({activePreviewIndex + 1} of {images.length})
                {activePreviewIndex === 0 && ' - Cover Photo'}
              </span>
              <button
                type="button"
                onClick={() => setActivePreviewIndex(null)}
                className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-gray-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={images[activePreviewIndex]}
                alt="Enlarged verification"
                className="max-w-full max-h-[58vh] object-contain rounded"
              />
            </div>
            <div className="p-3 bg-white flex items-center justify-between border-t border-gray-200">
              {activePreviewIndex !== 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    onSetCover(activePreviewIndex);
                    setActivePreviewIndex(0);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  Set as Cover Photo
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Active Cover Photo
                </span>
              )}
              <button
                type="button"
                onClick={() => setActivePreviewIndex(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
