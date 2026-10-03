import React from 'react';
import { ShoppingBag, Eye, Star, AlertCircle, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categories,
  onOpenDetails,
}) => {
  const { addToCart, cart } = useCart();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasSale = product.salePrice != null && product.salePrice < product.price;

  const categoryName = categories.find((c) => c.id === product.categoryId)?.name || 'Mountain Good';
  const cartItem = cart.find((i) => i.product.id === product.id);
  const isInCart = Boolean(cartItem);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Image and Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
  src={
    mainImage.includes('res.cloudinary.com')
      ? mainImage.replace('/upload/', '/upload/f_auto,q_auto,w_600/')
      : mainImage
  }
  alt={product.name}
  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
  loading="lazy"
  decoding="async"
/>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.featured && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded bg-amber-400 text-gray-950 shadow-sm">
              Featured
            </span>
          )}
          {hasSale && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded bg-red-600 text-white shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Only {product.stock} left
          </span>
        ) : null}

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-white/90 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow hover:bg-white hover:text-emerald-700"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 truncate">
            {categoryName}
          </span>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700 transition mb-1.5"
        >
          {product.name}
        </h3>

        {/* Unit & Description hint */}
        <div className="text-xs text-gray-500 mb-3">
          <span>Unit: </span>
          <span className="font-semibold text-gray-700">{product.unit || 'Standard Pack'}</span>
        </div>

        {/* Pricing & Add to Cart Container */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-900">
                Rs. {hasSale ? product.salePrice?.toLocaleString() : product.price.toLocaleString()}
              </span>
              {hasSale && (
                <span className="text-xs text-gray-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block font-medium">PKR</span>
          </div>

          <button
            id={`btn-add-to-cart-${product.id}`}
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : isInCart
                ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
            }`}
          >
            {isOutOfStock ? (
              <span>Sold Out</span>
            ) : isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>Added ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
