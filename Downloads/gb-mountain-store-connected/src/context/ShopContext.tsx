import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomerOrder, Product, ProductCategory } from '../types';
import { PRODUCTS_DATA } from '../data/productsData';
import { useLiveStoreProducts } from '../data/liveProducts';
import { BRAND_CONFIG } from '../config/brandConfig';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  savedAddresses: Array<{
    id: string;
    label: string;
    address: string;
    city: string;
    phone: string;
  }>;
}

interface ShopContextType {
  // Navigation
  currentView: string;
  navigateTo: (view: string, productIdOrSlug?: string, category?: ProductCategory) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedWeight?: string, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  // Orders
  orders: CustomerOrder[];
  lastCompletedOrder: CustomerOrder | null;
  createOrder: (orderDetails: {
    customer: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      orderNotes?: string;
    };
    deliveryMethod: 'Standard' | 'Express';
    paymentMethod: 'Cash on Delivery' | 'Online Payment';
  }) => CustomerOrder;

  // User Account Mock
  currentUser: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Products (static demo catalog + live products from the Admin Panel)
  allProducts: Product[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { liveProducts } = useLiveStoreProducts();
  // Live products from the Admin Panel take priority; static demo products
  // fill in any gaps (and are skipped if an admin product reuses their id).
  const liveIds = new Set(liveProducts.map((p) => p.id));
  const allProducts: Product[] = [
    ...liveProducts,
    ...PRODUCTS_DATA.filter((p) => !liveIds.has(p.id)),
  ];

  // Local storage hydrated states
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gb_mountain_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gb_mountain_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return ['prod-apricot-premium', 'prod-shilajit-resin-gold'];
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('gb_mountain_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial mock order to show in account history
    return [
      {
        id: 'ord-101',
        orderNumber: 'GB-84291',
        createdAt: '2026-02-14',
        items: [
          {
            id: 'cart-init-1',
            productId: 'prod-apricot-premium',
            name: 'Premium Sun-Dried Apricots (Hunza Khubani)',
            price: 1600,
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
            quantity: 1,
            selectedWeight: '500g',
            category: 'dry-fruits',
          },
        ],
        subtotal: 1600,
        deliveryCharge: 200,
        discount: 0,
        total: 1800,
        status: 'Delivered',
        customer: {
          fullName: 'Customer Account',
          phone: '0300-1234567',
          email: 'customer@example.pk',
          address: 'House 42, Street 8, F-7/2',
          city: 'Islamabad',
          province: 'Islamabad Capital Territory',
          postalCode: '44000',
        },
        deliveryMethod: 'Standard',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Paid',
      },
    ];
  });

  const [lastCompletedOrder, setLastCompletedOrder] = useState<CustomerOrder | null>(null);

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // UI state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Customer Account',
    email: 'customer@example.pk',
    phone: '0300-1234567',
    address: 'House 42, Street 8, F-7/2',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home (Islamabad)',
        address: 'House 42, Street 8, F-7/2',
        city: 'Islamabad',
        phone: '0300-1234567',
      },
    ],
  });

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gb_mountain_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('gb_mountain_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('gb_mountain_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const navigateTo = (view: string, productIdOrSlug?: string, category?: ProductCategory) => {
    if (productIdOrSlug) {
      const found = allProducts.find(
        (p) => p.id === productIdOrSlug || p.slug === productIdOrSlug
      );
      if (found) {
        setSelectedProduct(found);
      }
    }
    if (category) {
      setSelectedCategory(category);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedWeight?: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    // Determine price based on weight if selected
    let unitPrice = product.price;
    if (selectedWeight && product.availableWeights) {
      const weightOption = product.availableWeights.find((w) => w.weight === selectedWeight);
      if (weightOption) {
        unitPrice = weightOption.price;
      }
    }

    const itemIdentifier = `${product.id}-${selectedWeight || 'std'}-${selectedSize || ''}-${selectedColor || ''}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemIdentifier);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemIdentifier,
          productId: product.id,
          name: product.name,
          price: unitPrice,
          image: product.images[0],
          quantity,
          selectedWeight: selectedWeight || (product.availableWeights?.[0]?.weight),
          selectedSize,
          selectedColor,
          category: product.category,
        };
        return [...prev, newItem];
      }
    });

    addToast(`Added "${product.name}" to your cart!`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= BRAND_CONFIG.freeShippingThreshold ? 0 : BRAND_CONFIG.standardShippingFee;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MOUNTAIN10' || clean === 'GILGIT10') {
      const calcDiscount = Math.round(subtotal * 0.10);
      setDiscount(calcDiscount);
      setCouponCode(clean);
      addToast('10% Mountain discount applied!', 'success');
      return true;
    } else if (clean === 'FREESHIP') {
      setDiscount(BRAND_CONFIG.standardShippingFee);
      setCouponCode(clean);
      addToast('Free Shipping coupon applied!', 'success');
      return true;
    } else {
      addToast('Invalid voucher code. Try "MOUNTAIN10"', 'warning');
      return false;
    }
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from your Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Saved to your Wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;

  // Order Placement
  const createOrder = (orderDetails: {
    customer: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      orderNotes?: string;
    };
    deliveryMethod: 'Standard' | 'Express';
    paymentMethod: 'Cash on Delivery' | 'Online Payment';
  }): CustomerOrder => {
    const shippingAmount =
      orderDetails.deliveryMethod === 'Express'
        ? BRAND_CONFIG.expressShippingFee
        : subtotal >= BRAND_CONFIG.freeShippingThreshold
        ? 0
        : BRAND_CONFIG.standardShippingFee;

    const finalOrderTotal = Math.max(0, subtotal + shippingAmount - discount);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `GB-${randomSuffix}`;

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      deliveryCharge: shippingAmount,
      discount,
      total: finalOrderTotal,
      status: 'Processing',
      customer: orderDetails.customer,
      deliveryMethod: orderDetails.deliveryMethod,
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: orderDetails.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();
    setDiscount(0);
    setCouponCode('');
    return newOrder;
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...profile }));
    addToast('Account profile updated successfully', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        navigateTo,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        couponCode,
        applyCoupon,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        lastCompletedOrder,
        createOrder,
        currentUser,
        updateUserProfile,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        addToast,
        allProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
