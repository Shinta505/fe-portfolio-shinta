import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getSkills } from '../../api/backendApi';
import * as SiIcons from 'react-icons/si';
import { LuWrench } from 'react-icons/lu';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setSkills(data);
        }
      } catch (error) {
        console.error('Gagal mengambil data skills dari backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((skill) => skill.category.toLowerCase() === selectedCategory.toLowerCase());

  const renderSkillIcon = (iconName) => {
    if (iconName && SiIcons[iconName]) {
      const DynamicIcon = SiIcons[iconName];
      return <DynamicIcon className="w-6 h-6" />;
    }
    return <LuWrench className="w-6 h-6" />;
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
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold font-poppins uppercase tracking-widest text-goldPrimary">
            Keahlian & Teknologi
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-100">
            Teknologi yang Saya <span className="text-gradient">Kuasai</span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Berbagai kerangka kerja, bahasa pemrograman, dan alat penunjang yang saya gunakan dalam merancang serta membangun aplikasi web dan perangkat lunak.
          </p>
        </div>

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

        {loading ? (
          <LoadingSpinner size="md" text="Memuat keahlian..." />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6"
          >
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.uuid || skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-5 flex flex-col items-center justify-center gap-3 bg-bgSurface/40 border-borderMuted hover:border-goldPrimary hover:bg-bgSurface/70 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary group-hover:scale-110 transition-transform duration-300">
                    {renderSkillIcon(skill.icon)}
                  </div>
                  <div className="text-center space-y-0.5">
                    <h4 className="text-sm font-semibold font-poppins text-gray-200 group-hover:text-goldPrimary transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {skill.category}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default SkillsSection;