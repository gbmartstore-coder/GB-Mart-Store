import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
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
import { Product } from '../admin-system/AdminTypes';

export const AdminProducts: React.FC = () => {
  const { products, categories, subcategories, settings, getCategoryName, getSubcategoryName } =
    useStore();
  const currency = settings?.currency || 'Rs.';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    price: '',
    salePrice: '',
    unit: '1 kg',
    stock: '10',
    featured: false,
    active: true,
  });
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategoryFilter !== 'all') {
        const match =
          p.categoryId === selectedCategoryFilter ||
          p.categoryId === categories.find((c) => c.id === selectedCategoryFilter)?.slug;
        if (!match) return false;
      }
      // Status filter
      if (statusFilter === 'active' && !p.active) return false;
      if (statusFilter === 'inactive' && p.active) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        return nameMatch || descMatch;
      }
      return true;
    });
  }, [products, selectedCategoryFilter, statusFilter, searchQuery, categories]);

  // Open modal for Create or Edit
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      subcategoryId: '',
      description: '',
      price: '1000',
      salePrice: '',
      unit: '1 kg',
      stock: '25',
      featured: false,
      active: true,
    });
    setImagesList([
      'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
    ]);
    setErrorMsg('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId || '',
      description: p.description,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '',
      unit: p.unit,
      stock: String(p.stock),
      featured: !!p.featured,
      active: p.active,
    });
    setImagesList(p.images || []);
    setErrorMsg('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  // Subcategories available for selected category
  const availableSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter(
      (s) =>
        s.categoryId === formData.categoryId ||
        s.categoryId === categories.find((c) => c.id === formData.categoryId)?.slug
    );
  }, [subcategories, formData.categoryId, categories]);

  // Toggle active status inline
  const handleToggleActive = async (p: Product) => {
    try {
      const pRef = doc(db, 'products', p.id);
      await updateDoc(pRef, {
        active: !p.active,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (p: Product) => {
    if (window.confirm(`Are you sure you want to permanently delete "${p.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'products', p.id));
        setSuccessMsg(`Product "${p.name}" deleted successfully.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Error deleting product:', err);
        setErrorMsg('Failed to delete product.');
      }
    }
  };

  // File upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');

    try {
      if (storage) {
        const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);
        setImagesList((prev) => [...prev, downloadUrl]);
      } else {
        // Fallback: read as base64 data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagesList((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Storage upload warning, using local file reader:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagesList((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImagesList((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Form Submit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.categoryId || !formData.price) {
      setErrorMsg('Product name, category, and price are required.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const salePriceNum = formData.salePrice ? parseFloat(formData.salePrice) : null;
    const stockNum = parseInt(formData.stock, 10) || 0;

    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Price must be a valid positive number.');
      return;
    }

    if (salePriceNum !== null && (isNaN(salePriceNum) || salePriceNum >= priceNum)) {
      setErrorMsg('Sale price must be lower than the regular price.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload: Omit<Product, 'id'> = {
        name: formData.name.trim(),
        slug: editingProduct?.slug || `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId || null,
        description: formData.description.trim(),
        price: priceNum,
        salePrice: salePriceNum,
        unit: formData.unit.trim(),
        stock: stockNum,
        images: imagesList.length > 0 ? imagesList : [
          'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
        ],
        featured: formData.featured,
        active: formData.active,
        createdAt: editingProduct ? editingProduct.createdAt : now,
        updatedAt: now,
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), payload);
        setSuccessMsg(`Product "${payload.name}" updated successfully.`);
      } else {
        await addDoc(collection(db, 'products'), payload);
        setSuccessMsg(`Product "${payload.name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      console.error('Save product error:', err);
      setErrorMsg('Failed to save product in Firestore.');
      try {
        handleFirestoreError(
          err,
          editingProduct ? OperationType.UPDATE : OperationType.CREATE,
          'products'
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Products Catalog Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add, edit, price, and maintain mountain inventory across categories
          </p>
        </div>
        <button
          id="admin-add-product-btn"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & Filtering Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="admin-product-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or description..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Category filter */}
          <select
            id="admin-product-category-filter"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Active / Inactive filter */}
          <select
            id="admin-product-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const hasSale = p.salePrice && p.salePrice < p.price;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              p.images?.[0] ||
                              'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={p.name}
                            className="w-11 h-11 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-stone-500">{p.unit}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800">
                          {getCategoryName(p.categoryId)}
                        </span>
                        {p.subcategoryId && (
                          <span className="text-[11px] text-stone-400 block">
                            {getSubcategoryName(p.subcategoryId)}
                          </span>
                        )}
                      </td>

                      {/* Price & Sale Price */}
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {hasSale ? (
                          <div>
                            <span>
                              {currency} {p.salePrice?.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-stone-400 line-through block">
                              {currency} {p.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span>
                            {currency} {p.price.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            p.stock <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" /> Featured
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            p.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {p.active ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`admin-edit-product-btn-${p.slug}`}
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`admin-delete-product-btn-${p.slug}`}
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete product"
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
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
            <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Mountain Product'}
                </h3>
                <p className="text-xs text-stone-300">
                  Update inventory, pricing, images, and category categorization
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  id="admin-form-product-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pure Himalayan Shilajit (Gold Grade)"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Parent Category *
                  </label>
                  <select
                    id="admin-form-product-category"
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value,
                        subcategoryId: '', // Reset subcategory when category changes
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subcategory (Filtered by Category)
                  </label>
                  <select
                    id="admin-form-product-subcategory"
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="">None / General</option>
                    {availableSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Sale Price, Unit, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Regular Price ({currency}) *
                  </label>
                  <input
                    id="admin-form-product-price"
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sale Price ({currency})
                  </label>
                  <input
                    id="admin-form-product-sale-price"
                    type="number"
                    min="1"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Unit / Size *
                  </label>
                  <input
                    id="admin-form-product-unit"
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 50g jar, 1 kg"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    id="admin-form-product-stock"
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="20"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  id="admin-form-product-desc"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the high-altitude origin, taste profile, and authentic harvesting method..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Multiple Images Upload & URL */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Images (Multiple Supported)
                </label>

                {/* Current Images Preview */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 group">
                      <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-stone-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-stone-800 text-white text-xs font-semibold rounded-xl hover:bg-stone-700"
                  >
                    Add URL
                  </button>

                  <label className="px-3 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
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

              {/* Toggles: Featured & Active */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    id="admin-form-product-featured-toggle"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    id="admin-form-product-active-toggle"
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Active in Store (Visible to customers)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  id="admin-form-product-save-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20"
                >
                  {isSubmitting ? 'Saving to Firestore...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
