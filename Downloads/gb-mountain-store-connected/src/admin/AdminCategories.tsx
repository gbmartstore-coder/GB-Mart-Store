import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../admin-system/firebase';
import { useStore } from '../admin-system/StoreContext';
import { Category } from '../admin-system/AdminTypes';

export const AdminCategories: React.FC = () => {
  const { categories, products } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    active: true,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image:
        'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
      active: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      description: c.description,
      image: c.image,
      active: c.active,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (c: Category) => {
    try {
      await updateDoc(doc(db, 'categories', c.id), {
        active: !c.active,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error toggling category status:', err);
    }
  };

  const handleDeleteCategory = async (c: Category) => {
    // Check if category has any products
    const linkedProducts = products.filter(
      (p) => p.categoryId === c.id || p.categoryId === c.slug
    );

    if (linkedProducts.length > 0) {
      alert(
        `Cannot delete category "${c.name}" because it still has ${linkedProducts.length} product(s) assigned to it. Please reassign or delete the products first.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to delete category "${c.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'categories', c.id));
        setSuccessMsg(`Category "${c.name}" deleted successfully.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Error deleting category:', err);
        setErrorMsg('Failed to delete category.');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (storage) {
        const fileRef = ref(storage, `categories/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setFormData((prev) => ({ ...prev, image: url }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setFormData((prev) => ({ ...prev, image: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Storage upload error, using fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload: Omit<Category, 'id'> = {
        name: formData.name.trim(),
        slug: editingCategory?.slug || slug,
        description: formData.description.trim(),
        image:
          formData.image.trim() ||
          'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
        active: formData.active,
        createdAt: editingCategory ? editingCategory.createdAt : now,
        updatedAt: now,
      };

      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), payload);
        setSuccessMsg(`Category "${payload.name}" updated successfully.`);
      } else {
        await addDoc(collection(db, 'categories'), payload);
        setSuccessMsg(`Category "${payload.name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Save category error:', err);
      setErrorMsg('Failed to save category.');
      try {
        handleFirestoreError(
          err,
          editingCategory ? OperationType.UPDATE : OperationType.CREATE,
          'categories'
        );
      } catch {
        // Handled
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Categories Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize mountain produce into high-level collections
          </p>
        </div>
        <button
          id="admin-add-category-btn"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const catProducts = products.filter(
            (p) => p.categoryId === c.id || p.categoryId === c.slug
          );

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-xs transition-colors ${
                        c.active
                          ? 'bg-emerald-800/90 text-emerald-100'
                          : 'bg-stone-900/80 text-stone-300'
                      }`}
                    >
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{catProducts.length} Products</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-stone-900">{c.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{c.description}</p>
                  <p className="text-[11px] text-stone-400 font-mono mt-2">Slug: {c.slug}</p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                <span className="text-[11px] text-stone-500">
                  {catProducts.length > 0
                    ? `${catProducts.length} items linked`
                    : 'No products assigned'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id={`admin-edit-category-${c.slug}`}
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    id={`admin-delete-category-${c.slug}`}
                    onClick={() => handleDeleteCategory(c)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                    title={
                      catProducts.length > 0
                        ? 'Cannot delete category with products'
                        : 'Delete category'
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
            <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingCategory ? 'Edit Category' : 'Create Mountain Category'}
                </h3>
                <p className="text-xs text-stone-300">
                  Syncs immediately with customer store homepage and filter tabs
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 sm:p-8 space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Name *
                </label>
                <input
                  id="admin-form-category-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pure Himalayan Shilajit"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  id="admin-form-category-desc"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of this collection..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Banner Image
                </label>
                {formData.image && (
                  <div className="h-28 rounded-xl overflow-hidden border border-stone-200 mb-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL (https://...)"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <label className="px-3 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Active & Visible in Customer Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  id="admin-form-category-save-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
