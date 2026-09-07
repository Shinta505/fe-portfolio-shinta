import PropTypes from 'prop-types';
import useContentProtection from '../../hooks/useContentProtection';

/**
 * Komponen ContentProtector berfungsi sebagai pembungkus (wrapper)
 * untuk melindungi konten halaman dari klik kanan, shortcut inspeksi elemen, dan penyalinan.
 */
const ContentProtector = ({ children, enabled = true, className = '' }) => {
  useContentProtection(enabled);

  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

ContentProtector.propTypes = {
  children: PropTypes.node.isRequired,
  enabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ContentProtector;