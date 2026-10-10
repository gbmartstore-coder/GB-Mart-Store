import React, { useEffect, useState } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { onCustomerOrdersSnapshot } from '../services/db';
import { Order, OrderStatus } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onCustomerOrdersSnapshot(
      currentUser.uid,
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching customer orders:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Package className="w-3 h-3" />
            Packing in Gilgit
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Truck className="w-3 h-3" />
            In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif">My Purchase Orders</h2>
              <p className="text-xs text-stone-500">Live order tracking from Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!currentUser ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-500">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">Please Sign In</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5">
                Sign in with your email or Google account to view your past and current mountain store orders.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs shadow-sm hover:bg-emerald-900 transition"
              >
                Sign In Now
              </button>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-sm text-stone-500">
              Loading your orders from Firestore...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5">
                Your completed orders will appear here with live tracking updates.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs shadow-sm"
              >
                Browse Mountain Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                   <div className="text-right">
  <span className="text-[10px] text-stone-500 font-medium">
    {order.paymentMethod}
  </span>
</div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-stone-800">{item.name}</span>
                          <span className="text-stone-400">× {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-stone-700">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                   <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
  <div className="flex justify-between text-xs text-stone-600">
    <span>Subtotal</span>
    <span>Rs. {order.subtotal.toLocaleString()}</span>
  </div>

  <div className="flex justify-between text-xs text-stone-600">
    <span>Delivery Charges</span>
    <span>Rs. {order.deliveryCharges.toLocaleString()}</span>
  </div>

  <div className="flex justify-between items-center border-t border-stone-200 pt-2">
    <span className="text-sm font-bold text-stone-900">
      Grand Total
    </span>
    <span className="text-base font-bold text-emerald-800">
      Rs. {order.total.toLocaleString()}
    </span>
  </div>
</div>
                  {/* Shipping Address */}
                  <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
                    <span>Delivering to: <span className="text-stone-700 font-medium">{order.address}</span></span>
                    <span>Contact: <span className="text-stone-700 font-medium">{order.phone}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
