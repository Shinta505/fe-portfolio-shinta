import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';

// Objek konstanta tidak diekspor agar Vite Fast Refresh berjalan dengan baik
const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full m-4'
};

/**
 * Komponen Modal (Dialog Pop-up)
 * Digunakan untuk menampilkan konten dinamis di atas lapisan antarmuka utama.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  hideCloseButton = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Lapisan Latar Belakang (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Kontainer Utama Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className={`relative w-full ${modalSizes[maxWidth]} bg-bgMain border border-borderMuted rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden`}
            role="dialog"
            aria-modal="true"
          >
            {/* Bagian Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-borderMuted bg-bgSurface/50">
              {title && (
                <h2 className="text-xl font-semibold text-gray-100 font-poppins">
                  {title}
                </h2>
              )}

              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 ml-auto text-gray-400 transition-colors rounded-full hover:text-goldPrimary hover:bg-borderMuted/50 focus:outline-none"
                  aria-label="Tutup Modal"
                >
                  <LuX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bagian Konten Modal */}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']),
  hideCloseButton: PropTypes.bool
};

export default Modal;