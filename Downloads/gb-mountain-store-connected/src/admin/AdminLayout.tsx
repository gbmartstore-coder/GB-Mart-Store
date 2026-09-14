import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ListTree,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Settings,
  Mountain,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../admin-system/AuthContext';
import { useStore } from '../admin-system/StoreContext';

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'subcategories'
  | 'orders'
  | 'customers'
  | 'banners'
  | 'settings';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onBackToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onSelectSection,
  onBackToStore,
  children,
}) => {
  const { user, profile, logout } = useAuth();
  const { settings } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems: Array<{
    id: AdminSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'subcategories', label: 'Subcategories', icon: ListTree },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/assets/logo.png" alt="Brand logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Admin Console</h1>
            <p className="text-[10px] text-emerald-400">GB Mountain Store</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white bg-stone-800 text-xs flex items-center gap-1"
          >
            <Store className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white bg-stone-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-stone-900 text-stone-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col md:w-64 md:shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
              <img src="/assets/logo.png" alt="Brand logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white leading-none">
                Admin Console
              </span>
              <span className="text-[11px] font-medium text-emerald-400">
                {settings?.storeName || 'GB Mountain Store'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Management Sections
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  onSelectSection(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-stone-800/60 text-xs">
            <p className="text-[11px] text-stone-400 font-medium">Logged in Admin</p>
            <p className="text-white font-semibold truncate text-xs">
              {profile?.name || user?.email}
            </p>
          </div>

          <button
            id="admin-sidebar-back-to-store-btn"
            onClick={onBackToStore}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>View Customer Store</span>
          </button>

          <button
            onClick={async () => {
              await logout();
              onBackToStore();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-stone-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Admin Content View */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar for desktop */}
        <div className="hidden md:flex items-center justify-between bg-white border-b border-stone-200 px-8 py-4 sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-stone-900 capitalize">
              {currentSection} Management
            </h1>
            <p className="text-xs text-stone-500">
              Cloud Firestore Realtime Sync • GB Mountain Store
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
            >
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Customer Website</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
