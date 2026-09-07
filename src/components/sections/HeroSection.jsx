import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { LuArrowRight, LuCheck } from 'react-icons/lu';
import rocketImg from '../../assets/rocket.png';
import flashImg from '../../assets/flash.png';
import programmingSvg from '../../assets/programming.svg';
import { getProfile } from '../../api/backendApi';

const HeroSection = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data?.data || response.data);
      } catch (error) {
        console.error('Gagal mengambil data profil dari backend:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Mengambil data dari backend atau menggunakan fallback yang sesuai
  const name = profile?.fullname || "Shinta Nursobah Chairani";
  const title = profile?.headline || "Full-Stack Web Developer & UI/UX Designer";
  const headline = profile?.headline || "Membangun Solusi Digital Interaktif & Pengalaman Web Modern";
  const bio = profile?.bio || 'Mahasiswa Teknik Informatika UPN "Veteran" Yogyakarta yang berfokus pada pengembangan web full-stack, frontend engineering, serta perancangan antarmuka pengguna yang intuitif dan bermakna.';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-bgMain">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Kolom Kiri: Teks & Informasi Utama */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          {/* Indikator Keahlian Cepat */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-bgSurface border border-borderMuted shadow-inner">
            <img src={flashImg} alt="Flash Icon" className="w-4 h-4 object-contain" />
            <span className="text-xs sm:text-sm font-medium text-goldPrimary font-poppins tracking-wide">
              {title}
            </span>
          </div>

          {/* Headline Utama */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins tracking-tight text-gray-100 leading-[1.15]">
              Hi, I'm <span className="text-gradient">{name}</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-gray-300 font-poppins">
              {headline}
            </p>
          </div>

          {/* Deskripsi Singkat */}
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            {bio}
          </p>

          {/* Tombol CTA & Aksi */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#projects">
              <Button
                variant="primary"
                size="lg"
                iconLeft={() => <img src={rocketImg} alt="Rocket" className="w-5 h-5 object-contain" />}
                iconRight={LuArrowRight}
              >
                Get in Touch
              </Button>
            </a>
            <a href="#about">
              <Button variant="outline" size="lg">
                Explore About
              </Button>
            </a>
          </div>

          {/* Statistik / Poin Keunggulan yang Disesuaikan (Tanpa Tahun Pengalaman Palsu) */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-borderMuted/60 mt-6">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold font-poppins text-goldPrimary">2022</h3>
              <p className="text-xs sm:text-sm text-gray-400">Angkatan Informatika</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold font-poppins text-goldPrimary">Full-Stack</h3>
              <p className="text-xs sm:text-sm text-gray-400">& UI/UX Focus</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold font-poppins text-goldPrimary">100%</h3>
              <p className="text-xs sm:text-sm text-gray-400">Dedikasi Belajar</p>
            </div>
          </div>
        </motion.div>

        {/* Kolom Kanan: Foto / Gambar Ilustrasi */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          {/* Latar Belakang Efek Glow & Aksen Dekoratif */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-goldPrimary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="relative w-full max-w-md p-6 bg-bgSurface/40 border border-borderMuted rounded-3xl backdrop-blur-md shadow-2xl flex flex-col items-center gap-6">
            {/* Ilustrasi Gambar / SVG */}
            <div className="w-full h-64 sm:h-72 flex items-center justify-center overflow-hidden rounded-2xl bg-bgMain/60 border border-borderMuted/50 p-4">
              <img
                src={programmingSvg}
                alt="Programming Illustration"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>

            {/* Kapsul Status / Keahlian Tambahan */}
            <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-bgMain border border-borderMuted">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-goldPrimary animate-pulse" />
                <span className="text-xs font-medium text-gray-200 font-poppins">Open to Opportunities</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-goldPrimary font-medium">
                <LuCheck className="w-4 h-4" /> Ready
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;