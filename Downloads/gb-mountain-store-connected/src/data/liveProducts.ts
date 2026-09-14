// Bridges the Admin Panel's Firestore data (src/admin-system) into the
// customer-facing storefront's Product shape (src/types), so that products
// added/edited/deleted in the Admin Panel show up live on the public store.
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../admin-system/firebase';
import { Product, ProductCategory } from '../types';
import type { Product as AdminProduct, Category as AdminCategory } from '../admin-system/AdminTypes';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?auto=format&fit=crop&w=1000&q=80';

// Best-effort mapping from a free-form Admin category name/slug to the
// storefront's fixed ProductCategory union used for filtering/routing.
function mapToStorefrontCategory(categoryName: string, categorySlug: string): ProductCategory {
  const text = `${categoryName} ${categorySlug}`.toLowerCase();
  if (text.includes('shilajit')) return 'shilajit';
  if (text.includes('dry') || text.includes('fruit') || text.includes('nut')) return 'dry-fruits';
  if (text.includes('natural') || text.includes('organic') || text.includes('honey') || text.includes('herb'))
    return 'natural-organic';
  if (text.includes('cap') || text.includes('pakol')) return 'traditional-caps';
  if (text.includes('wear') || text.includes('shawl') || text.includes('cloth') || text.includes('dress'))
    return 'traditional-wear';
  if (text.includes('handicraft') || text.includes('craft') || text.includes('art')) return 'handicrafts';
  if (text.includes('gift') || text.includes('box')) return 'gift-boxes';
  return 'natural-organic';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapAdminProductToStorefront(
  p: AdminProduct,
  categoriesById: Map<string, AdminCategory>
): Product {
  const categoryDoc = categoriesById.get(p.categoryId);
  const categoryName = categoryDoc?.name || 'Natural Products';
  const categorySlug = categoryDoc?.slug || '';
  const storefrontCategory = mapToStorefrontCategory(categoryName, categorySlug);

  const hasSale = typeof p.salePrice === 'number' && p.salePrice > 0 && p.salePrice < p.price;
  const finalPrice = hasSale ? (p.salePrice as number) : p.price;
  const oldPrice = hasSale ? p.price : undefined;
  const discountPercentage = hasSale ? Math.round(((p.price - (p.salePrice as number)) / p.price) * 100) : undefined;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug || slugify(p.name) || p.id,
    category: storefrontCategory,
    subCategory: undefined,
    shortDescription: p.description?.slice(0, 140) || p.name,
    description: p.description || '',
    price: finalPrice,
    oldPrice,
    discountPercentage,
    images: p.images && p.images.length > 0 ? p.images : [PLACEHOLDER_IMAGE],
    rating: 4.8,
    reviewCount: 0,
    stock: p.stock ?? 0,
    origin: 'Gilgit-Baltistan, Pakistan',
    featured: !!p.featured,
    valley: 'Hunza',
  };
}

// Live-syncs Admin Panel products (Firestore) into the storefront Product shape.
// Only products marked "Active" in the admin panel are returned.
export function useLiveStoreProducts(): { liveProducts: Product[]; liveProductsLoading: boolean } {
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [categoriesById, setCategoriesById] = useState<Map<string, AdminCategory>>(new Map());
  const [rawProducts, setRawProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const map = new Map<string, AdminCategory>();
        snapshot.forEach((docSnap) => {
          map.set(docSnap.id, { id: docSnap.id, ...(docSnap.data() as Omit<AdminCategory, 'id'>) });
        });
        setCategoriesById(map);
      },
      (error) => {
        console.error('Storefront: error loading categories for products:', error);
      }
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list: AdminProduct[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<AdminProduct, 'id'>) });
        });
        setRawProducts(list);
        setLoading(false);
      },
      (error) => {
        console.error('Storefront: error loading live products:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubCategories();
      unsubProducts();
    };
  }, []);

  useEffect(() => {
    const mapped = rawProducts
      .filter((p) => p.active !== false)
      .map((p) => mapAdminProductToStorefront(p, categoriesById));
    setLiveProducts(mapped);
  }, [rawProducts, categoriesById]);

  return { liveProducts, liveProductsLoading: loading };
}
