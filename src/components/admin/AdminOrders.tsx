import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  X,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus } from '../../services/db';
import emailjs from '@emailjs/browser';
const EMAILJS_SERVICE_ID = 'service_6yz2hxo';
const EMAILJS_TEMPLATE_ID = 'template_wc5qszb';
const EMAILJS_PUBLIC_KEY = 'cIzwMXnJEQ4lCOQMX';
interface AdminOrdersProps {
  orders: Order[];
}

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search) ||
      order.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
  setUpdatingId(orderId);

  try {
    const order = orders.find((o) => o.id === orderId);

    await updateOrderStatus(orderId, newStatus);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    const statusMessages: Record<OrderStatus, string> = {
  Pending: 'Your order has been received and is awaiting confirmation.',
  Confirmed: 'Great news! Your order has been confirmed and will be processed shortly.',
  Processing: 'Your order is currently being prepared for dispatch.',
  Shipped: 'Your order has been shipped and is on its way to you.',
  Delivered: 'Your order has been successfully delivered. Thank you for shopping with GB Mart Store!',
  Cancelled: 'Your order has been cancelled. If you have any questions, please contact GB Mart Store.',
};
const statusHeadings: Record<OrderStatus, string> = {
  Pending: 'Your Order Is Pending',
  Confirmed: 'Your Order Has Been Confirmed!',
  Processing: 'Your Order Is Being Processed!',
  Shipped: 'Your Order Has Been Shipped!',
  Delivered: 'Order Delivered Successfully!',
  Cancelled: 'Your Order Has Been Cancelled',
};
    if (order?.email) {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          email: order.email,
          customer_name: order.customerName,
          order_id: order.id,
          order_status: newStatus,
          status_message: statusMessages[newStatus],
          status_heading: statusHeadings[newStatus],
          payment_method: order.paymentMethod,
          order_items: order.items
            .map(
              (item) =>
                `${item.name} × ${item.quantity} — Rs. ${(
                  item.price * item.quantity
                ).toLocaleString()}`
            )
            .join('\n'),
          subtotal: order.subtotal.toLocaleString(),
          delivery_charges: order.deliveryCharges.toLocaleString(),
          total: order.total.toLocaleString(),
          phone: order.phone,
          address: order.address,
        },
        EMAILJS_PUBLIC_KEY
      );
    }
  } catch (err: any) {
  console.error('Error updating status:', err);
  console.error('EmailJS status:', err?.status);
  console.error('EmailJS text:', err?.text);
  alert(
    `Status updated, but email failed: ${err?.status || ''} ${err?.text || err?.message || 'Unknown error'}`
  );
} finally {
    setUpdatingId(null);
  }
};

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
            <Package className="w-3 h-3" />
            Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
            <Truck className="w-3 h-3" />
            Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-stone-900">Orders Management</h2>
        <p className="text-xs text-stone-500">
          Process customer orders, update delivery progress, and view dispatch records.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, address, or Order ID..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3">Total (PKR)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4 text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-stone-800">
                        {order.customerName}
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                        {order.phone}
                      </td>

                      <td className="py-3.5 px-3 text-stone-500">
                        {itemCount} pkgs
                      </td>

                      <td className="py-3.5 px-3 font-bold text-emerald-900">
                        Rs. {order.total.toLocaleString()}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition font-semibold text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-serif font-bold">
                  GB
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    Order Details #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {/* Status and Action bar */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-500 block">Current Status</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-700">Update Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 bg-white"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2 text-xs">
                  <span className="font-bold text-stone-700 uppercase tracking-wider block text-[10px]">
                    Customer Information
                  </span>
                  <div className="font-semibold text-stone-900 text-sm">
                    {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
  <span>✉</span>
  <span>{selectedOrder.email}</span>
</div>
                  <div className="text-stone-400 text-[11px]">
                    Customer ID: {selectedOrder.customerId}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2 text-xs">
                  <span className="font-bold text-stone-700 uppercase tracking-wider block text-[10px]">
                    Delivery Destination
                  </span>
                  <div className="flex items-start gap-1.5 text-stone-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{selectedOrder.address}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 pt-1">
                    Payment: <span className="font-semibold text-stone-800">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
              {/* Payment Proof */}
{selectedOrder.paymentScreenshotUrl && (
  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
    <span className="font-bold text-stone-700 uppercase tracking-wider block text-[10px] mb-3">
      Payment Proof
    </span>

    <a
      href={selectedOrder.paymentScreenshotUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={selectedOrder.paymentScreenshotUrl}
        alt="Customer Payment Proof"
        className="w-full max-h-80 object-contain rounded-xl border border-stone-200 bg-white cursor-pointer hover:opacity-90 transition"
      />
    </a>

    <p className="text-[11px] text-stone-500 mt-2">
      Click the screenshot to view full size.
    </p>
  </div>
)}
              {/* Customer notes */}
              {selectedOrder.notes && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Special Instructions from Customer:</span>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Purchased Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Purchased Items
                </h4>
                <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-stone-50/50">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                          />
                        )}
                        <div>
                          <span className="font-bold text-stone-900 block">{item.name}</span>
                          <span className="text-[11px] text-stone-400">
                            Unit: {item.unit} • Rs. {item.price.toLocaleString()} each
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-medium text-stone-500 block">Qty: {item.quantity}</span>
                        <span className="font-bold text-stone-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges:</span>
                  <span>
                    {selectedOrder.deliveryCharges === 0
                      ? 'FREE'
                      : `Rs. ${selectedOrder.deliveryCharges.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                  <span>Grand Total Payable:</span>
                  <span className="text-emerald-900 text-base">
                    Rs. {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 text-white text-xs font-semibold hover:bg-stone-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
