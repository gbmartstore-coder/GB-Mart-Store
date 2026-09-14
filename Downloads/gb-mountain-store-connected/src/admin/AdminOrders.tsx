import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../admin-system/firebase';
import { useStore } from '../admin-system/StoreContext';
import { Order, OrderStatus } from '../admin-system/AdminTypes';

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrders: React.FC = () => {
  const { orders = [], settings } = useStore();
  const currency = settings?.currency || 'Rs.';

  const safeOrders = orders || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const filteredOrders = useMemo(() => {
    return safeOrders
      .filter((o) => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = (o.id || '').toLowerCase().includes(q);
          const matchName = (o.customerName || '').toLowerCase().includes(q);
          const matchPhone = (o.phone || '').toLowerCase().includes(q);
          const matchAddress = (o.address || '').toLowerCase().includes(q);
          return matchId || matchName || matchPhone || matchAddress;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [safeOrders, statusFilter, searchQuery]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Orders Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track customer deliveries, update fulfillment stages, and review payment methods
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
            {safeOrders.length} Total Orders Received
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="admin-orders-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone number, address, or order ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex gap-2">
          <select
            id="admin-orders-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-stone-900 block">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-stone-500">{order.phone}</span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-700">
                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                      </span>
                      <span className="text-[11px] text-stone-400 block truncate max-w-[160px]">
                        {(order.items || []).map((i) => i.name).join(', ')}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {currency} {order.total.toLocaleString()}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4 text-[11px] text-stone-600 font-medium">
                      {order.paymentMethod}
                    </td>

                    {/* Status dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        disabled={isUpdatingStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border focus:outline-none ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : order.status === 'Shipped'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* View Details */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
            <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-mono">
                  Order #{selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold mt-0.5">Order Fulfillment Details</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Status Selector in Modal */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">
                    Current Fulfillment Status
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600 font-medium">Update Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                  <h4 className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                    Customer Information
                  </h4>
                  <p className="font-semibold text-stone-900 text-sm">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.phone}</span>
                  </p>
                  <p className="text-stone-500">
                    User ID: <span className="font-mono">{selectedOrder.customerId}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                  <h4 className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                    Delivery Destination
                  </h4>
                  <p className="text-stone-700 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.address}</span>
                  </p>
                  <p className="text-stone-600">
                    Payment Method: <strong className="text-stone-900">{selectedOrder.paymentMethod}</strong>
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-stone-600 italic">
                      Notes: "{selectedOrder.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="font-bold text-stone-500 uppercase tracking-wider text-[11px] mb-3">
                  Package Contents ({selectedOrder.items?.length || 0} items)
                </h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-stone-100 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-stone-900">{item.name}</p>
                          <p className="text-[11px] text-stone-500">
                            Unit: {item.unit} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-900">
                          {currency} {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {currency} {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">
                    {currency} {selectedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-stone-900">
                    {currency} {selectedOrder.deliveryCharges.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount Paid / Due:</span>
                  <span className="text-emerald-800 text-base">
                    {currency} {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
