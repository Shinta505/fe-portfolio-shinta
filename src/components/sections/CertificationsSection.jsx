import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuAward, LuExternalLink, LuCalendar, LuShieldCheck } from 'react-icons/lu';
import { FaBuilding } from 'react-icons/fa';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getCertifications } from '../../api/backendApi';

// Konstanta data dummy (hardcoded) tidak diekspor untuk mencegah peringatan Vite Fast Refresh.
// Struktur properti disesuaikan dengan skema CertificationModel pada database PostgreSQL Supabase[cite: 1].
const dummyCertifications = [
  {
    uuid: 'dummy-cert-1',
    name: 'Belajar Dasar Pemrograman Web',
    issuer: 'Dicoding Indonesia',
    issueDate: 'Januari 2024',
    expirationDate: 'Januari 2027',
    credentialId: 'EYX49Y345ZDL',
    credentialUrl: 'https://www.dicoding.com/certificates/EYX49Y345ZDL',
    skills: 'HTML, CSS, JavaScript, Web Development',
    media: ''
  },
  {
    uuid: 'dummy-cert-2',
    name: 'Belajar Membuat Aplikasi Web dengan React',
    issuer: 'Dicoding Indonesia',
    issueDate: 'Maret 2024',
    expirationDate: 'Maret 2027',
    credentialId: 'JLX1L2485Z72',
    credentialUrl: 'https://www.dicoding.com/certificates/JLX1L2485Z72',
    skills: 'React.js, Frontend Development, UI/UX',
    media: ''
  },
  {
    uuid: 'dummy-cert-3',
    name: 'Cloud Practitioner Essentials',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'Juni 2024',
    expirationDate: 'Juni 2027',
    credentialId: 'AWS-CPE-00123',
    credentialUrl: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
    skills: 'Cloud Computing, AWS, Deployment, Server Management',
    media: ''
  }
];

/**
 * Komponen CertificationsSection
 * Berfungsi untuk merender antarmuka daftar lisensi dan sertifikasi profesional.
 * Terintegrasi dengan endpoint backend API untuk memuat data secara dinamis[cite: 1, 2].
 */
const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await getCertifications();
        const data = response.data?.data || response.data;

        // Memastikan ketersediaan data dari respons server
        if (Array.isArray(data) && data.length > 0) {
          setCertifications(data);
        } else {
          setCertifications(dummyCertifications);
        }
      } catch (error) {
        console.error('Terjadi anomali saat mengambil data sertifikasi, sistem menggunakan data cadangan (dummy):', error);
        setCertifications(dummyCertifications);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Bagian Header Seksi */}
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold font-poppins uppercase tracking-widest text-goldPrimary">
            Kualifikasi Profesional
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Lisensi & <span className="text-gradient">Sertifikasi</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Bukti pencapaian kompetensi teknis dan validasi keahlian yang diakui oleh institusi serta platform pembelajaran profesional.
          </p>
        </div>

        {/* Grid Konten Sertifikasi */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat data sertifikasi..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.uuid || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="h-full p-6 sm:p-8 flex flex-col bg-bgSurface/40 hover:bg-bgSurface/70 border-borderMuted hover:border-goldPrimary transition-all duration-300 group">

                  {/* Header Kartu: Judul dan Ikon */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center shrink-0 text-goldPrimary group-hover:scale-105 transition-transform duration-300">
                      <LuAward className="w-6 h-6" />
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-goldPrimary p-2 rounded-lg hover:bg-bgMain transition-colors"
                        aria-label="Lihat Kredensial"
                      >
                        <LuExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* Informasi Utama Sertifikasi */}
                  <div className="space-y-3 grow">
                    <h4 className="text-xl sm:text-2xl font-bold font-poppins text-gray-100 leading-snug group-hover:text-goldPrimary transition-colors">
                      {cert.name}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-borderMuted w-4 h-4 shrink-0" />
                        <span className="font-medium text-gray-200">{cert.issuer}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <LuCalendar className="text-borderMuted w-4 h-4 shrink-0" />
                        <span>
                          Diterbitkan: {cert.issueDate}
                          {cert.expirationDate ? ` — Kedaluwarsa: ${cert.expirationDate}` : ' (Tanpa masa berlaku)'}
                        </span>
                      </div>

                      {cert.credentialId && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                          <LuShieldCheck className="text-borderMuted w-4 h-4 shrink-0" />
                          <span>ID Kredensial: <span className="text-gray-300 font-mono">{cert.credentialId}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Daftar Keahlian / Kompetensi yang Diperoleh */}
                  {cert.skills && (
                    <div className="pt-5 mt-5 border-t border-borderMuted/60">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Keahlian Tervalidasi:</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.split(',').map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs font-medium bg-bgMain border border-borderMuted text-gray-300 rounded-md"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default CertificationsSection;
