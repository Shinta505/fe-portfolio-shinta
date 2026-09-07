import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Watermark from '../../components/common/Watermark';
import ContentProtector from '../../components/common/ContentProtector';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import SkillsSection from '../../components/sections/SkillsSection';
import ExperienceSection from '../../components/sections/ExperienceSection';
import EducationSection from '../../components/sections/EducationSection';
import CertificationsSection from '../../components/sections/CertificationsSection';
import ProjectsSection from '../../components/sections/ProjectsSection';
import ArticlesSection from '../../components/sections/ArticlesSection';
import ContactSection from '../../components/sections/ContactSection';
import SEO from '../../components/common/SEO';

const Home = () => {
  return (
    <ContentProtector>
      <SEO />
      <div className="relative min-h-screen bg-bgMain text-gray-100 font-sans selection:bg-goldPrimary selection:text-bgMain flex flex-col justify-between overflow-x-hidden">
        
        {/* Watermark Overlay */}
        <Watermark text="SHINTA NURSOBAH CHAIRANI" opacity={0.04} />

        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="grow flex flex-col w-full">
          <div id="home">
            <HeroSection />
          </div>
          <div id="about">
            <AboutSection />
          </div>
          <div id="skills">
            <SkillsSection />
          </div>
          <div id="experience">
            <ExperienceSection />
          </div>
          <div id="education">
            <EducationSection />
          </div>
          <div id="certifications">
            <CertificationsSection />
          </div>
          <div id="projects">
            <ProjectsSection />
          </div>
          <div id="articles">
            <ArticlesSection />
          </div>
          <div id="contact">
            <ContactSection />
          </div>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </ContentProtector>
  );
};

export default Home;