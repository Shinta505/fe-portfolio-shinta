import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuHeart, LuArrowUp } from 'react-icons/lu';
import { FaGithub, FaLinkedin, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { getProfile } from '../../api/backendApi';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [socialLinks, setSocialLinks] = useState({
        github_url: '',
        linkedin_url: '',
        instagram_url: '',
        tiktok_url: '',
        twitter_url: ''
    });

    useEffect(() => {
        let isMounted = true;
        const fetchFooterProfile = async () => {
            try {
                const response = await getProfile();
                const profileData = response.data?.data || response.data;
                if (profileData && isMounted) {
                    setSocialLinks({
                        github_url: profileData.github_url || '',
                        linkedin_url: profileData.linkedin_url || '',
                        instagram_url: profileData.instagram_url || '',
                        tiktok_url: profileData.tiktok_url || '',
                        twitter_url: profileData.twitter_url || ''
                    });
                }
            } catch (error) {
                console.error('Gagal memuat profil untuk footer:', error);
            }
        };

        fetchFooterProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Mapping ikon dan konfigurasi sosial media
    const socials = [
        { key: 'github_url', label: 'GitHub', icon: <FaGithub className="w-5 h-5" />, url: socialLinks.github_url },
        { key: 'linkedin_url', label: 'LinkedIn', icon: <FaLinkedin className="w-5 h-5" />, url: socialLinks.linkedin_url },
        { key: 'instagram_url', label: 'Instagram', icon: <FaInstagram className="w-5 h-5" />, url: socialLinks.instagram_url },
        { key: 'tiktok_url', label: 'TikTok', icon: <FaTiktok className="w-4 h-4" />, url: socialLinks.tiktok_url },
        { key: 'twitter_url', label: 'Twitter', icon: <FaTwitter className="w-5 h-5" />, url: socialLinks.twitter_url },
    ];

    return (
        <footer className="relative bg-bgSurface/50 border-t border-borderMuted pt-16 pb-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-borderMuted/60">

                    {/* Brand & Info */}
                    <div className="md:col-span-6 space-y-4">
                        <a
                            href="#home"
                            className="text-2xl font-bold font-poppins text-gradient tracking-wide inline-block"
                        >
                            Shinta<span className="text-gray-100">.dev</span>
                        </a>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Mahasiswa Teknik Informatika UPN "Veteran" Yogyakarta yang berfokus pada pengembangan web full-stack, frontend, dan UI/UX design. Siap membangun solusi digital yang interaktif dan bermakna.
                        </p>
                        
                        {/* Dynamic Social Media Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {socials.map((item) => {
                                if (!item.url) return null; // Sembunyikan jika link kosong di database
                                return (
                                    <a
                                        key={item.key}
                                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-gray-300 hover:text-goldPrimary hover:border-goldPrimary transition-colors duration-300"
                                        aria-label={item.label}
                                    >
                                        {item.icon}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-gray-100 font-semibold font-poppins text-base">Navigasi Cepat</h3>
                        <ul className="space-y-2.5 text-sm">
                            {['Home', 'About', 'Experience', 'Projects', 'Articles', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-400 hover:text-goldPrimary transition-colors duration-300"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Backend Connection Info */}
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-gray-100 font-semibold font-poppins text-base">Status Sistem</h3>
                        <div className="p-4 rounded-xl bg-bgMain border border-borderMuted space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium text-gray-300">API Terhubung</span>
                            </div>
                            <p className="text-xs text-gray-400 break-all">
                                BE: <a href="https://be-portfolio-shinta.vercel.app/" target="_blank" rel="noreferrer" className="text-goldPrimary hover:underline">be-portfolio-shinta.vercel.app</a>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <p className="flex items-center gap-1.5 font-poppins">
                        © {currentYear} Shinta Nursobah Chairani. Dibuat dengan <LuHeart className="text-goldPrimary inline" /> Menggunakan React & Tailwind CSS.
                    </p>

                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-bgMain border border-borderMuted text-gray-300 hover:text-goldPrimary hover:border-goldPrimary transition-colors duration-300 focus:outline-none"
                        aria-label="Kembali ke atas"
                    >
                        <span>Kembali ke atas</span>
                        <LuArrowUp className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
