export type ProductCategory =
  | 'all'
  | 'dry-fruits'
  | 'natural-organic'
  | 'shilajit'
  | 'traditional-wear'
  | 'traditional-caps'
  | 'handicrafts'
  | 'gift-boxes';

export interface ProductWeightOption {
  weight: string; // e.g. "250g", "500g", "1kg"
  price: number;
  oldPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subCategory?: string;
  shortDescription: string;
  description: string;
  price: number; // Base price for default weight/variant
  oldPrice?: number;
  discountPercentage?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  availableWeights?: ProductWeightOption[];
  availableSizes?: string[];
  availableColors?: string[];
  stock: number;
  origin: string; // e.g., "Hunza Valley, Gilgit-Baltistan", "Skardu, Gilgit-Baltistan"
  featured?: boolean;
  bestSeller?: boolean;
  ingredientsOrMaterial?: string;
  packagingInfo?: string;
  storageOrCare?: string;
  valley: 'Hunza' | 'Skardu' | 'Gilgit' | 'Astore' | 'Naltar' | 'Nagar' | 'Deosai';
  boxContents?: string[]; // For gift boxes
  authenticityNotes?: string; // For shilajit / organic items
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedWeight?: string;
  selectedSize?: string;
  selectedColor?: string;
  category: ProductCategory;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
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
  paymentStatus: 'Pending' | 'Paid';
}

export interface CustomerReview {
  id: string;
  productId: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
}
