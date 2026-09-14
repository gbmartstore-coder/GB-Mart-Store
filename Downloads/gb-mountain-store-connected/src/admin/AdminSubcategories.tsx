import React, { useState } from 'react';
import {
  ListTree,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  FolderTree,
} from 'lucide-react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../admin-system/firebase';
import { useStore } from '../admin-system/StoreContext';
import { Subcategory } from '../admin-system/AdminTypes';

export const AdminSubcategories: React.FC = () => {
  const { subcategories, categories, products, getCategoryName } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredSubs = subcategories.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.categoryId === filterCategory;
  });

  const handleOpenCreate = () => {
    setEditingSub(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      active: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Subcategory) => {
    setEditingSub(s);
    setFormData({
      name: s.name,
      categoryId: s.categoryId,
      active: s.active,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (s: Subcategory) => {
    try {
      await updateDoc(doc(db, 'subcategories', s.id), {
        active: !s.active,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating subcategory status:', err);
    }
  };

  const handleDelete = async (s: Subcategory) => {
    if (window.confirm(`Delete subcategory "${s.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'subcategories', s.id));
        setSuccessMsg(`Subcategory "${s.name}" deleted.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Error deleting subcategory:', err);
        setErrorMsg('Failed to delete subcategory.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.categoryId) {
      setErrorMsg('Name and parent category are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload: Omit<Subcategory, 'id'> = {
        name: formData.name.trim(),
        slug: editingSub?.slug || slug,
        categoryId: formData.categoryId,
        active: formData.active,
        createdAt: editingSub ? editingSub.createdAt : now,
        updatedAt: now,
      };

      if (editingSub) {
        await updateDoc(doc(db, 'subcategories', editingSub.id), payload);
        setSuccessMsg(`Subcategory "${payload.name}" updated successfully.`);
      } else {
        await addDoc(collection(db, 'subcategories'), payload);
        setSuccessMsg(`Subcategory "${payload.name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Save subcategory error:', err);
      setErrorMsg('Failed to save subcategory in Firestore.');
      try {
        handleFirestoreError(
          err,
          editingSub ? OperationType.UPDATE : OperationType.CREATE,
          'subcategories'
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
          <h2 className="text-xl font-bold text-stone-900">Subcategories Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Secondary categorization filtered by parent collections
          </p>
        </div>
        <button
          id="admin-add-subcategory-btn"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subcategory</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter by parent category */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200">
        <FolderTree className="w-4 h-4 text-stone-500" />
        <span className="text-xs font-semibold text-stone-700">Filter by Parent:</span>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
        >
          <option value="all">All Parent Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategories Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Subcategory Name</th>
              <th className="py-3.5 px-4">Parent Category</th>
              <th className="py-3.5 px-4">Assigned Products</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-stone-400">
                  No subcategories found.
                </td>
              </tr>
            ) : (
              filteredSubs.map((s) => {
                const assignedProducts = products.filter(
                  (p) => p.subcategoryId === s.id || p.subcategoryId === s.slug
                );

                return (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{s.name}</td>
                    <td className="py-3.5 px-4 text-stone-700 font-medium">
                      {getCategoryName(s.categoryId)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {assignedProducts.length} items
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          s.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {s.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{s.active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 rounded-lg hover:bg-stone-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              {editingSub ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Salajeet Paste, Dried Mulberries"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Parent Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-700"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
