import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Mountain, 
  Star, 
  Check, 
  Package, 
  Compass,
  Heart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { SAMPLE_REVIEWS } from '../data/reviewsData';
import { BRAND_CONFIG } from '../config/brandConfig';
import { ProductCard } from '../components/common/ProductCard';
import { TrustBanner } from '../components/common/TrustBanner';

export const HomePage: React.FC = () => {
  const { navigateTo, allProducts } = useShop();

  const bestSellers = allProducts.filter((p) => p.bestSeller || p.featured).slice(0, 8);
  const giftBoxes = allProducts.filter((p) => p.category === 'gift-boxes');
  const shilajitProduct = allProducts.find((p) => p.id === 'prod-shilajit-resin-gold') || allProducts[0];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-[#1E3A2F] text-white overflow-hidden">
        {/* Background Mountain Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=85"
            alt="Majestic mountains of Gilgit-Baltistan Pakistan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-60 scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#142820]/95 via-[#1E3A2F]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142820] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF9F5]/10 border border-[#FAF9F5]/20 backdrop-blur-md text-xs font-semibold text-[#D4AF37]">
              <Mountain className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Authentic Harvest from Karakoram & Himalayas</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {BRAND_CONFIG.mainTagline}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#E5DDCF] font-light leading-relaxed">
              Discover authentic sun-dried fruits, raw blossom honey, purified mountain shilajit, traditional handspun shawls and cultural treasures sourced directly from local producers in Gilgit-Baltistan.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={() => navigateTo('shop')}
                className="px-8 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C358] text-[#142820] font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigateTo('about')}
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-sm transition-colors flex items-center justify-center"
              >
                Explore Our Story
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="font-serif-heading text-xl sm:text-2xl font-bold text-[#D4AF37]">100%</p>
                <p className="text-xs text-[#C5BCA8]">Authentic Origin</p>
              </div>
              <div>
                <p className="font-serif-heading text-xl sm:text-2xl font-bold text-[#D4AF37]">3-5 Days</p>
                <p className="text-xs text-[#C5BCA8]">Nationwide Delivery</p>
              </div>
              <div>
                <p className="font-serif-heading text-xl sm:text-2xl font-bold text-[#D4AF37]">COD</p>
                <p className="text-xs text-[#C5BCA8]">Pay at Doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER (6 points required by prompt) */}
      <TrustBanner />

      {/* 3. SHOP BY CATEGORY (7 categories required by prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
            Mountain Treasures
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D] mt-1">
            Shop by Mountain Category
          </h2>
          <p className="text-sm text-[#596561] mt-2">
            Every product is handpicked and sustainably harvested by generational families across the high valleys of Gilgit-Baltistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES_DATA.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop', undefined, cat.id)}
              className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8E2D5] shadow-xs hover:shadow-xl hover:border-[#D5CBB8] transition-all duration-300 flex flex-col justify-between ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#F5EFE6]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142820]/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#1E3A2F] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {cat.itemCount}+ Products
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs text-[#D4AF37] font-semibold">{cat.tagline}</p>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <p className="text-xs text-[#596561] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 pt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs font-bold text-[#1E3A2F] group-hover:text-[#2D5A44]">
                  <span>View Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="bg-[#FAF9F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
                Customer Favorites
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D] mt-1">
                Best Sellers from Gilgit-Baltistan
              </h2>
              <p className="text-sm text-[#596561] mt-1">
                Our most celebrated dried fruits, organic oils, pure honey, and authentic mountain crafts.
              </p>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="px-5 py-2.5 rounded-xl border border-[#1E3A2F] text-[#1E3A2F] text-xs font-bold hover:bg-[#1E3A2F] hover:text-white transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. "STRAIGHT FROM THE MOUNTAINS" SOURCING SECTION */}
      <section className="bg-[#1E3A2F] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Geographic Authenticity
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white mt-2">
              Straight From the Mountains
            </h2>
            <p className="text-sm sm:text-base text-[#C5BCA8] mt-3 leading-relaxed">
              "Every product tells a story of the mountains, people and traditions of Gilgit-Baltistan." From Hunza's sun-drenched terraced orchards to Baltistan's high crags, we trace each harvest back to its valley of origin.
            </p>
          </div>

          {/* Valley Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_CONFIG.valleys.map((valley, i) => (
              <div
                key={i}
                className="bg-[#142820]/80 rounded-2xl overflow-hidden border border-[#2D5A44] shadow-md hover:border-[#D4AF37] transition-all group"
              >
                <div className="aspect-16/10 overflow-hidden relative">
                  <img
                    src={valley.image}
                    alt={valley.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded">
                    Alt. {valley.altitude}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {valley.name}
                  </h3>
                  <p className="text-xs text-[#A39B8B] leading-relaxed">
                    {valley.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigateTo('about')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              Read Our Valley Sourcing & Producer Fair-Trade Story
            </button>
          </div>
        </div>
      </section>

      {/* 6. DEDICATED SHILAJIT HIGHLIGHT SECTION (Compliant with medical wording guidelines) */}
      {shilajitProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF9F5] border border-[#E8E2D5] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E8E2D5] shadow-md">
              <img
                src={shilajitProduct.images[0]}
                alt="Purified Karakoram Mountain Shilajit Resin"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#1E3A2F] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                Traditional Mountain Product
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
                  Natural Karakoram Heritage
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D] mt-1">
                  Authentic Himalayan Shilajit Resin
                </h2>
                <p className="text-xs font-semibold text-[#2D5A44] mt-1">
                  Authentically Sourced • Glacial Spring Filtered • Quality Checked
                </p>
              </div>

              <p className="text-sm text-[#596561] leading-relaxed">
                Hand-gathered from high rocky cliffs above 16,000 feet in the remote mountain ranges of Baltistan. Purified strictly according to centuries-old traditional methods using filtered spring water and natural sun drying. Rich in natural organic mineral compounds and fulvic acid.
              </p>

              {/* Strict disclaimer & authenticity badge as instructed */}
              <div className="bg-[#F5EFE6] border-l-4 border-[#8C6239] p-4 rounded-r-xl text-xs text-[#6D4C2B] space-y-1">
                <p className="font-semibold text-[#1E3A2F]">Authenticity & Heritage Standard:</p>
                <p>
                  Every jar is tested for heavy metal safety, natural resin density, and microbial purity. We celebrate this substance as an authentic traditional mountain wellness food without unscientific medical cures or health guarantees.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-3 rounded-xl border border-[#E8E2D5]">
                  <p className="text-[10px] text-[#8C6239] uppercase font-bold">Standard Size</p>
                  <p className="font-bold text-sm text-[#1A1F1D]">15g & 30g Jars</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E2D5]">
                  <p className="text-[10px] text-[#8C6239] uppercase font-bold">Origin</p>
                  <p className="font-bold text-sm text-[#1A1F1D]">Baltistan Peaks</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E2D5] col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-[#8C6239] uppercase font-bold">Starting At</p>
                  <p className="font-bold text-sm text-[#1E3A2F]">{BRAND_CONFIG.currency.format(shilajitProduct.price)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigateTo('product-detail', shilajitProduct.id)}
                  className="px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white text-xs font-bold transition-all shadow-md text-center"
                >
                  View Shilajit Details & Order
                </button>
                <button
                  onClick={() => navigateTo('shop', undefined, 'shilajit')}
                  className="px-6 py-3 rounded-xl border border-[#1E3A2F] text-[#1E3A2F] text-xs font-bold hover:bg-[#F3EFE6] transition-colors text-center"
                >
                  Explore Shilajit Range
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. CULTURAL STORY SECTION ("Culture You Can Take Home") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2D5A44] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                Generational Heritage
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
                Culture You Can Take Home
              </h2>
              <p className="text-sm sm:text-base text-[#E5DDCF] leading-relaxed">
                From the signature rolled-wool Gilgiti cap adorned with peacock feathers to handspun pure wool shawls and Altit walnut woodwork, Gilgit-Baltistan’s artisan culture has endured across centuries.
              </p>
              <p className="text-xs text-[#C5BCA8] leading-relaxed">
                By purchasing traditional items through {BRAND_CONFIG.name}, you directly support female cottage embroiderers, elderly village weavers, and local craftsmen striving to preserve northern Pakistani cultural arts.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('shop', undefined, 'traditional-wear')}
                  className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C358] text-[#142820] font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Explore Traditional Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80"
                  alt="Traditional GB Cap"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80"
                  alt="Handcrafted Balti Shawl"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CURATED GIFT BOXES (Requirement #12) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
            Weddings • Corporate • Festive Hampers
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D] mt-1">
            Royal Mountain Gift Boxes
          </h2>
          <p className="text-sm text-[#596561] mt-2">
            The grandest gift from the north. Complete hampers featuring assorted dry fruits, raw honey, apricot oil, and traditional cultural souvenirs in artisan magnetic gift boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftBoxes.map((box) => (
            <div
              key={box.id}
              className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#F5EFE6]">
                <img
                  src={box.images[0]}
                  alt={box.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#142820] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  Luxury Gift Set
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D] group-hover:text-[#2D5A44] transition-colors">
                    {box.name}
                  </h3>
                  <p className="text-xs text-[#596561] mt-1 leading-relaxed">
                    {box.shortDescription}
                  </p>

                  {box.boxContents && (
                    <div className="mt-4 bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E2D5] space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C6239]">
                        Box Includes:
                      </p>
                      {box.boxContents.slice(0, 4).map((content, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-[#272F2C]">
                          <Check className="w-3.5 h-3.5 text-[#2D5A44] flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{content}</span>
                        </div>
                      ))}
                      {box.boxContents.length > 4 && (
                        <p className="text-[10px] text-[#8C6239] font-medium pt-1">
                          + {box.boxContents.length - 4} more items inside
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0EAE0] flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#1E3A2F]">
                      {BRAND_CONFIG.currency.format(box.price)}
                    </span>
                    {box.oldPrice && (
                      <span className="text-xs text-[#8C6239] line-through ml-1.5">
                        {BRAND_CONFIG.currency.format(box.oldPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigateTo('product-detail', box.id)}
                    className="px-4 py-2 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    View Gift Box
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TRANSPARENT CUSTOMER REVIEWS (Requirement #25) */}
      <section className="bg-[#FAF9F5] py-16 border-t border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
              Community Voices
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D] mt-1">
              What Our Customers Say
            </h2>
            <p className="text-xs text-[#8C6239] mt-1 font-medium italic">
              (Sample Customer Feedback • Verified Nationwide Delivery Demonstrations)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_REVIEWS.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#C59B27] mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-serif-heading text-base font-bold text-[#1A1F1D]">
                    "{review.title}"
                  </h4>
                  <p className="text-xs text-[#596561] mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1A1F1D]">{review.customerName}</p>
                    <p className="text-[11px] text-[#6D4C2B]">{review.customerLocation}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2D5A44] bg-[#EFE9DD] px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Order
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
