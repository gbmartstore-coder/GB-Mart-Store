import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import WhatsAppButton from './components/WhatsAppButton';
import {
  onProductsSnapshot,
  onCategoriesSnapshot,
  onSubcategoriesSnapshot,
  onBannersSnapshot,
  getStoreSettings,
} from './services/db';
import {
  Product,
  Category,
  Subcategory,
  Banner,
  StoreSettings,
} from './types';
import {
  INITIAL_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_BANNERS,
} from './data/initialData';
import { SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';

function StorefrontApp() {
  // Navigation Route
  const [route, setRoute] = useState<'store' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
      ? 'admin'
      : 'store';
  });

  // Firestore Real-Time Data
  const [products, setProducts] = useState<Product[]>(() => {
  try {
    const cached = localStorage.getItem('gbmart_products');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
});

const [categories, setCategories] = useState<Category[]>(() => {
  try {
    const cached = localStorage.getItem('gbmart_categories');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
});

const [subcategories, setSubcategories] = useState<Subcategory[]>(() => {
  try {
    const cached = localStorage.getItem('gbmart_subcategories');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
});

const [banners, setBanners] = useState<Banner[]>(() => {
  try {
    const cached = localStorage.getItem('gbmart_banners');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
});

const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

const [loading, setLoading] = useState(() => {
  return !localStorage.getItem('gbmart_products');
});
  // Search & Filtering
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [showAllProducts, setShowAllProducts] = useState(false);
  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Sync Cart context settings
  const { setSettings: setCartSettings } = useCart();

  // Listen to browser forward/back
  useEffect(() => {
    const handlePopState = () => {
      const isAdm = window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
      setRoute(isAdm ? 'admin' : 'store');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setRoute('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.history.pushState({}, '', '/');
    setRoute('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time Firestore Subscriptions
  useEffect(() => {

    const unsubProducts = onProductsSnapshot(
      (prods) => {
        if (prods.length > 0) {
  setProducts(prods);
  localStorage.setItem('gbmart_products', JSON.stringify(prods));
} else {
          setProducts(INITIAL_PRODUCTS);
          
        }
        setLoading(false);
      },
      false,
      (err) => {
        console.warn('Products subscription fallback:', err);
        setProducts(INITIAL_PRODUCTS);
        setLoading(false);
      }
    );

    const unsubCategories = onCategoriesSnapshot(
      (cats) => {
        if (cats.length > 0) {
  setCategories(cats);
  localStorage.setItem('gbmart_categories', JSON.stringify(cats));
}
        else setCategories(INITIAL_CATEGORIES);
      },
      (err) => {
        console.warn('Categories subscription fallback:', err);
        setCategories(INITIAL_CATEGORIES);
      }
    );

    const unsubSubcategories = onSubcategoriesSnapshot(
      (subs) => {
        if (subs.length > 0) {
  setSubcategories(subs);
  localStorage.setItem('gbmart_subcategories', JSON.stringify(subs));
}
        else setSubcategories(INITIAL_SUBCATEGORIES);
      },
      (err) => {
        console.warn('Subcategories subscription fallback:', err);
        setSubcategories(INITIAL_SUBCATEGORIES);
      }
    );

    const unsubBanners = onBannersSnapshot(
      (bans) => {
        if (bans.length > 0) {
  setBanners(bans);
  localStorage.setItem('gbmart_banners', JSON.stringify(bans));
}
        else setBanners(INITIAL_BANNERS.map((b, i) => ({ id: `banner-${i + 1}`, ...b })));
      },
      (err) => {
        console.warn('Banners subscription fallback:', err);
        setBanners(INITIAL_BANNERS.map((b, i) => ({ id: `banner-${i + 1}`, ...b })));
      }
    );

    getStoreSettings().then((s) => {
      setSettings(s);
      setCartSettings(s);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSubcategories();
      unsubBanners();
    };
  }, [setCartSettings]);

  // If currently on /admin route
  if (route === 'admin') {
    return <AdminPortal onBackToStore={navigateToStore} />;
  }

  // Active products only for storefront
  const activeProducts = products.filter((p) => p.active);

  // Filter products by category, subcategory, search
  const filteredProducts = activeProducts.filter((prod) => {
    const matchesCategory = selectedCategory ? prod.categoryId === selectedCategory : true;
    const matchesSubcategory = selectedSubcategory ? prod.subcategoryId === selectedSubcategory : true;
    const matchesSearch = searchQuery.trim()
      ? prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    }
    if (sortBy === 'price-asc') {
      const pA = a.salePrice ?? a.price;
      const pB = b.salePrice ?? b.price;
      return pA - pB;
    }
    if (sortBy === 'price-desc') {
      const pA = a.salePrice ?? a.price;
      const pB = b.salePrice ?? b.price;
      return pB - pA;
    }
    return a.name.localeCompare(b.name);
  });
// Homepage products: maximum 16 with products spread across categories
const homepageProducts: Product[] = [];
const usedProductIds = new Set<string>();

// First take up to 2 products from each category
categories.forEach((category) => {
  const categoryProducts = sortedProducts.filter(
    (product) => product.categoryId === category.id
  );

  categoryProducts.slice(0, 8).forEach((product) => {
    if (
      homepageProducts.length < 16 &&
      !usedProductIds.has(product.id)
    ) {
      homepageProducts.push(product);
      usedProductIds.add(product.id);
    }
  });
});

// If fewer than 16, fill remaining spaces with other available products
if (homepageProducts.length < 16) {
  sortedProducts.forEach((product) => {
    if (
      homepageProducts.length < 16 &&
      !usedProductIds.has(product.id)
    ) {
      homepageProducts.push(product);
      usedProductIds.add(product.id);
    }
  });
}

const visibleProducts =
  showAllProducts ||
  selectedCategory ||
  selectedSubcategory ||
  searchQuery.trim()
    ? sortedProducts
    : [...homepageProducts].sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        }

        if (sortBy === 'price-asc') {
          const pA = a.salePrice ?? a.price;
          const pB = b.salePrice ?? b.price;
          return pA - pB;
        }

        if (sortBy === 'price-desc') {
          const pA = a.salePrice ?? a.price;
          const pB = b.salePrice ?? b.price;
          return pB - pA;
        }

        return a.name.localeCompare(b.name);
      });
  // Count products by category
  const productCountsByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = activeProducts.filter((p) => p.categoryId === cat.id).length;
    return acc;
  }, {} as Record<string, number>);

  const handleHeroCta = () => {
    const el = document.getElementById('products-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      {/* Navigation */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onNavigateToAdmin={navigateToAdmin}
        settings={settings}
      />

      {/* Hero Banner Carousel */}
      <HeroBanner banners={banners} onCtaClick={handleHeroCta} />

      {/* Category Navigation Bar */}
      <CategoryNav
        categories={categories}
        subcategories={subcategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        productCountsByCategory={productCountsByCategory}
        totalProductsCount={activeProducts.length}
      />

      {/* Main Catalog View */}
      <main id="products-grid-section" className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Controls and Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-gray-900 tracking-tight">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || 'Products'
                : 'Featured Products'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
  {selectedCategory
    ? `Showing ${sortedProducts.length} ${sortedProducts.length === 1 ? 'product' : 'products'}`
    : 'Handpicked authentic products from Gilgit-Baltistan'}
</p>
          </div>
          {sortedProducts.length > 16 &&
  !selectedCategory &&
  !selectedSubcategory &&
  !searchQuery.trim() && (
    <button
      type="button"
      onClick={() => setShowAllProducts((prev) => !prev)}
      className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap"
    >
      {showAllProducts ? 'Show Less ↓' : 'View All Products →'}
    </button>
  )}
          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3"
              >
                <div className="aspect-square bg-gray-100 rounded-lg" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 my-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              No products match your current search query or filter. Try clearing filters or exploring other categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                onOpenDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigateToAdmin={navigateToAdmin}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal onOpenOrders={() => setIsOrdersOpen(true)} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        categories={categories}
        subcategories={subcategories}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
       
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StorefrontApp />
      </CartProvider>
    </AuthProvider>
  );
}
