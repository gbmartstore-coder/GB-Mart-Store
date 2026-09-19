import { Category, Subcategory, Product, Banner, StoreSettings } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'GB Mart Store',
  contactPhone: '+92 355 4123456',
  contactEmail: 'support@gbmart.pk',
  currency: 'PKR',
  deliveryFee: 250,
  freeDeliveryThreshold: 4000,
  announcementText: 'Welcome to GB Mart Store — Authentic Gilgit-Baltistan Products Delivered to Your Doorstep',
  address: 'Airport Road, Gilgit, Gilgit-Baltistan, Pakistan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const INITIAL_BANNERS: Omit<Banner, 'id'>[] = [
  {
    title: 'GB Mart Store — Pure & Authentic',
    subtitle: '100% Pure Shilajit, Mountain Wild Honey, and Sun-Dried Hunza Apricots direct from Gilgit-Baltistan.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    link: '#products-grid-section',
    buttonText: 'Shop All Products',
    active: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Pure Himalayan Shilajit (Salajeet)',
    subtitle: 'Golden grade purified resin rich in fulvic acid and minerals direct from Gilgit-Baltistan.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    link: '#products-grid-section',
    buttonText: 'Shop Shilajit',
    active: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Authentic Dry Fruits & Handcrafts',
    subtitle: 'Organic Hunza dried apricots, soft-shell walnuts, almonds, and handmade woolen shawls.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1600&q=80',
    link: '#products-grid-section',
    buttonText: 'Explore Categories',
    active: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_CATEGORIES: Array<{
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
}> = [
  {
    id: 'dry-fruits',
    name: 'Dry Fruits & Nuts',
    slug: 'dry-fruits',
    description: 'Naturally dried organic apricots, soft-shell Kagzi walnuts, roasted almonds, and wild pine nuts (Chilgoza).',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'honey-shilajit',
    name: 'Mountain Honey & Shilajit',
    slug: 'honey-shilajit',
    description: 'Gold-grade purified Himalayan Shilajit (Salajeet) and raw wild blossom mountain honey collected from alpine cliffs.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'herbal-wellness',
    name: 'Herbal Teas & Oils',
    slug: 'herbal-wellness',
    description: 'Ancient mountain remedies, high-altitude wild thyme (Tumuro tea), and cold-pressed apricot kernel oil.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'handicrafts-shawls',
    name: 'Handicrafts & Pashmina',
    slug: 'handicrafts-shawls',
    description: 'Authentic handwoven Hunza woolen shawls, pure Himalayan pashmina, and traditional Gilgiti feather caps (Pakol).',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'gemstones',
    name: 'Gemstones & Minerals',
    slug: 'gemstones',
    description: 'Natural untreated mineral specimens and gemstones from the world-famous pegmatites of Skardu and Shigar.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
];

export const INITIAL_SUBCATEGORIES: Array<{
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  active: boolean;
}> = [
  { id: 'sub-apricots', name: 'Dried Apricots', slug: 'dried-apricots', categoryId: 'dry-fruits', active: true },
  { id: 'sub-walnuts', name: 'Walnuts (Akhrot)', slug: 'walnuts', categoryId: 'dry-fruits', active: true },
  { id: 'sub-chilgoza', name: 'Pine Nuts (Chilgoza)', slug: 'pine-nuts-chilgoza', categoryId: 'dry-fruits', active: true },
  { id: 'sub-almonds', name: 'Almonds (Badam)', slug: 'almonds', categoryId: 'dry-fruits', active: true },
  
  { id: 'sub-shilajit', name: 'Pure Shilajit (Salajeet)', slug: 'shilajit', categoryId: 'honey-shilajit', active: true },
  { id: 'sub-raw-honey', name: 'Wildflower Honey', slug: 'wildflower-honey', categoryId: 'honey-shilajit', active: true },
  
  { id: 'sub-tumuro', name: 'Tumuro Wild Thyme', slug: 'tumuro-tea', categoryId: 'herbal-wellness', active: true },
  { id: 'sub-apricot-oil', name: 'Apricot Kernel Oil', slug: 'apricot-oil', categoryId: 'herbal-wellness', active: true },
  
  { id: 'sub-shawls', name: 'Pashmina & Shawls', slug: 'pashmina-shawls', categoryId: 'handicrafts-shawls', active: true },
  { id: 'sub-caps', name: 'Traditional Gilgiti Caps', slug: 'gilgiti-caps', categoryId: 'handicrafts-shawls', active: true },
  
  { id: 'sub-minerals', name: 'Aquamarine & Quartz', slug: 'aquamarine-quartz', categoryId: 'gemstones', active: true },
];

export const INITIAL_PRODUCTS: Array<{
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  price: number;
  salePrice: number | null;
  unit: string;
  stock: number;
  images: string[];
  featured: boolean;
  active: boolean;
}> = [
  {
    id: 'prod-apricot-hunza',
    name: 'Hunza Sun-Dried Organic Apricots',
    slug: 'hunza-sun-dried-organic-apricots',
    categoryId: 'dry-fruits',
    subcategoryId: 'sub-apricots',
    description: 'Sun-dried naturally under the high Karakoram sun in Karimabad, Hunza. Unsulfured, naturally sweet, and rich in potassium, vitamin A, and dietary fiber. An age-old staple of Hunza longevity.',
    price: 1450,
    salePrice: 1250,
    unit: '1 kg',
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-shilajit-gold',
    name: 'Pure Himalayan Shilajit (Salajeet) - Gold Grade',
    slug: 'pure-himalayan-shilajit-gold-grade',
    categoryId: 'honey-shilajit',
    subcategoryId: 'sub-shilajit',
    description: 'Extracted from steep mountain crags at over 16,000 feet in Gilgit-Baltistan. Traditionally purified through sun-filtration and glacier water. Contains over 85 ionic trace minerals and 70%+ fulvic acid for stamina, cognitive vitality, and immune strength.',
    price: 3800,
    salePrice: 3400,
    unit: '50g Glass Jar',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-honey-wild',
    name: 'Karakoram Wild Alpine Blossom Honey',
    slug: 'karakoram-wild-alpine-blossom-honey',
    categoryId: 'honey-shilajit',
    subcategoryId: 'sub-raw-honey',
    description: 'Raw, unfiltered honey collected by Apis dorsata mountain bees foraging on wild Russian olive flowers, Tumuro thyme, and alpine clover in the high valleys of Nagar and Ghizer. Unpasteurized and full of live enzymes.',
    price: 2600,
    salePrice: null,
    unit: '500g Jar',
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-walnuts-kagzi',
    name: 'Kagzi Soft-Shell Walnuts (Akhrot)',
    slug: 'kagzi-soft-shell-walnuts-akhrot',
    categoryId: 'dry-fruits',
    subcategoryId: 'sub-walnuts',
    description: 'Extra crispy and easily crackable by hand. Grown in mountain orchards irrigated with mineral-rich glacial meltwater. High in Omega-3 DHA fatty acids, brain-nourishing antioxidants, and rich natural oils.',
    price: 1850,
    salePrice: 1650,
    unit: '1 kg',
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-pine-nuts-chilgoza',
    name: 'Handpicked Skardu Pine Nuts (Chilgoza)',
    slug: 'handpicked-skardu-pine-nuts-chilgoza',
    categoryId: 'dry-fruits',
    subcategoryId: 'sub-chilgoza',
    description: 'Finest quality wild pine nuts harvested from the virgin pine forests of Astore and Diamer. Large jumbo grain size, exquisitely buttery texture, and rich in heart-healthy mono-unsaturated fats.',
    price: 8500,
    salePrice: 7900,
    unit: '500g Bag',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1543208543-6042c3b7d52b?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-tumuro-tea',
    name: 'Hunza Tumuro Wild Mountain Herbal Tea',
    slug: 'hunza-tumuro-wild-mountain-herbal-tea',
    categoryId: 'herbal-wellness',
    subcategoryId: 'sub-tumuro',
    description: 'Wild alpine thyme hand-harvested at 3,500 meters altitude. Brewed for centuries across northern Pakistan for respiratory clarity, calm digestion, and warming the body against mountain cold.',
    price: 800,
    salePrice: null,
    unit: '150g Pouch',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    active: true,
  },
  {
    id: 'prod-apricot-oil',
    name: 'Pure Cold-Pressed Apricot Kernel Oil',
    slug: 'pure-cold-pressed-apricot-kernel-oil',
    categoryId: 'herbal-wellness',
    subcategoryId: 'sub-apricot-oil',
    description: 'Extracted using traditional wooden expellers from sweet Hunza apricot seeds. Highly nourishing for skin glow, hair conditioning, and gentle culinary dressing. Contains naturally concentrated vitamin E.',
    price: 1250,
    salePrice: 1100,
    unit: '250ml Glass Bottle',
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-pashmina-shawl',
    name: 'Master-Weave Gilgit Himalayan Pashmina Shawl',
    slug: 'master-weave-gilgit-himalayan-pashmina-shawl',
    categoryId: 'handicrafts-shawls',
    subcategoryId: 'sub-shawls',
    description: 'Crafted with fine undercoat wool of mountain Capra Hircus cashmere goats. Woven on traditional handlooms in Gilgit with classic borders. Exceptionally lightweight, supple, and luxuriously warm.',
    price: 14500,
    salePrice: 12900,
    unit: '1 Piece',
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    active: true,
  },
  {
    id: 'prod-gilgiti-cap',
    name: 'Traditional Gilgiti Woolen Feather Cap (Pakol)',
    slug: 'traditional-gilgiti-woolen-feather-cap-pakol',
    categoryId: 'handicrafts-shawls',
    subcategoryId: 'sub-caps',
    description: 'Authentic pure sheep wool round cap featuring traditional embroidery and ceremonial Monal pheasant feather plume ornament. Handcrafted in Hunza valley.',
    price: 2200,
    salePrice: 1950,
    unit: '1 Piece',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    active: true,
  },
  {
    id: 'prod-skardu-aquamarine',
    name: 'Natural Skardu Gem-Grade Aquamarine Specimen',
    slug: 'natural-skardu-gem-grade-aquamarine-specimen',
    categoryId: 'gemstones',
    subcategoryId: 'sub-minerals',
    description: 'Sky-blue hexagonal beryl crystal discovered in the pegmatite veins of Dassu, Shigar Valley, Baltistan. Completely natural, unheated, with pristine termination and mica matrix.',
    price: 9800,
    salePrice: null,
    unit: '1 Display Specimen',
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    active: true,
  },
];
