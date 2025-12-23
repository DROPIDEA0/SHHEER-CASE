import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
  const { data: settings } = trpc.admin.getWhatsAppSettings.useQuery();
  const [isVisible, setIsVisible] = useState(true);

  // Don't render if disabled or no phone number
  if (!settings || !settings.isEnabled || !settings.phoneNumber) {
    return null;
  }

  const handleClick = () => {
    const phone = settings.phoneNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(settings.message || 'مرحباً');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const position = settings.position || 'bottom-right';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${positionClasses[position as keyof typeof positionClasses]} z-50`}
        >
          <div className="relative group">
            {/* WhatsApp Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClick}
              className="w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
              aria-label="تواصل عبر واتساب"
            >
              <MessageCircle className="w-8 h-8" />
            </motion.button>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-stone-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                تواصل عبر واتساب
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-stone-900"></div>
                </div>
              </div>
            </div>

            {/* Pulse Animation */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-[#25D366] rounded-full -z-10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
