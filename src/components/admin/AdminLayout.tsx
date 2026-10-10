import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ListTree,
  ShoppingCart,
  Users,
  Image,
  Settings,
  ArrowLeft,
  LogOut,
  Mountain,
  Menu,
  X,
  
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'subcategories'
  | 'orders'
  | 'customers'
  | 'banners'
  | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onBackToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onBackToStore,
  children,
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'subcategories', label: 'Subcategories', icon: ListTree },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ] as const;

  

  return (
    <div className="min-h-screen bg-[#f4f2ee] text-stone-900 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1c2e24] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-emerald-900/60 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Mountain className="w-5 h-5 text-emerald-300" />
          <span className="font-serif font-bold text-base">GB Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-200 text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg text-emerald-100 hover:bg-emerald-900"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-[#18281f] text-stone-200 flex flex-col justify-between transition-transform duration-300 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Store Info */}
          <div className="p-6 border-b border-emerald-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
  src={new URL('../../assets/gb-mart-logo.png', import.meta.url).href}
  alt="GB Mart Store"
  className="w-10 h-10 rounded-full object-cover shrink-0"
/>
              <div>
                <span className="font-serif font-bold text-sm tracking-tight text-white block">
                  GB Mart Store
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                  Firestore Backend
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-500/30'
                      : 'text-stone-300 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-4 border-t border-emerald-950/80 space-y-3">
          

          {/* User badge */}
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-xs font-semibold text-white block truncate">
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{userProfile?.role || 'admin'}</span>
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-white/5 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Back to store link */}
          <button
            onClick={onBackToStore}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-stone-200 px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-stone-900 capitalize font-serif">
              {activeTab === 'subcategories' ? 'Product Subcategories' : activeTab}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold">
              Live Firestore Connection
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Customer Website</span>
            </button>
          </div>
        </header>

        

        {/* Tab View Container */}
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
