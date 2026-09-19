import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { Banner } from '../../types';
import { createBanner, updateBanner, deleteBanner } from '../../services/db';
import { uploadImage } from '../../services/storage';

interface AdminBannersProps {
  banners: Banner[];
}

export const AdminBanners: React.FC<AdminBannersProps> = ({ banners }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [buttonText, setButtonText] = useState('Explore Harvest');
  const [link, setLink] = useState('#products');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80');
    setButtonText('Explore Products');
    setLink('#products');
    setActive(true);
    setOrder(banners.length);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setImage(b.image);
    setButtonText(b.buttonText || 'Explore Products');
    setLink(b.link || '#products');
    setActive(b.active);
    setOrder(b.order || 0);
    setError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, 'banners');
      setImage(url);
    } catch (err) {
      console.error('Banner upload failed:', err);
      alert('Failed to upload banner image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      setError('Title and banner image are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, {
          title: title.trim(),
          subtitle: subtitle.trim(),
          image: image.trim(),
          buttonText: buttonText.trim(),
          link: link.trim(),
          active,
          order: Number(order),
        });
      } else {
        await createBanner({
          title: title.trim(),
          subtitle: subtitle.trim(),
          image: image.trim(),
          buttonText: buttonText.trim(),
          link: link.trim(),
          active,
          order: Number(order),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Save banner error:', err);
      setError('Failed to save banner into Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (b: Banner) => {
    try {
      await updateBanner(b.id, { active: !b.active });
    } catch (err) {
      console.error('Toggle banner error:', err);
      alert('Could not update banner status.');
    }
  };

  const handleDelete = async (b: Banner) => {
    if (!window.confirm(`Delete banner "${b.title}"?`)) return;
    try {
      await deleteBanner(b.id);
    } catch (err) {
      console.error('Delete banner error:', err);
      alert('Failed to delete banner.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Hero Banners & Promotions</h2>
          <p className="text-xs text-stone-500">
            Control the top showcase carousel displayed on the customer storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover brightness-75"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(b)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow transition ${
                      b.active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800/80 text-stone-300'
                    }`}
                  >
                    {b.active ? 'Active' : 'Hidden'}
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                    Order index: {b.order}
                  </span>
                  <h3 className="text-base font-bold text-white font-serif line-clamp-1">
                    {b.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                  {b.subtitle}
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>Button: "{b.buttonText || 'Shop'}"</span>
                  <span>Target: {b.link || '#products'}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200/70 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(b)}
                className="p-1.5 rounded-lg text-emerald-800 hover:bg-emerald-100 transition text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(b)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                {editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Pure Karakoram Treasures"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sub-title / Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="100% pure Himalayan Shilajit, Hunza dried apricots, and organic walnuts."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Banner Background Image *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-24 rounded-xl object-cover border border-stone-200 mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Explore Harvest"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Active (Displayed on Storefront Hero)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
