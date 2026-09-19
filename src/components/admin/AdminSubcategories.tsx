import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ListTree,
  AlertCircle,
  X,
  Search,
  CheckCircle,
  Package,
} from 'lucide-react';
import { Subcategory, Category, Product } from '../../types';
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../../services/db';

interface AdminSubcategoriesProps {
  subcategories: Subcategory[];
  categories: Category[];
  products?: Product[];
}

export const AdminSubcategories: React.FC<AdminSubcategoriesProps> = ({
  subcategories,
  categories,
  products = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [subToDelete, setSubToDelete] = useState<Subcategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredList = subcategories.filter((s) => {
    const matchesCat = selectedCategoryFilter === 'all' || s.categoryId === selectedCategoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingSub(null);
    setName('');
    setCategoryId(
      selectedCategoryFilter !== 'all' && selectedCategoryFilter
        ? selectedCategoryFilter
        : categories.length > 0
        ? categories[0].id
        : ''
    );
    setActive(true);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subcategory) => {
    setEditingSub(sub);
    setName(sub.name);
    setCategoryId(sub.categoryId);
    setActive(sub.active);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subcategory name is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a parent category.');
      return;
    }

    // Check duplicate under same parent category
    const isDuplicate = subcategories.some(
      (s) =>
        s.categoryId === categoryId &&
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.id !== editingSub?.id
    );

    if (isDuplicate) {
      setError(`A subcategory named "${name.trim()}" already exists in this parent category.`);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (editingSub) {
        await updateSubcategory(editingSub.id, {
          name: name.trim(),
          slug,
          categoryId,
          active,
        });
        setSuccessMessage(`Subcategory "${name}" updated successfully.`);
      } else {
        await createSubcategory({
          name: name.trim(),
          slug,
          categoryId,
          active,
        });
        setSuccessMessage(`Subcategory "${name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving subcategory:', err);
      setError('Failed to save subcategory into Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (sub: Subcategory) => {
    try {
      await updateSubcategory(sub.id, { active: !sub.active });
      setSuccessMessage(
        `Subcategory "${sub.name}" is now ${!sub.active ? 'active' : 'hidden'}.`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to toggle subcategory:', err);
      setError('Could not update subcategory status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!subToDelete) return;
    setDeleting(true);
    try {
      await deleteSubcategory(subToDelete.id);
      setSuccessMessage(`Subcategory "${subToDelete.name}" deleted.`);
      setSubToDelete(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Delete subcategory error:', err);
      setError('Could not delete subcategory.');
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

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-gray-900">Subcategories Management</h2>
          <p className="text-xs text-gray-500">
            Organize fine-grained product variants linked directly to parent categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subcategories..."
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <ListTree className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Parent Category:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="all">All Categories ({subcategories.length})</option>
            {categories.map((c) => {
              const count = subcategories.filter((s) => s.categoryId === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Subcategories Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Subcategory Name</th>
                <th className="px-5 py-3.5">Parent Category</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5">Products</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No subcategories match your current filter. Click "Add Subcategory" to create one.
                  </td>
                </tr>
              ) : (
                filteredList.map((sub) => {
                  const parentCat = categories.find((c) => c.id === sub.categoryId);
                  const linkedProductsCount = products.filter((p) => p.subcategoryId === sub.id).length;

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {sub.name}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {parentCat ? parentCat.name : 'Unknown Category'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-gray-400">
                        /{sub.slug}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-gray-600 font-medium">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          <span>{linkedProductsCount}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(sub)}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition ${
                            sub.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {sub.active ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition text-xs font-semibold flex items-center gap-1"
                            title="Edit Subcategory"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setSubToDelete(sub)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition text-xs font-semibold flex items-center gap-1"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
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
      </div>

      {/* Add / Edit Subcategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-base font-bold text-gray-900 font-sans">
                {editingSub ? 'Edit Subcategory' : 'Add New Subcategory'}
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
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hunza Dried Apricots"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Parent Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 bg-white"
                >
                  <option value="" disabled>Select parent category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  This subcategory will appear under the selected category in the store filter.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                  />
                  <span>Active (Visible on Storefront Filter)</span>
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
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingSub ? 'Save Changes' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {subToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Delete Subcategory "{subToDelete.name}"?
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Are you sure you want to delete this subcategory? Products belonging to this subcategory will remain safely in their parent category.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubToDelete(null)}
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
