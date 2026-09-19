import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Mountain,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminSubcategories } from './AdminSubcategories';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminBanners } from './AdminBanners';
import { AdminSettings } from './AdminSettings';
import {
  onProductsSnapshot,
  onCategoriesSnapshot,
  onSubcategoriesSnapshot,
  onOrdersSnapshot,
  onBannersSnapshot,
  onUsersSnapshot,
  getStoreSettings,
} from '../../services/db';
import {
  Product,
  Category,
  Subcategory,
  Order,
  Banner,
  UserProfile,
  StoreSettings,
} from '../../types';
import { INITIAL_SETTINGS } from '../../data/initialData';

interface AdminPortalProps {
  onBackToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToStore }) => {
  const {
    currentUser,
    userProfile,
    isAdmin,
    loading: authLoading,
    loginWithGoogle,
    loginWithEmail,
    makeMeAdmin,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Firestore Live States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  // Admin login credentials state
  const [loginEmail, setLoginEmail] = useState('ibrargd44@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Subscribe to real-time collections when user is authorized admin
  useEffect(() => {
    if (!isAdmin) return;

    const unsubProducts = onProductsSnapshot((data) => setProducts(data));
    const unsubCategories = onCategoriesSnapshot((data) => setCategories(data));
    const unsubSubcategories = onSubcategoriesSnapshot((data) => setSubcategories(data));
    const unsubOrders = onOrdersSnapshot((data) => setOrders(data));
    const unsubBanners = onBannersSnapshot((data) => setBanners(data));
    const unsubUsers = onUsersSnapshot((data) => setUsers(data));

    getStoreSettings().then((s) => setSettings(s));

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSubcategories();
      unsubOrders();
      unsubBanners();
      unsubUsers();
    };
  }, [isAdmin]);

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      await loginWithEmail(loginEmail.trim(), loginPassword);
    } catch (err: unknown) {
      console.error('Admin login error:', err);
      setLoginError('Authentication failed. Check your password or use Google Sign-In.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setLoginError('');
    setLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error('Admin Google sign-in failed:', err);
      setLoginError('Google sign in was cancelled or denied.');
    } finally {
      setLoggingIn(false);
    }
  };

  // If Auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center text-stone-300">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold">Verifying Administrator Permissions...</p>
        </div>
      </div>
    );
  }

  // Not an Admin -> Show Secure Admin Authentication Gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#131d17] text-stone-100 flex flex-col justify-between p-4 sm:p-8">
        {/* Top bar with back to storefront button */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </button>
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400">
            Protected Admin Gate
          </span>
        </div>

        {/* Gate Card */}
        <div className="max-w-md w-full mx-auto bg-stone-900/90 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md my-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Gilgit-Baltistan Admin Access
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Authorized access restricted to users with role <span className="text-emerald-400 font-mono">admin</span> in Firestore.
            </p>
          </div>

          {/* Current user feedback if logged in as customer */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Signed in as customer: {currentUser.email}</span>
              </div>
              <p className="text-stone-300 text-[11px]">
                Your account is currently assigned the customer role. You can grant admin access below:
              </p>
              <button
                onClick={makeMeAdmin}
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow transition"
              >
                Grant Admin Privileges to this Account
              </button>
            </div>
          )}

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleAdminLogin}
            disabled={loggingIn}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs flex items-center justify-center gap-2.5 transition shadow-sm mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Admin Google Account</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-stone-900 px-2 text-stone-500 font-bold">Or Email & Password</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleAdminEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ibrargd44@gmail.com"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-stone-500">
          Gilgit-Baltistan Mountain Store • Cloud Firestore & Firebase Auth Secured
        </div>
      </div>
    );
  }

  // Authorized Admin View
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onBackToStore={onBackToStore}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard
          products={products}
          orders={orders}
          users={users}
          categories={categories}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          categories={categories}
          subcategories={subcategories}
        />
      )}

      {activeTab === 'categories' && (
        <AdminCategories
          categories={categories}
          products={products}
        />
      )}

      {activeTab === 'subcategories' && (
        <AdminSubcategories
          subcategories={subcategories}
          categories={categories}
          products={products}
        />
      )}

      {activeTab === 'orders' && (
        <AdminOrders orders={orders} />
      )}

      {activeTab === 'customers' && (
        <AdminCustomers users={users} />
      )}

      {activeTab === 'banners' && (
        <AdminBanners banners={banners} />
      )}

      {activeTab === 'settings' && (
        <AdminSettings
          settings={settings}
          onSettingsUpdated={setSettings}
        />
      )}
    </AdminLayout>
  );
};
