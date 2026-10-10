
import React from 'react';
import {
  ArrowLeft,
  Truck,
  MapPin,
  PackageCheck,
  Clock,
  Mountain,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  Mail,
  Route,
} from 'lucide-react';

export const DeliveryConditions: React.FC = () => {
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
            <Truck className="w-8 h-8 text-emerald-200" />
            Delivery Conditions
          </h1>

          <p className="mt-3 text-sm text-emerald-100">
            Important shipping and delivery information
            for GB Mart Store customers.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-5 py-10">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-10 space-y-10 text-stone-700">

          <p className="text-sm leading-8">
            At GB Mart Store, we work to deliver authentic
            Gilgit-Baltistan products safely to customers
            across Pakistan. Because many products originate
            from mountainous regions and travel through
            long-distance transportation routes, delivery
            times may vary depending on road conditions,
            weather, and logistics availability.
          </p>

          {/* 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <MapPin className="w-5 h-5 text-emerald-700" />
              1. Delivery Coverage
            </h2>
            <p className="text-sm leading-8">
              GB Mart Store arranges deliveries to supported
              cities and locations across Pakistan.
              Delivery availability depends on courier
              services and accessibility of the customer's
              destination. Remote areas may require
              additional delivery time.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              2. Delivery Charges &amp; Free Delivery
            </h2>
            <p className="text-sm leading-8">
              Delivery charges are calculated according
              to the current store settings and displayed
              separately during checkout.
              Orders meeting the applicable free delivery
              threshold qualify for free delivery,
              as indicated in the shopping cart.
              Any applicable charges are included in
              the final order total before confirmation.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Clock className="w-5 h-5 text-emerald-700" />
              3. Estimated Delivery Time
            </h2>
            <p className="text-sm leading-8">
              Delivery times depend on order processing,
              product availability, destination,
              transportation routes, and courier operations.
              Deliveries from Gilgit-Baltistan may take
              longer than shipments between major cities.
              Any delivery estimate provided is approximate
              and not a guaranteed arrival date.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Mountain className="w-5 h-5 text-emerald-700" />
              4. Road Blockages &amp; Landslides
            </h2>
            <p className="text-sm leading-8">
              Transportation routes connecting
              Gilgit-Baltistan with other regions of
              Pakistan may be affected by landslides,
              rockfalls, road closures, damaged roads,
              heavy snowfall, flooding, or other natural
              conditions. These situations may temporarily
              suspend or delay shipment movement until
              routes become safe and accessible.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <AlertTriangle className="w-5 h-5 text-emerald-700" />
              5. Protests, Strikes &amp; Unexpected Disruptions
            </h2>
            <p className="text-sm leading-8">
              Public protests, road demonstrations,
              transport strikes, security restrictions,
              traffic disruptions, and government-imposed
              road closures may affect courier operations.
              If such events occur, delivery may be
              delayed until transportation services
              resume normally.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Route className="w-5 h-5 text-emerald-700" />
              6. Long-Distance Transportation Routes
            </h2>
            <p className="text-sm leading-8">
              Many GB Mart Store products originate from
              Gilgit-Baltistan and may travel long distances
              through mountainous highways before reaching
              courier distribution centers and customers.
              Route length, vehicle availability,
              road accessibility, and multiple transit
              points can increase delivery times.
              Additional transit time may be required
              for remote or difficult-to-access locations.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <PackageCheck className="w-5 h-5 text-emerald-700" />
              7. Order Processing &amp; Dispatch
            </h2>
            <p className="text-sm leading-8">
              Orders are reviewed before dispatch.
              Processing times may vary depending on
              stock availability, order volume,
              packaging requirements, and transportation
              schedules. Customers may check available
              order status updates through their
              GB Mart Store account.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              8. Packaging &amp; Product Safety
            </h2>
            <p className="text-sm leading-8">
              We aim to package products carefully
              to reduce the risk of damage during
              transportation. Customers should inspect
              delivered packages and contact our
              support team promptly if an item arrives
              damaged, missing, or incorrect.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Truck className="w-5 h-5 text-emerald-700" />
              9. Delayed Deliveries &amp; Customer Support
            </h2>
            <p className="text-sm leading-8">
              In case of significant delivery delays
              caused by weather, landslides, road
              blockages, protests, or courier disruptions,
              GB Mart Store will make reasonable efforts
              to provide available updates and coordinate
              delivery once transportation resumes.
              Customers may contact our support team
              for assistance with delayed shipments.
              Applicable consumer rights remain unaffected.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-3">
              <Mail className="w-5 h-5" />
              10. Delivery Support
            </h2>

            <p className="text-sm leading-7">
              For delivery-related questions, order
              assistance, or shipment concerns,
              please contact GB Mart Store.
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

            <p className="text-sm mt-2">
              Location: Airport Road, Gilgit,
              Gilgit-Baltistan, Pakistan
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};
