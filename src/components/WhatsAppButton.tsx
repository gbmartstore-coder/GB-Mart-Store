import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const [showPopup, setShowPopup] = useState(true);

  const whatsappNumber = '923253444462';

  const message =
    'Assalam-o-Alaikum! I need some information about GB Mart Store products.';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (!showPopup) {
      const timer = window.setTimeout(() => {
        setShowPopup(true);
      }, 120000); // 2 minutes

      return () => window.clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {showPopup && (
        <div className="relative w-[290px] rounded-2xl bg-white border border-stone-200 shadow-xl p-4">
          <button
            type="button"
            onClick={handleClosePopup}
            aria-label="Close WhatsApp popup"
            className="absolute top-2 right-2 text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-5">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-stone-900">
                Need Help?
              </p>

              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Chat with GB Mart Store on WhatsApp. We're here to help!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Chat on WhatsApp
          </button>
        </div>
      )}

      <button
        onClick={handleWhatsAppClick}
        type="button"
        aria-label="Contact GB Mart Store on WhatsApp"
        title="Chat with us on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};

export default WhatsAppButton;