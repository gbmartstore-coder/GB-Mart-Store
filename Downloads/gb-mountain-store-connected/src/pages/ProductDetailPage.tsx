import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Package, 
  ChevronRight, 
  ArrowLeft,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SAMPLE_REVIEWS } from '../data/reviewsData';
import { BRAND_CONFIG } from '../config/brandConfig';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo,
    addToast,
    allProducts,
  } = useShop();

  const product = selectedProduct || allProducts[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedWeight, setSelectedWeight] = useState<string>(
    product.availableWeights?.[0]?.weight || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes?.[0] || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'origin' | 'reviews' | 'delivery'>('desc');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Dynamic price based on weight
  const activeWeightOption = product.availableWeights?.find(
    (w) => w.weight === selectedWeight
  );
  const currentPrice = activeWeightOption ? activeWeightOption.price : product.price;
  const currentOldPrice = activeWeightOption?.oldPrice || product.oldPrice;
  const inWishlist = isInWishlist(product.id);

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedWeight || undefined,
      selectedSize || undefined,
      selectedColor || undefined
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      quantity,
      selectedWeight || undefined,
      selectedSize || undefined,
      selectedColor || undefined
    );
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#6D4C2B]">
        <button onClick={() => navigateTo('home')} className="hover:text-[#1E3A2F]">Home</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <button onClick={() => navigateTo('shop', undefined, product.category)} className="hover:text-[#1E3A2F] capitalize">
          {product.category.replace('-', ' ')}
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="font-semibold text-[#1A1F1D] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#F5EFE6] border border-[#E8E2D5] shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Origin Badge */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <span className="bg-[#1E3A2F] text-[#F5EFE6] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm">
                Origin: Gilgit-Baltistan
              </span>
              {product.discountPercentage && (
                <span className="bg-[#8C6239] text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm w-fit">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md transition-all ${
                inWishlist
                  ? 'bg-white text-rose-600 shadow-md'
                  : 'bg-white/80 text-[#272F2C] hover:bg-white hover:text-rose-600'
              }`}
              aria-label="Save to wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#1E3A2F] ring-2 ring-[#1E3A2F]/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Order Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8C6239] font-semibold mb-1">
              <span>{product.valley} Valley, Gilgit-Baltistan</span>
              <div className="flex items-center gap-1 text-[#C59B27]">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-[#1A1F1D] font-bold text-xs">{product.rating}</span>
                <span className="text-[#8C6239]">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1F1D] leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-[#596561] mt-3 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E8E2D5] flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#6D4C2B] font-semibold uppercase tracking-wider block">
                Price (PKR)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1E3A2F]">
                  {BRAND_CONFIG.currency.format(currentPrice)}
                </span>
                {currentOldPrice && (
                  <span className="text-sm text-[#8C6239] line-through">
                    {BRAND_CONFIG.currency.format(currentOldPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[#2D5A44] font-bold block">In Stock</span>
              <span className="text-[#8C6239]">Aroma Sealed Packaging</span>
            </div>
          </div>

          {/* Weight Variant Selector */}
          {product.availableWeights && product.availableWeights.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block">
                Select Package Weight:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.availableWeights.map((w) => (
                  <button
                    key={w.weight}
                    type="button"
                    onClick={() => setSelectedWeight(w.weight)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      selectedWeight === w.weight
                        ? 'bg-[#1E3A2F] text-white border-[#1E3A2F] shadow-sm'
                        : 'bg-white text-[#1A1F1D] border-[#D5CBB8] hover:border-[#1E3A2F]'
                    }`}
                  >
                    <span className="block font-bold">{w.weight}</span>
                    <span className="text-[10px] opacity-80 mt-0.5 block">
                      {BRAND_CONFIG.currency.format(w.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Apparel Size / Color Selectors if available */}
          {product.availableSizes && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block">
                Select Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                        : 'bg-white text-[#1A1F1D] border-[#D5CBB8]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.availableColors && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block">
                Color Choice:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === col
                        ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                        : 'bg-white text-[#1A1F1D] border-[#D5CBB8]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B]">
              Quantity:
            </span>
            <div className="flex items-center border border-[#D5CBB8] rounded-xl bg-white shadow-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-sm font-bold text-[#6D4C2B] hover:text-black"
                aria-label="Decrease"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-[#1A1F1D]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-2 text-sm font-bold text-[#6D4C2B] hover:text-black"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <span className="text-xs text-[#6D4C2B]">
              Total: <strong>{BRAND_CONFIG.currency.format(currentPrice * quantity)}</strong>
            </span>
          </div>

          {/* Action Buttons: Add to Cart + Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-[#2D5A44] text-white'
                    : 'bg-[#1E3A2F] hover:bg-[#2D5A44] text-white active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C358] text-[#142820] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Buy Now (COD)
              </button>
            </div>
          </div>

          {/* Trust Highlights for PDP */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-2.5 text-xs text-[#272F2C]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2D5A44] flex-shrink-0" />
              <span>Nationwide delivery in 3 to 5 business days across Pakistan.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D5A44] flex-shrink-0" />
              <span>100% Genuine mountain harvest directly from Gilgit-Baltistan.</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#2D5A44] flex-shrink-0" />
              <span>Hassle-free 7-day replacement if damaged during courier transit.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Valley Sourcing, Care/Packaging, Reviews */}
      <div className="pt-8 border-t border-[#E8E2D5]">
        <div className="flex border-b border-[#E8E2D5] gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-[#1E3A2F] text-[#1E3A2F]'
                : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('origin')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'origin'
                ? 'border-[#1E3A2F] text-[#1E3A2F]'
                : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
            }`}
          >
            Valley Origin & Authenticity
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-[#1E3A2F] text-[#1E3A2F]'
                : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
            }`}
          >
            Packaging & Delivery
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#1E3A2F] text-[#1E3A2F]'
                : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
            }`}
          >
            Customer Reviews ({product.reviewCount})
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="py-6 text-sm text-[#272F2C] leading-relaxed">
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4">
              <p>{product.description}</p>
              {product.ingredientsOrMaterial && (
                <div className="mt-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E2D5]">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C6239] mb-1">
                    Ingredients / Material:
                  </h4>
                  <p className="text-xs text-[#1A1F1D]">{product.ingredientsOrMaterial}</p>
                </div>
              )}
              {product.boxContents && (
                <div className="mt-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E2D5]">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C6239] mb-2">
                    Gift Box Items Included:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-[#1A1F1D]">
                    {product.boxContents.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'origin' && (
            <div className="max-w-3xl space-y-4">
              <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E8E2D5]">
                <h4 className="font-serif-heading text-lg font-bold text-[#1E3A2F]">
                  Sourced from {product.origin}
                </h4>
                <p className="text-xs text-[#596561] mt-1 leading-relaxed">
                  Grown and harvested in the high-altitude Karakoram mountains under pure glacial sun. Gilgit-Baltistan’s extreme temperature swings produce extraordinary natural sugar concentration in fruits and highly potent mineral resins.
                </p>
              </div>
              {product.authenticityNotes && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold mb-1">Authenticity & Quality Notice:</p>
                  <p>{product.authenticityNotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8E2D5]">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#8C6239] mb-1">
                    Packaging Standard
                  </h5>
                  <p className="text-xs text-[#596561]">
                    {product.packagingInfo || 'Food-grade moisture-lock pouches or vacuum sealed packs designed to withstand nationwide courier transit.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8E2D5]">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#8C6239] mb-1">
                    Storage & Shelf Life
                  </h5>
                  <p className="text-xs text-[#596561]">
                    {product.storageOrCare || 'Keep in an airtight jar in a cool, shaded environment.'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#6D4C2B]">
                Orders are dispatched daily from our regional northern hubs and central distribution point in Islamabad for rapid delivery across Punjab, Sindh, KPK, Balochistan, and Gilgit-Baltistan.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
                    Customer Feedback
                  </h4>
                  <p className="text-xs text-[#8C6239] italic">
                    (Sample customer reviews shown for preview)
                  </p>
                </div>
                <button
                  onClick={() => addToast('Review submission form will connect to Firebase backend', 'info')}
                  className="px-4 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-semibold"
                >
                  Write a Review
                </button>
              </div>

              <div className="space-y-4">
                {SAMPLE_REVIEWS.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[#C59B27]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[#8C6239]">{rev.date}</span>
                    </div>
                    <h5 className="font-bold text-sm text-[#1A1F1D]">{rev.title}</h5>
                    <p className="text-xs text-[#596561] leading-relaxed">{rev.comment}</p>
                    <div className="text-[11px] text-[#6D4C2B] pt-1">
                      <strong>{rev.customerName}</strong> • {rev.customerLocation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#E8E2D5] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#1A1F1D]">
              More from this Mountain Category
            </h3>
            <button
              onClick={() => navigateTo('shop', undefined, product.category)}
              className="text-xs font-bold text-[#1E3A2F] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
