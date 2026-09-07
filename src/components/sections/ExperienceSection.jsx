import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getExperiences } from '../../api/backendApi';
import { LuBriefcaseBusiness, LuMapPin, LuCalendar } from 'react-icons/lu';

// Konstanta dummy data TIDAK diekspor agar tidak mengganggu Vite Fast Refresh
const dummyExperiences = [
  {
    uuid: '1',
    position: 'Full-Stack Web Developer',
    company: 'Freelance & Personal Projects',
    location: 'Sleman, Yogyakarta',
    location_type: 'Di lokasi',
    employment_type: 'Pekerja Mandiri',
    start_date: 'Agustus 2025',
    end_date: 'Sekarang',
    description: 'Mengembangkan dan merancang aplikasi web interaktif, termasuk platform pembelajaran kosakata bahasa Inggris dan sistem manajemen konten portofolio. Menggunakan teknologi React.js, Node.js, Express, Tailwind CSS, serta integrasi database Supabase PostgreSQL.',
    skills: 'React.js, Node.js, Supabase, Tailwind CSS, Express.js'
  },
  {
    uuid: '2',
    position: 'Content Creator & Affiliate Marketer',
    company: 'Skincare & Healthcare Brands',
    location: 'Yogyakarta',
    location_type: 'Di lokasi',
    employment_type: 'Pekerja Lepas',
    start_date: 'Agustus 2025',
    end_date: 'November 2025',
    description: 'Berkolaborasi secara tatap muka (in-person) di Yogyakarta untuk merancang materi promosi, landing page, dan kampanye media sosial karosel guna meningkatkan visibilitas produk kemitraan afiliasi perawatan kulit.',
    skills: 'Digital Marketing, Content Creation, Copywriting, Canva'
  },
  {
    uuid: '3',
    position: 'Student Coordinator',
    company: 'Program Pengabdian Masyarakat UPN "Veteran" Yogyakarta',
    location: 'Dusun Tamanan, Yogyakarta',
    location_type: 'Di lokasi',
    employment_type: 'Kontrak',
    start_date: 'Oktober 2024',
    end_date: 'Oktober 2024',
    description: 'Mengoordinasikan kegiatan kerja bakti komunitas secara langsung. Hari pertama difokuskan pada pembersihan area kelompok tani dan peralatannya, sedangkan hari kedua difokuskan secara khusus pada pembersihan fasilitas gedung olahraga.',
    skills: 'Leadership, Event Management, Communication, Teamwork'
  }
];

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]); // Menyimpan data pengalaman
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await getExperiences();
        const data = response.data?.data || response.data;

        if (Array.isArray(data) && data.length > 0) {
          setExperiences(data);
        } else {
          setExperiences(dummyExperiences);
        }
      } catch (error) {
        console.error('Gagal mengambil data experience dari backend, menggunakan data dummy:', error);
        setExperiences(dummyExperiences);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
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
            Perjalanan Karir
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Pengalaman <span className="text-gradient">Profesional</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Rekam jejak pengalaman kerja, kepemimpinan, dan kontribusi proyek yang telah membentuk kompetensi teknis dan kemampuan manajerial saya.
          </p>
        </div>

        {/* Timeline Konten */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat pengalaman..." />
        ) : (
          <div className="relative border-l border-borderMuted ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.uuid || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-8.25 sm:-left-10.25 top-6 w-4 h-4 rounded-full bg-goldPrimary border-4 border-bgMain shadow-md shadow-goldPrimary/30" />

                <Card className="p-6 sm:p-8 flex flex-col space-y-4 bg-bgSurface/40 hover:bg-bgSurface/70 border-borderMuted hover:border-goldPrimary transition-colors duration-300">

                  {/* Bagian Judul dan Perusahaan */}
                  <div className="space-y-1">
                    <h4 className="text-xl sm:text-2xl font-bold font-poppins text-gray-100">
                      {exp.position}
                    </h4>
                    <div className="flex items-center gap-2 text-goldPrimary font-medium text-sm sm:text-base">
                      <LuBriefcaseBusiness className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  {/* Metadata: Waktu, Lokasi, Tipe */}
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <LuCalendar className="w-4 h-4 text-borderMuted" />
                      <span>
                        {exp.start_date} — {exp.end_date ? exp.end_date : 'Sekarang'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LuMapPin className="w-4 h-4 text-borderMuted" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Lencana (Badges) Tipe Pekerjaan & Lokasi */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-3 py-1 bg-bgMain border border-borderMuted text-gray-300 text-[10px] sm:text-xs rounded-full uppercase tracking-wider font-semibold">
                      {exp.employment_type}
                    </span>
                    <span className="px-3 py-1 bg-goldPrimary/10 border border-goldPrimary/20 text-goldPrimary text-[10px] sm:text-xs rounded-full uppercase tracking-wider font-semibold">
                      {exp.location_type}
                    </span>
                  </div>

                  {/* Deskripsi Pekerjaan */}
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed pt-2">
                    {exp.description}
                  </p>

                  {/* Keahlian (Skills) */}
                  {exp.skills && (
                    <div className="pt-4 mt-2 border-t border-borderMuted/60 flex flex-wrap gap-2">
                      {exp.skills.split(',').map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs bg-bgMain text-gray-400 border border-borderMuted rounded-md"
                        >
                          {skill.trim()}
                        </span>
                      ))}
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

export default ExperienceSection;