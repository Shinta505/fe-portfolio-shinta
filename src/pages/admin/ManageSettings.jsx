import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { LuSave, LuPalette, LuSearch } from 'react-icons/lu';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export default function ManageSettings() {
    // Mengonsumsi state global dari ThemeContext untuk warna aksen
    const { accentColor, changeAccentColor } = useTheme();

    // State untuk mengontrol buka/tutup sidebar pada tampilan mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State lokal untuk form manajemen SEO
    const [seoSettings, setSeoSettings] = useState(() => {
        const savedSeo = localStorage.getItem('seoSettings');
        if (savedSeo) {
            try {
                return JSON.parse(savedSeo);
            } catch {
                // Gunakan nilai bawaan jika data tersimpan tidak valid.
            }
        }

        return {
            title: 'Shinta Nursobah Chairani | Full-Stack Developer & UI/UX Designer',
            description: 'Portofolio resmi Shinta Nursobah Chairani, mahasiswa Teknik Informatika UPN "Veteran" Yogyakarta.',
            keywords: 'Shinta Nursobah Chairani, Full-Stack Developer, UI/UX Designer',
            author: 'Shinta Nursobah Chairani'
        };
    });

    const handleSeoChange = (e) => {
        const { name, value } = e.target;
        setSeoSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveSeo = (e) => {
        e.preventDefault();
        localStorage.setItem('seoSettings', JSON.stringify(seoSettings));
        alert('Pengaturan SEO berhasil diperbarui pada Local Storage.');
    };

    const colorPalettes = [
        { label: 'Gold (Default)', hex: '#E5A93B' },
        { label: 'Blue', hex: '#3B82F6' },
        { label: 'Emerald', hex: '#10B981' },
        { label: 'Rose', hex: '#F43F5E' },
        { label: 'Purple', hex: '#8B5CF6' }
    ];

    return (
        <div className="flex min-h-screen bg-bgMain">
            {/* Teruskan state mobile sidebar ke AdminSidebar jika diperlukan */}
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Hubungkan onMenuClick agar tombol hamburger berfungsi */}
                <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto text-gray-200"
                    >
                        <div className="mb-8 border-b border-borderMuted pb-4">
                            <h1 className="text-3xl font-bold text-white mb-2">Pengaturan Sistem</h1>
                            <p className="text-gray-400 text-sm">
                                Kelola preferensi warna aksen antarmuka dan konfigurasi optimasi mesin pencari (SEO).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Bagian 1: Konfigurasi Warna Aksen */}
                            <div className="bg-bgSurface p-6 rounded-xl border border-borderMuted shadow-lg h-fit">
                                <div className="flex items-center gap-3 mb-6">
                                    <LuPalette className="text-xl text-goldPrimary" />
                                    <h2 className="text-xl font-semibold text-white">Preferensi Tema</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium text-white mb-3">Warna Aksen Utama</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {colorPalettes.map((color) => (
                                                <button
                                                    key={color.hex}
                                                    onClick={() => changeAccentColor(color.hex)}
                                                    className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                                                        accentColor === color.hex ? 'border-gray-200 scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                                                    }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.label}
                                                    aria-label={`Ubah warna ke ${color.label}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bagian 2: Konfigurasi SEO */}
                            <div className="bg-bgSurface p-6 rounded-xl border border-borderMuted shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <LuSearch className="text-xl text-goldPrimary" />
                                    <h2 className="text-xl font-semibold text-white">Konfigurasi SEO</h2>
                                </div>

                                <form onSubmit={handleSaveSeo} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="title">
                                            Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={seoSettings.title}
                                            onChange={handleSeoChange}
                                            className="w-full bg-bgMain border border-borderMuted rounded-lg px-4 py-3 text-white focus:outline-none focus:border-goldPrimary transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="description">
                                            Meta Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={seoSettings.description}
                                            onChange={handleSeoChange}
                                            rows="3"
                                            className="w-full bg-bgMain border border-borderMuted rounded-lg px-4 py-3 text-white focus:outline-none focus:border-goldPrimary transition-colors resize-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="keywords">
                                            Meta Keywords (Pisahkan dengan koma)
                                        </label>
                                        <input
                                            type="text"
                                            id="keywords"
                                            name="keywords"
                                            value={seoSettings.keywords}
                                            onChange={handleSeoChange}
                                            className="w-full bg-bgMain border border-borderMuted rounded-lg px-4 py-3 text-white focus:outline-none focus:border-goldPrimary transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="author">
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            id="author"
                                            name="author"
                                            value={seoSettings.author}
                                            onChange={handleSeoChange}
                                            className="w-full bg-bgMain border border-borderMuted rounded-lg px-4 py-3 text-white focus:outline-none focus:border-goldPrimary transition-colors"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-borderMuted">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-goldPrimary hover:bg-goldHover text-bgMain font-semibold px-6 py-3 rounded-lg transition-colors w-full justify-center shadow-md"
                                        >
                                            <LuSave size={18} />
                                            Simpan Konfigurasi SEO
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
