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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
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

        {/* Grid Konten Artikel atau Pesan Kosong */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat artikel..." />
        ) : articles.length > 0 ? (
          <div className="relative">
            {/* Desktop View: Grid 4 Kolom */}
            <div className="hidden lg:grid grid-cols-4 gap-6">
              {articles.map((article) => (
                <div key={article.uuid} className="h-full">
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
                </div>
              ))}
            </div>

            {/* Mobile / Tablet View: 1 Card dengan Slider & Navigasi < 1 dari 2 > */}
            <div className="lg:hidden space-y-6">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden bg-bgSurface/40 border-borderMuted group hover:border-goldPrimary transition-colors duration-300">
                      {/* Gambar Thumbnail */}
                      <Link to={`/article/${articles[currentIndex].slug || articles[currentIndex].uuid}`} className="relative h-48 w-full overflow-hidden bg-bgMain border-b border-borderMuted flex items-center justify-center cursor-pointer">
                        {articles[currentIndex].image ? (
                          <img
                            src={articles[currentIndex].image.startsWith('http') ? articles[currentIndex].image : `https://be-portfolio-shinta.vercel.app${articles[currentIndex].image}`}
                            alt={articles[currentIndex].title}
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
                            {new Date(articles[currentIndex].publishedAt || new Date()).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Judul & Konten (Excerpt) */}
                        <div className="grow">
                          <Link to={`/article/${articles[currentIndex].slug || articles[currentIndex].uuid}`}>
                            <h4 className="text-xl font-bold font-poppins text-gray-100 group-hover:text-goldPrimary transition-colors line-clamp-2 cursor-pointer leading-snug">
                              {articles[currentIndex].title}
                            </h4>
                          </Link>
                          <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                            {articles[currentIndex].content.replace(/<[^>]+>/g, '')}
                          </p>
                        </div>

                        {/* Aksi Baca Selengkapnya */}
                        <div className="pt-4 border-t border-borderMuted/60 mt-4">
                          <Link
                            to={`/article/${articles[currentIndex].slug || articles[currentIndex].uuid}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold font-poppins text-gray-300 group-hover:text-goldPrimary transition-colors"
                          >
                            Baca Selengkapnya
                            <LuArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Kontrol Navigasi Slider Mobile */}
              <div className="flex items-center justify-center gap-4 text-gray-300 font-medium text-sm">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg bg-bgSurface/60 border border-borderMuted hover:text-goldPrimary hover:border-goldPrimary transition-colors"
                  aria-label="Previous Slide"
                >
                  <LuChevronLeft className="w-5 h-5" />
                </button>
                <span>
                  {currentIndex + 1} dari {articles.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg bg-bgSurface/60 border border-borderMuted hover:text-goldPrimary hover:border-goldPrimary transition-colors"
                  aria-label="Next Slide"
                >
                  <LuChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-bgSurface/20 border border-borderMuted max-w-md mx-auto space-y-3">
            <LuFileText className="w-12 h-12 text-goldPrimary mx-auto opacity-80" />
            <p className="text-gray-300 font-medium text-base">Belum ada artikel yang dipublish.</p>
            <p className="text-gray-500 text-sm">Silakan kunjungi kembali nanti untuk membaca pembaruan wawasan terbaru.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ArticlesSection;
