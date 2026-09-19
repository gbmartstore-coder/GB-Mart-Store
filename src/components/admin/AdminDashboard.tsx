import React from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Product, Order, UserProfile, Category } from '../../types';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  categories: Category[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  users,
  onNavigateTab,
}) => {
  // Calculations
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length || users.length;

  const totalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const recentOrders = orders.slice(0, 5);
  const lowStockItems = products.filter((p) => p.stock <= 5).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1c2e24] via-[#243d30] to-[#1c2e24] text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Master Admin Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-2">
            Gilgit-Baltistan Store Overview
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
            Real-time synchronization across Cloud Firestore, Authentication, and Customer Storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
          >
            Add New Product
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold backdrop-blur-sm transition"
          >
            View Pending Orders ({pendingOrders})
          </button>
        </div>
      </div>

      {/* 8 Required Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-emerald-700/40 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{totalProducts}</div>
          <span className="text-[11px] text-stone-400 mt-1 block">In catalog</span>
        </div>

        {/* Metric 2: Active Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-emerald-700/40 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Products</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900">{activeProducts}</div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Visible to customers</span>
        </div>

        {/* Metric 3: Out of Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-rose-400 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{outOfStockProducts}</div>
          <span className="text-[11px] text-rose-500 mt-1 block font-medium">Needs restocking</span>
        </div>

        {/* Metric 4: Low Stock Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock (≤5)</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{lowStockProducts}</div>
          <span className="text-[11px] text-stone-400 mt-1 block">Critical inventory</span>
        </div>

        {/* Metric 5: Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-emerald-700/40 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{totalOrders}</div>
          <span className="text-[11px] text-stone-400 mt-1 block">Recorded in Firestore</span>
        </div>

        {/* Metric 6: Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{pendingOrders}</div>
          <span className="text-[11px] text-amber-800 mt-1 block font-medium">Action required</span>
        </div>

        {/* Metric 7: Total Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-emerald-700/40 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{totalCustomers}</div>
          <span className="text-[11px] text-stone-400 mt-1 block">Registered profiles</span>
        </div>

        {/* Metric 8: Total Sales */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm cursor-pointer hover:border-emerald-700/40 transition"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            Rs. {totalSales.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Gross revenue</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">Recent Store Orders</h3>
              <p className="text-xs text-stone-500">Live feed from customer checkouts</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              No orders placed yet. As customers check out, their orders appear here in real-time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/60">
                      <td className="py-3 font-semibold text-stone-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 text-stone-700">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-[10px] text-stone-400">{order.phone}</div>
                      </td>
                      <td className="py-3 text-stone-500">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="py-3 font-bold text-stone-900">
                        Rs. {order.total.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'Pending'
                              ? 'bg-amber-100 text-amber-900'
                              : order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-900'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Quick Sourcing (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif mb-1">Inventory Warnings</h3>
            <p className="text-xs text-stone-500">Items requiring restocking from Hunza/Skardu</p>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>All mountain store inventory is at healthy stock levels.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <h4 className="font-semibold text-xs text-stone-900 truncate">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] text-stone-500">
                      Per {prod.unit || 'Pack'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      prod.stock <= 0
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {prod.stock <= 0 ? 'Out of Stock' : `${prod.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <span>Manage All Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
