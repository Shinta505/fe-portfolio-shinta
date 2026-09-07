import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LuFolderGit2,
    LuFileText,
    LuMail,
    LuGraduationCap,
    LuBriefcaseBusiness,
    LuAward,
    LuWrench,
    LuTrendingUp,
    LuActivity
} from 'react-icons/lu';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import {
    getProjects,
    getArticles,
    getContactMessages,
    getEducations,
    getExperiences,
    getCertifications,
    getSkills
} from '../../api/backendApi';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mengontrol sidebar  
    const [stats, setStats] = useState({
        projectsCount: 0,
        articlesCount: 0,
        messagesCount: 0,
        educationsCount: 0,
        experiencesCount: 0,
        certificationsCount: 0,
        skillsCount: 0,
    });

    const [recentMessages, setRecentMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    projectsRes,
                    articlesRes,
                    messagesRes,
                    educationsRes,
                    experiencesRes,
                    certificationsRes,
                    skillsRes,
                ] = await Promise.allSettled([
                    getProjects(),
                    getArticles(),
                    getContactMessages(),
                    getEducations(),
                    getExperiences(),
                    getCertifications(),
                    getSkills(),
                ]);

                const getCount = (res) => {
                    if (res.status === 'fulfilled') {
                        const data = res.value.data?.data || res.value.data;
                        return Array.isArray(data) ? data.length : 0;
                    }
                    return 0;
                };

                setStats({
                    projectsCount: getCount(projectsRes),
                    articlesCount: getCount(articlesRes),
                    messagesCount: getCount(messagesRes),
                    educationsCount: getCount(educationsRes),
                    experiencesCount: getCount(experiencesRes),
                    certificationsCount: getCount(certificationsRes),
                    skillsCount: getCount(skillsRes),
                });

                if (messagesRes.status === 'fulfilled') {
                    const msgData = messagesRes.value.data?.data || messagesRes.value.data;
                    if (Array.isArray(msgData)) {
                        setRecentMessages(msgData.slice(0, 5));
                    }
                }
            } catch (error) {
                console.error('Gagal memuat data statistik dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Projek', count: stats.projectsCount, icon: LuFolderGit2, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { title: 'Total Artikel', count: stats.articlesCount, icon: LuFileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { title: 'Pesan Masuk', count: stats.messagesCount, icon: LuMail, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { title: 'Riwayat Pendidikan', count: stats.educationsCount, icon: LuGraduationCap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { title: 'Pengalaman Kerja', count: stats.experiencesCount, icon: LuBriefcaseBusiness, color: 'text-goldPrimary', bg: 'bg-goldPrimary/10' },
        { title: 'Sertifikasi', count: stats.certificationsCount, icon: LuAward, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { title: 'Keahlian (Skills)', count: stats.skillsCount, icon: LuWrench, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ];

    if (loading) {
        return <LoadingSpinner fullScreen text="Memuat statistik ringkas CMS..." />;
    }

    return (
        <div className="w-screen h-screen bg-bgMain text-gray-100 flex overflow-hidden">
            {/* Sidebar Admin */}
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Area Konten Utama */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Konten Dashboard */}
                <main className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="space-y-8 pb-12">

                        {/* Banner / Selamat Datang */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="p-6 sm:p-8 bg-bgSurface/60 border-borderMuted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-100">
                                        Dashboard <span className="text-gradient">CMS</span>
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Ringkasan statistik dan data portofolio yang terhubung langsung dengan database Supabase backend.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bgMain border border-borderMuted text-xs font-medium text-goldPrimary">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Sistem Aktif</span>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Grid Statistik Kartu */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statCards.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="p-6 bg-bgSurface/40 border-borderMuted hover:border-goldPrimary transition-colors duration-300 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider font-poppins">
                                                    {item.title}
                                                </p>
                                                <h3 className="text-3xl font-bold font-poppins text-gray-100">
                                                    {item.count}
                                                </h3>
                                            </div>
                                            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}>
                                                <IconComponent className="w-7 h-7" />
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Bagian Bawah: Pesan Masuk Terbaru & Aktivitas Sistem */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Pesan Masuk Terbaru */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="lg:col-span-7 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold font-poppins text-gray-100 flex items-center gap-2">
                                        <LuMail className="text-goldPrimary w-5 h-5" />
                                        <span>Pesan Masuk Terbaru</span>
                                    </h3>
                                </div>

                                <Card className="p-6 bg-bgSurface/40 border-borderMuted">
                                    {recentMessages.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-6">Belum ada pesan masuk yang tercatat.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentMessages.map((msg) => (
                                                <div key={msg.uuid} className="p-4 rounded-xl bg-bgMain border border-borderMuted space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-semibold text-gray-200 font-poppins">{msg.name}</h4>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-goldPrimary">{msg.email}</p>
                                                    <p className="text-sm text-gray-300 line-clamp-2">{msg.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </motion.div>

                            {/* Status Sistem & Informasi Backend */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="lg:col-span-5 space-y-4"
                            >
                                <h3 className="text-lg font-bold font-poppins text-gray-100 flex items-center gap-2">
                                    <LuActivity className="text-goldPrimary w-5 h-5" />
                                    <span>Status Sistem & Backend</span>
                                </h3>

                                <Card className="p-6 bg-bgSurface/40 border-borderMuted space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Database Engine</span>
                                            <span className="font-semibold text-gray-200">Supabase PostgreSQL</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">ORM Framework</span>
                                            <span className="font-semibold text-gray-200">Sequelize</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Autentikasi</span>
                                            <span className="font-semibold text-gray-200">JWT (JSON Web Token)</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Deployment API</span>
                                            <a
                                                href="https://be-portfolio-shinta.vercel.app/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-semibold text-goldPrimary hover:underline truncate max-w-50"
                                            >
                                                be-portfolio-shinta.vercel.app
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-bgMain border border-borderMuted space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                                            <LuTrendingUp className="text-goldPrimary w-4 h-4" />
                                            <span>Keterangan Environment Admin</span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Kredensial username dan password administrator dikelola secara aman melalui environment variables di backend Vercel.
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;