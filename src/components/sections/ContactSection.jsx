import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuSend, LuMail, LuUser, LuMessageSquare, LuCircleCheck, LuCircleAlert } from 'react-icons/lu';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { sendContactMessage, getProfile } from '../../api/backendApi';

/**
 * Komponen ContactSection
 * Berfungsi untuk menampilkan formulir kontak interaktif dan menangani pengiriman pesan 
 * yang terhubung ke backend API serta database PostgreSQL (Supabase)[cite: 1].
 */
const ContactSection = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data?.data || response.data);
      } catch (error) {
        console.error('Gagal mengambil data profil:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Nilai fallback jika data profil dari database kosong
  const emailContact = profile?.email || 'shintanursobah@example.com';
  const locationContact = profile?.location || 'Sleman, Yogyakarta';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const response = await sendContactMessage(formData);
      setStatusMessage(response.data?.message || 'Pesan Anda berhasil dikirim. Terima kasih telah menghubungi kami.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setIsError(true);
      setStatusMessage(
        error.response?.data?.message || 'Terjadi kesalahan pada server saat mengirim pesan. Silakan coba lagi.'
      );
    } finally {
      setIsLoading(false);
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
            Hubungi Saya
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Mari Berdiskusi & <span className="text-gradient">Terhubung</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Punya pertanyaan, tawaran kolaborasi proyek, atau ingin sekadar menyapa? Jangan ragu untuk mengirimkan pesan melalui formulir di bawah ini.
          </p>
        </div>

        {/* Konten Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Kolom Informasi Kontak (Kiri) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6 bg-bgSurface/40 border-borderMuted">
              <div className="space-y-2">
                <h4 className="text-xl font-bold font-poppins text-gray-100">Informasi Kontak</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Saya terbuka untuk peluang kerja sama sebagai Full-Stack Developer, Frontend Engineer, maupun UI/UX Designer.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-borderMuted/60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary shrink-0">
                    <LuMail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email Utama</p>
                    <p className="text-sm font-medium text-gray-200">{emailContact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary shrink-0">
                    <LuUser className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lokasi</p>
                    <p className="text-sm font-medium text-gray-200">{locationContact}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-borderMuted/60">
                <div className="p-4 rounded-xl bg-bgMain border border-borderMuted space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-gray-300">Status Ketersediaan</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Aktif menerima proyek freelance, kolaborasi tim, maupun kesempatan magang/kerja penuh waktu.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Kolom Formulir Pesan (Kanan) */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-bgSurface/40 border-borderMuted">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Notifikasi Status Pengiriman */}
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${isError
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                  >
                    {isError ? <LuCircleAlert className="w-5 h-5 shrink-0" /> : <LuCircleCheck className="w-5 h-5 shrink-0" />}
                    <span>{statusMessage}</span>
                  </motion.div>
                )}

                {/* Input Nama */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <LuUser className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama Anda..."
                      className="w-full pl-11 pr-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <LuMail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="nama@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                    />
                  </div>
                </div>

                {/* Input Pesan */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                    Isi Pesan
                  </label>
                  <div className="relative">
                    <span className="absolute top-3.5 left-4 pointer-events-none text-gray-500">
                      <LuMessageSquare className="w-4 h-4" />
                    </span>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tuliskan pesan atau detail kolaborasi Anda di sini..."
                      className="w-full pl-11 pr-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Tombol Kirim */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  iconRight={LuSend}
                  className="w-full"
                >
                  Kirim Pesan
                </Button>

              </form>
            </Card>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;