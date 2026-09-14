import React from 'react';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ShoppingBag,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useStore } from '../admin-system/StoreContext';
import { AdminSection } from './AdminLayout';

interface AdminDashboardProps {
  onNavigate: (section: AdminSection) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { products = [], orders = [], categories = [], settings } = useStore();

  const currency = settings?.currency || 'Rs.';

  const safeProducts = products || [];
  const safeOrders = orders || [];

  // Metrics calculations
  const totalProducts = safeProducts.length;
  const activeProducts = safeProducts.filter((p) => p.active).length;
  const outOfStockProducts = safeProducts.filter((p) => p.stock <= 0).length;
  const lowStockProducts = safeProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const totalOrders = safeOrders.length;
  const pendingOrders = safeOrders.filter((o) => o.status === 'Pending').length;

  // Derive unique customers from orders (or users)
  const uniqueCustomerEmails = new Set(safeOrders.map((o) => o.phone || o.customerName));
  const totalCustomers = Math.max(uniqueCustomerEmails.size, 1);

  // Total sales (from non-cancelled orders)
  const totalSales = safeOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Recent 5 orders
  const recentOrders = [...safeOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Sales',
      value: `${currency} ${totalSales.toLocaleString()}`,
      sub: 'Excluding cancelled orders',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      sub: `${pendingOrders} Pending fulfillment`,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      sub: `${activeProducts} Active in catalog`,
      icon: Package,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      sub: 'Active buyers across regions',
      icon: Users,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Active Products',
      value: activeProducts,
      sub: `${totalProducts - activeProducts} Inactive / hidden`,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      sub: 'Needs immediate restock',
      icon: AlertCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Low Stock (<5 units)',
      value: lowStockProducts,
      sub: 'Running low in warehouse',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      sub: 'Awaiting confirmation',
      icon: Clock,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Store Overview & Operations</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time data synchronization with Google Cloud Firestore
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Orders</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-start justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-stone-500">{stat.title}</span>
                <p className="text-2xl font-extrabold text-stone-900 mt-1">{stat.value}</p>
                <p className="text-[11px] text-stone-400 mt-1">{stat.sub}</p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">Recent Customer Orders</h3>
                <p className="text-xs text-stone-500">Live order queue from store checkout</p>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No orders received yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50">
                        <td className="py-3 font-mono font-medium text-stone-800">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-3 font-semibold text-stone-900">
                          {order.customerName}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : order.status === 'Shipped'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-stone-900">
                          {currency} {order.total.toLocaleString()}
                        </td>
                        <td className="py-3 text-stone-500 text-right">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Attention / Stock Alerts */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-1">Inventory Attention</h3>
            <p className="text-xs text-stone-500 mb-4">Products requiring immediate restock</p>

            <div className="space-y-3">
              {products
                .filter((p) => p.stock <= 5)
                .slice(0, 5)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          prod.images?.[0] ||
                          'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-xl bg-stone-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-stone-500">{prod.unit}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        prod.stock <= 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prod.stock <= 0 ? 'Out of stock' : `${prod.stock} left`}
                    </span>
                  </div>
                ))}

              {products.filter((p) => p.stock <= 5).length === 0 && (
                <div className="py-8 text-center text-xs text-emerald-700 font-medium">
                  ✓ All products have healthy warehouse stock.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="mt-4 w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
          >
            Update Inventory Stocks
          </button>
        </div>
      </div>
    </div>
  );
};
