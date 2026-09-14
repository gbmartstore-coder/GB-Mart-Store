/**
 * CENTRAL BRAND & STORE CONFIGURATION
 * 
 * To customize the brand, simply edit the values below.
 * Everything across the site will automatically update!
 */

export const BRAND_CONFIG = {
  // Brand Name Placeholder: change this string to your official brand name
  name: 'GB Mart Store',
  
  // Taglines
  mainTagline: 'From the Mountains of Gilgit-Baltistan to Your Doorstep',
  secondaryTagline: 'From Our Mountains. To Your Home.',
  
  // Currency settings (Pakistan Rupee)
  currency: {
    symbol: 'Rs.',
    code: 'PKR',
    format: (amount: number) => `Rs. ${amount.toLocaleString('en-PK')}`,
  },

  // Free shipping threshold in PKR
  freeShippingThreshold: 3000,
  standardShippingFee: 200,
  expressShippingFee: 450,

  // Contact Placeholders (easily replace with your real details)
  contact: {
    phone: '+92 300 0000000',
    whatsapp: '+92 300 0000000',
    email: 'contact@brandname.pk',
    supportEmail: 'support@brandname.pk',
    headOffice: 'Karakoram Highway, Main Bazaar, Gilgit, Gilgit-Baltistan, Pakistan',
    fulfillmentCenter: 'Islamabad Distribution Hub, Sector I-9, Islamabad, Pakistan',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM PKT',
  },

  // Social Links Placeholders
  social: {
    facebook: 'https://facebook.com/placeholder',
    instagram: 'https://instagram.com/placeholder',
    youtube: 'https://youtube.com/placeholder',
    tiktok: 'https://tiktok.com/placeholder',
    whatsappDirect: 'https://wa.me/923000000000',
  },

  // Six Core Trust Badges
  trustPoints: [
    {
      title: 'Authentic Gilgit-Baltistan',
      description: '100% genuine products sourced directly from high mountain valleys.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Quality Checked',
      description: 'Hand-sorted and lab tested for purity, freshness, and organic standards.',
      icon: 'CheckCircle',
    },
    {
      title: 'Local Producer Direct',
      description: 'Fair-trade compensation directly supporting valley farmers and artisans.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Secure Eco Packaging',
      description: 'Aroma-sealed & protective moisture-lock packaging for nationwide transit.',
      icon: 'PackageCheck',
    },
    {
      title: 'Nationwide Fast Delivery',
      description: 'Prompt shipping to all cities, towns, and villages across Pakistan.',
      icon: 'Truck',
    },
    {
      title: 'Cash on Delivery',
      description: 'Pay comfortably at your doorstep or via fast secure digital transfer.',
      icon: 'Banknote',
    },
  ],

  // Key mountain valleys represented
  valleys: [
    {
      name: 'Hunza Valley',
      altitude: '2,438 m',
      specialty: 'Sun-dried sweet apricots, high altitude walnuts, apricot oil',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Skardu & Baltistan',
      altitude: '2,228 m',
      specialty: 'Chilgoza pine nuts, mountain honey, pure Himalayan shilajit',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Gilgit Valley',
      altitude: '1,500 m',
      specialty: 'Almonds, mulberries, traditional wool caps, embroidered waistcoats',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Astore & Deosai',
      altitude: '4,114 m',
      specialty: 'Wild mountain herbs, organic flora honey, sea buckthorn berries',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    },
  ],
};
