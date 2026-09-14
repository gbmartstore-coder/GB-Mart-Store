import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  Truck,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { useShop } from '../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do you deliver nationwide across all cities and towns in Pakistan?',
      a: 'Yes! We deliver to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Faisalabad, Multan, and all remote towns and tehsils across Pakistan through our trusted courier partners (TCS, Leopards, and Call Courier).',
    },
    {
      q: 'Is Cash on Delivery (COD) available for all orders?',
      a: 'Yes, Cash on Delivery is available across Pakistan. You can pay cash directly to the courier rider upon receiving your package.',
    },
    {
      q: 'How long does nationwide delivery take?',
      a: 'Standard courier delivery takes 3 to 5 business days. Express air dispatch takes 1 to 2 business days for major metropolitan hubs.',
    },
    {
      q: 'How do you guarantee the authenticity of Shilajit and Honey?',
      a: 'Every batch of our Shilajit is gathered directly from Baltistan peak crevices above 16,000 feet and purified with glacial spring water. Our blossom honey is raw, unheated, and tested for purity. We never blend with glucose or sugar syrups.',
    },
    {
      q: 'Can we place bulk orders for weddings and corporate hampers?',
      a: 'Absolutely! We craft custom luxury mountain gift boxes featuring engraved wooden boxes, dry fruits, honey, and traditional handicrafts. Please email us or WhatsApp our helpline for catalog pricing.',
    },
    {
      q: 'What is your return or replacement policy?',
      a: 'We offer an instant 7-day replacement guarantee if your package is damaged during courier transit or if you notice any quality discrepancy.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    addToast('Message dispatched! Our mountain support desk will reply within 24 hours.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Contact Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
          Get in Touch
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#1A1F1D]">
          Contact Our Mountain Desk
        </h1>
        <p className="text-sm text-[#596561] leading-relaxed">
          Have questions about harvest freshness, shilajit purity, traditional sizes, or corporate gift boxes? We're here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF9F5] p-6 rounded-3xl border border-[#E8E2D5] space-y-6 shadow-xs">
            <h3 className="font-serif-heading text-lg font-bold text-[#1A1F1D]">
              Direct Sourcing & Distribution
            </h3>

            <div className="space-y-4 text-xs text-[#272F2C]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1F1D]">Origin & Sourcing Hub:</p>
                  <p className="text-[#596561] mt-0.5">{BRAND_CONFIG.contact.headOffice}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1F1D]">Nationwide Fulfillment Desk:</p>
                  <p className="text-[#596561] mt-0.5">{BRAND_CONFIG.contact.fulfillmentCenter}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1F1D]">Customer Care & WhatsApp:</p>
                  <p className="text-[#596561] mt-0.5">{BRAND_CONFIG.contact.phone}</p>
                  <p className="text-[11px] text-[#8C6239]">{BRAND_CONFIG.contact.workingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1F1D]">Email Inquiries:</p>
                  <p className="text-[#596561] mt-0.5">{BRAND_CONFIG.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Guarantee Box */}
          <div className="bg-[#1E3A2F] text-white p-6 rounded-3xl border border-[#2D5A44] space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticity Promise</span>
            </div>
            <p className="text-xs text-[#E5DDCF] leading-relaxed">
              We stand firmly behind the authenticity of every single item. If any product is found lacking its promised natural heritage, we guarantee a full replacement or refund.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-4">
          <h2 className="font-serif-heading text-xl font-bold text-[#1A1F1D]">
            Send Us a Message
          </h2>
          <p className="text-xs text-[#596561]">
            Fill in the form below and our customer support team will respond promptly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Your Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03xx-xxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#272F2C]">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                >
                  <option value="Product Inquiry">Product Inquiry / Quality</option>
                  <option value="Order Tracking">Order Tracking & Delivery</option>
                  <option value="Bulk & Corporate Gift Boxes">Bulk & Corporate Gift Boxes</option>
                  <option value="Producer Partnership">Local Producer Collaboration</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#272F2C]">
                Your Message <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="How can we help you today? Please include order number if applicable..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CBB8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#2D5A44] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
              Submit Message
            </button>

            {isSent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your message has been sent to our customer care team.</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="pt-8 border-t border-[#E8E2D5] space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6239]">
            Help & Guidance
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A1F1D]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif-heading text-sm sm:text-base font-bold text-[#1A1F1D]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8C6239] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C6239] flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-[#596561] leading-relaxed border-t border-[#F0EAE0] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
