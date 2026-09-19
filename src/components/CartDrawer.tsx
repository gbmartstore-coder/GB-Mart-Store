import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    totalAmount,
    settings,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 4000;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Your Harvest Cart</h2>
                <p className="text-xs text-stone-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-900 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  {amountToFreeDelivery === 0
                    ? '🎉 You unlocked Free Delivery!'
                    : `Add Rs. ${amountToFreeDelivery.toLocaleString()} for Free Delivery`}
                </span>
                <span className="text-emerald-800 font-bold">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full bg-emerald-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore fresh organic apricots, Shilajit, walnuts, and mountain honey direct from Gilgit-Baltistan.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs shadow-sm hover:bg-emerald-900 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const effectivePrice =
                  item.product.salePrice != null && item.product.salePrice < item.product.price
                    ? item.product.salePrice
                    : item.product.price;

                const img =
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0]
                    : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80"
                  >
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 transition p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Per {item.product.unit || 'Pack'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity adjust */}
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-stone-900">
                          Rs. {(effectivePrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                    ) : (
                      `Rs. ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total (PKR)</span>
                  <span className="text-base text-emerald-900">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                id="btn-drawer-checkout"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Cash on Delivery & Direct Bank Transfer Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
