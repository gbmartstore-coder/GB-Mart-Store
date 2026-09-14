import React, { useState } from 'react';
import { 
  Mountain, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  CreditCard 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const Footer: React.FC = () => {
  const { navigateTo, addToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      addToast('Thank you for subscribing to mountain dispatches!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#142820] text-[#E5DDCF] pt-16 pb-12 border-t border-[#234739]">
      {/* Newsletter Feature Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-[#1E3A2F] rounded-3xl p-8 sm:p-12 border border-[#2D5A44] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
              Dispatch From The Highlands
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white mt-1">
              Stay Connected With the Mountains
            </h3>
            <p className="text-sm text-[#C5BCA8] mt-2 leading-relaxed">
              Get seasonal harvest updates about dried apricots, fresh mountain blossom honey, handcrafted shawls, and stories from Gilgit-Baltistan communities.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-md">
            {isSubscribed ? (
              <div className="bg-[#2D5A44] text-white p-4 rounded-2xl flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-[#D4AF37]" />
                <span>You are subscribed! Welcome to our mountain family.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#142820] border border-[#2D5A44] text-white placeholder-[#8A9A92] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#142820] font-bold text-sm hover:bg-[#E5C358] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-[#8A9A92] mt-2 text-center lg:text-left">
              No spam. Unsubscribe anytime. We respect your inbox privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#234739]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                <img src="/assets/logo.png" alt={BRAND_CONFIG.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif-heading text-xl font-bold text-white tracking-tight">
                  {BRAND_CONFIG.name}
                </h4>
                <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                  Gilgit-Baltistan, Pakistan
                </p>
              </div>
            </div>

            <p className="text-sm text-[#A39B8B] leading-relaxed max-w-sm">
              "{BRAND_CONFIG.mainTagline}"
              <br />
              <span className="text-xs text-[#8A9A92] mt-1 block">
                {BRAND_CONFIG.secondaryTagline}
              </span>
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#A39B8B]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{BRAND_CONFIG.contact.headOffice}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{BRAND_CONFIG.contact.phone} (Mon - Sat)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{BRAND_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
              Shop Mountains
            </h5>
            <ul className="space-y-2.5 text-sm text-[#C5BCA8]">
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'dry-fruits')}
                  className="hover:text-white transition-colors"
                >
                  Dry Fruits & Nuts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'natural-organic')}
                  className="hover:text-white transition-colors"
                >
                  Natural & Blossom Honey
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'shilajit')}
                  className="hover:text-white transition-colors"
                >
                  Karakoram Shilajit
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'traditional-wear')}
                  className="hover:text-white transition-colors"
                >
                  Traditional Wear & Shawls
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'traditional-caps')}
                  className="hover:text-white transition-colors"
                >
                  Traditional GB Caps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'handicrafts')}
                  className="hover:text-white transition-colors"
                >
                  Handicrafts & Woodwork
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', undefined, 'gift-boxes')}
                  className="hover:text-white transition-colors"
                >
                  Royal Gift Boxes
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-sm text-[#C5BCA8]">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-white transition-colors">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Nationwide Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Easy Return & Exchange
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Authenticity Verification
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Corporate & Wedding Orders
                </button>
              </li>
            </ul>
          </div>

          {/* About & Socials Column */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
              Our Heritage
            </h5>
            <ul className="space-y-2.5 text-sm text-[#C5BCA8]">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Our Valley Story
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Local Producer Fair Trade
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Hunza & Baltistan Artisans
                </button>
              </li>
            </ul>

            <h5 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mt-6 mb-3">
              Follow Our Journey
            </h5>
            <div className="flex gap-3 text-xs text-[#A39B8B]">
              <a 
                href={BRAND_CONFIG.social.facebook} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E3A2F] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#142820] transition-colors"
                aria-label="Facebook"
              >
                FB
              </a>
              <a 
                href={BRAND_CONFIG.social.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E3A2F] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#142820] transition-colors"
                aria-label="Instagram"
              >
                IG
              </a>
              <a 
                href={BRAND_CONFIG.social.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E3A2F] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#142820] transition-colors"
                aria-label="YouTube"
              >
                YT
              </a>
              <a 
                href={BRAND_CONFIG.social.tiktok} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E3A2F] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#142820] transition-colors"
                aria-label="TikTok"
              >
                TT
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8A9A92]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="font-semibold text-[#D4AF37]">Accepted Payments in Pakistan:</span>
            <span className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded font-medium">Cash on Delivery (COD)</span>
            <span className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded font-medium">JazzCash</span>
            <span className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded font-medium">Easypaisa</span>
            <span className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded font-medium">Raast</span>
            <span className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded font-medium">Visa & Mastercard</span>
          </div>

          <p className="text-center md:text-right">
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Sourced with pride from Gilgit-Baltistan, Pakistan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
