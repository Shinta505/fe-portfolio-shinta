import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectByIdOrSlug } from '../../api/backendApi';
import { LuArrowLeft, LuExternalLink, LuFolderGit2, LuCalendar } from 'react-icons/lu';
import { FaGithub, FaFigma } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ContentProtector from '../../components/common/ContentProtector';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Data dummy diletakkan di luar komponen dan TIDAK DIEKSPOR 
// untuk menghindari pesan error "Fast refresh only works when a file only exports components".
const DUMMY_PROJECT = {
  uuid: 'ce7fb94d-4d9a-4d6e-944c-44361cf81260',
  title: 'Portfolio Website CMS',
  slug: 'portfolio-website-cms',
  category: 'Website Development',
  description: 'Sistem manajemen konten portofolio pribadi berbasis Node.js dan Supabase. Memungkinkan administrator untuk mengelola profil, artikel blog, riwayat pendidikan, pengalaman kerja, serta galeri karya dengan mudah melalui antarmuka dashboard yang intuitif.\n\nProyek ini dikembangkan dengan fokus pada performa, aksesibilitas, dan perlindungan konten (Content Protection) untuk menjaga orisinalitas karya.',
  tools: 'React.js, Tailwind CSS, Node.js, Express, Sequelize, Supabase, Framer Motion',
  image: '',
  github_url: 'https://github.com/Shinta505/portfolio',
  figma_url: 'https://figma.com',
  website_url: 'https://shintanursobah.vercel.app',
  createdAt: '2023-11-15T10:00:00.000Z'
};

const ProjectDetail = () => {
  const { identifier } = useParams();
  const [project, setProject] = useState(() => (identifier ? null : DUMMY_PROJECT));
  const [loading, setLoading] = useState(Boolean(identifier));

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await getProjectByIdOrSlug(identifier);
        const data = response.data?.data || response.data;
        if (data) {
          setProject(data);
        } else {
          setProject(DUMMY_PROJECT);
        }
      } catch (error) {
        console.error('Gagal memuat detail proyek, menggunakan data dummy:', error);
        setProject(DUMMY_PROJECT);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) fetchProjectDetail();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgMain flex justify-center items-center">
        <LoadingSpinner size="lg" text="Memuat detail karya..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center text-gray-300">
        <h2 className="text-2xl font-bold font-poppins mb-4">Projek tidak ditemukan</h2>
        <Link to="/#projects" className="text-goldPrimary hover:text-goldHover flex items-center gap-2">
          <LuArrowLeft /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <ContentProtector>
      <SEO 
        title={`${project.title} - Portofolio`} 
        description={project.description.substring(0, 150)} 
      />
      <div className="min-h-screen bg-bgMain flex flex-col font-sans text-gray-100">
        <Navbar />

        <main className="grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tombol Kembali */}
            <Link 
              to="/#projects" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-goldPrimary transition-colors mb-8"
            >
              <LuArrowLeft className="w-4 h-4" />
              Kembali ke Galeri
            </Link>

            {/* Header Proyek */}
            <header className="mb-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider text-bgMain bg-goldPrimary rounded-full">
                  {project.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <LuCalendar className="w-3 h-3" />
                  {new Date(project.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-gray-100 leading-tight">
                {project.title}
              </h1>
            </header>

            {/* Banner Gambar */}
            <div className="w-full h-64 sm:h-80 md:h-96 bg-bgSurface border border-borderMuted rounded-2xl overflow-hidden flex items-center justify-center mb-12 shadow-lg relative">
              {project.image ? (
                <img
                  src={project.image.startsWith('http') ? project.image : `https://be-portfolio-shinta.vercel.app${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-borderMuted">
                  <LuFolderGit2 className="w-24 h-24 mb-4" />
                  <p className="text-sm">Tidak ada pratinjau media</p>
                </div>
              )}
            </div>

            {/* Grid Konten Bawah */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Kolom Deskripsi (Kiri) */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold font-poppins text-goldPrimary">Tentang Projek</h3>
                <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {project.description}
                </div>
              </div>

              {/* Kolom Sidebar Info (Kanan) */}
              <div className="space-y-8">
                {/* Tools & Tech Stack */}
                <div className="p-6 bg-bgSurface/40 border border-borderMuted rounded-2xl">
                  <h4 className="font-semibold font-poppins text-gray-100 mb-4">Teknologi Digunakan</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.split(',').map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-xs rounded-lg bg-bgMain border border-borderMuted text-gray-300"
                      >
                        {tool.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tautan Proyek */}
                <div className="p-6 bg-bgSurface/40 border border-borderMuted rounded-2xl space-y-4">
                  <h4 className="font-semibold font-poppins text-gray-100 mb-2">Tautan Relevan</h4>
                  
                  {project.website_url && (
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borderMuted text-gray-300 hover:border-goldPrimary hover:text-goldPrimary transition-colors group"
                    >
                      <LuExternalLink className="w-5 h-5 text-gray-400 group-hover:text-goldPrimary" />
                      <span className="text-sm font-medium">Kunjungi Website</span>
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borderMuted text-gray-300 hover:border-goldPrimary hover:text-goldPrimary transition-colors group"
                    >
                      <FaGithub className="w-5 h-5 text-gray-400 group-hover:text-goldPrimary" />
                      <span className="text-sm font-medium">Repository Source Code</span>
                    </a>
                  )}

                  {project.figma_url && (
                    <a
                      href={project.figma_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-bgMain border border-borderMuted text-gray-300 hover:border-goldPrimary hover:text-goldPrimary transition-colors group"
                    >
                      <FaFigma className="w-5 h-5 text-gray-400 group-hover:text-goldPrimary" />
                      <span className="text-sm font-medium">Desain Figma</span>
                    </a>
                  )}

                  {/* Kondisi Jika Tidak Ada Link */}
                  {!project.website_url && !project.github_url && !project.figma_url && (
                    <p className="text-sm text-gray-500 italic">Tidak ada tautan publik yang tersedia untuk karya ini.</p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </ContentProtector>
  );
};

export default ProjectDetail;