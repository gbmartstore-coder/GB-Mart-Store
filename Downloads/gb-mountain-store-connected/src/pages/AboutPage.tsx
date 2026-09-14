import React from 'react';
import { 
  Mountain, 
  Heart, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Sun,
  Compass
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Hero Header */}
      <section className="relative min-h-[55vh] flex items-center bg-[#1E3A2F] text-white overflow-hidden rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
            alt="Gilgit-Baltistan mountain valley"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#142820]/90 via-[#1E3A2F]/70 to-transparent" />
        </div>

        <div className="relative z-10 py-16 max-w-2xl space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] flex items-center gap-1.5">
            <Mountain className="w-4 h-4" />
            Our Mountain Heritage
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
            From the Mountains of Gilgit-Baltistan to Your Doorstep
          </h1>
          <p className="text-sm sm:text-base text-[#E5DDCF] font-light leading-relaxed">
            {BRAND_CONFIG.name} was born out of a profound love for the Karakoram, Himalayan, and Hindu Kush highlands, and a commitment to bring their natural riches directly to homes across Pakistan.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-[#272F2C]">
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
            The Journey & Purpose
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D]">
            Preserving Purity in the High Valleys
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#596561]">
            For generations, the remote villages of Hunza, Nagar, Skardu, Shigar, and Astore have cultivated organic apricots, gathered wildflower blossom honey from mountain bees, and collected potent shilajit from sheer rock walls above the clouds.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-[#596561]">
            Yet, finding genuine, unadulterated products in Pakistani metropolitan centers like Karachi, Lahore, and Islamabad has always been fraught with imitation, artificial sugar syrups, and industrial chemical preservatives. We built {BRAND_CONFIG.name} to bridge this distance with complete transparency and trust.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E8E2D5] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#2D5A44]" />
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
              Uncompromising Authenticity
            </h3>
            <p className="text-xs text-[#596561] leading-relaxed">
              Every jar of honey, pouch of almonds, and block of shilajit is authenticated at the source. Zero artificial additives, chemical bleaching, or refined corn syrups.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E8E2D5] space-y-2">
            <Users className="w-6 h-6 text-[#2D5A44]" />
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
              Fair Producer Compensation
            </h3>
            <p className="text-xs text-[#596561] leading-relaxed">
              We eliminate predatory middle-men by purchasing directly from cooperative family farms and village women embroiderers at ethical, sustainable fair-market prices.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E8E2D5] space-y-2">
            <Heart className="w-6 h-6 text-[#2D5A44]" />
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
              Cultural Conservation
            </h3>
            <p className="text-xs text-[#596561] leading-relaxed">
              From traditional wool caps with monal pheasant feathers to centuries-old balti walnut wood carving, we provide northern artisans with nationwide visibility and steady income.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E8E2D5] space-y-2">
            <Sun className="w-6 h-6 text-[#2D5A44]" />
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
              Nature-Powered Processing
            </h3>
            <p className="text-xs text-[#596561] leading-relaxed">
              Our fruits are naturally sun-dried on clean mountain rooftops under pure ultraviolet light, preserving natural fructose and therapeutic vitamins.
            </p>
          </div>
        </div>
      </section>

      {/* Valleys Showcase */}
      <section className="bg-[#FAF9F5] py-16 border-y border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
              The Landscapes
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1A1F1D]">
              Where Our Products Originate
            </h2>
            <p className="text-xs text-[#596561]">
              Explore the legendary valleys whose microclimates and alpine soils nurture our entire catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_CONFIG.valleys.map((valley, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs space-y-3 p-4">
                <div className="aspect-16/10 rounded-xl overflow-hidden bg-[#F5EFE6]">
                  <img
                    src={valley.image}
                    alt={valley.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-heading font-bold text-base text-[#1A1F1D]">{valley.name}</h4>
                    <span className="text-[10px] bg-[#FAF9F5] border border-[#E8E2D5] px-2 py-0.5 rounded font-semibold text-[#8C6239]">
                      Alt. {valley.altitude}
                    </span>
                  </div>
                  <p className="text-xs text-[#596561] leading-relaxed">{valley.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slogan Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1E3A2F]">
          "From Our Mountains. To Your Home."
        </h3>
        <p className="text-xs sm:text-sm text-[#596561] max-w-xl mx-auto leading-relaxed">
          Experience the untamed purity of Gilgit-Baltistan. Your order directly supports over 60 highland farming families and artisan cooperatives.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white text-xs sm:text-sm font-bold shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Shop Authentic Harvest</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
