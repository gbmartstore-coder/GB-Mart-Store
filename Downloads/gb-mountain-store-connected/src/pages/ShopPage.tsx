import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  Mountain
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCategory } from '../types';
import { BRAND_CONFIG } from '../config/brandConfig';

type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'best-selling' | 'top-rated';

export const ShopPage: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    allProducts,
  } = useShop();

  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedValley, setSelectedValley] = useState<string>('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        const matchOrigin = product.origin.toLowerCase().includes(query);
        const matchValley = product.valley.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat && !matchOrigin && !matchValley) {
          return false;
        }
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Stock filter
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      // Valley filter
      if (selectedValley !== 'all' && product.valley !== selectedValley) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'best-selling':
          return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
        case 'top-rated':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [allProducts, selectedCategory, searchQuery, maxPrice, minRating, onlyInStock, selectedValley, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(12000);
    setMinRating(0);
    setOnlyInStock(false);
    setSelectedValley('all');
    setSortOption('featured');
  };

  const activeCategoryInfo = CATEGORIES_DATA.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Category Header Banner */}
      <div className="bg-[#FAF9F5] border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#8C6239]">
              <Mountain className="w-3.5 h-3.5" />
              <span>Gilgit-Baltistan Catalog</span>
            </div>
            <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D]">
              {selectedCategory === 'all'
                ? 'All Mountain Products'
                : activeCategoryInfo?.name || 'Mountain Products'}
            </h1>
            <p className="text-sm text-[#596561] leading-relaxed">
              {activeCategoryInfo?.description ||
                '100% genuine harvest, wild flora honey, cold-pressed oils, handwoven shawls, and traditional caps sourced across Gilgit, Hunza, Skardu, and Astore.'}
            </p>
          </div>

          {/* Search Box inside header */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C6239] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products or valleys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#D5CBB8] bg-white text-sm text-[#1A1F1D] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6239] hover:text-[#1A1F1D]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="mt-6 pt-6 border-t border-[#E8E2D5] flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1E3A2F] text-white shadow-xs'
                : 'bg-white text-[#272F2C] border border-[#E8E2D5] hover:border-[#1E3A2F]'
            }`}
          >
            All Items ({allProducts.length})
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1E3A2F] text-white shadow-xs'
                  : 'bg-white text-[#272F2C] border border-[#E8E2D5] hover:border-[#1E3A2F]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Total Count, Filters Toggle, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="lg:hidden px-4 py-2 rounded-xl border border-[#D5CBB8] bg-white text-xs font-bold text-[#1E3A2F] flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <span className="text-xs text-[#6D4C2B] font-medium">
            Showing <strong className="text-[#1A1F1D]">{filteredProducts.length}</strong> authentic products
          </span>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs text-[#6D4C2B] font-medium hidden sm:inline">Sort By:</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none bg-white border border-[#D5CBB8] rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-[#1A1F1D] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured First</option>
              <option value="best-selling">Best Selling</option>
              <option value="top-rated">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Harvest</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C6239] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Catalog Grid + Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${isFilterDrawerOpen ? 'block' : 'hidden'} space-y-6 bg-white p-5 rounded-2xl border border-[#E8E2D5] shadow-xs`}>
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
            <h3 className="font-bold text-sm text-[#1A1F1D] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8C6239]" />
              Filter Products
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#8C6239] hover:text-[#1E3A2F] flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          {/* Valley of Origin */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block">
              Origin Valley
            </label>
            <select
              value={selectedValley}
              onChange={(e) => setSelectedValley(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#D5CBB8] rounded-xl px-3 py-2 text-xs font-medium text-[#1A1F1D] focus:outline-none"
            >
              <option value="all">All Valleys</option>
              <option value="Hunza">Hunza Valley</option>
              <option value="Skardu">Skardu / Baltistan</option>
              <option value="Gilgit">Gilgit Valley</option>
              <option value="Astore">Astore / Deosai</option>
              <option value="Nagar">Nagar Valley</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-2 border-t border-[#F0EAE0]">
            <div className="flex justify-between items-center text-xs font-bold text-[#1A1F1D]">
              <span className="text-[#6D4C2B] uppercase tracking-wider">Max Price</span>
              <span className="text-[#1E3A2F]">{BRAND_CONFIG.currency.format(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="12000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1E3A2F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C6239]">
              <span>Rs. 500</span>
              <span>Rs. 12,000+</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-2 border-t border-[#F0EAE0]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6D4C2B] block">
              Minimum Rating
            </label>
            <div className="space-y-1.5">
              {[0, 4.5, 4.8, 5.0].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-xs text-[#272F2C] cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                    className="accent-[#1E3A2F]"
                  />
                  <span>{rating === 0 ? 'All Ratings' : `${rating} Stars & Above`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In Stock only toggle */}
          <div className="pt-2 border-t border-[#F0EAE0]">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1F1D] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-[#1E3A2F] w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid (Desktop: 3-4 cols, Tablet: 2-3 cols, Mobile: 2 cols per requirement #14) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8E2D5] p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#F5EFE6] flex items-center justify-center mx-auto text-[#8C6239]">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-[#1A1F1D]">
                No mountain products matched your criteria
              </h3>
              <p className="text-xs text-[#596561] max-w-md mx-auto leading-relaxed">
                We couldn't find any products matching your active filters or search terms. Try loosening your price limit or clearing the search keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#2D5A44] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
