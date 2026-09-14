import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDocs,
  collection,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { Category, Subcategory, Product, Banner, StoreSettings } from './AdminTypes';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mandatory connection test on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Verify network/configuration.');
    } else {
      console.log('Firebase initialized (test ping acknowledged).');
    }
    return false;
  }
}

// Initial Data Seed for Gilgit-Baltistan Mountain Store
export async function seedInitialStoreData(force = false): Promise<boolean> {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (!force && !productsSnap.empty) {
      console.log('Database already has products. Skipping initial seed.');
      return false;
    }

    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // 1. Settings
    const defaultSettings: StoreSettings = {
      storeName: 'GB Mountain Store',
      phone: '+92 355 5123456',
      WhatsApp: '+92 345 9876543',
      email: 'info@gbmountainstore.pk',
      address: 'Main Karakoram Highway Bazaar, Gilgit, Gilgit-Baltistan',
      deliveryCharges: 250,
      minimumOrder: 500,
      currency: 'Rs.',
    };
    batch.set(doc(db, 'settings', 'general'), defaultSettings);

    // 2. Categories
    const categoriesData: Array<Omit<Category, 'id'>> = [
      {
        name: 'Dried Fruits',
        slug: 'dried-fruits',
        description: 'Sun-ripened, organic, and naturally dried fruits from the high valleys of Hunza, Nagar, and Skardu.',
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Traditional Products',
        slug: 'traditional-products',
        description: 'Authentic handmade GB Caps, traditional woolen shawls, cultural embroidery, and mountain handicrafts.',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Natural Products',
        slug: 'natural-products',
        description: '100% pure Himalayan & Karakoram Shilajit, raw mountain blossom honey, and wild organic herbal cures.',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const categoryIds: Record<string, string> = {
      'dried-fruits': 'cat_dried_fruits',
      'traditional-products': 'cat_traditional',
      'natural-products': 'cat_natural',
    };

    categoriesData.forEach((cat) => {
      const id = categoryIds[cat.slug];
      batch.set(doc(db, 'categories', id), { ...cat, id });
    });

    // 3. Subcategories
    const subcategoriesData: Array<{ id: string; name: string; slug: string; categoryId: string }> = [
      // Dried Fruits
      { id: 'sub_apricot', name: 'Apricot', slug: 'apricot', categoryId: categoryIds['dried-fruits'] },
      { id: 'sub_walnut', name: 'Walnut', slug: 'walnut', categoryId: categoryIds['dried-fruits'] },
      { id: 'sub_almond', name: 'Almond', slug: 'almond', categoryId: categoryIds['dried-fruits'] },
      { id: 'sub_apple', name: 'Apple', slug: 'apple', categoryId: categoryIds['dried-fruits'] },
      { id: 'sub_mulberry', name: 'Mulberry', slug: 'mulberry', categoryId: categoryIds['dried-fruits'] },
      // Traditional Products
      { id: 'sub_gb_caps', name: 'GB Caps', slug: 'gb-caps', categoryId: categoryIds['traditional-products'] },
      { id: 'sub_dresses', name: 'Traditional Dresses', slug: 'traditional-dresses', categoryId: categoryIds['traditional-products'] },
      { id: 'sub_shawls', name: 'Shawls', slug: 'shawls', categoryId: categoryIds['traditional-products'] },
      { id: 'sub_handicrafts', name: 'Handicrafts', slug: 'handicrafts', categoryId: categoryIds['traditional-products'] },
      // Natural Products
      { id: 'sub_shilajit', name: 'Shilajit', slug: 'shilajit', categoryId: categoryIds['natural-products'] },
      { id: 'sub_honey', name: 'Honey', slug: 'honey', categoryId: categoryIds['natural-products'] },
      { id: 'sub_herbal', name: 'Herbal Products', slug: 'herbal-products', categoryId: categoryIds['natural-products'] },
    ];

    subcategoriesData.forEach((sub) => {
      batch.set(doc(db, 'subcategories', sub.id), {
        ...sub,
        active: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 4. Products
    const productsData: Array<Omit<Product, 'id'>> = [
      {
        name: 'Pure Himalayan Gold Grade Shilajit (Resin)',
        slug: 'pure-himalayan-shilajit-resin',
        categoryId: categoryIds['natural-products'],
        subcategoryId: 'sub_shilajit',
        description: 'Authentic high-altitude purified Shilajit resin extracted from cliffs over 16,000 ft in the Karakoram range. Rich in 85+ ionic minerals and fulvic acid for stamina, energy, and overall health.',
        price: 3500,
        salePrice: 3150,
        unit: '30g Jar',
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        ],
        featured: true,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Organic Hunza Sun-Dried Apricots (Khubani)',
        slug: 'organic-hunza-sun-dried-apricots',
        categoryId: categoryIds['dried-fruits'],
        subcategoryId: 'sub_apricot',
        description: 'Naturally sweetened and sun-dried apricots harvested directly from ancient Hunza Valley orchards. No sulfur, no artificial preservatives, tender, chewy and intensely flavorful.',
        price: 1500,
        salePrice: 1350,
        unit: '1 kg Pack',
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        ],
        featured: true,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Traditional Gilgit-Baltistan Pakol Cap with Feather',
        slug: 'traditional-gb-pakol-cap-feather',
        categoryId: categoryIds['traditional-products'],
        subcategoryId: 'sub_gb_caps',
        description: 'Iconic authentic handmade pure sheep wool Pakol cap adorned with traditional peacock feather brooch. Warm, durable, and a timeless cultural emblem of Gilgit-Baltistan.',
        price: 1800,
        salePrice: 1500,
        unit: '1 Piece',
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
        ],
        featured: true,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Raw Wild Mountain Blossom Honey (Skardu Valley)',
        slug: 'raw-wild-mountain-honey-skardu',
        categoryId: categoryIds['natural-products'],
        subcategoryId: 'sub_honey',
        description: 'Cold-extracted unpasteurized natural honey collected by wild bees foraging on alpine wildflowers across Skardu and Deosai plains. Pure, enzyme-rich, and therapeutic.',
        price: 2800,
        salePrice: 2450,
        unit: '1 kg Jar',
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
        ],
        featured: true,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Gilgit Thin Paper Shell Walnuts (Kaghzi Akhrot)',
        slug: 'gilgit-paper-shell-walnuts-kaghzi',
        categoryId: categoryIds['dried-fruits'],
        subcategoryId: 'sub_walnut',
        description: 'Premium thin paper shell walnuts easy to crack with bare hands. Crisp, creamy kernels packed with healthy Omega-3 fats, freshly collected from mountain farmers.',
        price: 2200,
        salePrice: 1950,
        unit: '1 kg Pack',
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1563205764-67252277d337?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
        ],
        featured: true,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Mountain Sun-Dried Sweet Mulberries (Shahtoot)',
        slug: 'mountain-sun-dried-sweet-mulberries',
        categoryId: categoryIds['dried-fruits'],
        subcategoryId: 'sub_mulberry',
        description: 'Sweet, chewy white and dark mulberries hand-picked from Gilgit orchards and dried under clear mountain skies. Naturally rich in iron, vitamin C, and antioxidants.',
        price: 1300,
        unit: '500g Pack',
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
        ],
        featured: false,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Hand-Woven Pure Wool Gilgiti Embroidery Shawl',
        slug: 'hand-woven-wool-gilgiti-shawl',
        categoryId: categoryIds['traditional-products'],
        subcategoryId: 'sub_shawls',
        description: 'Luxuriously soft and cozy winter shawl woven from natural sheep wool and trimmed with traditional Hunza floral needlework borders. Handcrafted by local women artisans.',
        price: 6500,
        salePrice: 5800,
        unit: '1 Piece',
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
        ],
        featured: true,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Wild Mountain Herbal Thyme Tea (Tumuro)',
        slug: 'wild-mountain-tumuro-herbal-tea',
        categoryId: categoryIds['natural-products'],
        subcategoryId: 'sub_herbal',
        description: 'Legendary wild high-altitude thyme collected from the upper slopes of Hunza and Nagar. Celebrated for respiratory clarity, soothing digestion, and warming aroma.',
        price: 950,
        salePrice: 850,
        unit: '150g Pouch',
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
        ],
        featured: false,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Sweet Mountain Dried Apple Slices (Organic)',
        slug: 'sweet-mountain-dried-apple-slices',
        categoryId: categoryIds['dried-fruits'],
        subcategoryId: 'sub_apple',
        description: 'Crisp and chewy heirloom apple rings dried without added sugar. A delicious and wholesome wholesome snack straight from mountain valleys.',
        price: 1100,
        unit: '500g Pack',
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80',
        ],
        featured: false,
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    productsData.forEach((prod, idx) => {
      const prodId = `prod_${idx + 1}`;
      batch.set(doc(db, 'products', prodId), { ...prod, id: prodId });
    });

    // 5. Banners
    const bannersData: Array<Omit<Banner, 'id'>> = [
      {
        title: 'Authentic Treasures of Gilgit-Baltistan',
        subtitle: '100% Pure Himalayan Shilajit, Sun-Dried Organic Fruits & Traditional Mountain Crafts delivered directly to your doorstep.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Shop Mountain Harvest',
        buttonLink: 'products',
        active: true,
        createdAt: now,
      },
    ];

    bannersData.forEach((banner, idx) => {
      const bannerId = `banner_${idx + 1}`;
      batch.set(doc(db, 'banners', bannerId), { ...banner, id: bannerId });
    });

    await batch.commit();
    console.log('Database seeded with authentic GB Mountain Store catalog!');
    return true;
  } catch (error) {
    console.error('Error seeding store data:', error);
    return false;
  }
}
