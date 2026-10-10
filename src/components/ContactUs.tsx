
import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Headphones,
  ExternalLink
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const whatsappNumber = '923253444462';

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="bg-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-100 hover:text-white mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </a>

          <div className="flex items-center gap-3 mb-3">
            <Headphones className="w-8 h-8 text-emerald-200" />
            <h1 className="text-3xl font-extrabold">
              Contact Us
            </h1>
          </div>

          <p className="text-sm text-emerald-100">
            Have a question? We're here to help you.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-10">

          <h2 className="text-xl font-bold text-stone-900 mb-3">
            Get in Touch with GB Mart Store
          </h2>

          <p className="text-sm text-stone-600 leading-8 mb-8">
            Thank you for visiting GB Mart Store. Whether you need
            information about our authentic Gilgit-Baltistan
            products, order assistance, delivery updates,
            wholesale inquiries, or general support, our team
            is happy to assist you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Address */}
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900">
                  Store Location
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-7">
                Airport Road, Gilgit,
                <br />
                Gilgit-Baltistan, Pakistan
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900">
                  Phone Support
                </h3>
              </div>
              <a
                href="tel:+923253444462"
                className="text-sm text-emerald-700 font-semibold hover:underline"
              >
                +92 325 3444462
              </a>
              <p className="text-xs text-stone-500 mt-2">
                For product and order inquiries
              </p>
            </div>

            {/* Email */}
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900">
                  Email Support
                </h3>
              </div>
              <a
                href="mailto:gbmartstore@gmail.com"
                className="text-sm text-emerald-700 font-semibold hover:underline break-all"
              >
                gbmartstore@gmail.com
              </a>
              <p className="text-xs text-stone-500 mt-2">
                Send us your questions or feedback
              </p>
            </div>

            {/* Working Hours */}
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900">
                  Customer Support
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-7">
                Contact us anytime through WhatsApp or email.
                Our team will respond as soon as possible.
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 text-emerald-700" />
              <h2 className="text-lg font-bold text-emerald-900">
                Chat with Us on WhatsApp
              </h2>
            </div>

            <p className="text-sm text-stone-700 leading-7 mb-5">
              Need assistance with an order, product availability,
              delivery details, or bulk purchases? Connect with
              GB Mart Store directly on WhatsApp.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Assalam-o-Alaikum! I need some information about GB Mart Store products.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Additional Information */}
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="font-bold text-stone-900 mb-3">
              How Can We Help?
            </h3>

            <p className="text-sm text-stone-600 leading-8">
              We can assist you with product information,
              order confirmations, payment inquiries,
              delivery tracking, shipping delays,
              returns-related questions, and wholesale orders.
              Please include your order number when contacting
              us about an existing order.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
