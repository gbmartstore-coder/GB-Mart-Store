import React, { useEffect } from 'react';
import { 
  ShopProvider, 
  useShop 
} from './context/ShopContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { MessageCircle, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { BRAND_CONFIG } from './config/brandConfig';

const MainAppContent: React.FC = () => {
  const { currentView, toasts, removeToast } = useShop();

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1F1D] font-sans selection:bg-[#1E3A2F] selection:text-[#FAF9F5]">
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Dynamic View Routing */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-success' && <OrderSuccessPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'account' && <AccountPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'admin' && <AdminPage />}
      </main>

      {/* Global Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Global Quick View Product Modal */}
      <QuickViewModal />

      {/* Floating WhatsApp / Customer Helpline Widget (Essential for Pakistani E-Commerce) */}
      <a
        href={`https://wa.me/${BRAND_CONFIG.contact.phone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum!%20I%20have%20an%20inquiry%20regarding%20Gilgit-Baltistan%20products.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold font-sans">
          Chat on WhatsApp
        </span>
      </a>

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-[#1E3A2F] text-white border-[#2D5A44]'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-white text-[#1A1F1D] border-[#D5CBB8]'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#2D5A44] flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Comprehensive Mountain Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
