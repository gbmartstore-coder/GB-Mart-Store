import React from 'react';
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  CreditCard,
  Truck,
  UserRound,
  Mail,
  ArrowLeft,
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <div className="bg-emerald-800 py-12 text-white">
        <div className="max-w-5xl mx-auto px-5">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-100 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </a>

          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-9 h-9 text-emerald-200" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>

          <p className="text-emerald-100 text-sm">
            Your privacy and trust matter to GB Mart Store.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-10 space-y-9">

          <p className="text-sm leading-7 text-stone-600">
            Welcome to GB Mart Store. This Privacy Policy explains how
            we collect, use, protect, and manage personal information
            when you visit our website, create an account, or place
            an order for products from Gilgit-Baltistan.
          </p>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
              <Database className="w-5 h-5 text-emerald-700" />
              1. Information We Collect
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              When you place an order or register an account, we may
              collect your name, email address, phone number, delivery
              address, order details, and payment-related information.
              We may also process information necessary for website
              functionality and security.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
              <UserRound className="w-5 h-5 text-emerald-700" />
              2. How We Use Your Information
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              We use your information to process orders, arrange
              deliveries, provide customer support, communicate order
              confirmations and status updates, maintain customer
              accounts, and improve our services.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
              <LockKeyhole className="w-5 h-5 text-emerald-700" />
              3. Data Security
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              We use reasonable technical and organizational measures
              to protect customer information against unauthorized
              access, misuse, and disclosure. However, no internet
              service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              4. Payment Information
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              GB Mart Store offers payment options including Cash on
              Delivery, bank transfer, JazzCash, and Easypaisa.
              Payment confirmation details and any voluntarily
              uploaded payment screenshots may be processed to verify
              orders. Please do not share payment passwords, PINs,
              or other sensitive credentials with us.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
              <Truck className="w-5 h-5 text-emerald-700" />
              5. Delivery Information
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              Customer names, phone numbers, and delivery addresses
              may be shared with delivery and logistics partners
              where necessary to fulfill and deliver orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              6. Third-Party Services
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              Our website uses third-party services for features such
              as authentication, database storage, image hosting,
              and order communications. These providers may process
              information as required to deliver their services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              7. Cookies and Local Storage
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              Our website may use browser storage and similar
              technologies to remember shopping cart contents,
              support account sessions, and improve website
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              8. Your Privacy Rights
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              You may contact us to request access to, correction
              of, or deletion of your personal information, subject
              to applicable legal and operational requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              9. Policy Updates
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              We may update this Privacy Policy when our services,
              practices, or legal obligations change. The latest
              version will be published on this page.
            </p>
          </section>

          <section className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3 text-emerald-900">
              <Mail className="w-5 h-5" />
              10. Contact Us
            </h2>
            <p className="text-sm leading-7 text-stone-700">
              For privacy-related questions or requests, contact
              GB Mart Store.
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
            <p className="text-sm mt-1">
              Location: Airport Road, Gilgit, Gilgit-Baltistan, Pakistan
            </p>
          </section>

        </div>
      </div>
    </main>
  );
};