import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Banner } from '../types';

interface HeroBannerProps {
  banners: Banner[];
  onCtaClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners, onCtaClick }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return null;
  }

  const current = activeBanners[currentIdx] || activeBanners[0];

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white min-h-[260px] sm:min-h-[280px] md:min-h-[300px] flex items-center rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-3">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover object-center transition-all duration-700 brightness-[0.85] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/45 via-stone-950/20 to-transparent"/>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-24 py-8 md:py-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Pure & Organic Guaranteed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold text-white tracking-tight leading-[1.1] mb-3">
            {current.title}
          </h1>

          <p className="text-gray-200 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-xl">
            {current.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              id="btn-hero-cta"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>{current.buttonText || 'Shop All Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIdx((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIdx((prev) => (prev + 1) % activeBanners.length)}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIdx ? 'w-8 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
