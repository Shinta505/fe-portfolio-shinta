import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { LuUser, LuMapPin, LuMail, LuDownload, LuExternalLink, LuGraduationCap } from 'react-icons/lu';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { getProfile, getActiveResume } from '../../api/backendApi';

const AboutSection = () => {
  const [profile, setProfile] = useState(null);
  const [activeResume, setActiveResume] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, resumeRes] = await Promise.allSettled([
          getProfile(),
          getActiveResume(),
        ]);

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data?.data || profileRes.value.data);
        }

        if (resumeRes.status === 'fulfilled') {
          setActiveResume(resumeRes.value.data?.data || resumeRes.value.data);
        }
      } catch (error) {
        console.error('Gagal mengambil data profil atau resume:', error);
      }
    };

    fetchData();
  }, []);

  const dummyProfile = {
    fullname: "Shinta Nursobah Chairani",
    headline: "Full-Stack Web Developer & UI/UX Designer",
    bio: "Mahasiswa Teknik Informatika UPN \"Veteran\" Yogyakarta (Angkatan 2022) yang memiliki ketertarikan mendalam pada pengembangan web full-stack, antarmuka pengguna (UI/UX), serta machine learning dan computer vision. Berpengalaman dalam merancang dan membangun aplikasi web interaktif menggunakan Node.js, Express.js, React.js, serta integrasi database Supabase PostgreSQL.",
    location: "Sleman, Yogyakarta (Asal: Tegal, Jawa Tengah)",
    email: "shintanursobah@example.com",
    github_url: "https://github.com/Shinta505",
    linkedin_url: "https://linkedin.com/in/shinta-nursobah-chairani",
    instagram_url: "https://instagram.com/by_shntaa",
    profile_image: ""
  };

  const dummyResume = {
    version_name: "Resume Utama - Fullstack & Frontend",
    cv_url: "https://example.com/cv-shinta.pdf"
  };

  const currentProfile = profile || dummyProfile;
  const currentResume = activeResume || dummyResume;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold font-poppins uppercase tracking-widest text-goldPrimary">
            Tentang Saya
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Mengenal Lebih Dekat <span className="text-gradient">Profil & Latar Belakang</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Berdedikasi dalam menciptakan solusi digital yang fungsional, estetis, dan berdampak positif melalui kode serta desain yang terstruktur.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Kolom Kiri: Ringkasan Biodata & Info Kontak */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 bg-bgSurface/60 border-borderMuted">
              <div className="flex items-center gap-4 pb-6 border-b border-borderMuted/60">
                {/* Kondisi Foto Profil: Menampilkan gambar dari database jika ada, atau inisial SN jika kosong */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center text-goldPrimary text-2xl font-bold font-poppins shrink-0">
                  {currentProfile.profile_image ? (
                    <img
                      src={currentProfile.profile_image}
                      alt={currentProfile.fullname || dummyProfile.fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>SN</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-100 font-poppins">
                    {currentProfile.fullname || dummyProfile.fullname}
                  </h4>
                  <p className="text-xs sm:text-sm text-goldPrimary font-medium mt-0.5">
                    {currentProfile.headline || dummyProfile.headline}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
                    <LuGraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pendidikan</p>
                    <p className="font-medium text-gray-200">Teknik Informatika UPN "Veteran" Yogyakarta</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
                    <LuMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lokasi Domisili</p>
                    <p className="font-medium text-gray-200">{currentProfile.location || dummyProfile.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
                    <LuMail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email Kontak</p>
                    <p className="font-medium text-gray-200">{currentProfile.email || dummyProfile.email}</p>
                  </div>
                </div>
              </div>

              {/* Tautan Sosial Media */}
              <div className="pt-4 border-t border-borderMuted/60 flex items-center gap-3">
                <a
                  href={currentProfile.github_url || dummyProfile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-gray-300 hover:text-goldPrimary hover:border-goldPrimary transition-colors duration-300"
                  aria-label="GitHub Profile"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href={currentProfile.linkedin_url || dummyProfile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-gray-300 hover:text-goldPrimary hover:border-goldPrimary transition-colors duration-300"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href={currentProfile.instagram_url || dummyProfile.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-gray-300 hover:text-goldPrimary hover:border-goldPrimary transition-colors duration-300"
                  aria-label="Instagram Profile"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </Card>
          </div>

          {/* Kolom Kanan: Deskripsi Bio & Unduh/Lihat Resume */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 bg-bgSurface/40 border-borderMuted">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-goldPrimary">
                  <LuUser className="w-5 h-5" />
                  <h4 className="font-poppins font-semibold text-lg text-gray-100">Siapa Saya?</h4>
                </div>
                <p className="text-gray-300 text-base leading-relaxed font-sans">
                  {currentProfile.bio || dummyProfile.bio}
                </p>
              </div>

              {/* Bagian Tautan Resume / CV */}
              <div className="pt-6 border-t border-borderMuted/60 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h5 className="text-sm font-semibold font-poppins text-gray-200">Dokumen Resume / Curriculum Vitae</h5>
                    <p className="text-xs text-gray-400">Versi aktif: {currentResume.version_name || dummyResume.version_name}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={currentResume.cv_url || dummyResume.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        iconRight={LuExternalLink}
                      >
                        Lihat CV
                      </Button>
                    </a>
                    <a
                      href={currentResume.cv_url || dummyResume.cv_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        iconLeft={LuDownload}
                      >
                        Unduh CV
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
