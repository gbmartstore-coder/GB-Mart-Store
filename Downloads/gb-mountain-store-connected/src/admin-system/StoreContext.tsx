import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, testConnection, seedInitialStoreData, handleFirestoreError, OperationType } from './firebase';
import { Category, Subcategory, Product, Banner, StoreSettings, Order } from './AdminTypes';
import { useAuth } from './AuthContext';

interface StoreContextType {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  banners: Banner[];
  orders: Order[];
  settings: StoreSettings | null;
  loading: boolean;
  getCategoryName: (categoryId: string) => string;
  getSubcategoryName: (subcategoryId?: string) => string;
  reseedData: () => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial connection test
    testConnection().catch(() => {});

    // 1. Categories listener
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const list: Category[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) });
        });
        setCategories(list);
      },
      (error) => {
        console.error('Error listening to categories:', error);
      }
    );

    // 2. Subcategories listener
    const unsubSubcategories = onSnapshot(
      collection(db, 'subcategories'),
      (snapshot) => {
        const list: Subcategory[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as Omit<Subcategory, 'id'>) });
        });
        setSubcategories(list);
      },
      (error) => {
        console.error('Error listening to subcategories:', error);
      }
    );

    // 3. Products listener
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) });
        });
        setProducts(list);
        // If database is completely empty upon initial load, trigger automatic seed
        if (snapshot.empty) {
          seedInitialStoreData().catch((e) => console.error('Auto-seed failed', e));
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to products:', error);
        setLoading(false);
      }
    );

    // 4. Banners listener
    const unsubBanners = onSnapshot(
      collection(db, 'banners'),
      (snapshot) => {
        const list: Banner[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as Omit<Banner, 'id'>) });
        });
        setBanners(list);
      },
      (error) => {
        console.error('Error listening to banners:', error);
      }
    );

    // 5. Settings listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({ id: snapshot.id, ...(snapshot.data() as StoreSettings) });
        } else {
          setSettings({
            storeName: 'GB Mountain Store',
            phone: '+92 355 5123456',
            WhatsApp: '+92 345 9876543',
            email: 'info@gbmountainstore.pk',
            address: 'Main Karakoram Highway Bazaar, Gilgit, Gilgit-Baltistan',
            deliveryCharges: 250,
            minimumOrder: 500,
            currency: 'Rs.',
          });
        }
      },
      (error) => {
        console.error('Error listening to settings:', error);
      }
    );

    return () => {
      unsubCategories();
      unsubSubcategories();
      unsubProducts();
      unsubBanners();
      unsubSettings();
    };
  }, []);

  // Sync orders based on auth status (admins see all orders, users see their orders)
  useEffect(() => {
    if (isAdmin) {
      const unsubOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Omit<Order, 'id'>) });
          });
          setOrders(list);
        },
        (error) => {
          console.warn('Orders listener notice (admin):', error.message);
        }
      );
      return () => unsubOrders();
    } else if (user) {
      const unsubUserOrders = onSnapshot(
        query(collection(db, 'orders'), where('customerId', '==', user.uid)),
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Omit<Order, 'id'>) });
          });
          setOrders(list);
        },
        (error) => {
          console.warn('Orders listener notice (user):', error.message);
        }
      );
      return () => unsubUserOrders();
    } else {
      setOrders([]);
    }
  }, [user, isAdmin]);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId || c.slug === categoryId);
    return cat ? cat.name : 'Mountain Goods';
  };

  const getSubcategoryName = (subcategoryId?: string) => {
    if (!subcategoryId) return '';
    const sub = subcategories.find((s) => s.id === subcategoryId || s.slug === subcategoryId);
    return sub ? sub.name : '';
  };

  const reseedData = async () => {
    return await seedInitialStoreData(true);
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        subcategories,
        products,
        banners,
        orders,
        settings,
        loading,
        getCategoryName,
        getSubcategoryName,
        reseedData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
