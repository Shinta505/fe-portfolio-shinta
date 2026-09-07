import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuUser, LuSave, LuCheck, LuCircleAlert, LuUpload, LuX } from 'react-icons/lu';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getProfile, updateProfile } from '../../api/backendApi';

const ManageProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        headline: '',
        bio: '',
        profile_image: '',
        location: '',
        email: '',
        github_url: '',
        linkedin_url: '',
        instagram_url: '',
        tiktok_url: '',
        twitter_url: ''
    });

    // State untuk API Wilayah (Disamakan dengan ManageExperiences)
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [selectedProv, setSelectedProv] = useState({ id: '', name: '' });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getProfile();
                const profileData = response.data?.data || response.data;
                if (profileData && isMounted) {
                    setFormData({
                        fullname: profileData.fullname || '',
                        headline: profileData.headline || '',
                        bio: profileData.bio || '',
                        profile_image: profileData.profile_image || '',
                        location: profileData.location || '',
                        email: profileData.email || '',
                        github_url: profileData.github_url || '',
                        linkedin_url: profileData.linkedin_url || '',
                        instagram_url: profileData.instagram_url || '',
                        tiktok_url: profileData.tiktok_url || '',
                        twitter_url: profileData.twitter_url || ''
                    });
                    setImagePreview(profileData.profile_image || null);
                }
            } catch (error) {
                console.error('Gagal memuat profil:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Fetch Provinsi menggunakan emsifa.com (Sesuai ManageExperiences)
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(res => res.json())
            .then(data => {
                if (isMounted) setProvinces(data);
            })
            .catch(err => console.error('Gagal memuat provinsi', err));

        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch Kabupaten/Kota saat Provinsi berubah
    useEffect(() => {
        if (selectedProv.id) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`)
                .then(res => res.json())
                .then(data => setRegencies(data))
                .catch(err => console.error('Gagal memuat kota/kabupaten', err));
        }
    }, [selectedProv.id]);

    const handleProvChange = (e) => {
        const provId = e.target.value;
        const provName = e.target.options[e.target.selectedIndex].text;
        setSelectedProv({ id: provId, name: provName });
        setRegencies([]);
    };

    const handleRegChange = (e) => {
        const regName = e.target.options[e.target.selectedIndex].text;

        // Format lokasi: "Kota/Kabupaten, Provinsi"
        const cleanedRegName = regName.replace(/^(KABUPATEN|KOTA)\s+/i, '');
        const formattedLocation = `${cleanedRegName}, ${selectedProv.name}`;

        setFormData((prev) => ({
            ...prev,
            location: formattedLocation
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setIsError(true);
                setStatusMessage('File harus berupa gambar (JPG, PNG, WebP, dll).');
                return;
            }
            setFormData((prev) => ({ ...prev, profile_image: file }));
            setImagePreview(URL.createObjectURL(file));
            setStatusMessage(null);
            setIsError(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith('image/')) {
                setIsError(true);
                setStatusMessage('File harus berupa gambar (JPG, PNG, WebP, dll).');
                return;
            }
            setFormData((prev) => ({ ...prev, profile_image: file }));
            setImagePreview(URL.createObjectURL(file));
            setStatusMessage(null);
            setIsError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);
        setIsError(false);

        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'profile_image' && typeof formData[key] === 'string') {
                return;
            }
            if (formData[key] !== null && formData[key] !== '') {
                submitData.append(key, formData[key]);
            }
        });

        try {
            const response = await updateProfile(submitData);
            const updatedData = response.data?.data || response.data;

            if (updatedData?.profile_image) {
                const freshImageUrl = `${updatedData.profile_image}?t=${new Date().getTime()}`;
                setFormData((prev) => ({ ...prev, profile_image: updatedData.profile_image }));
                setImagePreview(freshImageUrl);
            }

            setStatusMessage(response.data?.message || 'Profil berhasil diperbarui.');
        } catch (error) {
            setIsError(true);
            setStatusMessage(
                error.response?.data?.message || 'Gagal memperbarui profil. Silakan coba lagi.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Memuat data profil..." />;
    }

    return (
        <div className="w-screen h-screen bg-bgMain text-gray-100 flex overflow-hidden">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="max-w-4xl mx-auto space-y-8 pb-12">

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="p-6 sm:p-8 bg-bgSurface/60 border-borderMuted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-100">
                                        Manage <span className="text-gradient">Profile</span>
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Perbarui informasi biodata, headline, serta tautan sosial media portofolio Anda.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bgMain border border-borderMuted text-xs font-medium text-goldPrimary">
                                    <LuUser className="w-4 h-4" />
                                    <span>CRUD Form</span>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <Card className="p-6 sm:p-8 bg-bgSurface/40 border-borderMuted">
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {statusMessage && (
                                        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${isError
                                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            }`}>
                                            {isError ? <LuCircleAlert className="w-5 h-5 shrink-0" /> : <LuCheck className="w-5 h-5 shrink-0" />}
                                            <span>{statusMessage}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                Nama Lengkap (Fullname)
                                            </label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                Headline / Gelar Profesional
                                            </label>
                                            <input
                                                type="text"
                                                name="headline"
                                                value={formData.headline}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Bagian Pemilihan Wilayah (Provinsi & Kabupaten/Kota) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-bgMain/40 border border-borderMuted">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                Pilih Provinsi
                                            </label>
                                            <select
                                                value={selectedProv.id}
                                                onChange={handleProvChange}
                                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                                            >
                                                <option value="">-- Pilih Provinsi --</option>
                                                {provinces.map((prov) => (
                                                    <option key={prov.id} value={prov.id} className="bg-bgMain">
                                                        {prov.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                Pilih Kabupaten / Kota
                                            </label>
                                            <select
                                                onChange={handleRegChange}
                                                disabled={!selectedProv.id}
                                                defaultValue=""
                                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors disabled:opacity-50"
                                            >
                                                <option value="" disabled>-- Pilih Kab / Kota --</option>
                                                {regencies.map((reg) => (
                                                    <option key={reg.id} value={reg.id} className="bg-bgMain">
                                                        {reg.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                Lokasi Domisili (Hasil Terpilih / Manual)
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="Contoh: Sleman, Yogyakarta"
                                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                Alamat Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                            Biografi Singkat (Bio)
                                        </label>
                                        <textarea
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Drag & Drop Area */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                            Foto Profil (Upload / Drag & Drop)
                                        </label>

                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center ${dragActive
                                                    ? 'border-goldPrimary bg-goldPrimary/5'
                                                    : 'border-borderMuted bg-bgMain/50 hover:border-gray-500'
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />

                                            {imagePreview ? (
                                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full z-20">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-bgMain border border-borderMuted shrink-0">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <p className="text-xs font-medium text-gray-200 truncate">
                                                            {typeof formData.profile_image === 'object' ? formData.profile_image.name : formData.profile_image}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                                            Seret gambar lain ke sini atau klik untuk mengganti
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFormData((prev) => ({ ...prev, profile_image: '' }));
                                                            setImagePreview(null);
                                                        }}
                                                        className="p-2 rounded-lg bg-bgMain border border-borderMuted text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                                                        title="Hapus gambar"
                                                    >
                                                        <LuX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 py-2">
                                                    <div className="w-12 h-12 rounded-xl bg-bgSurface border border-borderMuted flex items-center justify-center text-goldPrimary">
                                                        <LuUpload className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-200">
                                                            Seret & letakkan foto di sini, atau <span className="text-goldPrimary">telusuri</span>
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            PNG, JPG, WEBP hingga 5MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-borderMuted/60 space-y-4">
                                        <h3 className="text-sm font-bold font-poppins text-gray-200">Tautan Sosial Media</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                    GitHub URL
                                                </label>
                                                <input
                                                    type="text"
                                                    name="github_url"
                                                    value={formData.github_url}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                    LinkedIn URL
                                                </label>
                                                <input
                                                    type="text"
                                                    name="linkedin_url"
                                                    value={formData.linkedin_url}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                    Instagram URL
                                                </label>
                                                <input
                                                    type="text"
                                                    name="instagram_url"
                                                    value={formData.instagram_url}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                                                    TikTok URL
                                                </label>
                                                <input
                                                    type="text"
                                                    name="tiktok_url"
                                                    value={formData.tiktok_url}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            isLoading={isSubmitting}
                                            iconLeft={LuSave}
                                            className="w-full"
                                        >
                                            Simpan Perubahan Profil
                                        </Button>
                                    </div>

                                </form>
                            </Card>
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageProfile;