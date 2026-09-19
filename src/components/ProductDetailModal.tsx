import React, { useState } from 'react';
import { X, Check, ShoppingBag, Truck, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';
import { Product, Category, Subcategory } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  categories: Category[];
  subcategories: Subcategory[];
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  categories,
  subcategories,
  onClose,
}) => {
  const { addToCart, cart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const effectivePrice = hasSale ? (product.salePrice as number) : product.price;

  const category = categories.find((c) => c.id === product.categoryId);
  const subcategory = subcategories.find((s) => s.id === product.subcategoryId);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[selectedImageIdx] || images[0];
  const cartItem = cart.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="w-full md:w-1/2 p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm relative">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.featured && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded bg-amber-400 text-gray-950 shadow-sm">
                Featured Product
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm uppercase">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    idx === selectedImageIdx ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-gray-200 text-[11px] text-gray-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Pure & Authentic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Quality Inspected</span>
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              <span>{category?.name || 'Produce'}</span>
              {subcategory && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{subcategory.name}</span>
                </>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-sans text-gray-900 leading-tight mb-3">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                Rs. {effectivePrice.toLocaleString()}
              </span>
              {hasSale && (
                <span className="text-base text-gray-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold">
                Per {product.unit || 'Unit'}
              </span>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-2 mb-6">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Currently Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Description & Details
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description || 'Authentic product from Gilgit-Baltistan.'}
              </p>
            </div>
          </div>

          {/* Actions & Quantity */}
          <div className="pt-6 border-t border-gray-200">
            {!isOutOfStock && (
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-gray-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((prev) => Math.min(product.stock, prev + 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                id="btn-modal-add-to-cart"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow transition ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isOutOfStock
                    ? 'Unavailable'
                    : `Add to Cart • Rs. ${(effectivePrice * qty).toLocaleString()}`}
                </span>
              </button>
            </div>

            {/* Delivery note */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe delivery across all cities of Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
