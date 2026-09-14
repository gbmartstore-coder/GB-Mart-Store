import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, ShieldCheck, UserCheck, Mail, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../admin-system/firebase';
import { useStore } from '../admin-system/StoreContext';
import { UserProfile } from '../admin-system/AdminTypes';

export const AdminCustomers: React.FC = () => {
  const { orders = [], settings } = useStore();
  const safeOrders = orders || [];
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const currency = settings?.currency || 'Rs.';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        list.push({ uid: d.id, ...(d.data() as Omit<UserProfile, 'uid'>) });
      });
      setUsersList(list);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (
      window.confirm(
        `Change role for ${user.email} from "${user.role}" to "${newRole}"?`
      )
    ) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          role: newRole,
          updatedAt: new Date().toISOString(),
        });
        setUsersList((prev) =>
          prev.map((u) => (u.uid === user.uid ? { ...u, role: newRole } : u))
        );
        setSuccessMsg(`Role updated to ${newRole} for ${user.email}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Error changing role:', err);
        alert('Failed to update user role.');
      }
    }
  };

  // Merge registered users with orders stats
  const customerStats = useMemo(() => {
    return usersList
      .filter((u) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      })
      .map((u) => {
        const userOrders = safeOrders.filter((o) => o.customerId === u.uid);
        const totalSpent = userOrders
          .filter((o) => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          ...u,
          orderCount: userOrders.length,
          totalSpent,
        };
      });
  }, [usersList, safeOrders, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Customer Accounts & Roles</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Registered profiles in Cloud Firestore, order history metrics, and role management
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
        >
          Refresh Users List
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by full name or email address..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer Name & Email</th>
                <th className="py-3.5 px-4">Access Role</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : customerStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No customer accounts found.
                  </td>
                </tr>
              ) : (
                customerStats.map((cust) => (
                  <tr key={cust.uid} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{cust.name}</span>
                      <span className="text-[11px] text-stone-500">{cust.email}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          cust.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {cust.role === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>Store Admin</span>
                          </>
                        ) : (
                          <span>Customer</span>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      {cust.orderCount} orders
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {currency} {cust.totalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {cust.createdAt
                        ? new Date(cust.createdAt).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(cust)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          cust.role === 'admin'
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cust.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
