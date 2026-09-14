import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../admin-system/AuthContext';
import { StoreProvider } from '../admin-system/StoreContext';
import { AdminLogin } from '../admin/AdminLogin';
import { AdminLayout, AdminSection } from '../admin/AdminLayout';
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminProducts } from '../admin/AdminProducts';
import { AdminCategories } from '../admin/AdminCategories';
import { AdminSubcategories } from '../admin/AdminSubcategories';
import { AdminOrders } from '../admin/AdminOrders';
import { AdminCustomers } from '../admin/AdminCustomers';
import { AdminBanners } from '../admin/AdminBanners';
import { AdminSettings } from '../admin/AdminSettings';

const AdminPortalContent: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [section, setSection] = useState<AdminSection>('dashboard');

  const backToStore = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-stone-300">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onBackToStore={backToStore} />;
  }

  return (
    <AdminLayout
      currentSection={section}
      onSelectSection={setSection}
      onBackToStore={backToStore}
    >
      {section === 'dashboard' && <AdminDashboard onNavigate={setSection} />}
      {section === 'products' && <AdminProducts />}
      {section === 'categories' && <AdminCategories />}
      {section === 'subcategories' && <AdminSubcategories />}
      {section === 'orders' && <AdminOrders />}
      {section === 'customers' && <AdminCustomers />}
      {section === 'banners' && <AdminBanners />}
      {section === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
};

export const AdminPage: React.FC = () => (
  <AuthProvider>
    <StoreProvider>
      <AdminPortalContent />
    </StoreProvider>
  </AuthProvider>
);
