import React from 'react';
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAuth: () => void;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAuth, onNavigateToAdmin }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="font-sans font-bold text-lg text-white">
                {settings.storeName || 'GB Mart Store'}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              GB Mart Store is your trusted destination for authentic dry fruits, Himalayan shilajit, mountain honey, herbal wellness, and artisan crafts from Gilgit-Baltistan.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Guaranteed Pure Quality</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>Dry Fruits & Nuts</li>
              <li>Pure Shilajit & Mountain Honey</li>
              <li>Organic Herbal Teas & Oils</li>
              <li>Traditional Handcrafts & Shawls</li>
              <li>Gemstones & Minerals</li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>Nationwide Delivery Across Pakistan</li>
              <li>Safe Packaging & Purity Guarantee</li>
              <li>Wholesale & Bulk Orders</li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-white transition">
                  Customer Account Login
                </button>
              </li>
              
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address || 'Airport Road, Gilgit, Gilgit-Baltistan, Pakistan'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{settings.contactPhone || '+92 355 4123456'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{settings.contactEmail || 'support@gbmart.pk'}</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} {settings.storeName || 'GB Mart Store'}. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-gray-400">GB Mart Store Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
