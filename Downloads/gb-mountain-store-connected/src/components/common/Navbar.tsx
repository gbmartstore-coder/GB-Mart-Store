import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Mountain, 
  ChevronDown, 
  Sparkles,
  Phone,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { ProductCategory } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    navigateTo, 
    cartCount, 
    wishlistCount, 
    setIsCartDrawerOpen, 
    isSearchOpen, 
    setIsSearchOpen,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  const handleNav = (view: string, category?: ProductCategory) => {
    navigateTo(view, undefined, category);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E3A2F] text-[#F5EFE6] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <p className="font-medium tracking-wide">
              Authentic Harvest from Gilgit-Baltistan • Delivered Nationwide Across Pakistan
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#E5D7C1] font-light">
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              100% Guaranteed Authenticity
            </span>
            <span className="inline-flex items-center gap-1 font-normal">
              Free Delivery on orders over Rs. 3,000
            </span>
            <button 
              onClick={() => handleNav('admin')}
              className="text-[#D4AF37] hover:underline font-medium ml-1"
              title="View Admin Portal Mockup"
            >
              [Admin View]
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-[#1E3A2F] hover:bg-[#EFE9DD] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                <img src="/assets/logo.png" alt={BRAND_CONFIG.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1E3A2F]">
                    {BRAND_CONFIG.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#EAE2D2] text-[#6D4C2B] px-1.5 py-0.5 rounded">
                    GB
                  </span>
                </div>
                <p className="text-[10px] tracking-wider text-[#6D4C2B] uppercase font-medium hidden sm:block">
                  Mountains of Gilgit-Baltistan
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium text-[#272F2C]">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'home' ? 'text-[#1E3A2F] font-bold bg-[#EFE9DD]' : 'hover:text-[#1E3A2F] hover:bg-[#F3EFE6]'
              }`}
            >
              Home
            </button>

            {/* Shop with Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => handleNav('shop', 'all')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  currentView === 'shop' ? 'text-[#1E3A2F] font-bold bg-[#EFE9DD]' : 'hover:text-[#1E3A2F] hover:bg-[#F3EFE6]'
                }`}
              >
                Shop All
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {shopDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 rounded-xl bg-white shadow-xl border border-[#E8E2D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 text-[11px] font-bold text-[#8C6239] uppercase tracking-wider border-b border-[#F0EAE0]">
                    Authentic Categories
                  </div>
                  <button
                    onClick={() => handleNav('shop', 'dry-fruits')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1A1F1D] flex items-center justify-between"
                  >
                    <span>Dry Fruits & Nuts</span>
                    <span className="text-xs text-[#8C6239]">Apricots, Walnuts</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'natural-organic')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1A1F1D] flex items-center justify-between"
                  >
                    <span>Natural & Honey</span>
                    <span className="text-xs text-[#8C6239]">Blossom Honey, Oils</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'shilajit')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1A1F1D] flex items-center justify-between"
                  >
                    <span>Mountain Shilajit</span>
                    <span className="text-xs text-[#C59B27] font-semibold">Gold Grade</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'traditional-wear')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1A1F1D] flex items-center justify-between"
                  >
                    <span>Traditional Wear</span>
                    <span className="text-xs text-[#8C6239]">Shawls, Waistcoats</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'traditional-caps')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1A1F1D] flex items-center justify-between"
                  >
                    <span>Traditional GB Caps</span>
                    <span className="text-xs text-[#8C6239]">Feather Topi</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'handicrafts')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1A1F1D] flex items-center justify-between"
                  >
                    <span>Handicrafts</span>
                    <span className="text-xs text-[#8C6239]">Walnut Wood, Gems</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'gift-boxes')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF9F5] text-[#1E3A2F] font-semibold flex items-center justify-between border-t border-[#F0EAE0]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                      Royal Gift Boxes
                    </span>
                    <span className="text-xs bg-[#F5EFE6] px-1.5 py-0.5 rounded text-[#6D4C2B]">Curated</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('shop', 'dry-fruits')}
              className="px-3 py-2 rounded-lg hover:text-[#1E3A2F] hover:bg-[#F3EFE6] transition-colors"
            >
              Dry Fruits
            </button>
            <button
              onClick={() => handleNav('shop', 'natural-organic')}
              className="px-3 py-2 rounded-lg hover:text-[#1E3A2F] hover:bg-[#F3EFE6] transition-colors"
            >
              Natural Products
            </button>
            <button
              onClick={() => handleNav('shop', 'traditional-wear')}
              className="px-3 py-2 rounded-lg hover:text-[#1E3A2F] hover:bg-[#F3EFE6] transition-colors"
            >
              Traditional Wear
            </button>
            <button
              onClick={() => handleNav('shop', 'handicrafts')}
              className="px-3 py-2 rounded-lg hover:text-[#1E3A2F] hover:bg-[#F3EFE6] transition-colors"
            >
              Handicrafts
            </button>
            <button
              onClick={() => handleNav('shop', 'gift-boxes')}
              className="px-3 py-2 rounded-lg hover:text-[#1E3A2F] hover:bg-[#F3EFE6] transition-colors flex items-center gap-1 text-[#6D4C2B]"
            >
              <span>Gift Boxes</span>
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'about' ? 'text-[#1E3A2F] font-bold bg-[#EFE9DD]' : 'hover:text-[#1E3A2F] hover:bg-[#F3EFE6]'
              }`}
            >
              About Us
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-full text-[#1E3A2F] hover:bg-[#EFE9DD] transition-colors relative"
              aria-label="Search store products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button
              onClick={() => handleNav('account')}
              className={`p-2.5 rounded-full transition-colors hidden sm:flex items-center justify-center ${
                currentView === 'account' ? 'bg-[#1E3A2F] text-white' : 'text-[#1E3A2F] hover:bg-[#EFE9DD]'
              }`}
              aria-label="My Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNav('wishlist')}
              className="p-2.5 rounded-full text-[#1E3A2F] hover:bg-[#EFE9DD] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#8C6239] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#2D5A44] text-[#FAF9F5] transition-all flex items-center gap-2 shadow-sm active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-semibold hidden md:inline">Cart</span>
              <span className="bg-[#D4AF37] text-[#1E3A2F] text-xs font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Quick Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-[#E8E2D5] bg-white py-3 px-4 shadow-inner animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-[#8C6239] absolute left-3.5" />
              <input
                type="text"
                placeholder="Search dried apricots, Hunza walnuts, Shilajit, Balti shawls, mountain honey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-24 py-2.5 rounded-full border border-[#D5CBB8] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] text-sm text-[#1A1F1D] bg-[#FAF9F5]"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 rounded-full bg-[#1E3A2F] text-white text-xs font-medium hover:bg-[#2D5A44]"
              >
                Search
              </button>
            </form>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#6D4C2B] overflow-x-auto pb-1">
              <span className="font-semibold text-[#1E3A2F]">Popular:</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('Apricots'); navigateTo('shop'); setIsSearchOpen(false); }}
                className="hover:underline bg-[#F5EFE6] px-2 py-0.5 rounded"
              >
                Apricots
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('Walnuts'); navigateTo('shop'); setIsSearchOpen(false); }}
                className="hover:underline bg-[#F5EFE6] px-2 py-0.5 rounded"
              >
                Hunza Walnuts
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('Shilajit'); navigateTo('shop'); setIsSearchOpen(false); }}
                className="hover:underline bg-[#F5EFE6] px-2 py-0.5 rounded"
              >
                Shilajit
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('Honey'); navigateTo('shop'); setIsSearchOpen(false); }}
                className="hover:underline bg-[#F5EFE6] px-2 py-0.5 rounded"
              >
                Mountain Honey
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('Cap'); navigateTo('shop'); setIsSearchOpen(false); }}
                className="hover:underline bg-[#F5EFE6] px-2 py-0.5 rounded"
              >
                GB Cap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] z-50 bg-[#1A1F1D]/50 backdrop-blur-xs">
          <div className="bg-[#FAF9F5] w-4/5 max-w-sm h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between border-r border-[#E8E2D5]">
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D5] pb-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#8C6239]">Explore Mountain Collections</p>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => handleNav('home')}
                    className="w-full text-left py-2 text-base font-semibold text-[#1E3A2F]"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'all')}
                    className="w-full text-left py-2 text-base font-semibold text-[#1E3A2F]"
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'dry-fruits')}
                    className="w-full text-left py-2 text-sm text-[#272F2C] flex items-center justify-between"
                  >
                    <span>Dry Fruits & Nuts</span>
                    <span className="text-xs text-[#8C6239]">Apricots, Walnuts</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'natural-organic')}
                    className="w-full text-left py-2 text-sm text-[#272F2C] flex items-center justify-between"
                  >
                    <span>Natural & Organic</span>
                    <span className="text-xs text-[#8C6239]">Honey, Oils</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'shilajit')}
                    className="w-full text-left py-2 text-sm text-[#272F2C] flex items-center justify-between"
                  >
                    <span>Mountain Shilajit</span>
                    <span className="text-xs text-[#C59B27] font-bold">Gold Grade</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'traditional-wear')}
                    className="w-full text-left py-2 text-sm text-[#272F2C] flex items-center justify-between"
                  >
                    <span>Traditional Wear</span>
                    <span className="text-xs text-[#8C6239]">Shawls, Patti</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'traditional-caps')}
                    className="w-full text-left py-2 text-sm text-[#272F2C] flex items-center justify-between"
                  >
                    <span>Traditional GB Caps</span>
                    <span className="text-xs text-[#8C6239]">Feather Topi</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'handicrafts')}
                    className="w-full text-left py-2 text-sm text-[#272F2C] flex items-center justify-between"
                  >
                    <span>Handicrafts</span>
                    <span className="text-xs text-[#8C6239]">Walnut Wood</span>
                  </button>
                  <button
                    onClick={() => handleNav('shop', 'gift-boxes')}
                    className="w-full text-left py-2 text-sm font-semibold text-[#8C6239] flex items-center justify-between"
                  >
                    <span>Curated Gift Boxes</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleNav('about')}
                  className="w-full text-left py-2 text-sm font-medium text-[#1E3A2F]"
                >
                  Our Story & Gilgit-Baltistan
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full text-left py-2 text-sm font-medium text-[#1E3A2F]"
                >
                  Contact & Support
                </button>
                <button
                  onClick={() => handleNav('account')}
                  className="w-full text-left py-2 text-sm font-medium text-[#1E3A2F] flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Account & Orders
                </button>
                <button
                  onClick={() => handleNav('wishlist')}
                  className="w-full text-left py-2 text-sm font-medium text-[#1E3A2F] flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Saved Wishlist ({wishlistCount})
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E2D5] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#6D4C2B]">
                <Phone className="w-3.5 h-3.5" />
                <span>Helpline: {BRAND_CONFIG.contact.phone}</span>
              </div>
              <button
                onClick={() => handleNav('admin')}
                className="w-full py-2 px-3 text-xs bg-[#EFE9DD] text-[#1E3A2F] rounded-lg font-medium hover:bg-[#E2D8C3]"
              >
                Switch to Admin Portal Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
