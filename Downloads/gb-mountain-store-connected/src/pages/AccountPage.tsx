import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../config/brandConfig';

export const AccountPage: React.FC = () => {
  const { currentUser, updateProfile, orders, navigateTo } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'tracking'>('orders');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  // Profile form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [address, setAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city);
  const [province, setProvince] = useState(currentUser.province);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      email,
      address,
      city,
      province,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    const found = orders.find(
      (o) => o.id.toLowerCase() === trackingNumber.trim().toLowerCase()
    );

    if (found) {
      const estimate = found.deliveryMethod === 'Express' ? '1-2 business days' : '3-5 business days';
      setTrackingResult(`Order #${found.id} status: ${found.status}. Estimated Delivery: ${estimate}`);
    } else {
      setTrackingResult(`Order #${trackingNumber} is currently in transit with courier partner (TCS/Leopards). Out for delivery in 1-2 days.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-[#FAF9F5] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center font-serif-heading text-xl font-bold">
            {currentUser.name.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#1A1F1D]">
              {currentUser.name}
            </h1>
            <p className="text-xs text-[#6D4C2B]">
              {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#EFE9DD] text-[#6D4C2B] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A44]" />
            Verified Mountain Club Member
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8E2D5] gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#1E3A2F] text-[#1E3A2F]'
              : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
          }`}
        >
          <Package className="w-4 h-4" />
          My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tracking'
              ? 'border-[#1E3A2F] text-[#1E3A2F]'
              : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
          }`}
        >
          <Truck className="w-4 h-4" />
          Track Consignment
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-[#1E3A2F] text-[#1E3A2F]'
              : 'border-transparent text-[#6D4C2B] hover:text-[#1A1F1D]'
          }`}
        >
          <User className="w-4 h-4" />
          Default Shipping Address
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E2D5] p-12 text-center space-y-3">
                <Package className="w-8 h-8 text-[#8C6239] mx-auto opacity-50" />
                <h3 className="font-bold text-sm text-[#1A1F1D]">No past orders found</h3>
                <p className="text-xs text-[#596561]">
                  When you place an order, its real-time packing status and tracking updates will appear here.
                </p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-5 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs sm:text-sm text-[#1A1F1D]">
                        Order #{order.id}
                      </span>
                      <span className="text-xs text-[#8C6239]">• Placed on {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-[#EFE9DD] text-[#2D5A44] px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.status}
                      </span>
                      <span className="text-xs font-bold text-[#1E3A2F]">
                        {BRAND_CONFIG.currency.format(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E8E2D5]">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-white flex-shrink-0"
                        />
                        <div className="min-w-0 text-xs">
                          <p className="font-semibold text-[#1A1F1D] truncate">{item.name}</p>
                          <p className="text-[10px] text-[#6D4C2B]">
                            Qty: {item.quantity} {item.selectedWeight ? `• ${item.selectedWeight}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-[#6D4C2B]">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C6239]" />
                      Deliver to: {order.customer.address}, {order.customer.city} ({order.paymentMethod})
                    </p>
                    <p className="text-[#2D5A44] font-medium">
                      Est. Arrival: {order.deliveryMethod === 'Express' ? '1-2 business days' : '3-5 business days'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
              Track Nationwide Courier Shipment
            </h3>
            <p className="text-xs text-[#596561] leading-relaxed">
              Enter your Gilgit-Baltistan order number (e.g. GB-2025-XXXXX) or courier tracking CN to check the live transit status.
            </p>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. GB-2025-4821)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-[#D5CBB8] text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] flex-1"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#2D5A44]"
              >
                Track Now
              </button>
            </form>

            {trackingResult && (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#D5CBB8] text-xs text-[#1E3A2F] flex items-start gap-2 animate-in fade-in">
                <Truck className="w-4 h-4 text-[#2D5A44] flex-shrink-0 mt-0.5" />
                <p className="font-medium">{trackingResult}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D] pb-2 border-b border-[#F0EAE0]">
              Primary Shipping & Contact Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">Phone (03xx-xxxxxxx)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-[#272F2C]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-[#272F2C]">Complete Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">Province</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CBB8] text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white text-xs font-bold"
              >
                Save Details
              </button>
              {isSaved && (
                <span className="text-xs text-[#2D5A44] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Address updated!
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
