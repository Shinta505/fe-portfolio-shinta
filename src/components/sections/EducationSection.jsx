import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getEducations } from '../../api/backendApi';
import { LuGraduationCap, LuCalendar, LuAward, LuBookOpen } from 'react-icons/lu';
import { FaUniversity } from 'react-icons/fa';

// Konstanta dummy data TIDAK diekspor agar tidak memicu pesan peringatan Vite Fast Refresh
const dummyEducations = [
  {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    institution_logo: null,
    institution_name: 'UPN "Veteran" Yogyakarta',
    degree: 'Sarjana Komputer',
    field_of_study: 'Teknik Informatika',
    start_date: 'Agustus 2022',
    end_date: 'Sekarang',
    score: '3.85',
    activities: 'Head of Division & Secretary General Organisasi Kemahasiswaan, Student Coordinator Pengabdian Masyarakat di Dusun Tamanan.',
    description: 'Fokus studi pada pengembangan perangkat lunak (Full-stack web development), perancangan antarmuka pengguna (UI/UX), serta penerapan Machine Learning (Computer Vision dan Deep Learning).',
    media: ''
  }
];

const EducationSection = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const response = await getEducations();
        const data = response.data?.data || response.data;

        if (Array.isArray(data) && data.length > 0) {
          setEducations(data);
        } else {
          setEducations(dummyEducations);
        }
      } catch (error) {
        console.error('Gagal mengambil data pendidikan dari backend, menggunakan data dummy:', error);
        setEducations(dummyEducations);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
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
            Riwayat Pendidikan
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Latar Belakang <span className="text-gradient">Akademis</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Perjalanan pendidikan formal yang membangun landasan pengetahuan teoretis dan keterampilan praktis saya di bidang teknologi.
          </p>
        </div>

        {/* Timeline Konten */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat riwayat pendidikan..." />
        ) : (
          <div className="relative border-l border-borderMuted ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
            {educations.map((edu, index) => (
              <motion.div
                key={edu.uuid || edu.id || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-8.25 sm:-left-10.25 top-6 w-4 h-4 rounded-full bg-goldPrimary border-4 border-bgMain shadow-md shadow-goldPrimary/30" />

                <Card className="p-6 sm:p-8 flex flex-col space-y-4 bg-bgSurface/40 hover:bg-bgSurface/70 border-borderMuted hover:border-goldPrimary transition-colors duration-300">

                  {/* Bagian Institusi & Gelar */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xl sm:text-2xl font-bold font-poppins text-gray-100 flex items-center gap-2">
                        {edu.institution_logo ? (
                          <img src={edu.institution_logo} alt="Logo" className="w-6 h-6 object-contain" />
                        ) : (
                          <FaUniversity className="text-goldPrimary w-5 h-5" />
                        )}
                        {edu.institution_name}
                      </h4>
                      <p className="flex items-center gap-2 text-goldPrimary font-medium text-sm sm:text-base">
                        <LuGraduationCap className="w-5 h-5" />
                        <span>{edu.degree} — {edu.field_of_study}</span>
                      </p>
                    </div>

                    {/* Metadata Waktu & IPK */}
                    <div className="flex flex-col sm:items-end gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <LuCalendar className="w-4 h-4 text-borderMuted" />
                        <span>
                          {edu.start_date} — {edu.end_date ? edu.end_date : 'Sekarang'}
                        </span>
                      </div>
                      {edu.score && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-goldPrimary/10 border border-goldPrimary/20 text-goldPrimary rounded-full font-semibold">
                          <LuAward className="w-3.5 h-3.5" />
                          <span>IPK: {edu.score}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deskripsi & Aktivitas */}
                  <div className="pt-2 space-y-3">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {edu.description}
                    </p>

                    {edu.activities && (
                      <div className="p-4 rounded-xl bg-bgMain border border-borderMuted flex items-start gap-3">
                        <LuBookOpen className="w-5 h-5 text-goldPrimary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Aktivitas & Penghargaan</p>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {edu.activities}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default EducationSection;