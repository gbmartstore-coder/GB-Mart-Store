import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Check,
  AlertCircle,
  Building,
  Phone,
  Mail,
  Truck,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../admin-system/firebase';
import { useStore } from '../admin-system/StoreContext';
import { StoreSettings } from '../admin-system/AdminTypes';

export const AdminSettings: React.FC = () => {
  const { settings } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({
    storeName: 'GB Mountain Store',
    currency: 'Rs.',
    deliveryCharges: 250,
    phone: '+92 355 1234567',
    WhatsApp: '+92 355 1234567',
    email: 'info@gbmountainstore.pk',
    address: 'Main Bazaar, Gilgit & Aliabad, Hunza, Gilgit-Baltistan',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload: StoreSettings = {
        storeName: formData.storeName.trim(),
        currency: formData.currency.trim(),
        deliveryCharges: Number(formData.deliveryCharges) || 0,
        phone: formData.phone.trim(),
        WhatsApp: formData.WhatsApp.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      await setDoc(doc(db, 'settings', 'store_config'), payload, { merge: true });
      setSuccessMsg('Store settings saved and updated across the customer website.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMsg('Failed to save settings: ' + (err?.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <h2 className="text-xl font-bold text-stone-900">Store Global Settings</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Control store branding, currency code, delivery flat rate, and regional contact lines
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Store Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Brand Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-settings-store-name"
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Currency Display Symbol / Text
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-settings-currency"
                type="text"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="Rs."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Delivery Charges */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nationwide Delivery Flat Fee
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-settings-delivery"
                type="number"
                required
                min="0"
                value={formData.deliveryCharges}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryCharges: Number(e.target.value) })
                }
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Support Phone Call Line
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-settings-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 355 1234567"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Official WhatsApp Orders Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-settings-whatsapp"
                type="text"
                value={formData.WhatsApp}
                onChange={(e) => setFormData({ ...formData, WhatsApp: e.target.value })}
                placeholder="+92 355 1234567"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-settings-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@gbmountainstore.pk"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Headquarters / Physical Hub Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <textarea
                id="admin-settings-address"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop address in Gilgit / Skardu / Hunza"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            id="admin-settings-save-btn"
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Firestore...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
