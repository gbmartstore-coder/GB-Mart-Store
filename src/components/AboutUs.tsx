
import React from 'react';
import {
  ArrowLeft,
  Mountain,
  Heart,
  ShieldCheck,
  PackageCheck,
  Leaf,
  MapPin,
  ShoppingBag,
  Users,
  Mail,
  Sparkles,
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-emerald-800 text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-5">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-100 hover:text-white mb-7"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </a>

          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Mountain className="w-8 h-8 text-emerald-200" />
            About GB Mart Store
          </h1>

          <p className="mt-3 text-sm text-emerald-100">
            Bringing the authentic treasures of Gilgit-Baltistan
            to your doorstep.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-5 py-10">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-10 space-y-10 text-stone-700">

          {/* Introduction */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900 mb-4">
              <Heart className="w-5 h-5 text-emerald-700" />
              Welcome to GB Mart Store
            </h2>

            <p className="text-sm leading-8">
              GB Mart Store is an online shopping destination
              dedicated to bringing the authentic products,
              natural treasures, and traditional craftsmanship
              of Gilgit-Baltistan to customers across Pakistan.
              Our store celebrates the beauty, heritage,
              and unique offerings of Pakistan's northern
              mountain regions.
            </p>
          </section>

          {/* Our Story */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Mountain className="w-5 h-5 text-emerald-700" />
              1. Our Story
            </h2>

            <p className="text-sm leading-8">
              Gilgit-Baltistan is known for its breathtaking
              mountains, rich cultural heritage, traditional
              craftsmanship, and natural products.
              GB Mart Store was created with the vision
              of making these regional specialties more
              accessible through a convenient online
              shopping experience.
            </p>
          </section>

          {/* Mission */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              2. Our Mission
            </h2>

            <p className="text-sm leading-8">
              Our mission is to connect customers with
              authentic products associated with
              Gilgit-Baltistan while promoting regional
              craftsmanship, natural resources, and
              traditional specialties.
              We aim to offer a convenient, transparent,
              and customer-focused shopping experience.
            </p>
          </section>

          {/* Products */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              3. What We Offer
            </h2>

            <p className="text-sm leading-8 mb-4">
              Our product selection includes:
            </p>

            <ul className="space-y-3 text-sm leading-7">
              <li>• Premium dry fruits, walnuts, apricots, and nuts</li>
              <li>• Himalayan shilajit and mountain honey</li>
              <li>• Herbal teas and natural oils</li>
              <li>• Traditional handicrafts, caps, and pashmina shawls</li>
              <li>• Gemstones and mineral specimens</li>
            </ul>
          </section>

          {/* Quality */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              4. Our Quality Commitment
            </h2>

            <p className="text-sm leading-8">
              We aim to provide genuine products with
              clear descriptions and careful packaging.
              Product quality, transparency, and customer
              satisfaction are important priorities
              for GB Mart Store.
              Natural products may vary slightly in
              appearance because of their origin
              and characteristics.
            </p>
          </section>

          {/* Nature */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Leaf className="w-5 h-5 text-emerald-700" />
              5. Inspired by Nature
            </h2>

            <p className="text-sm leading-8">
              From mountain-grown fruits and traditional
              herbal products to handcrafted regional items,
              our collection reflects the natural
              environment and cultural traditions
              of Gilgit-Baltistan.
            </p>
          </section>

          {/* Packaging */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <PackageCheck className="w-5 h-5 text-emerald-700" />
              6. Packaging &amp; Delivery
            </h2>

            <p className="text-sm leading-8">
              We aim to package orders carefully and
              arrange deliveries to supported locations
              across Pakistan.
              Because products may travel from mountainous
              regions, transportation can be affected
              by weather, long routes, and road conditions.
            </p>
          </section>

          {/* Customer Trust */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Users className="w-5 h-5 text-emerald-700" />
              7. Our Customers Matter
            </h2>

            <p className="text-sm leading-8">
              We believe in building long-term relationships
              through respectful communication, transparent
              product information, and responsive support.
              Our goal is to make every shopping experience
              simple, reliable, and enjoyable.
            </p>
          </section>

          {/* Location */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <MapPin className="w-5 h-5 text-emerald-700" />
              8. Our Location
            </h2>

            <p className="text-sm leading-8">
              GB Mart Store is based in Gilgit-Baltistan,
              Pakistan.
            </p>

            <p className="text-sm mt-2">
              Airport Road, Gilgit, Gilgit-Baltistan, Pakistan
            </p>
          </section>

          {/* Contact */}
          <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-3">
              <Mail className="w-5 h-5" />
              9. Get in Touch
            </h2>

            <p className="text-sm leading-7">
              Have questions about our products or services?
              We would be happy to hear from you.
            </p>

            <p className="text-sm mt-3">
              Email:{' '}
              <a
                href="mailto:gbmartstore@gmail.com"
                className="text-emerald-700 font-semibold hover:underline"
              >
                gbmartstore@gmail.com
              </a>
            </p>

            <p className="text-sm mt-2">
              Phone:{' '}
              <a
                href="tel:+923253444462"
                className="text-emerald-700 font-semibold hover:underline"
              >
                +92 325 3444462
              </a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};
