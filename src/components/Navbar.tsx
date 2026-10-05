import React, { useState } from 'react';
import gbMartLogo from '../assets/gb-mart-logo.png';
import {
  Mountain,
  ShoppingBag,
  User,
  Search,
  ShieldAlert,
  Package,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Category, StoreSettings } from '../types';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onNavigateToAdmin: () => void;
  settings: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  onOpenOrders,
  onNavigateToAdmin,
  settings,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Announcement Bar */}
      {settings.announcementText && (
        <div className="bg-emerald-700 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory(null)}>
            <img
  src={gbMartLogo}
  alt="GB Mart Store"
  className="w-14 h-14 rounded-full object-cover shrink-0"
/>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 block leading-tight font-sans">
                {settings.storeName || 'GB Mart Store'}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Authentic Gilgit-Baltistan Products
              </span>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search dry fruits, shilajit, honey, walnuts, almonds..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Panel Button */}
            {isAdmin && (
              <button
                id="btn-admin-portal"
                onClick={onNavigateToAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* My Orders (Desktop) */}
            {currentUser && (
              <button
                id="btn-my-orders"
                onClick={onOpenOrders}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
              >
                <Package className="w-4 h-4 text-emerald-800" />
                <span>My Orders</span>
              </button>
            )}

            {/* User Account */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    id="btn-user-profile-menu"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                      {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-semibold text-stone-900 truncate">
                          {currentUser.displayName || 'Customer'}
                        </p>
                        <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-800">
                          {userProfile?.role || 'Customer'}
                        </span>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigateToAdmin();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-emerald-800 font-semibold"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenOrders();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Purchase Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-stone-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="btn-nav-login"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                >
                  <User className="w-4 h-4 text-stone-600" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              id="btn-open-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#23382c] text-white hover:bg-[#1a2c22] transition shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-amber-400 text-stone-950">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Shilajit, Hunza apricots, walnuts..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
          {isAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrders();
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-stone-700 hover:bg-stone-100 flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-emerald-800" />
              <span>My Orders</span>
            </button>
          )}

          <div className="pt-2 border-t border-stone-100">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectCategory(null);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  selectedCategory === null ? 'bg-emerald-100 text-emerald-900' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold truncate ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
