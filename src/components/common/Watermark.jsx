import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Komponen Watermark untuk menampilkan overlay tanda air gambar atau teks
 * pada portofolio, menjaga estetika visual sekaligus konsisten dengan tema warna aplikasi.
 */
const Watermark = ({
  text = 'SHINTA NURSOBAH CHAIRANI',
  imageUrl = '',
  opacity = 0.05,
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden z-10 flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opacity }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-wrap items-center justify-center gap-16 select-none"
        style={{ transform: 'rotate(-25deg) scale(1.2)' }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 whitespace-nowrap text-goldPrimary/20 font-poppins font-bold text-2xl tracking-widest uppercase"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Watermark Overlay"
                className="w-8 h-8 object-contain opacity-40 filter grayscale"
              />
            ) : null}
            <span>{text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

Watermark.propTypes = {
  text: PropTypes.string,
  imageUrl: PropTypes.string,
  opacity: PropTypes.number,
  className: PropTypes.string,
};

export default Watermark;