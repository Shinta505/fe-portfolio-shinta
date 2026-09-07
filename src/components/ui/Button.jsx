import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { LuLoaderCircle } from 'react-icons/lu';

// Objek konstanta ini TIDAK diekspor agar Vite Fast Refresh tetap berjalan lancar
const styleVariants = {
  primary: 'bg-goldPrimary text-bgMain hover:bg-goldHover shadow-md shadow-goldPrimary/20',
  secondary: 'bg-bgSurface text-gray-100 border border-borderMuted hover:border-goldPrimary',
  outline: 'bg-transparent text-goldPrimary border border-goldPrimary hover:bg-goldPrimary hover:text-bgMain',
  ghost: 'bg-transparent text-gray-300 hover:text-goldPrimary hover:bg-bgSurface',
};

const styleSizes = {
  sm: 'py-1.5 px-3 text-sm rounded-md',
  md: 'py-2 px-4 text-base rounded-lg gap-2',
  lg: 'py-3 px-6 text-lg rounded-xl gap-3',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  // Menggabungkan class Tailwind berdasarkan props yang diterima
  const combinedClassName = `${baseStyle} ${styleVariants[variant]} ${styleSizes[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Render Loading Spinner atau Icon Kiri */}
      {isLoading ? (
        <LuLoaderCircle className="animate-spin text-current text-xl" />
      ) : (
        IconLeft && <IconLeft className="text-xl" />
      )}

      <span>{children}</span>

      {/* Render Icon Kanan (hanya jika tidak loading) */}
      {!isLoading && IconRight && <IconRight className="text-xl" />}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  iconLeft: PropTypes.elementType,
  iconRight: PropTypes.elementType,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
};

export default Button;