import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  HeartHandshake, 
  PackageCheck, 
  Truck, 
  Banknote 
} from 'lucide-react';

export const TrustBanner: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: 'Authentic Gilgit-Baltistan',
      subtitle: '100% genuine origin',
    },
    {
      icon: CheckCircle,
      title: 'Quality Checked',
      subtitle: 'Lab & freshness inspected',
    },
    {
      icon: HeartHandshake,
      title: 'Local Producers',
      subtitle: 'Direct valley fair trade',
    },
    {
      icon: PackageCheck,
      title: 'Secure Packaging',
      subtitle: 'Aroma-seal moisture lock',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      subtitle: 'Anywhere in Pakistan',
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      subtitle: 'Pay at your doorstep',
    },
  ];

  return (
    <section className="bg-[#FAF9F5] border-y border-[#E8E2D5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div 
                key={idx} 
                className="flex items-start sm:items-center gap-3 p-2 rounded-xl transition-all hover:bg-[#F3EFE6]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EFE9DD] text-[#1E3A2F] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 text-[#2D5A44]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1A1F1D] leading-tight">
                    {pt.title}
                  </h4>
                  <p className="text-[11px] text-[#6D4C2B] mt-0.5 truncate">
                    {pt.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
