import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Star,
  Package,
} from 'lucide-react';
import { Product, Category, Subcategory } from '../../types';
import { deleteField } from 'firebase/firestore';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/db';
import { uploadImage } from '../../services/storage';
import { ProductImagePreview } from './ProductImagePreview';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  subcategories,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [weight, setWeight] = useState<string>('1');
  const [weightUnit, setWeightUnit] = useState<string>('kg');
  const [unit, setUnit] = useState('1 kg');
  const [stock, setStock] = useState<number | ''>(10);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Quick Inline Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlinePrice, setInlinePrice] = useState<number>(0);
  const [inlineSalePrice, setInlineSalePrice] = useState<number | null>(null);
  const [inlineStock, setInlineStock] = useState<number>(0);

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.description.toLowerCase().includes(search.toLowerCase()) ||
      prod.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || prod.categoryId === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && prod.active) ||
      (statusFilter === 'inactive' && !prod.active);

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && prod.stock > 5) ||
      (stockFilter === 'low_stock' && prod.stock > 0 && prod.stock <= 5) ||
      (stockFilter === 'out_of_stock' && prod.stock <= 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    setCategoryId(defaultCatId);
    setSubcategoryId('');
    setDescription('');
    setPrice(1500);
    setSalePrice('');
    setWeight('1');
    setWeightUnit('kg');
    setUnit('1 kg');
    setStock(20);
    setImages(['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80']);
    setImageUrlInput('');
    setFeatured(false);
    setActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategoryId(prod.categoryId);
    setSubcategoryId(prod.subcategoryId || '');
    setDescription(prod.description || '');
    setPrice(prod.price);
    setSalePrice(prod.salePrice != null ? prod.salePrice : '');
    setUnit(prod.unit || '1 kg');
    setWeight(prod.weight ? String(prod.weight) : (prod.unit ? prod.unit.split(' ')[0] : '1'));
    setWeightUnit(prod.weightUnit || (prod.unit && prod.unit.split(' ')[1] ? prod.unit.split(' ')[1] : 'kg'));
    setStock(prod.stock);
    setImages(prod.images || []);
    setImageUrlInput('');
    setFeatured(prod.featured);
    setActive(prod.active);
    setFormError('');
    setIsModalOpen(true);
  };

  // Keep unit in sync when weight or weightUnit change
  const handleWeightChange = (newWeight: string, newUnit: string) => {
    setWeight(newWeight);
    setWeightUnit(newUnit);
    if (newWeight.trim()) {
      setUnit(`${newWeight.trim()} ${newUnit.trim()}`);
    }
  };

  // Subcategories available for selected category
  const filteredSubcategories = subcategories.filter(
    (s) => s.categoryId === categoryId
  );

  // Handle Image File Upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setFormError('');
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImage(file, 'products');
        newUrls.push(url);
      }
      setImages((prev) => [...prev, ...newUrls]);
      setSuccessMessage(`${newUrls.length} image(s) uploaded successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: unknown) {
      console.error('Image upload failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Image upload failed. Please choose valid JPG, JPEG, PNG, or WEBP files.';
      setFormError(errMsg);
    } finally {
      setUploadingImage(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleAddImageUrl = (urlToAdd?: string) => {
    const target = (typeof urlToAdd === 'string' ? urlToAdd : imageUrlInput).trim();
    if (!target) return;
    setImages((prev) => [...prev, target]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [target, ...remaining];
    });
  };

  // Save product to Firestore
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!categoryId) {
      setFormError('Please select a category.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setFormError('Please provide a valid price.');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setFormError('Please provide a valid stock level (0 or more).');
      return;
    }

    setSaving(true);
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const formattedUnit = unit.trim() || `${weight} ${weightUnit}`.trim() || 'Unit';

      const payload: Record<string, any> = {
        name: name.trim(),
        slug: slug || `prod-${Date.now()}`,
        categoryId,
        description: description.trim(),
        price: Number(price),
        salePrice: salePrice === '' ? null : Number(salePrice),
        unit: formattedUnit,
        stock: Number(stock),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
        image: images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
        featured,
        active,
      };

      if (subcategoryId && subcategoryId.trim()) {
        payload.subcategoryId = subcategoryId.trim();
      } else if (editingProduct?.subcategoryId) {
        payload.subcategoryId = deleteField();
      }

      if (weight && weight.trim()) {
        payload.weight = weight.trim();
      } else if (editingProduct?.weight) {
        payload.weight = deleteField();
      }

      if (weightUnit && weightUnit.trim()) {
        payload.weightUnit = weightUnit.trim();
      } else if (editingProduct?.weightUnit) {
        payload.weightUnit = deleteField();
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload as any);
        setSuccessMessage(`Product "${name}" updated successfully.`);
      } else {
        await createProduct(payload as any);
        setSuccessMessage(`Product "${name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError('Failed to save product into Firestore. ' + (err instanceof Error ? err.message : ''));
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { active: !prod.active });
      setSuccessMessage(`"${prod.name}" is now ${!prod.active ? 'active' : 'hidden'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Toggle error:', err);
      setFormError('Failed to update product visibility status.');
    }
  };

  // Toggle featured status directly
  const handleToggleFeatured = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { featured: !prod.featured });
      setSuccessMessage(`"${prod.name}" featured status updated.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Featured toggle error:', err);
      setFormError('Failed to update featured status.');
    }
  };

  // Delete product safe modal
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setSuccessMessage(`Product "${productToDelete.name}" was deleted.`);
      setProductToDelete(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Delete error:', err);
      setFormError('Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  // Start inline edit
  const startInlineEdit = (prod: Product) => {
    setInlineEditingId(prod.id);
    setInlinePrice(prod.price);
    setInlineSalePrice(prod.salePrice ?? null);
    setInlineStock(prod.stock);
  };

  // Save inline edit
  const saveInlineEdit = async (prodId: string) => {
    try {
      await updateProduct(prodId, {
        price: Number(inlinePrice),
        salePrice: inlineSalePrice != null && inlineSalePrice > 0 ? Number(inlineSalePrice) : null,
        stock: Number(inlineStock),
      });
      setInlineEditingId(null);
      setSuccessMessage('Quick edits saved.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Inline update failed:', err);
      setFormError('Failed to save quick updates.');
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

      {formError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{formError}</span>
          </div>
          <button onClick={() => setFormError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-gray-900">Products Catalog</h2>
          <p className="text-xs text-gray-500">
            Manage store products, weights, inventory, prices, and images.
          </p>
        </div>

        <button
          id="btn-add-new-product"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, description or slug..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock (&gt;5)</option>
            <option value="low_stock">Low Stock (1-5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price (PKR)</th>
                <th className="py-3 px-3">Sale Price</th>
                <th className="py-3 px-3">Unit / Weight</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No products found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const category = categories.find((c) => c.id === prod.categoryId);
                  const subcategory = subcategories.find((s) => s.id === prod.subcategoryId);
                  const isInline = inlineEditingId === prod.id;
                  const img = prod.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=120&q=80';

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/70 transition">
                      {/* Item */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-11 h-11 rounded-lg object-cover border border-gray-200 flex-shrink-0 bg-gray-100"
                          />
                          <div className="max-w-xs">
                            <span className="font-semibold text-gray-900 block truncate">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-gray-400 block font-mono">
                              /{prod.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Subcategory */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {category ? category.name : 'Uncategorized'}
                          </span>
                          {subcategory && (
                            <span className="text-[10px] text-emerald-700">
                              ↳ {subcategory.name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3">
                        {isInline ? (
                          <input
                            type="number"
                            value={inlinePrice}
                            onChange={(e) => setInlinePrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Sale Price */}
                      <td className="py-3 px-3">
                        {isInline ? (
                          <input
                            type="number"
                            value={inlineSalePrice ?? ''}
                            placeholder="None"
                            onChange={(e) =>
                              setInlineSalePrice(e.target.value === '' ? null : Number(e.target.value))
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs text-red-600 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        ) : prod.salePrice ? (
                          <span className="font-bold text-red-600">
                            Rs. {prod.salePrice.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Unit / Weight */}
                      <td className="py-3 px-3">
                        <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                          {prod.unit || '1 Unit'}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3">
                        {isInline ? (
                          <input
                            type="number"
                            value={inlineStock}
                            onChange={(e) => setInlineStock(Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                              prod.stock <= 0
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : prod.stock <= 5
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {prod.stock <= 0 ? 'Out of stock' : `${prod.stock} units`}
                          </span>
                        )}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleActive(prod)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                            prod.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {prod.active ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleFeatured(prod)}
                          className={`p-1 rounded transition ${
                            prod.featured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-400'
                          }`}
                          title={prod.featured ? 'Featured on homepage' : 'Not featured'}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isInline ? (
                            <>
                              <button
                                onClick={() => saveInlineEdit(prod.id)}
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                title="Save Quick Edits"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setInlineEditingId(null)}
                                className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startInlineEdit(prod)}
                                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                                title="Quick Price & Stock Edit"
                              >
                                <Package className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                                title="Full Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(prod)}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-sans">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-gray-500">
                  Update product details, images, pricing, and category linkages.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Hunza Dried Apricots"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              {/* Category & Subcategory dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setSubcategoryId('');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 bg-white"
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subcategory (Filtered by Category)
                  </label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 bg-white"
                  >
                    <option value="">None / General in this Category</option>
                    {filteredSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing, Weight, Unit, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1500"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sale Price (PKR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Discounted"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Weight & Unit *
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => handleWeightChange(e.target.value, weightUnit)}
                      placeholder="1"
                      className="w-14 px-2 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none"
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => handleWeightChange(weight, e.target.value)}
                      className="flex-1 px-2 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none bg-white"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="pack">pack</option>
                      <option value="piece">piece</option>
                      <option value="box">box</option>
                      <option value="dozen">dozen</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="25"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Authentic high-altitude produce. 100% natural and sun-dried in the valleys of Gilgit-Baltistan..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              {/* Images Manager with Functional File Input and Preview Component */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Product Images *
                </label>
                <ProductImagePreview
                  images={images}
                  uploading={uploadingImage}
                  onFileUpload={handleFileUpload}
                  onSetCover={handleSetCoverImage}
                  onRemoveImage={handleRemoveImage}
                  onAddImageUrl={handleAddImageUrl}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                  />
                  <span>Featured Product (Highlighted on homepage)</span>
                </label>

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

              {/* Footer Buttons */}
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
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Safe Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Delete "{productToDelete.name}"?
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this product from your Firestore database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
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
