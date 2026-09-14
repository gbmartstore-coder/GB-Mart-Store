import React, { useState } from 'react';
import { Heart, Star, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct,
    navigateTo 
  } = useShop();

  const [selectedWeight, setSelectedWeight] = useState<string>(
    product.availableWeights?.[0]?.weight || ''
  );
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const activeWeightOption = product.availableWeights?.find(
    (w) => w.weight === selectedWeight
  );

  const displayPrice = activeWeightOption ? activeWeightOption.price : product.price;
  const displayOldPrice = activeWeightOption?.oldPrice || product.oldPrice;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedWeight || undefined);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => navigateTo('product-detail', product.id)}
      className={`group cursor-pointer bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#D5CBB8] hover:-translate-y-1 ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-[#F5EFE6] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Origin Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          <span className="bg-[#1E3A2F]/90 text-[#F5EFE6] text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
            Gilgit-Baltistan
          </span>
          {product.discountPercentage && (
            <span className="bg-[#8C6239] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs w-fit">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-xs transition-all ${
            inWishlist
              ? 'bg-white text-rose-600 shadow-sm'
              : 'bg-white/80 text-[#272F2C] hover:bg-white hover:text-rose-600'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover (Desktop) */}
        <div className="absolute inset-x-0 bottom-3 px-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickView}
            className="w-full py-2 bg-white/95 backdrop-blur-xs text-[#1E3A2F] text-xs font-semibold rounded-xl shadow-md hover:bg-[#1E3A2F] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Valley / Category line */}
          <div className="flex items-center justify-between text-[11px] text-[#6D4C2B] mb-1 font-medium">
            <span>{product.valley} Valley</span>
            {/* Rating Stars */}
            <div className="flex items-center gap-1 text-[#C59B27]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[#1A1F1D] font-bold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[#8C6239] text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-sm sm:text-base text-[#1A1F1D] line-clamp-1 group-hover:text-[#2D5A44] transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#596561] line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Weight Options Pills (if dry fruits / honey / shilajit) */}
          {product.availableWeights && product.availableWeights.length > 0 && (
            <div 
              className="mt-3 flex flex-wrap gap-1.5 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] uppercase font-bold text-[#8C6239] mr-0.5">
                Weight:
              </span>
              {product.availableWeights.map((w) => (
                <button
                  key={w.weight}
                  type="button"
                  onClick={() => setSelectedWeight(w.weight)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-all ${
                    selectedWeight === w.weight
                      ? 'bg-[#1E3A2F] text-[#F5EFE6] border-[#1E3A2F] shadow-xs'
                      : 'bg-[#FAF9F5] text-[#272F2C] border-[#D5CBB8] hover:border-[#1E3A2F]'
                  }`}
                >
                  {w.weight}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#F0EAE0] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[#1E3A2F]">
                {BRAND_CONFIG.currency.format(displayPrice)}
              </span>
              {displayOldPrice && (
                <span className="text-xs text-[#8C6239] line-through opacity-70">
                  {BRAND_CONFIG.currency.format(displayOldPrice)}
                </span>
              )}
            </div>
            {selectedWeight && (
              <span className="text-[10px] text-[#6D4C2B] font-medium block">
                Selected: {selectedWeight}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
              isAddedRecently
                ? 'bg-[#2D5A44] text-white'
                : 'bg-[#1E3A2F] text-white hover:bg-[#2D5A44] active:scale-95'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
