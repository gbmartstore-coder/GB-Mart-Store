import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Category,
  Subcategory,
  Product,
  Order,
  OrderStatus,
  StoreSettings,
  Banner,
  UserProfile,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SUBCATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_BANNERS,
} from '../data/initialData';

/**
 * Recursively cleans an object for Firestore by removing any keys with `undefined` values.
 * Firestore strictly disallows `undefined` as a field value and throws runtime errors.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }

  // Preserve Firestore FieldValue (such as deleteField, serverTimestamp) and Date objects
  if (
    data instanceof Date ||
    typeof (data as any)?._methodName === 'string' ||
    ('_delegate' in (data as any) && (data as any)?._delegate?._methodName)
  ) {
    return data;
  }

  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

// -------------------------------------------------------------
// USER SERVICES
// -------------------------------------------------------------
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function setUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map((d) => d.data() as UserProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function onUsersSnapshot(
  callback: (users: UserProfile[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'users';
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        users.push(docSnap.data() as UserProfile);
      });
      callback(users);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function updateUserRole(uid: string, role: 'admin' | 'customer'): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// -------------------------------------------------------------
// CATEGORIES SERVICES
// -------------------------------------------------------------
export function onCategoriesSnapshot(
  callback: (categories: Category[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'categories';
  return onSnapshot(
    collection(db, 'categories'),
    (snapshot) => {
      const categories: Category[] = [];
      snapshot.forEach((docSnap) => {
        categories.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
      });
      callback(categories);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createCategory(
  data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): Promise<string> {
  const path = 'categories';
  try {
    const docRef = doc(collection(db, 'categories'));
    await setDoc(docRef, sanitizeForFirestore({
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const path = `categories/${id}`;
  try {
    await updateDoc(doc(db, 'categories', id), sanitizeForFirestore({
      ...data,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const path = `categories/${id}`;
  try {
    const productsSnap = await getDocs(
      query(collection(db, 'products'), where('categoryId', '==', id))
    );
    if (!productsSnap.empty) {
      throw new Error('Cannot delete category with associated products. Please reassign or delete the products first.');
    }
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deleteCategoryAndReassignProducts(
  id: string,
  newCategoryId: string
): Promise<void> {
  const path = `categories/${id}`;
  try {
    const productsSnap = await getDocs(
      query(collection(db, 'products'), where('categoryId', '==', id))
    );
    const updates = productsSnap.docs.map((docSnap) =>
      updateDoc(docSnap.ref, {
        categoryId: newCategoryId,
        subcategoryId: '',
        updatedAt: new Date().toISOString(),
      })
    );
    await Promise.all(updates);
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// SUBCATEGORIES SERVICES
// -------------------------------------------------------------
export function onSubcategoriesSnapshot(
  callback: (subcategories: Subcategory[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'subcategories';
  return onSnapshot(
    collection(db, 'subcategories'),
    (snapshot) => {
      const subcategories: Subcategory[] = [];
      snapshot.forEach((docSnap) => {
        subcategories.push({ id: docSnap.id, ...(docSnap.data() as Omit<Subcategory, 'id'>) });
      });
      callback(subcategories);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createSubcategory(
  data: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): Promise<string> {
  const path = 'subcategories';
  try {
    const docRef = doc(collection(db, 'subcategories'));
    await setDoc(docRef, sanitizeForFirestore({
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSubcategory(id: string, data: Partial<Subcategory>): Promise<void> {
  const path = `subcategories/${id}`;
  try {
    await updateDoc(doc(db, 'subcategories', id), sanitizeForFirestore({
      ...data,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSubcategory(id: string): Promise<void> {
  const path = `subcategories/${id}`;
  try {
    await deleteDoc(doc(db, 'subcategories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// PRODUCTS SERVICES
// -------------------------------------------------------------
export function onProductsSnapshot(
  callback: (products: Product[]) => void,
  activeOnly: boolean = false,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'products';
  const q = activeOnly
    ? query(collection(db, 'products'), where('active', '==', true))
    : collection(db, 'products');

  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      callback(products);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): Promise<string> {
  const path = 'products';
  try {
    const docRef = doc(collection(db, 'products'));
    await setDoc(docRef, sanitizeForFirestore({
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const path = `products/${id}`;
  try {
    await updateDoc(doc(db, 'products', id), sanitizeForFirestore({
      ...data,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// ORDERS SERVICES
// -------------------------------------------------------------
export function onAllOrdersSnapshot(
  callback: (orders: Order[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'orders';
  return onSnapshot(
    collection(db, 'orders'),
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export const onOrdersSnapshot = onAllOrdersSnapshot;

export function onCustomerOrdersSnapshot(
  customerId: string,
  callback: (orders: Order[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'orders';
  const q = query(
    collection(db, 'orders'),
    where('customerId', '==', customerId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createOrder(data: Omit<Order, 'id'>): Promise<string> {
  const path = 'orders';
  try {
    const docRef = doc(collection(db, 'orders'));
    await setDoc(docRef, sanitizeForFirestore({
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const path = `orders/${id}`;
  try {
    await updateDoc(doc(db, 'orders', id), sanitizeForFirestore({
      status,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// -------------------------------------------------------------
// STORE SETTINGS SERVICES
// -------------------------------------------------------------
export async function getStoreSettings(): Promise<StoreSettings> {
  const path = 'settings/store_config';
  try {
    const snap = await getDoc(doc(db, 'settings', 'store_config'));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as StoreSettings) };
    }
    return INITIAL_SETTINGS;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return INITIAL_SETTINGS;
  }
}

export function onSettingsSnapshot(
  callback: (settings: StoreSettings) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'settings/store_config';
  return onSnapshot(
    doc(db, 'settings', 'store_config'),
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...(snap.data() as StoreSettings) });
      } else {
        callback(INITIAL_SETTINGS);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function updateStoreSettings(data: Partial<StoreSettings>): Promise<void> {
  const path = 'settings/store_config';
  try {
    await setDoc(
      doc(db, 'settings', 'store_config'),
      sanitizeForFirestore({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// -------------------------------------------------------------
// BANNERS SERVICES
// -------------------------------------------------------------
export function onBannersSnapshot(
  callback: (banners: Banner[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'banners';
  return onSnapshot(
    collection(db, 'banners'),
    (snapshot) => {
      const banners: Banner[] = [];
      snapshot.forEach((docSnap) => {
        banners.push({ id: docSnap.id, ...(docSnap.data() as Omit<Banner, 'id'>) });
      });
      banners.sort((a, b) => a.order - b.order);
      callback(banners);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createBanner(
  data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }
): Promise<string> {
  const path = 'banners';
  try {
    const docRef = doc(collection(db, 'banners'));
    await setDoc(docRef, sanitizeForFirestore({
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<void> {
  const path = `banners/${id}`;
  try {
    await updateDoc(doc(db, 'banners', id), sanitizeForFirestore({
      ...data,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBanner(id: string): Promise<void> {
  const path = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// INITIAL DATABASE SEEDING
// -------------------------------------------------------------
export async function seedInitialDatabase(): Promise<{
  categoriesCount: number;
  subcategoriesCount: number;
  productsCount: number;
  bannersCount: number;
}> {
  const now = new Date().toISOString();
  const batch = writeBatch(db);

  // Settings
  batch.set(doc(db, 'settings', 'store_config'), {
    ...INITIAL_SETTINGS,
    createdAt: now,
    updatedAt: now,
  });

  // Categories
  for (const cat of INITIAL_CATEGORIES) {
    batch.set(doc(db, 'categories', cat.id), {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      active: cat.active,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Subcategories
  for (const sub of INITIAL_SUBCATEGORIES) {
    batch.set(doc(db, 'subcategories', sub.id), {
      name: sub.name,
      slug: sub.slug,
      categoryId: sub.categoryId,
      active: sub.active,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Products - only create if product does not already exist
for (const prod of INITIAL_PRODUCTS) {
  const productRef = doc(db, 'products', prod.id);
  const existingProduct = await getDoc(productRef);

  if (!existingProduct.exists()) {
    batch.set(productRef, {
      name: prod.name,
      slug: prod.slug,
      categoryId: prod.categoryId,
      subcategoryId: prod.subcategoryId,
      description: prod.description,
      price: prod.price,
      salePrice: prod.salePrice,
      unit: prod.unit,
      stock: prod.stock,
      images: prod.images,
      featured: prod.featured,
      active: prod.active,
      createdAt: now,
      updatedAt: now,
    });
  }
}

  // Banners - only create if banner does not already exist
for (let i = 0; i < INITIAL_BANNERS.length; i++) {
  const banner = INITIAL_BANNERS[i];
  const bannerRef = doc(db, 'banners', `banner-${i + 1}`);
  const existingBanner = await getDoc(bannerRef);

  if (!existingBanner.exists()) {
    batch.set(bannerRef, {
      ...banner,
      createdAt: now,
      updatedAt: now,
    });
  }
}

  await batch.commit();

  return {
    categoriesCount: INITIAL_CATEGORIES.length,
    subcategoriesCount: INITIAL_SUBCATEGORIES.length,
    productsCount: INITIAL_PRODUCTS.length,
    bannersCount: INITIAL_BANNERS.length,
  };
}
