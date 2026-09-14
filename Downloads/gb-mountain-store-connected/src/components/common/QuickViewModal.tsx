import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    navigateTo 
  } = useShop();

  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedWeight(quickViewProduct.availableWeights?.[0]?.weight || '');
      setSelectedSize(quickViewProduct.availableSizes?.[0] || '');
      setQuantity(1);
      setActiveImageIndex(0);
      setIsAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);
  const activeWeightOption = quickViewProduct.availableWeights?.find(
    (w) => w.weight === selectedWeight
  );
  const currentPrice = activeWeightOption ? activeWeightOption.price : quickViewProduct.price;
  const currentOldPrice = activeWeightOption?.oldPrice || quickViewProduct.oldPrice;

  const handleAddToCart = () => {
    addToCart(
      quickViewProduct,
      quantity,
      selectedWeight || undefined,
      selectedSize || undefined
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleFullDetails = () => {
    setQuickViewProduct(null);
    navigateTo('product-detail', quickViewProduct.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-[#1A1F1D]/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF9F5] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8E2D5] z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#272F2C] shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-5 bg-[#F5EFE6] flex flex-col justify-between">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-white shadow-xs">
              <img
                src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-[#1E3A2F]' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-[#E2D8C3] flex items-center justify-between text-xs text-[#6D4C2B]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A44]" />
                Origin: {quickViewProduct.origin}
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#2D5A44]" />
                COD Across Pakistan
              </span>
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C6239] mb-1 font-semibold">
                <span>{quickViewProduct.valley} Valley Harvest</span>
                <div className="flex items-center gap-1 text-[#C59B27]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-xs text-[#1A1F1D]">{quickViewProduct.rating}</span>
                  <span className="text-[#8C6239] text-xs">({quickViewProduct.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif-heading text-xl font-bold text-[#1A1F1D] leading-snug">
                {quickViewProduct.name}
              </h2>

              <p className="text-xs text-[#596561] mt-2 leading-relaxed line-clamp-3">
                {quickViewProduct.shortDescription}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1E3A2F]">
                  {BRAND_CONFIG.currency.format(currentPrice)}
                </span>
                {currentOldPrice && (
                  <span className="text-sm text-[#8C6239] line-through">
                    {BRAND_CONFIG.currency.format(currentOldPrice)}
                  </span>
                )}
                {quickViewProduct.discountPercentage && (
                  <span className="text-xs bg-[#8C6239] text-white px-2 py-0.5 rounded font-bold">
                    Save {quickViewProduct.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Weight Selector */}
              {quickViewProduct.availableWeights && (
                <div className="mt-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block mb-1.5">
                    Select Packaging Weight:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.availableWeights.map((w) => (
                      <button
                        key={w.weight}
                        type="button"
                        onClick={() => setSelectedWeight(w.weight)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedWeight === w.weight
                            ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                            : 'bg-white text-[#1A1F1D] border-[#D5CBB8] hover:border-[#1E3A2F]'
                        }`}
                      >
                        {w.weight} - {BRAND_CONFIG.currency.format(w.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {quickViewProduct.availableSizes && (
                <div className="mt-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block mb-1.5">
                    Select Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          selectedSize === s
                            ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                            : 'bg-white text-[#1A1F1D] border-[#D5CBB8]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-[#6D4C2B] uppercase">Quantity:</span>
                <div className="flex items-center border border-[#D5CBB8] rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-[#6D4C2B] hover:text-black"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-[#6D4C2B] hover:text-black"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#2D5A44] font-medium">In Stock</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E8E2D5] space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    isAdded ? 'bg-[#2D5A44] text-white' : 'bg-[#1E3A2F] hover:bg-[#2D5A44] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Basket
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                      Add to Basket
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-[#D5CBB8] bg-white text-[#1A1F1D] hover:text-rose-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleFullDetails}
                className="w-full py-2 text-xs font-semibold text-[#6D4C2B] hover:text-[#1E3A2F] flex items-center justify-center gap-1 transition-colors"
              >
                View Complete Product Details & Reviews
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
