import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  CheckCircle, 
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../config/brandConfig';

const PAKISTANI_CITIES = [
  'Islamabad',
  'Lahore',
  'Karachi',
  'Rawalpindi',
  'Gilgit',
  'Skardu',
  'Peshawar',
  'Quetta',
  'Faisalabad',
  'Multan',
  'Abbottabad',
  'Sialkot',
  'Gujranwala',
  'Hunza (Aliabad/Karimabad)',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Mardan',
  'Muzaffarabad',
  'Mirpur (AJK)',
  'Other City',
];

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
];

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    subtotal, 
    discount, 
    couponCode,
    createOrder, 
    navigateTo,
    currentUser
  } = useShop();

  const [fullName, setFullName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [city, setCity] = useState(currentUser.city || 'Islamabad');
  const [customCity, setCustomCity] = useState('');
  const [province, setProvince] = useState(currentUser.province || 'Islamabad Capital Territory');
  const [postalCode, setPostalCode] = useState('44000');
  const [orderNotes, setOrderNotes] = useState('');

  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery calculation
  const standardFee = subtotal >= BRAND_CONFIG.freeShippingThreshold ? 0 : BRAND_CONFIG.standardShippingFee;
  const deliveryCost = deliveryMethod === 'Express' ? BRAND_CONFIG.expressShippingFee : standardFee;
  const grandTotal = Math.max(0, subtotal + deliveryCost - discount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city) {
      alert('Please fill in all mandatory delivery details.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const finalCity = city === 'Other City' ? customCity || 'Other City' : city;
      createOrder({
        customer: {
          fullName,
          phone,
          email,
          address,
          city: finalCity,
          province,
          postalCode,
          orderNotes,
        },
        deliveryMethod,
        paymentMethod,
      });
      setIsSubmitting(false);
      navigateTo('order-success');
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-sm text-[#596561]">Your cart is empty. Please add items before checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Breadcrumb Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A1F1D]">
            Nationwide Checkout
          </h1>
          <p className="text-xs text-[#6D4C2B] mt-0.5">
            Safe & fast delivery to any doorstep in Pakistan
          </p>
        </div>
        <button
          onClick={() => navigateTo('cart')}
          className="text-xs font-bold text-[#1E3A2F] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Basket
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Delivery Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact & Customer Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-2 border-b border-[#F0EAE0] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white text-xs flex items-center justify-center font-sans">
                1
              </span>
              Recipient Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Pakistani Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
                <span className="text-[10px] text-[#8C6239]">Used by courier for delivery coordination</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
                <span className="text-[10px] text-[#8C6239]">For order invoice and shipment tracking</span>
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-2 border-b border-[#F0EAE0] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white text-xs flex items-center justify-center font-sans">
                2
              </span>
              Shipping Address in Pakistan
            </h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Complete Street Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="House / Apartment #, Street #, Sector / Area name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#272F2C]">
                    City <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5CBB8] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {city === 'Other City' && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-[#272F2C]">Specify City Name:</label>
                    <input
                      type="text"
                      placeholder="Enter your city / town"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D5CBB8] text-xs"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-[#272F2C]">
                    Province / Region <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D5CBB8] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                  >
                    {PROVINCES.map((pr) => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#272F2C]">Postal Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 44000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-bold text-[#272F2C]">
                  Delivery Instructions / Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Special landmark near your home, preferred delivery timing, or gift instructions..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-2 border-b border-[#F0EAE0] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white text-xs flex items-center justify-center font-sans">
                3
              </span>
              Delivery Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setDeliveryMethod('Standard')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'Standard'
                    ? 'border-[#1E3A2F] bg-[#FAF9F5]'
                    : 'border-[#E8E2D5] bg-white hover:border-[#D5CBB8]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-xs sm:text-sm text-[#1A1F1D] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#2D5A44]" />
                      Standard Courier Delivery
                    </p>
                    <p className="text-[11px] text-[#6D4C2B]">
                      3 to 5 business days across Pakistan
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'Standard'}
                    onChange={() => setDeliveryMethod('Standard')}
                    className="accent-[#1E3A2F] mt-1"
                  />
                </div>
                <p className="mt-3 text-xs font-bold text-[#1E3A2F]">
                  {standardFee === 0 ? 'FREE (Special Offer)' : BRAND_CONFIG.currency.format(standardFee)}
                </p>
              </label>

              <label
                onClick={() => setDeliveryMethod('Express')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'Express'
                    ? 'border-[#1E3A2F] bg-[#FAF9F5]'
                    : 'border-[#E8E2D5] bg-white hover:border-[#D5CBB8]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-xs sm:text-sm text-[#1A1F1D] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#8C6239]" />
                      Express Air Dispatch
                    </p>
                    <p className="text-[11px] text-[#6D4C2B]">
                      1 to 2 business days priority routing
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'Express'}
                    onChange={() => setDeliveryMethod('Express')}
                    className="accent-[#1E3A2F] mt-1"
                  />
                </div>
                <p className="mt-3 text-xs font-bold text-[#8C6239]">
                  {BRAND_CONFIG.currency.format(BRAND_CONFIG.expressShippingFee)}
                </p>
              </label>
            </div>
          </div>

          {/* 4. Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-2 border-b border-[#F0EAE0] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2F] text-white text-xs flex items-center justify-center font-sans">
                4
              </span>
              Payment Option
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-xl border-2 cursor-pointer block transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#1E3A2F] bg-[#FAF9F5]'
                    : 'border-[#E8E2D5] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#1E3A2F]">
                      <Banknote className="w-5 h-5 text-[#2D5A44]" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#1A1F1D]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-[#6D4C2B]">
                        Pay in cash to the delivery rider at your doorstep anywhere in Pakistan.
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="accent-[#1E3A2F]"
                  />
                </div>
              </label>

              {/* Online Payment Provider Ready */}
              <label
                onClick={() => setPaymentMethod('Online Payment')}
                className={`p-4 rounded-xl border-2 cursor-pointer block transition-all ${
                  paymentMethod === 'Online Payment'
                    ? 'border-[#1E3A2F] bg-[#FAF9F5]'
                    : 'border-[#E8E2D5] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EFE9DD] flex items-center justify-center text-[#1E3A2F]">
                      <CreditCard className="w-5 h-5 text-[#8C6239]" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#1A1F1D] flex items-center gap-2">
                        <span>Online Digital Payment</span>
                        <span className="bg-[#EAE2D2] text-[#6D4C2B] text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Integration Ready
                        </span>
                      </p>
                      <p className="text-[11px] text-[#6D4C2B]">
                        JazzCash, Easypaisa, Raast Direct, or Debit/Credit Cards.
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={() => setPaymentMethod('Online Payment')}
                    className="accent-[#1E3A2F]"
                  />
                </div>

                {paymentMethod === 'Online Payment' && (
                  <div className="mt-3 pt-3 border-t border-[#E8E2D5] text-xs text-[#596561] space-y-2">
                    <p className="bg-[#F5EFE6] p-3 rounded-lg text-[#6D4C2B]">
                      <strong>Note:</strong> Online payment gateways (e.g. PayFast, Safepay, JazzCash) can be connected seamlessly. For this demonstration, your order will be recorded as Paid and instantly confirmed.
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4 sticky top-28">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-3 border-b border-[#F0EAE0]">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Line items preview */}
            <div className="max-h-64 overflow-y-auto divide-y divide-[#F0EAE0] pr-1 space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-[#F5EFE6] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1A1F1D] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#6D4C2B]">
                      Qty: {item.quantity} {item.selectedWeight ? `• ${item.selectedWeight}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1E3A2F]">
                    {BRAND_CONFIG.currency.format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation rows */}
            <div className="space-y-2 pt-3 border-t border-[#E8E2D5] text-xs text-[#272F2C]">
              <div className="flex justify-between">
                <span className="text-[#6D4C2B]">Subtotal</span>
                <span className="font-bold">{BRAND_CONFIG.currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D4C2B]">Delivery ({deliveryMethod})</span>
                <span className="font-bold">
                  {deliveryCost === 0 ? <span className="text-[#2D5A44]">FREE</span> : BRAND_CONFIG.currency.format(deliveryCost)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2D5A44]">
                  <span>Voucher Discount</span>
                  <span className="font-bold">-{BRAND_CONFIG.currency.format(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#1E3A2F] pt-3 border-t border-[#E8E2D5]">
                <span>Total Payable</span>
                <span>{BRAND_CONFIG.currency.format(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Place Order ({BRAND_CONFIG.currency.format(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-[#6D4C2B] text-center space-y-1 pt-2">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A44]" />
                100% Guaranteed Fresh Mountain Dispatch
              </p>
              <p>You can inspect package upon delivery before courier payment.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
