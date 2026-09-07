import PropTypes from 'prop-types';

/**
 * Komponen SEO (Wrapper penata meta tag & title halaman)
 * Mengelola judul dokumen dan meta tag untuk optimasi mesin pencari secara dinamis.
 */
const SEO = ({
  // TODO: Ubah nilai default title jika ingin menyesuaikan dengan branding halaman utama Anda
  title = 'Shinta Nursobah Chairani | Full-Stack Developer & UI/UX Designer',

  // TODO: Sesuaikan deskripsi singkat portofolio atau halaman aktif jika diperlukan
  description = 'Portofolio resmi Shinta Nursobah Chairani, mahasiswa Teknik Informatika UPN "Veteran" Yogyakarta yang berfokus pada pengembangan web full-stack, frontend, dan UI/UX design.',

  // TODO: Perbarui daftar keyword SEO jika ada penambahan teknologi atau keahlian baru
  keywords = 'Shinta Nursobah Chairani, Full-Stack Developer, Frontend Developer, UI/UX Designer, UPN Veteran Yogyakarta, Portfolio, Web Development',
  author = 'Shinta Nursobah Chairani',

  // TODO: Ganti path gambar preview media sosial (pastikan file tersedia di folder public)
  image = '/og-image.png',

  // TODO: Sesuaikan URL production web Anda jika domain utama berubah
  url = 'https://shintanursobah.vercel.app/'
}) => {
  const fullTitle = title.includes('Shinta') ? title : `${title} | Shinta Nursobah Chairani`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="OG:type" content="website" />
      <meta property="OG:url" content={url} />
      <meta property="OG:title" content={fullTitle} />
      <meta property="OG:description" content={description} />
      <meta property="OG:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
};

export default SEO;