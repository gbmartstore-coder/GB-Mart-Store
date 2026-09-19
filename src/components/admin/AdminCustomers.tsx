import React, { useState } from 'react';
import { Users, Shield, Search, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import { UserProfile } from '../../types';
import { setUserProfile } from '../../services/db';

interface AdminCustomersProps {
  users: UserProfile[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ users }) => {
  const [search, setSearch] = useState('');
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      (u.displayName && u.displayName.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term))
    );
  });

  const handleRoleToggle = async (user: UserProfile) => {
    const nextRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change role of ${user.displayName || user.email} to "${nextRole}"?`)) {
      return;
    }

    setUpdatingUid(user.uid);
    try {
      await setUserProfile({
        ...user,
        role: nextRole,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to change role:', err);
      alert('Could not update user role in Firestore.');
    } finally {
      setUpdatingUid(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-serif text-stone-900">Registered Users & Customers</h2>
        <p className="text-xs text-stone-500">
          Customer accounts and administrator privileges stored in Firestore `/users` collection.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email address, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>
        <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
          {filteredUsers.length} profiles
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No customer accounts match your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-6 font-semibold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                          {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span>{user.displayName || 'Customer'}</span>
                          <span className="text-[10px] text-stone-400 block font-mono">
                            UID: {user.uid.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.role === 'admin'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {user.role === 'admin' && <Shield className="w-3 h-3 text-emerald-700" />}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        disabled={updatingUid === user.uid}
                        className="px-3 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-[11px] font-semibold text-stone-700 transition disabled:opacity-50"
                      >
                        {user.role === 'admin' ? 'Make Customer' : 'Grant Admin'}
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
