import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArticleByIdOrSlug } from '../../api/backendApi';
import { LuArrowLeft, LuCalendar, LuImageOff } from 'react-icons/lu';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ContentProtector from '../../components/common/ContentProtector';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Data dummy diletakkan di luar komponen dan TIDAK DIEKSPOR 
// untuk menghindari pesan error "Fast refresh only works when a file only exports components".
const DUMMY_ARTICLE = {
  uuid: 'dummy-article-1',
  title: 'Membangun API Berkinerja Tinggi dengan Express.js dan Sequelize',
  slug: 'membangun-api-berkinerja-tinggi-dengan-express-js-dan-sequelize',
  content: 'Dalam arsitektur modern, RESTful API menjadi tulang punggung komunikasi antar sistem. Express.js yang dipadukan dengan ORM Sequelize memberikan kombinasi luar biasa antara kesederhanaan routing dan ketangguhan pengelolaan database relasional seperti PostgreSQL.\n\nPendekatan ini memungkinkan pengembang untuk dengan cepat memodelkan data, mengelola relasi tabel, dan menjalankan kueri yang dioptimalkan. Pada artikel ini, kita akan membahas lebih dalam mengenai konfigurasi dasar, penanganan error, serta penerapan middleware untuk mengamankan endpoint secara efektif.',
  image: '',
  publishedAt: '2023-11-20T10:00:00.000Z',
  status: 'published'
};

const ArticleDetail = () => {
  const { identifier } = useParams();
  const [article, setArticle] = useState(() => (identifier ? null : DUMMY_ARTICLE));
  const [loading, setLoading] = useState(Boolean(identifier));

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const response = await getArticleByIdOrSlug(identifier);
        const data = response.data?.data || response.data;
        if (data) {
          setArticle(data);
        } else {
          setArticle(DUMMY_ARTICLE);
        }
      } catch (error) {
        console.error('Gagal memuat detail artikel, menggunakan data dummy:', error);
        setArticle(DUMMY_ARTICLE);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) fetchArticleDetail();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgMain flex justify-center items-center">
        <LoadingSpinner size="lg" text="Memuat detail artikel..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center text-gray-300">
        <h2 className="text-2xl font-bold font-poppins mb-4">Artikel tidak ditemukan</h2>
        <Link to="/#articles" className="text-goldPrimary hover:text-goldHover flex items-center gap-2">
          <LuArrowLeft /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Membersihkan tag HTML dasar untuk meta description jika konten berupa Rich Text
  const plainTextContent = article.content ? article.content.replace(/<[^>]+>/g, '') : '';

  return (
    <ContentProtector>
      <SEO 
        title={`${article.title} - Portofolio`} 
        description={plainTextContent.substring(0, 150)} 
      />
      <div className="min-h-screen bg-bgMain flex flex-col font-sans text-gray-100">
        <Navbar />

        <main className="grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tombol Kembali */}
            <Link 
              to="/#articles" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-goldPrimary transition-colors mb-8"
            >
              <LuArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Link>

            {/* Header Artikel */}
            <header className="mb-10 space-y-5">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider text-bgMain bg-goldPrimary rounded-full uppercase">
                  Artikel
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                  <LuCalendar className="w-4 h-4" />
                  {new Date(article.publishedAt || article.createdAt || new Date()).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-gray-100 leading-snug">
                {article.title}
              </h1>
            </header>

            {/* Banner Gambar */}
            <div className="w-full h-64 sm:h-80 md:h-100 bg-bgSurface border border-borderMuted rounded-2xl overflow-hidden flex items-center justify-center mb-12 shadow-lg relative">
              {article.image ? (
                <img
                  src={article.image.startsWith('http') ? article.image : `https://be-portfolio-shinta.vercel.app${article.image}`}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-borderMuted">
                  <LuImageOff className="w-24 h-24 mb-4" />
                  <p className="text-sm">Tidak ada sampul artikel</p>
                </div>
              )}
            </div>

            {/* Konten Artikel */}
            <article className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
              {/* Jika backend kelak menggunakan HTML rich text, bisa diganti menggunakan dangerouslySetInnerHTML */}
              {article.content}
            </article>

          </motion.div>
        </main>

        <Footer />
      </div>
    </ContentProtector>
  );
};

export default ArticleDetail;