import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo, allProducts } = useShop();

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A1F1D] flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600 fill-current" />
            My Mountain Wishlist
          </h1>
          <p className="text-xs text-[#6D4C2B] mt-1">
            Keep track of your favorite products from Gilgit-Baltistan
          </p>
        </div>
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs font-bold text-[#1E3A2F] hover:underline flex items-center gap-1"
        >
          <span>Explore More Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-[#FAF9F5] border border-[#E8E2D5] rounded-3xl p-12 sm:p-16 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F5EFE6] flex items-center justify-center mx-auto text-[#8C6239]">
            <Heart className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="font-serif-heading text-xl font-bold text-[#1A1F1D]">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-[#596561] leading-relaxed">
            Click the heart icon on any product in our store to save dried apricots, pure shilajit, or handmade caps to your personal mountain wishlist.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#2D5A44] transition-colors"
          >
            Start Exploring Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
