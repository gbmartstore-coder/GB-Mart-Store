
import React from 'react';
import {
  ArrowLeft,
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  AlertCircle,
  Mail,
} from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
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
            <FileText className="w-8 h-8 text-emerald-200" />
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-emerald-100">
            Please review the terms for shopping with GB Mart Store.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-10 space-y-10 text-stone-700">
          <p className="text-sm leading-8">
            Welcome to GB Mart Store. By accessing our website or
            placing an order, you agree to the following Terms
            &amp; Conditions. Please read them carefully before
            purchasing our products.
          </p>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              1. Products &amp; Availability
            </h2>
            <p className="text-sm leading-8">
              GB Mart Store offers products including dry fruits,
              mountain honey, shilajit, herbal teas, oils,
              gemstones, and traditional handicrafts. Product
              availability may change without prior notice.
              We aim to provide accurate product descriptions,
              images, weights, and prices.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              2. Prices &amp; Payments
            </h2>
            <p className="text-sm leading-8">
              All prices are displayed in Pakistani Rupees (PKR).
              Delivery charges, where applicable, are displayed
              separately during checkout. Available payment methods
              may include Cash on Delivery, bank transfer,
              JazzCash, and Easypaisa, as shown at checkout.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <PackageCheck className="w-5 h-5 text-emerald-700" />
              3. Order Confirmation
            </h2>
            <p className="text-sm leading-8">
              After an order is submitted, it may be reviewed and
              confirmed by our team. We may contact customers to
              verify delivery information, product availability,
              or payment details. Submitting an order does not
              guarantee acceptance.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <Truck className="w-5 h-5 text-emerald-700" />
              4. Shipping &amp; Delivery
            </h2>
            <p className="text-sm leading-8">
              We arrange deliveries to supported locations across
              Pakistan. Delivery timeframes depend on the
              destination, product availability, weather,
              and courier operations. Any estimated delivery
              date is not a guaranteed arrival date.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <RefreshCcw className="w-5 h-5 text-emerald-700" />
              5. Returns, Refunds &amp; Cancellations
            </h2>
            <p className="text-sm leading-8">
              If you receive an incorrect, damaged, or defective
              product, please contact GB Mart Store promptly with
              your order details and supporting photographs.
              Requests are reviewed according to the product
              condition and applicable consumer protection laws.
              Perishable or opened products may have additional
              return restrictions where legally permitted.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              6. Product Quality &amp; Information
            </h2>
            <p className="text-sm leading-8">
              We aim to supply authentic products and accurate
              information. Natural products may vary in color,
              size, appearance, or texture. Herbal and wellness
              products are not intended to replace professional
              medical advice or treatment.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <AlertCircle className="w-5 h-5 text-emerald-700" />
              7. Customer Responsibilities
            </h2>
            <p className="text-sm leading-8">
              Customers must provide accurate contact and delivery
              information. Misuse of the website, fraudulent
              orders, or unauthorized activity is prohibited.
              We may refuse or cancel orders where reasonably
              necessary, subject to applicable law.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4">
              <FileText className="w-5 h-5 text-emerald-700" />
              8. Changes to These Terms
            </h2>
            <p className="text-sm leading-8">
              GB Mart Store may update these Terms &amp;
              Conditions when necessary. Changes will be
              published on this page and will apply as
              permitted by applicable law.
            </p>
          </section>

          <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-3">
              <Mail className="w-5 h-5" />
              9. Contact Us
            </h2>
            <p className="text-sm leading-7">
              For questions about these Terms &amp; Conditions,
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
              Location: Airport Road, Gilgit,
              Gilgit-Baltistan, Pakistan
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
