import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { LuLoaderCircle } from 'react-icons/lu';

// Objek konstanta ini TIDAK diekspor agar Vite Fast Refresh berjalan tanpa peringatan
const spinnerSizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl'
};

/**
 * Komponen LoadingSpinner
 * Digunakan untuk menampilkan indikator proses asinkron atau pemuatan halaman.
 */
const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  text = 'Memuat data...',
  className = ''
}) => {
  // Konten utama spinner beserta teks animasinya
  const SpinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={`text-goldPrimary ${spinnerSizes[size]}`}
      >
        <LuLoaderCircle />
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
          className="text-sm font-medium text-gray-300 font-poppins animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  // Jika prop fullScreen aktif, render spinner di atas lapisan backdrop
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bgMain/80 backdrop-blur-sm">
        {SpinnerContent}
      </div>
    );
  }

  // Render normal (inline) untuk kontainer lokal
  return (
    <div className="flex items-center justify-center w-full h-full min-h-37.5">
      {SpinnerContent}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;