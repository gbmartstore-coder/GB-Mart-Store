import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import { uploadImage } from '../../services/storage';

export interface CategoryFormProps {
  editingCategory?: Category | null;
  onSave: (categoryData: Partial<Category>) => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  onSave,
  onCancel,
  saving = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setDescription(editingCategory.description || '');
      setImage(editingCategory.image || '');
      setActive(editingCategory.active !== false);
    } else {
      setName('');
      setDescription('');
      setImage('');
      setActive(true);
    }
  }, [editingCategory]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      // Upload to Firebase Storage under 'categories/' folder
      const downloadUrl = await uploadImage(file, 'categories');
      // Update state to store resulting Firebase download URL
      setImage(downloadUrl);
    } catch (err: unknown) {
      console.error('Category image upload failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to upload category image.';
      setError(errMsg);
    } finally {
      setUploadingImage(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload: Partial<Category> = {
      name: name.trim(),
      slug: slug || `cat-${Date.now()}`,
      description: description.trim(),
      image: image.trim(),
      active,
    };

    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4" id="category-management-form">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dry Fruits & Nuts"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Fresh and organic produce from Gilgit-Baltistan valleys..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        />
      </div>

      {/* HTML File Input Field & Image Preview */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Category Image *
        </label>

        <div className="space-y-2">
          {/* HTML File Input Field */}
          <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-4 text-center hover:bg-emerald-50 transition">
            <label
              htmlFor="category-html-file-input"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                {uploadingImage ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  {uploadingImage
                    ? 'Uploading Category Image to Firebase Storage...'
                    : 'Choose Category Image from Computer'}
                </span>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  JPG, JPEG, PNG, WEBP
                </span>
              </div>
              <input
                id="category-html-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                disabled={uploadingImage}
                className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer border border-emerald-200 rounded-lg p-1 bg-white"
              />
            </label>
          </div>

          {/* Image Preview for UI */}
          {image ? (
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={image}
                alt="Category Preview"
                className="w-14 h-14 rounded-md object-cover border border-gray-200 bg-white"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold text-gray-800 block truncate">
                  Category Image Preview
                </span>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  Firebase URL stored in state: {image.substring(0, 40)}...
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <label className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer underline">
                    Replace image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-[11px] text-red-600 hover:text-red-800 font-medium underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-gray-400">
              Please select an image file to represent this category.
            </p>
          )}
        </div>
      </div>

      {/* Active Toggle */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
          />
          <span>Active (Visible on Storefront)</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition disabled:opacity-50 flex items-center gap-2 shadow-xs"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
        </button>
      </div>
    </form>
  );
};
export default CategoryForm;
