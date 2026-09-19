import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Settings, Truck, DollarSign, Store } from 'lucide-react';
import { StoreSettings } from '../../types';
import { updateStoreSettings } from '../../services/db';

interface AdminSettingsProps {
  settings: StoreSettings;
  onSettingsUpdated: (updated: StoreSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName || 'Gilgit-Baltistan Mountain Store');
  const [email, setEmail] = useState(settings.email || 'info@mountainstore.gb');
  const [phone, setPhone] = useState(settings.phone || '+92 300 1234567');
  const [currency, setCurrency] = useState(settings.currency || 'PKR');
  const [deliveryFee, setDeliveryFee] = useState<number>(settings.deliveryFee || 250);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(
    settings.freeDeliveryThreshold || 4000
  );
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText || '🏔️ Pure Himalayan Shilajit, Hunza Organic Apricots & Dry Fruits — Direct from Karakoram'
  );
  const [address, setAddress] = useState(settings.address || 'Karakoram Highway, Jutial, Gilgit, GB, Pakistan');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setStoreName(settings.storeName || 'Gilgit-Baltistan Mountain Store');
    setEmail(settings.email || 'info@mountainstore.gb');
    setPhone(settings.phone || '+92 300 1234567');
    setCurrency(settings.currency || 'PKR');
    setDeliveryFee(settings.deliveryFee || 250);
    setFreeDeliveryThreshold(settings.freeDeliveryThreshold || 4000);
    setAnnouncementText(settings.announcementText || '');
    setAddress(settings.address || '');
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated: StoreSettings = {
        storeName: storeName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        contactEmail: email.trim(),
        contactPhone: phone.trim(),
        currency: currency.trim(),
        deliveryFee: Number(deliveryFee),
        freeDeliveryThreshold: Number(freeDeliveryThreshold),
        announcementText: announcementText.trim(),
        address: address.trim(),
        createdAt: settings.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await updateStoreSettings(updated);
      onSettingsUpdated(updated);
      setSuccess('Store settings saved and updated across the live customer storefront!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Save settings error:', err);
      setError('Failed to update store settings in Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold font-serif text-stone-900">Storefront Configuration</h2>
        <p className="text-xs text-stone-500">
          Control branding, announcement bar, shipping rates, and contact details across the website.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        {/* Brand identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-emerald-800" />
            <span>Brand & Identity</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Top Announcement Banner (Displayed at top of website)
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. Free shipping on all orders over Rs. 4,000 across Pakistan"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            />
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-800" />
            <span>Delivery & Shipping Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Standard Delivery Charge (PKR)
              </label>
              <input
                type="number"
                required
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Free Delivery Order Threshold (PKR)
              </label>
              <input
                type="number"
                required
                min="0"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Orders with subtotal above this amount get free shipping automatically.
              </span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Official Store Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Support Phone / WhatsApp
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Dispatch & Warehouse Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Firestore...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
