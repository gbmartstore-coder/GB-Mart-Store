import React, { useState } from 'react';
import { Category, Subcategory } from '../types';
import { Layers, ArrowRight } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  selectedSubcategory: string | null;
  onSelectSubcategory: (subId: string | null) => void;
  productCountsByCategory: Record<string, number>;
  totalProductsCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  subcategories,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
}) => {
  const activeCategories = categories.filter((c) => c.active);
const [showAllCategories, setShowAllCategories] = useState(false);

const visibleCategories = showAllCategories
  ? activeCategories
  : activeCategories.slice(0, 8);
  const visibleSubcategories = selectedCategory
    ? subcategories.filter(
        (s) => s.categoryId === selectedCategory && s.active
      )
    : [];

const handleViewAllCategories = () => {
  setShowAllCategories((prev) => !prev);
};

  return (
    <section className="bg-[#f8faf9] border-b border-gray-100 py-7 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Shop by Category
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Explore our authentic Gilgit-Baltistan products
            </p>
          </div>

          {/* View All Categories */}
          <button
            type="button"
            onClick={handleViewAllCategories}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap"
          >
            <span>
  {showAllCategories ? 'Show Less' : 'View All Categories'}
</span>

<ArrowRight
  className={`w-4 h-4 transition-transform duration-300 ${
    showAllCategories ? 'rotate-90' : ''
  }`}
/>
          </button>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">

          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(isSelected ? null : cat.id);
                  onSelectSubcategory(null);
                }}
                className={`group min-w-0 bg-white rounded-2xl px-3 py-4 sm:px-3 sm:py-5
                  flex flex-col items-center text-center
                  border transition-all duration-300
                  ${
                    isSelected
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                      : 'border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200'
                  }
                `}
              >
                {/* Circular Category Image */}
                <div
                  className={`w-[82px] h-[82px] sm:w-[88px] sm:h-[88px]
                    rounded-full overflow-hidden flex-shrink-0
                    border-2 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-emerald-500'
                        : 'border-gray-100 group-hover:border-emerald-200'
                    }
                  `}
                >
                  {cat.image ? (
                   <img
  src={
    cat.image.includes('res.cloudinary.com')
      ? cat.image.replace('/upload/', '/upload/f_auto,q_auto,w_300/')
      : cat.image
  }
  alt={cat.name}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
/>
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                      <Layers className="w-8 h-8 text-emerald-600" />
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <h3 className="mt-3 text-[13px] sm:text-sm font-extrabold text-gray-900 leading-tight min-h-[34px] flex items-center justify-center">
                  {cat.name}
                </h3>

                {/* Small Subtitle */}
                <p className="mt-1 text-[11px] sm:text-xs text-gray-500 leading-tight">
                  Explore Products
                </p>
              </button>
            );
          })}
        </div>

        {/* Mobile View All Categories */}
        <div className="sm:hidden flex justify-end mt-5">
          <button
            type="button"
            onClick={handleViewAllCategories}
            className="flex items-center gap-2 text-sm font-bold text-emerald-700"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subcategories */}
        {selectedCategory && visibleSubcategories.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Sub-types:
            </span>

            <button
              type="button"
              onClick={() => onSelectSubcategory(null)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedSubcategory === null
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All in category
            </button>

            {visibleSubcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() =>
                  onSelectSubcategory(
                    selectedSubcategory === sub.id ? null : sub.id
                  )
                }
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedSubcategory === sub.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};