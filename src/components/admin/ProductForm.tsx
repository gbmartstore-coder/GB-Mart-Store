import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, Star, Trash2, Eye, CheckCircle } from 'lucide-react';
import { Product, Category, Subcategory } from '../../types';
import { uploadImage } from '../../services/storage';

export interface ProductFormProps {
  editingProduct?: Product | null;
  categories: Category[];
  subcategories: Subcategory[];
  onSave: (productData: Partial<Product>) => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  categories,
  subcategories,
  onSave,
  onCancel,
  saving = false,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [weight, setWeight] = useState('1');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [unit, setUnit] = useState('1 kg');
  const [stock, setStock] = useState<number | ''>(10);
  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState<string>('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  // Upload & Preview State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);

  // Initialize or reset form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setCategoryId(editingProduct.categoryId || '');
      setSubcategoryId(editingProduct.subcategoryId || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price ?? '');
      setSalePrice(editingProduct.salePrice ?? '');
      setStock(editingProduct.stock ?? 10);
      setFeatured(editingProduct.featured || false);
      setActive(editingProduct.active !== false);

      const prodImages = editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image
        ? [editingProduct.image]
        : [];
      setImages(prodImages);
      setImage(prodImages[0] || editingProduct.image || '');

      if (editingProduct.weight) {
        setWeight(editingProduct.weight);
      }
      if (editingProduct.weightUnit) {
        setWeightUnit(editingProduct.weightUnit);
      }
      if (editingProduct.unit) {
        setUnit(editingProduct.unit);
      }
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setSubcategoryId('');
      setDescription('');
      setPrice('');
      setSalePrice('');
      setWeight('1');
      setWeightUnit('kg');
      setUnit('1 kg');
      setStock(10);
      setImages([]);
      setImage('');
      setFeatured(false);
      setActive(true);
    }
  }, [editingProduct, categories]);

  // Keep primary single image in sync with first image
  useEffect(() => {
    if (images.length > 0) {
      setImage(images[0]);
    } else {
      setImage('');
    }
  }, [images]);

  const handleWeightChange = (newWeight: string, newUnit: string) => {
    setWeight(newWeight);
    setWeightUnit(newUnit);
    if (newWeight.trim()) {
      setUnit(`${newWeight.trim()} ${newUnit.trim()}`);
    }
  };

  // Handle HTML File Input Selection & Firebase Storage Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Upload to Firebase Storage under 'products/' folder
        const downloadUrl = await uploadImage(file, 'products');
        uploadedUrls.push(downloadUrl);
      }

      // Update state to store resulting Firebase download URLs
      setImages((prev) => [...prev, ...uploadedUrls]);
      if (uploadedUrls.length > 0 && !image) {
        setImage(uploadedUrls[0]);
      }
    } catch (err: unknown) {
      console.error('Image upload failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to upload image.';
      setError(errMsg);
    } finally {
      setUploadingImage(false);
      if (e.target) {
        e.target.value = '';
      }
    }
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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setError('Please enter a valid price.');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setError('Please provide a valid stock level (0 or more).');
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const finalImages = images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'];

    const formattedUnit = unit.trim() || `${weight} ${weightUnit}`.trim() || 'Unit';

    const payload: Partial<Product> = {
      name: name.trim(),
      slug: slug || `prod-${Date.now()}`,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      description: description.trim(),
      price: Number(price),
      salePrice: salePrice === '' ? null : Number(salePrice),
      unit: formattedUnit,
      weight: weight.trim() || undefined,
      weightUnit: weightUnit.trim() || undefined,
      stock: Number(stock),
      images: finalImages,
      image: finalImages[0],
      featured,
      active,
    };

    await onSave(payload);
  };

  const filteredSubcategories = subcategories.filter(
    (s) => s.categoryId === categoryId
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4" id="product-management-form">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
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

      {/* Category & Subcategory */}
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
            Subcategory (Optional)
          </label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 bg-white"
          >
            <option value="">None / General</option>
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
            Regular Price (PKR) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="1200"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Sale Price (PKR)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Optional"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Weight / Volume
          </label>
          <div className="flex">
            <input
              type="text"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value, weightUnit)}
              placeholder="1"
              className="w-16 px-2 py-2 rounded-l-lg border border-r-0 border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
            <select
              value={weightUnit}
              onChange={(e) => handleWeightChange(weight, e.target.value)}
              className="flex-1 px-2 py-2 rounded-r-lg border border-gray-300 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="Pack">Pack</option>
              <option value="Bottle">Bottle</option>
              <option value="Piece">Piece</option>
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
            placeholder="10"
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
          placeholder="Authentic high-altitude produce, 100% natural and sun-dried in Gilgit-Baltistan..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        />
      </div>

      {/* HTML File Input Field with uploadImage & Image Preview */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700">
          Product Images (HTML File Input & Firebase Storage) *
        </label>

        {/* HTML File Input Field */}
        <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-4 text-center hover:bg-emerald-50 transition">
          <label
            htmlFor="product-html-file-input"
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
                  ? 'Uploading to Firebase Storage (products)...'
                  : 'Choose Product Image File from Computer'}
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5">
                PNG, JPG, JPEG, WEBP (Single or Multiple)
              </span>
            </div>
            <input
              id="product-html-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleFileChange}
              disabled={uploadingImage}
              className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer border border-emerald-200 rounded-lg p-1 bg-white"
            />
          </label>
        </div>

        {/* Image Preview for UI */}
        {images.length > 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
              <span>Image Previews ({images.length} uploaded)</span>
              <span className="text-[11px] text-emerald-700 font-medium">Ready for submission</span>
            </div>

            {/* Featured / Cover Image Preview */}
            <div className="bg-white border border-emerald-200 rounded-lg p-2.5 flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                <img
                  src={images[0]}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-bold text-center py-0.5 uppercase">
                  Cover
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Primary Storefront Image
                </span>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  Firebase Download URL stored in state and ready to update Firestore.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActivePreviewUrl(images[0])}
                  className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-md transition"
                  title="Preview full size"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(0)}
                  className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Additional gallery thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-square rounded-lg overflow-hidden border group bg-white ${
                      idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActivePreviewUrl(imgUrl)}
                        className="p-1 rounded bg-white text-gray-900 hover:bg-gray-100"
                        title="View image"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(idx)}
                          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          title="Set as Cover"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-gray-400">
            No image selected. Please select a file from your computer to preview before submitting.
          </p>
        )}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
          />
          <span>Active (Available for purchase)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
          />
          <span>Featured Product (Display on homepage)</span>
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
          <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
        </button>
      </div>

      {/* Lightbox Preview Modal */}
      {activePreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 text-white">
              <span className="text-xs font-semibold">Image Preview Verification</span>
              <button
                type="button"
                onClick={() => setActivePreviewUrl(null)}
                className="p-1 text-gray-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={activePreviewUrl}
                alt="Enlarged preview"
                className="max-w-full max-h-[58vh] object-contain"
              />
            </div>
            <div className="p-3 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setActivePreviewUrl(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
export default ProductForm;
