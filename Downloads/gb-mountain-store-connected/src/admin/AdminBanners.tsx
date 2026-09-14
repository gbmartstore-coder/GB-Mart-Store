import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../admin-system/firebase';
import { useStore } from '../admin-system/StoreContext';
import { Banner } from '../admin-system/AdminTypes';

export const AdminBanners: React.FC = () => {
  const { banners } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'Shop Mountain Harvest',
    buttonLink: '#products',
    active: true,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: 'Authentic Treasures of Gilgit-Baltistan',
      subtitle:
        '100% Pure Himalayan Shilajit resin, sun-dried Hunza apricots, paper shell walnuts, and hand-woven cultural mountain attire.',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Shop Mountain Harvest',
      buttonLink: '#products',
      active: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      buttonText: b.buttonText || 'Shop Mountain Harvest',
      buttonLink: b.buttonLink || '#products',
      active: b.active,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (b: Banner) => {
    try {
      await updateDoc(doc(db, 'banners', b.id), {
        active: !b.active,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating banner:', err);
    }
  };

  const handleDelete = async (b: Banner) => {
    if (window.confirm(`Delete banner "${b.title}"?`)) {
      try {
        await deleteDoc(doc(db, 'banners', b.id));
        setSuccessMsg(`Banner deleted.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Error deleting banner:', err);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (storage) {
        const fileRef = ref(storage, `banners/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setFormData((prev) => ({ ...prev, image: url }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setFormData((prev) => ({ ...prev, image: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Banner upload error, fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.image.trim()) {
      setErrorMsg('Banner headline title and image are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const payload: Omit<Banner, 'id'> = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        image: formData.image.trim(),
        buttonText: formData.buttonText.trim(),
        buttonLink: formData.buttonLink.trim(),
        active: formData.active,
        createdAt: editingBanner ? editingBanner.createdAt : now,
        updatedAt: now,
      };

      if (editingBanner) {
        await updateDoc(doc(db, 'banners', editingBanner.id), payload);
        setSuccessMsg('Banner updated successfully.');
      } else {
        await addDoc(collection(db, 'banners'), payload);
        setSuccessMsg('Banner created successfully.');
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving banner:', err);
      setErrorMsg('Failed to save banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Hero Banners Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure promotions, mountain hero photography, and headline announcements
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* List of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-stone-900 overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent" />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                      banner.active
                        ? 'bg-emerald-800/90 text-emerald-100'
                        : 'bg-stone-900/80 text-stone-300'
                    }`}
                  >
                    {banner.active ? 'Active on Homepage' : 'Hidden'}
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-bold text-base line-clamp-1">{banner.title}</h3>
                  <p className="text-xs text-stone-300 line-clamp-1">{banner.subtitle}</p>
                </div>
              </div>

              <div className="p-4 text-xs space-y-1 text-stone-600">
                <p>
                  Button Label: <strong className="text-stone-900">{banner.buttonText}</strong>
                </p>
                <p>
                  Link: <span className="font-mono text-stone-500">{banner.buttonLink}</span>
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 flex justify-end gap-2 bg-stone-50/50">
              <button
                onClick={() => handleOpenEdit(banner)}
                className="p-1.5 text-stone-600 hover:text-emerald-700 rounded-lg hover:bg-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(banner)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              {editingBanner ? 'Edit Banner' : 'Create Hero Banner'}
            </h3>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Background Mountain Image *
                </label>
                {formData.image && (
                  <div className="h-28 rounded-xl overflow-hidden border border-stone-200 mb-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <label className="px-3 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-700"
                  />
                  <span>Active & Displayed on Customer Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
