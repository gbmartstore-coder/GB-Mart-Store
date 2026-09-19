import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  AlertCircle,
  FolderTree,
  X,
  Search,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Category, Product } from '../../types';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
} from '../../services/db';
import { uploadImage } from '../../services/storage';

interface AdminCategoriesProps {
  categories: Category[];
  products: Product[];
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  products,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Delete Safety Modal state
  const [deleteModalCategory, setDeleteModalCategory] = useState<Category | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80');
    setActive(true);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setActive(cat.active);
    setError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const url = await uploadImage(file, 'categories');
      setImage(url);
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
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          slug,
          description: description.trim(),
          image: image.trim(),
          active,
        });
        setSuccessMessage(`Category "${name}" updated successfully.`);
      } else {
        await createCategory({
          name: name.trim(),
          slug,
          description: description.trim(),
          image: image.trim(),
          active,
        });
        setSuccessMessage(`Category "${name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category into Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await updateCategory(cat.id, { active: !cat.active });
      setSuccessMessage(
        `Category "${cat.name}" is now ${!cat.active ? 'active' : 'hidden'}.`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to toggle category:', err);
      setError('Could not update category status.');
    }
  };

  // Safe delete initiation
  const handleInitiateDelete = (cat: Category) => {
    const otherCategories = categories.filter((c) => c.id !== cat.id);
    setReassignTargetId(otherCategories.length > 0 ? otherCategories[0].id : '');
    setDeleteModalCategory(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalCategory) return;
    const catId = deleteModalCategory.id;
    const catName = deleteModalCategory.name;
    const associatedProducts = products.filter((p) => p.categoryId === catId);

    setDeleting(true);
    try {
      if (associatedProducts.length > 0) {
        if (!reassignTargetId) {
          setError('Please select a category to reassign the products to.');
          setDeleting(false);
          return;
        }
        await deleteCategoryAndReassignProducts(catId, reassignTargetId);
        setSuccessMessage(
          `Category "${catName}" deleted. ${associatedProducts.length} products safely reassigned.`
        );
      } else {
        await deleteCategory(catId);
        setSuccessMessage(`Category "${catName}" was deleted.`);
      }
      setDeleteModalCategory(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Delete category error:', err);
      setError('Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-gray-900">Categories Management</h2>
          <p className="text-xs text-gray-500">
            Manage product categories, update images, and organize storefront collections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow transition"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80'}
                    alt={cat.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm truncate font-sans">
                        {cat.name}
                      </h3>
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                          cat.active
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                        title="Click to toggle visibility on storefront"
                      >
                        {cat.active ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {cat.description || 'Authentic products from Gilgit-Baltistan.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FolderTree className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{productCount} {productCount === 1 ? 'product' : 'products'}</span>
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    /{cat.slug}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleInitiateDelete(cat)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition text-xs font-semibold flex items-center gap-1"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-base font-bold text-gray-900 font-sans">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh and organic high-altitude dried apricots, walnuts, almonds..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Image *
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-300 border-dashed rounded-lg text-xs font-semibold cursor-pointer transition">
                    <Upload className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      {uploadingImage
                        ? 'Uploading Category Image...'
                        : 'Choose Image from Computer (JPG, JPEG, PNG, WEBP)'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

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
                        <div className="flex items-center gap-3 mt-1">
                          <label className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer underline">
                            Replace image
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
                              onChange={handleFileUpload}
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
                      Please select an image file from your computer to represent this category.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                  />
                  <span>Active (Visible on Customer Storefront)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Delete Confirmation Dialog Modal */}
      {deleteModalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Delete Category "{deleteModalCategory.name}"?
              </h3>
            </div>

            {/* Check if category has associated products */}
            {(() => {
              const associatedProducts = products.filter(
                (p) => p.categoryId === deleteModalCategory.id
              );
              const otherCategories = categories.filter(
                (c) => c.id !== deleteModalCategory.id
              );

              if (associatedProducts.length > 0) {
                return (
                  <div className="space-y-3 mb-5">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <p className="font-semibold">
                        This category contains {associatedProducts.length} product(s).
                      </p>
                      <p className="mt-1">
                        To protect your store data, products will NOT be deleted. Please choose another category to reassign them to:
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Reassign {associatedProducts.length} Products To:
                      </label>
                      <select
                        value={reassignTargetId}
                        onChange={(e) => setReassignTargetId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:ring-2 focus:ring-emerald-600/30"
                      >
                        {otherCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              }

              return (
                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                  This category has no products. Are you sure you want to permanently remove it? This action cannot be undone.
                </p>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalCategory(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
