import React, { useState } from 'react';
import { X, CheckCircle, Truck, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/db';
import { uploadImage } from '../services/storage';
import { OrderItem } from '../types';
import emailjs from '@emailjs/browser';
const EMAILJS_SERVICE_ID = 'service_6yz2hxo';
const EMAILJS_TEMPLATE_ID = 'template_wc5qszb';
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_a3xddf8';
const EMAILJS_PUBLIC_KEY = 'cIzwMXnJEQ4lCOQMX';
interface CheckoutModalProps {
  onOpenOrders: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onOpenOrders }) => {
  const {
    cart,
    subtotal,
    deliveryFee,
    totalAmount,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();
  const { currentUser, userProfile } = useAuth();

  const [customerName, setCustomerName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState('Islamabad');
  const [paymentMethod, setPaymentMethod] = useState<
  'Cash on Delivery' | 'JazzCash' | 'Easypaisa' | 'Bank Transfer'
>('Cash on Delivery');
  const [notes, setNotes] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);
  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please provide your full name, phone number, and complete delivery address.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      let paymentScreenshotUrl = '';

if (paymentMethod !== 'Cash on Delivery' && paymentScreenshot) {
  paymentScreenshotUrl = await uploadImage(
    paymentScreenshot,
    'payment-proofs'
  );
}
      const orderItems: OrderItem[] = cart.map((item) => {
        const effectivePrice =
          item.product.salePrice != null && item.product.salePrice < item.product.price
            ? item.product.salePrice
            : item.product.price;
        return {
          productId: item.product.id,
          name: item.product.name,
          price: effectivePrice,
          quantity: item.quantity,
          image: item.product.images?.[0] || '',
          unit: item.product.unit || 'Pack',
        };
      });

      const customerId = currentUser ? currentUser.uid : `guest_${Date.now()}`;
      const fullAddress = `${address.trim()}, ${city.trim()}`;

      const newOrderId = await createOrder({
        customerId,
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: fullAddress,
        items: orderItems,
        subtotal,
        deliveryCharges: deliveryFee,
        total: totalAmount,
        paymentMethod,
        paymentScreenshotUrl,
        status: 'Pending',
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
     try {
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      email: email.trim(),
      customer_name: customerName.trim(),
      order_id: newOrderId,
      order_status: 'Pending',
      payment_method: paymentMethod,
      order_items: orderItems
        .map(
          (item) =>
            `${item.name} × ${item.quantity} — Rs. ${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join('\n'),
      subtotal: subtotal.toLocaleString(),
      delivery_charges: deliveryFee.toLocaleString(),
      total: totalAmount.toLocaleString(),
      phone: phone.trim(),
      address: fullAddress,
    },
    EMAILJS_PUBLIC_KEY
  );

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_ADMIN_TEMPLATE_ID,
    {
      email: email.trim(),
      customer_name: customerName.trim(),
      order_id: newOrderId,
      order_status: 'Pending',
      payment_method: paymentMethod,
      order_items: orderItems
        .map(
          (item) =>
            `${item.name} × ${item.quantity} — Rs. ${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join('\n'),
      subtotal: subtotal.toLocaleString(),
      delivery_charges: deliveryFee.toLocaleString(),
      total: totalAmount.toLocaleString(),
      phone: phone.trim(),
      address: fullAddress,
    },
    EMAILJS_PUBLIC_KEY
  );
} catch (emailError) {
  console.warn(
    'Order saved successfully, but email notification failed:',
    emailError
  );
}     setPlacedOrderTotal(subtotal + deliveryFee);
      setPlacedOrderId(newOrderId);
      clearCart();
    } catch (err: any) {
  console.error('Failed to submit order:', err);
  console.error('EmailJS status:', err?.status);
  console.error('EmailJS text:', err?.text);
  const errorCode = err?.code || 'unknown-error';
  const errorText = err?.message || String(err);

  setErrorMessage(`Order failed: ${errorCode} - ${errorText}`);
} finally {
  setSubmitting(false);
}
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setPlacedOrderId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              {placedOrderId ? 'Order Confirmed!' : 'Checkout & Delivery Details'}
            </h2>
            <p className="text-xs text-stone-500">
              {placedOrderId
                ? 'Thank you for supporting Gilgit-Baltistan mountain farmers & artisans.'
                : 'Fast delivery with reliable packaging across all Pakistan cities.'}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {placedOrderId ? (
            /* Success View */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-serif mb-2">
                Order #{placedOrderId.slice(0, 8).toUpperCase()} Placed!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                Your order has been recorded into our Firestore system with status <span className="font-semibold text-emerald-800">Pending</span>. Our team will contact you via WhatsApp/SMS to dispatch your mountain harvest.
              </p>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-2 mb-6 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer:</span>
                  <span className="font-semibold text-stone-900">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-semibold text-stone-900">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span className="font-semibold text-stone-900">{paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold">
                  <span className="text-stone-700">Total Payable:</span>
                  <span className="text-emerald-900 text-sm">Rs. {placedOrderTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    onOpenOrders();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md transition"
                >
                  View in My Orders
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order Summary Snapshot */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Total Items</span>
                  <span className="text-sm font-bold text-stone-900">
                    {cart.reduce((s, i) => s + i.quantity, 0)} packages
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Total to Pay</span>
                  <span className="text-lg font-bold text-emerald-900">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Contact & Shipping Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Recipient & Delivery Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ali Ahmed Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number (WhatsApp preferred) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                    />
                  </div>
                </div>
                 <div>
  <label className="block text-xs font-semibold text-stone-700 mb-1">
    Email Address *
  </label>
  <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="e.g. customer@gmail.com"
    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm"
  />
</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Complete Street Address / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 14, Street 2, Sector F-7/2"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Islamabad, Lahore, Karachi, Gilgit"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, leave with neighbor if unavailable"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/10'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-stone-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] text-stone-500">Pay when order reaches your door</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/10'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-stone-900 block">
                        Online / Bank Transfer
                      </span></div>
                      
                                        </label>

                  <label
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'JazzCash'
                        ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/10'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="font-semibold text-xs text-stone-900 block">
                        JazzCash
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Pay securely via JazzCash
                      </span>
                    </div>
                  </label>
                                    <label
                    onClick={() => setPaymentMethod('Easypaisa')}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'Easypaisa'
                        ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/10'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="font-semibold text-xs text-stone-900 block">
                        Easypaisa
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Pay securely via Easypaisa
                      </span>
                    </div>
                  </label>
                </div>
              </div>
                            {paymentMethod === 'JazzCash' && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <h4 className="text-sm font-bold text-emerald-900 mb-3">
                    JazzCash Payment Details
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">Account Title:</span>
                      <span className="font-semibold text-stone-900">
                        Ibrar Ahmad
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">JazzCash Number:</span>
                      <span className="font-semibold text-stone-900">
                        03120291701
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-3">
                    Please send the payment before confirming your order.
                  </p>
                </div>
              )}
                            {paymentMethod === 'Bank Transfer' && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <h4 className="text-sm font-bold text-emerald-900 mb-3">
                    Bank Transfer Details
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">Bank Name:</span>
                      <span className="font-semibold text-stone-900 text-right">
                        Meezan Bank Limited
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">Account Title:</span>
                      <span className="font-semibold text-stone-900 text-right">
                        Ibrar Ahmad
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">Account Number:</span>
                      <span className="font-semibold text-stone-900 text-right">
                        02160107093720
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">IBAN:</span>
                      <span className="font-semibold text-stone-900 text-right break-all">
                        PK28MEZN0002160107093720
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-3">
                    Please send the payment before confirming your order.
                  </p>
                </div>
              )}
                            {paymentMethod === 'Easypaisa' && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <h4 className="text-sm font-bold text-emerald-900 mb-3">
                    Easypaisa Payment Details
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">Account Title:</span>
                      <span className="font-semibold text-stone-900">
                        Ibrar Ahmad
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500">Easypaisa Number:</span>
                      <span className="font-semibold text-stone-900">
                        03120291701
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-3">
                    Please send the payment before confirming your order.
                  </p>
                </div>
              )}
              {/* Submit Button */}
               

              {/* Submit Button */}
              {paymentMethod !== 'Cash on Delivery' && (
  <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50">
    <label className="block text-xs font-bold text-stone-700 mb-2">
      Upload Payment Screenshot *
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setPaymentScreenshot(file);
      }}
      className="block w-full text-xs text-stone-600
        file:mr-4 file:py-2.5 file:px-4
        file:rounded-lg file:border-0
        file:text-xs file:font-semibold
        file:bg-emerald-100 file:text-emerald-800
        hover:file:bg-emerald-200
        file:cursor-pointer"
    />

    {paymentScreenshot && (
      <p className="mt-2 text-xs text-emerald-700 font-medium">
        ✓ {paymentScreenshot.name}
      </p>
    )}

    <p className="mt-2 text-[11px] text-stone-500">
      Upload a screenshot of your completed payment.
    </p>
  </div>
)}
              <div className="pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {submitting ? 'Submitting to Firestore...' : `Confirm Order • Rs. ${totalAmount.toLocaleString()}`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-stone-400 mt-2">
                  Orders are processed securely and tracked in our real-time Firestore database.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
