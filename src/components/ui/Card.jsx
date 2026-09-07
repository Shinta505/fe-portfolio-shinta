import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Konstanta gaya tidak diekspor untuk mencegah peringatan Vite Fast Refresh
const styleVariants = {
  base: 'relative overflow-hidden rounded-2xl border border-borderMuted bg-bgSurface/40 backdrop-blur-md shadow-lg transition-colors duration-300',
  interactive: 'cursor-pointer hover:border-goldPrimary hover:bg-bgSurface/60 hover:shadow-goldPrimary/20',
};

const Card = ({
  children,
  className = '',
  isInteractive = false,
  onClick,
  ...props
}) => {
  // Penggabungan kelas utilitas secara dinamis
  const combinedClassName = `${styleVariants.base} ${isInteractive ? styleVariants.interactive : ''
    } ${className}`;

  return (
    <motion.div
      className={combinedClassName}
      onClick={onClick}
      whileHover={isInteractive ? { y: -6 } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;