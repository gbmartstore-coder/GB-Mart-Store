import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  Truck,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../config/brandConfig';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    couponCode,
    applyCoupon,
    total,
    navigateTo,
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');

  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#EFE9DD] flex items-center justify-center mx-auto text-[#8C6239]">
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A1F1D]">
          Your Mountain Basket is Empty
        </h1>
        <p className="text-sm text-[#596561] max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any authentic Gilgit-Baltistan products yet. Discover natural dry fruits, organic honey, and traditional attire.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 rounded-xl bg-[#1E3A2F] text-white text-xs sm:text-sm font-bold hover:bg-[#2D5A44] transition-colors shadow-md"
        >
          Explore Mountain Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A1F1D]">
            Shopping Basket
          </h1>
          <p className="text-xs text-[#6D4C2B] mt-1">
            Review your selected items from the mountains of Gilgit-Baltistan
          </p>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A2F] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      {/* Free Shipping Alert */}
      <div className="bg-[#F5EFE6] p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#1E3A2F]">
          <span>
            {remainingForFreeShipping === 0 ? (
              <span className="text-[#2D5A44] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                You unlocked FREE Nationwide Shipping across Pakistan!
              </span>
            ) : (
              `Add ${BRAND_CONFIG.currency.format(remainingForFreeShipping)} more for FREE Nationwide Shipping`
            )}
          </span>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-[#E2D8C3] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#2D5A44] h-full transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs divide-y divide-[#F0EAE0]">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-[#F5EFE6] flex-shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base text-[#1A1F1D] line-clamp-1">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#8C6239] hover:text-rose-600 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6D4C2B]">
                    {item.selectedWeight && (
                      <span className="bg-[#FAF9F5] border border-[#E8E2D5] px-2 py-0.5 rounded font-medium">
                        Weight: {item.selectedWeight}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="bg-[#FAF9F5] border border-[#E8E2D5] px-2 py-0.5 rounded font-medium">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#D5CBB8] rounded-xl bg-[#FAF9F5]">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-[#6D4C2B] hover:text-[#1A1F1D]"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1A1F1D]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-[#6D4C2B] hover:text-[#1A1F1D]"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-bold text-[#1E3A2F]">
                        {BRAND_CONFIG.currency.format(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[#6D4C2B]">
                          ({BRAND_CONFIG.currency.format(item.price)} each)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs">
            <button
              onClick={clearCart}
              className="text-[#8C6239] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Empty entire basket
            </button>
            <span className="text-[#6D4C2B]">Prices inclusive of all local taxes</span>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Input */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#6D4C2B] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Apply Mountain Voucher
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. MOUNTAIN10"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#D5CBB8] text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#2D5A44]"
              >
                Apply
              </button>
            </form>
            <p className="text-[10px] text-[#8C6239]">
              Try code <span className="font-bold">MOUNTAIN10</span> for 10% off your total order!
            </p>
          </div>

          {/* Totals Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-3 border-b border-[#F0EAE0]">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#272F2C]">
              <div className="flex justify-between">
                <span className="text-[#6D4C2B]">Cart Subtotal</span>
                <span className="font-bold">{BRAND_CONFIG.currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D4C2B]">Nationwide Delivery</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#2D5A44]">FREE (Order &gt; Rs. 3000)</span>
                  ) : (
                    BRAND_CONFIG.currency.format(deliveryFee)
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2D5A44]">
                  <span>Voucher Discount ({couponCode})</span>
                  <span className="font-bold">-{BRAND_CONFIG.currency.format(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#1E3A2F] pt-3 border-t border-[#E8E2D5]">
                <span>Grand Total</span>
                <span>{BRAND_CONFIG.currency.format(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-[#6D4C2B] space-y-1 text-center">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A44]" />
                Cash on Delivery & Secure Online Transfer
              </p>
              <p>Authentic Gilgit-Baltistan high-altitude dispatch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
