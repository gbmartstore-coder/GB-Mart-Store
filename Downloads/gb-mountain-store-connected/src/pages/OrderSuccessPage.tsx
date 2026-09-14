import React from 'react';
import { 
  CheckCircle, 
  Mountain, 
  Package, 
  Truck, 
  MapPin, 
  ArrowRight, 
  ShoppingBag,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../config/brandConfig';

export const OrderSuccessPage: React.FC = () => {
  const { lastCompletedOrder, orders, navigateTo } = useShop();

  const order = lastCompletedOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-sm text-[#596561]">No recent order found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-[#FAF9F5] border border-[#E8E2D5] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#E5F2EB] text-[#2D5A44] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#8C6239]">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D] mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-sm font-serif text-[#1E3A2F] italic mt-1">
            "{BRAND_CONFIG.mainTagline}"
          </p>
        </div>

        <p className="text-xs text-[#596561] max-w-lg mx-auto leading-relaxed">
          We have received your order. Our team in Gilgit-Baltistan is preparing your fresh harvest package for nationwide courier dispatch.
        </p>

        {/* Order Meta Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="bg-white border border-[#D5CBB8] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#1A1F1D]">
            Order #{order.id}
          </span>
          <span className="bg-[#EFE9DD] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#6D4C2B]">
            Status: {order.status}
          </span>
          <span className="bg-white border border-[#D5CBB8] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#2D5A44] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            Est. Delivery: {order.deliveryMethod === 'Express' ? '1-2 business days' : '3-5 business days'}
          </span>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="font-serif-heading text-xl font-bold text-[#1A1F1D] pb-3 border-b border-[#F0EAE0]">
          Order Summary & Dispatch Details
        </h2>

        {/* Delivery Address Review */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#272F2C]">
          <div className="space-y-1.5 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E8E2D5]">
            <p className="font-bold text-[#8C6239] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Delivery Address:
            </p>
            <p className="font-bold text-sm text-[#1A1F1D]">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}, {order.customer.province} {order.customer.postalCode}</p>
            <p className="pt-1 text-[#6D4C2B]">Phone: {order.customer.phone}</p>
          </div>

          <div className="space-y-1.5 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E8E2D5]">
            <p className="font-bold text-[#8C6239] uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              Payment & Shipping Method:
            </p>
            <p><strong className="text-[#1A1F1D]">Payment:</strong> {order.paymentMethod}</p>
            <p><strong className="text-[#1A1F1D]">Shipping:</strong> {order.deliveryMethod} Dispatch</p>
            <p><strong className="text-[#1A1F1D]">Packaging:</strong> Aroma Sealed & Tamper Proof</p>
            <p className="pt-1 text-[#2D5A44] font-medium">Tracking SMS will be sent shortly</p>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B]">
            Items in this Package:
          </h3>
          <div className="divide-y divide-[#F0EAE0] border-t border-b border-[#F0EAE0]">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover bg-[#F5EFE6]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1A1F1D]">{item.name}</p>
                    <p className="text-[11px] text-[#6D4C2B]">
                      Qty: {item.quantity} {item.selectedWeight ? `• Weight: ${item.selectedWeight}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1E3A2F]">
                  {BRAND_CONFIG.currency.format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="space-y-2 text-xs text-[#272F2C] pt-2">
          <div className="flex justify-between">
            <span className="text-[#6D4C2B]">Subtotal</span>
            <span className="font-semibold">{BRAND_CONFIG.currency.format(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6D4C2B]">Delivery Charge</span>
            <span className="font-semibold">
              {order.deliveryCharge === 0 ? 'FREE' : BRAND_CONFIG.currency.format(order.deliveryCharge)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#2D5A44]">
              <span>Discount</span>
              <span>-{BRAND_CONFIG.currency.format(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-[#1E3A2F] pt-2 border-t border-[#E8E2D5]">
            <span>Grand Total (Payable upon delivery)</span>
            <span>{BRAND_CONFIG.currency.format(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          Continue Shopping
        </button>
        <button
          onClick={() => navigateTo('account')}
          className="px-6 py-3.5 rounded-xl bg-white border border-[#D5CBB8] hover:border-[#1E3A2F] text-[#1A1F1D] text-xs sm:text-sm font-bold transition-colors flex items-center justify-center"
        >
          View in My Account / Order History
        </button>
      </div>

      {/* Helpline Contact Prompt */}
      <div className="text-center text-xs text-[#8C6239] pt-2 space-y-1">
        <p>Need urgent order modifications or address correction?</p>
        <p>
          WhatsApp or Call customer support at <strong className="text-[#1E3A2F]">{BRAND_CONFIG.contact.phone}</strong> or email <strong className="text-[#1E3A2F]">{BRAND_CONFIG.contact.email}</strong>.
        </p>
      </div>
    </div>
  );
};
