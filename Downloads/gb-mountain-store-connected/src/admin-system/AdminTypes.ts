export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  price: number;
  salePrice?: number;
  unit: string;
  stock: number;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'JazzCash / EasyPaisa';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  id?: string;
  storeName: string;
  phone: string;
  WhatsApp: string;
  email: string;
  address: string;
  deliveryCharges: number;
  minimumOrder?: number;
  currency: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
