import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    discount,
    total,
    navigateTo,
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  const handleViewCartPage = () => {
    setIsCartDrawerOpen(false);
    navigateTo('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-[#1A1F1D]/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col justify-between border-l border-[#E8E2D5]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8E2D5] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1E3A2F]" />
              <h2 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
                Your Mountain Basket
              </h2>
              <span className="text-xs bg-[#EFE9DD] text-[#6D4C2B] font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-full text-[#6D4C2B] hover:bg-[#FAF9F5] hover:text-[#1A1F1D] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F5EFE6] px-5 py-3 border-b border-[#E8E2D5]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1E3A2F]">
              <span>
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#2D5A44] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    You unlocked FREE Nationwide Delivery!
                  </span>
                ) : (
                  `Add ${BRAND_CONFIG.currency.format(remainingForFreeShipping)} more for FREE Delivery`
                )}
              </span>
              <span className="text-[#6D4C2B]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E2D8C3] h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-[#2D5A44] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFE9DD] flex items-center justify-center text-[#8C6239]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <p className="font-serif-heading text-lg font-semibold text-[#1A1F1D]">
                    Your basket is empty
                  </p>
                  <p className="text-xs text-[#6D4C2B] mt-1 max-w-xs">
                    Explore fresh dry fruits, raw mountain honey, shilajit, and traditional crafts directly from Gilgit-Baltistan.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#1E3A2F] text-white text-xs font-semibold hover:bg-[#2D5A44] transition-colors"
                >
                  Explore Mountain Shop
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white p-3 rounded-xl border border-[#E8E2D5] shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-[#F5EFE6] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#1A1F1D] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C6239] hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant details */}
                      <div className="flex flex-wrap gap-1.5 mt-0.5 text-[11px] text-[#6D4C2B]">
                        {item.selectedWeight && (
                          <span className="bg-[#FAF9F5] border border-[#E8E2D5] px-1.5 py-0.2 rounded font-medium">
                            {item.selectedWeight}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-[#FAF9F5] border border-[#E8E2D5] px-1.5 py-0.2 rounded font-medium">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F0EAE0]">
                      {/* Qty Stepper */}
                      <div className="flex items-center border border-[#D5CBB8] rounded-lg bg-[#FAF9F5]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-[#6D4C2B] hover:text-[#1A1F1D] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#1A1F1D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-[#6D4C2B] hover:text-[#1A1F1D] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-[#1E3A2F]">
                        {BRAND_CONFIG.currency.format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D5] space-y-3">
              <div className="space-y-1.5 text-xs text-[#272F2C]">
                <div className="flex justify-between">
                  <span className="text-[#6D4C2B]">Subtotal</span>
                  <span className="font-semibold">{BRAND_CONFIG.currency.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D4C2B]">Estimated Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#2D5A44]">FREE (Special Offer)</span>
                    ) : (
                      BRAND_CONFIG.currency.format(deliveryFee)
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2D5A44]">
                    <span>Promotional Discount</span>
                    <span>-{BRAND_CONFIG.currency.format(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#1E3A2F] pt-2 border-t border-[#E8E2D5]">
                  <span>Total Amount</span>
                  <span>{BRAND_CONFIG.currency.format(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleViewCartPage}
                  className="w-full py-2.5 rounded-xl border border-[#1E3A2F] text-[#1E3A2F] text-xs font-semibold hover:bg-[#FAF9F5] transition-colors text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-center text-[#6D4C2B]">
                Cash on Delivery (COD) & Online Payment available across Pakistan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
