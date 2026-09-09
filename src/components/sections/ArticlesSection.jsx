import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getArticles } from '../../api/backendApi';
import { LuCalendar, LuArrowRight, LuImageOff, LuFileText, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Menampilkan 3 card per halaman

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles('published');
        const data = response.data?.data || response.data;

        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error('Gagal mengambil data artikel:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Hitung total halaman berdasarkan jumlah artikel
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  // Ambil data artikel untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold font-poppins uppercase tracking-widest text-goldPrimary">
            Blog & Wawasan
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Artikel <span className="text-gradient">Terbaru</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Berbagi pemikiran, eksplorasi teknologi, dan catatan perjalanan seputar pengembangan perangkat lunak dan desain antarmuka.
          </p>
        </div>

        {/* Grid Konten Artikel / Empty State */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat artikel..." />
        ) : articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-bgSurface/20 border border-borderMuted text-center space-y-4 max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
              <LuFileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold font-poppins text-gray-200">Belum Ada Artikel</h4>
              <p className="text-sm text-gray-400">
                Belum ada artikel yang dipublikasikan saat ini. Silakan kembali lagi nanti untuk membaca wawasan dan pembaruan terbaru!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Grid 3 Card */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <AnimatePresence mode="wait">
                {currentArticles.map((article) => (
                  <motion.div
                    key={article.uuid}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Card className="h-full flex flex-col overflow-hidden bg-bgSurface/40 border-borderMuted group hover:border-goldPrimary transition-colors duration-300">
                      
                      {/* Gambar Thumbnail */}
                      <Link to={`/article/${article.slug || article.uuid}`} className="relative h-48 w-full overflow-hidden bg-bgMain border-b border-borderMuted flex items-center justify-center cursor-pointer">
                        {article.image ? (
                          <img
                            src={article.image.startsWith('http') ? article.image : `https://be-portfolio-shinta.vercel.app${article.image}`}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <LuImageOff className="w-16 h-16 text-borderMuted group-hover:text-goldPrimary/50 transition-colors duration-300" />
                        )}
                      </Link>

                      {/* Info Artikel */}
                      <div className="p-6 flex flex-col grow space-y-4">
                        {/* Tanggal Publikasi */}
                        <div className="flex items-center gap-1.5 text-xs text-goldPrimary font-medium">
                          <LuCalendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(article.publishedAt || new Date()).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Judul & Konten (Excerpt) */}
                        <div className="grow">
                          <Link to={`/article/${article.slug || article.uuid}`}>
                            <h4 className="text-xl font-bold font-poppins text-gray-100 group-hover:text-goldPrimary transition-colors line-clamp-2 cursor-pointer leading-snug">
                              {article.title}
                            </h4>
                          </Link>
                          <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                            {article.content.replace(/<[^>]+>/g, '')}
                          </p>
                        </div>

                        {/* Aksi Baca Selengkapnya */}
                        <div className="pt-4 border-t border-borderMuted/60 mt-4">
                          <Link
                            to={`/article/${article.slug || article.uuid}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold font-poppins text-gray-300 group-hover:text-goldPrimary transition-colors"
                          >
                            Baca Selengkapnya
                            <LuArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Navigasi Slider / Paging (< 1 dari X >) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full border border-borderMuted bg-bgSurface/40 text-gray-200 transition-colors ${
                    currentPage === 1 
                      ? 'opacity-40 cursor-not-allowed' 
                      : 'hover:bg-goldPrimary hover:text-bgMain hover:border-goldPrimary'
                  }`}
                  aria-label="Previous Page"
                >
                  <LuChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-poppins font-medium text-gray-300 tracking-wider">
                  &lt; {currentPage} dari {totalPages} &gt;
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full border border-borderMuted bg-bgSurface/40 text-gray-200 transition-colors ${
                    currentPage === totalPages 
                      ? 'opacity-40 cursor-not-allowed' 
                      : 'hover:bg-goldPrimary hover:text-bgMain hover:border-goldPrimary'
                  }`}
                  aria-label="Next Page"
                >
                  <LuChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ArticlesSection;
