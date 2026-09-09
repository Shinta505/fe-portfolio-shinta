import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getProjects } from '../../api/backendApi';
import { FaGithub, FaFigma } from 'react-icons/fa';
import { LuExternalLink, LuFolderGit2, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

// Konstanta data dummy tidak diekspor untuk mencegah error Vite Fast Refresh
const dummyProjects = [
  {
    uuid: 'p1',
    title: 'English Vocab Learning App',
    slug: 'english-vocab-learning-app',
    category: 'Website Development',
    description: 'Aplikasi web full-stack untuk pembelajaran kosakata bahasa Inggris yang terintegrasi dengan database Supabase PostgreSQL, payment gateway Midtrans, Google Gemini API, dan layanan Text-to-Speech.',
    tools: 'React.js, Node.js, Vercel, Supabase, PostgreSQL',
    image: '',
    github_url: 'https://github.com/Shinta505',
    figma_url: '',
    website_url: 'https://example.com'
  },
  {
    uuid: 'p2',
    title: 'Facial Emotion Recognition',
    slug: 'facial-emotion-recognition',
    category: 'Machine Learning',
    description: 'Riset dan analisis performa komparatif antara arsitektur ResNet-50 dan InceptionV3 untuk pengenalan ekspresi wajah menggunakan teknik transfer learning pada dataset RAF-DB dan MTCNN face alignment.',
    tools: 'Python, TensorFlow, OpenCV, Streamlit',
    image: '',
    github_url: 'https://github.com/Shinta505',
    figma_url: '',
    website_url: ''
  },
  {
    uuid: 'p3',
    title: 'Desa Sangubanyu Community Profile',
    slug: 'desa-sangubanyu-community-profile',
    category: 'Website Development',
    description: 'Pembuatan dan deployment website profil komunitas serta sistem direktori bisnis lokal yang terintegrasi khusus untuk memfasilitasi Desa Sangubanyu dan Dusun Kepuh Pelem.',
    tools: 'HTML, CSS, JavaScript, Node.js',
    image: '',
    github_url: 'https://github.com/Shinta505',
    figma_url: '',
    website_url: 'https://sangubanyu.com'
  },
  {
    uuid: 'p4',
    title: 'EcoPlan Waste Classification',
    slug: 'ecoplan-waste-classification',
    category: 'Machine Learning',
    description: 'Aplikasi cerdas untuk klasifikasi jenis sampah organik dan anorganik menggunakan algoritma Convolutional Neural Networks (CNN) dengan arsitektur MobileNetV2.',
    tools: 'Python, TensorFlow, Keras, MobileNetV2',
    image: '',
    github_url: 'https://github.com/Shinta505',
    figma_url: '',
    website_url: ''
  },
  {
    uuid: 'p5',
    title: 'Interactive 3D Editor Web',
    slug: 'interactive-3d-editor-web',
    category: 'Website Development',
    description: 'Pengembangan antarmuka aplikasi web editor 3D interaktif yang memungkinkan manipulasi objek visual menggunakan pustaka Three.js dan rendering LatheGeometry.',
    tools: 'JavaScript, Three.js, React.js',
    image: '',
    github_url: 'https://github.com/Shinta505',
    figma_url: '',
    website_url: ''
  },
  {
    uuid: 'p6',
    title: 'Medical Management System',
    slug: 'medical-management-system',
    category: 'Website Development',
    description: 'Sistem manajemen berbasis web dengan fitur operasi data lengkap untuk mengelola profesional medis, riwayat pasien, serta pelacakan sistem inventaris fasilitas.',
    tools: 'Node.js, Express.js, React.js',
    image: '',
    github_url: 'https://github.com/Shinta505',
    figma_url: '',
    website_url: ''
  }
];

const categories = ['All', 'Website Development', 'Machine Learning', 'UI/UX Design'];

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(dummyProjects);
        }
      } catch (error) {
        console.error('Gagal mengambil data projek, menggunakan data dummy:', error);
        setProjects(dummyProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Reset index slider setiap kali kategori berubah
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((project) => project.category.toLowerCase() === selectedCategory.toLowerCase());

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredProjects.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredProjects.length - 1 ? prev + 1 : 0));
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
            Galeri Karya
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Projek Pilihan <span className="text-gradient">Terbaru</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Kumpulan studi kasus, eksplorasi machine learning, dan implementasi aplikasi web full-stack.
          </p>
        </div>

        {/* Filter Kategori & Navigasi Slider */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-poppins transition-all duration-300 focus:outline-none ${selectedCategory === category
                    ? 'bg-goldPrimary text-bgMain shadow-lg shadow-goldPrimary/20'
                    : 'bg-bgSurface/60 text-gray-300 border border-borderMuted hover:border-goldPrimary hover:text-goldPrimary'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tombol Geser < 1 dari 2 > */}
          {!loading && filteredProjects.length > 0 && (
            <div className="flex items-center gap-3 bg-bgSurface/60 border border-borderMuted px-3 py-1.5 rounded-xl">
              <button
                onClick={handlePrev}
                className="p-1.5 text-gray-300 hover:text-goldPrimary transition-colors focus:outline-none"
                aria-label="Previous Slide"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs sm:text-sm font-poppins font-semibold text-gray-300 min-w-[50px] text-center">
                {currentIndex + 1} dari {filteredProjects.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 text-gray-300 hover:text-goldPrimary transition-colors focus:outline-none"
                aria-label="Next Slide"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Konten Projek (1 di Mobile, 4 di Desktop via Slider) */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat projek..." />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-poppins text-sm">
            Tidak ada projek pada kategori ini.
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              animate={{ x: `calc(-${currentIndex} * (100% / var(--slides-per-view, 1) + 24px / var(--slides-per-view, 1)))` }}
              style={{
                // Menyesuaikan jumlah card yang tampil: 1 untuk mobile, 4 untuk lg ke atas
                display: 'grid',
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              }}
            >
              <style>{`
                @media (min-width: 1024px) {
                  .grid {
                    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    transform: translateX(calc(-${currentIndex} * (100% / 4 + 1.5rem / 4))) !important;
                  }
                }
              `}</style>

              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.uuid}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <Card className="h-full flex flex-col overflow-hidden bg-bgSurface/40 border-borderMuted group hover:border-goldPrimary transition-colors duration-300">

                      {/* Gambar Thumbnail */}
                      <Link to={`/project/${project.slug || project.uuid}`} className="relative h-48 w-full overflow-hidden bg-bgMain border-b border-borderMuted flex items-center justify-center cursor-pointer">
                        {project.image ? (
                          <img
                            src={project.image.startsWith('http') ? project.image : `https://be-portfolio-shinta.vercel.app${project.image}`}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <LuFolderGit2 className="w-16 h-16 text-borderMuted group-hover:text-goldPrimary/50 transition-colors duration-300" />
                        )}
                        <div className="absolute top-3 right-3 bg-bgMain/90 backdrop-blur border border-borderMuted px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-goldPrimary uppercase">
                          {project.category}
                        </div>
                      </Link>

                      {/* Info Projek */}
                      <div className="p-6 flex flex-col grow space-y-4">
                        <div>
                          <Link to={`/project/${project.slug || project.uuid}`}>
                            <h4 className="text-xl font-bold font-poppins text-gray-100 group-hover:text-goldPrimary transition-colors line-clamp-1 cursor-pointer">
                              {project.title}
                            </h4>
                          </Link>
                          <p className="text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack Tools */}
                        <div className="flex flex-wrap gap-2 pt-2 mt-auto">
                          {project.tools.split(',').map((tool, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded-md bg-bgMain border border-borderMuted text-gray-300"
                            >
                              {tool.trim()}
                            </span>
                          ))}
                        </div>

                        {/* Aksi Tautan Eksternal */}
                        <div className="flex items-center gap-3 pt-4 border-t border-borderMuted/60 mt-4">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-bgMain border border-borderMuted text-gray-400 hover:text-goldPrimary hover:border-goldPrimary transition-colors"
                              aria-label="Repository GitHub"
                            >
                              <FaGithub className="w-4 h-4" />
                            </a>
                          )}
                          {project.figma_url && (
                            <a
                              href={project.figma_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-bgMain border border-borderMuted text-gray-400 hover:text-goldPrimary hover:border-goldPrimary transition-colors"
                              aria-label="Desain Figma"
                            >
                              <FaFigma className="w-4 h-4" />
                            </a>
                          )}
                          {project.website_url && (
                            <a
                              href={project.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-bgMain border border-borderMuted text-gray-400 hover:text-goldPrimary hover:border-goldPrimary transition-colors"
                              aria-label="Kunjungi Website"
                            >
                              <LuExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
