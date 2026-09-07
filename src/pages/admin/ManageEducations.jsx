import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuGraduationCap, LuPlus, LuPen, LuTrash2,
    LuCircleAlert, LuCheck, LuCalendar, LuAward, LuBookOpen
} from 'react-icons/lu';
import { FaUniversity } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getEducations, createEducation, updateEducation, deleteEducation } from '../../api/backendApi';

// Konstanta Statis untuk Dropdown Tanggal
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Sekarang'
];

const currentYear = new Date().getFullYear();
const YEARS = ['Sekarang', ...Array.from({ length: 30 }, (_, i) => (currentYear + 5 - i).toString())];

const initialFormState = {
    institution_logo: '',
    institution_name: '',
    degree: '',
    field_of_study: '',
    startMonth: 'Januari',
    startYear: currentYear.toString(),
    endMonth: 'Sekarang',
    endYear: 'Sekarang',
    score: '',
    activities: '',
    description: '',
    media: ''
};

const ManageEducations = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [status, setStatus] = useState({ type: null, message: '' });

    const fetchEducations = async () => {
        setLoading(true);
        try {
            const response = await getEducations();
            const data = response.data?.data || response.data;
            setEducations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Anomali saat mengambil data riwayat pendidikan:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchEducations, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Helper untuk memecah string tanggal (Misal: "Agustus 2022" -> { month: "Agustus", year: "2022" })
    const parseDateStr = (dateStr, isEnd = false) => {
        if (!dateStr || dateStr.toLowerCase() === 'sekarang') {
            return isEnd ? { month: 'Sekarang', year: 'Sekarang' } : { month: 'Januari', year: currentYear.toString() };
        }
        const parts = dateStr.split(' ');
        return {
            month: parts[0] || 'Januari',
            year: parts[1] || currentYear.toString()
        };
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (education) => {
        setEditingId(education.uuid);

        const startObj = parseDateStr(education.start_date, false);
        const endObj = parseDateStr(education.end_date, true);

        setFormData({
            institution_logo: education.institution_logo || '',
            institution_name: education.institution_name || '',
            degree: education.degree || '',
            field_of_study: education.field_of_study || '',
            startMonth: startObj.month,
            startYear: startObj.year,
            endMonth: endObj.month,
            endYear: endObj.year,
            score: education.score || '',
            activities: education.activities || '',
            description: education.description || '',
            media: education.media || ''
        });
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (uuid) => {
        setDeleteId(uuid);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        // Restrukturisasi payload untuk menggabungkan bulan dan tahun menjadi format string yang valid
        const payload = {
            institution_logo: formData.institution_logo,
            institution_name: formData.institution_name,
            degree: formData.degree,
            field_of_study: formData.field_of_study,
            score: formData.score,
            activities: formData.activities,
            description: formData.description,
            media: formData.media,
            start_date: `${formData.startMonth} ${formData.startYear}`,
            end_date: (formData.endMonth === 'Sekarang' || formData.endYear === 'Sekarang')
                ? 'Sekarang'
                : `${formData.endMonth} ${formData.endYear}`
        };

        try {
            if (editingId) {
                await updateEducation(editingId, payload);
                setStatus({ type: 'success', message: 'Riwayat pendidikan berhasil diperbarui.' });
            } else {
                await createEducation(payload);
                setStatus({ type: 'success', message: 'Riwayat pendidikan baru berhasil ditambahkan.' });
            }
            fetchEducations();
            setTimeout(() => setIsModalOpen(false), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi galat komputasi saat menyimpan data.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteEducation(deleteId);
            fetchEducations();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus riwayat pendidikan:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-bgMain text-gray-100 flex overflow-hidden font-sans">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-100 flex items-center gap-3">
                                    <LuGraduationCap className="text-goldPrimary" /> Kelola Pendidikan
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Atur riwayat pendidikan formal, gelar akademis, dan histori aktivitas Anda untuk CMS Portofolio.
                                </p>
                            </div>
                            <Button variant="primary" iconLeft={LuPlus} onClick={openAddModal}>
                                Tambah Riwayat
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner text="Sinkronisasi data pendidikan..." />
                        ) : (
                            <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <AnimatePresence>
                                    {educations.length === 0 ? (
                                        <div className="col-span-full p-8 text-center bg-bgSurface/40 border border-borderMuted rounded-2xl">
                                            <p className="text-gray-400">Belum ada riwayat pendidikan yang tercatat dalam basis data.</p>
                                        </div>
                                    ) : (
                                        educations.map((edu) => (
                                            <motion.div
                                                key={edu.uuid}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Card className="p-6 bg-bgSurface/40 hover:bg-bgSurface/60 border-borderMuted flex flex-col justify-between h-full gap-4 transition-colors">

                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center shrink-0 overflow-hidden">
                                                                {edu.institution_logo ? (
                                                                    <img src={edu.institution_logo} alt="Logo" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <FaUniversity className="w-5 h-5 text-goldPrimary" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-bold font-poppins text-gray-100">{edu.institution_name}</h4>
                                                                <p className="text-sm font-medium text-goldPrimary">{edu.degree} — {edu.field_of_study}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => openEditModal(edu)}
                                                                className="p-2 text-gray-400 hover:text-goldPrimary bg-bgMain rounded-lg border border-borderMuted transition-colors"
                                                                aria-label="Edit"
                                                            >
                                                                <LuPen className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteConfirm(edu.uuid)}
                                                                className="p-2 text-gray-400 hover:text-red-400 bg-bgMain rounded-lg border border-borderMuted transition-colors"
                                                                aria-label="Delete"
                                                            >
                                                                <LuTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                                        <div className="flex items-center gap-1.5">
                                                            <LuCalendar className="w-4 h-4 text-borderMuted" />
                                                            <span>{edu.start_date} — {edu.end_date || 'Sekarang'}</span>
                                                        </div>
                                                        {edu.score && (
                                                            <div className="flex items-center gap-1.5">
                                                                <LuAward className="w-4 h-4 text-borderMuted" />
                                                                <span>Nilai/IPK: {edu.score}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                                                        {edu.description}
                                                    </p>

                                                    {edu.activities && (
                                                        <div className="p-3 bg-bgMain border border-borderMuted rounded-xl flex items-start gap-2.5">
                                                            <LuBookOpen className="w-4 h-4 text-goldPrimary shrink-0 mt-0.5" />
                                                            <p className="text-xs text-gray-400 line-clamp-2">{edu.activities}</p>
                                                        </div>
                                                    )}
                                                </Card>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={editingId ? "Perbarui Data Pendidikan" : "Tambah Riwayat Akademik"}
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${status.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                }`}
                        >
                            {status.type === 'error' ? <LuCircleAlert className="w-5 h-5 shrink-0" /> : <LuCheck className="w-5 h-5 shrink-0" />}
                            <span>{status.message}</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Nama Institusi
                            </label>
                            <input
                                type="text"
                                name="institution_name"
                                value={formData.institution_name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none"
                                placeholder="Misal: UPN Veteran Yogyakarta"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Gelar Akademik
                            </label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none"
                                placeholder="Misal: Sarjana Komputer (S.Kom)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Bidang Studi / Jurusan
                            </label>
                            <input
                                type="text"
                                name="field_of_study"
                                value={formData.field_of_study}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none"
                                placeholder="Misal: Teknik Informatika"
                            />
                        </div>

                        {/* Dropdown Tanggal Mulai */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Tanggal Mulai
                            </label>
                            <div className="flex gap-2">
                                <select
                                    name="startMonth"
                                    value={formData.startMonth}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:border-goldPrimary focus:outline-none appearance-none cursor-pointer"
                                >
                                    {MONTHS.filter(m => m !== 'Sekarang').map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    name="startYear"
                                    value={formData.startYear}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:border-goldPrimary focus:outline-none appearance-none cursor-pointer"
                                >
                                    {YEARS.filter(y => y !== 'Sekarang').map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dropdown Tanggal Berakhir */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Tanggal Berakhir (Opsional)
                            </label>
                            <div className="flex gap-2">
                                <select
                                    name="endMonth"
                                    value={formData.endMonth}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:border-goldPrimary focus:outline-none appearance-none cursor-pointer"
                                >
                                    {MONTHS.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    name="endYear"
                                    value={formData.endYear}
                                    onChange={handleInputChange}
                                    disabled={formData.endMonth === 'Sekarang'}
                                    className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:border-goldPrimary focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {YEARS.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Nilai / IPK
                            </label>
                            <input
                                type="text"
                                name="score"
                                value={formData.score}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none"
                                placeholder="Misal: 3.85 / 4.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Logo Institusi (URL Opsional)
                            </label>
                            <input
                                type="text"
                                name="institution_logo"
                                value={formData.institution_logo}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Aktivitas & Organisasi
                            </label>
                            <textarea
                                name="activities"
                                value={formData.activities}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none resize-none"
                                placeholder="Tuliskan pengalaman organisasi Anda..."
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:border-goldPrimary focus:outline-none resize-none"
                                placeholder="Fokus studi atau pencapaian akademis..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-borderMuted">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {editingId ? 'Simpan Perubahan' : 'Tambahkan Riwayat'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Konfirmasi Penghapusan"
                maxWidth="sm"
            >
                <div className="space-y-6">
                    <p className="text-gray-300 text-sm">
                        Tindakan ini akan menghapus riwayat pendidikan secara permanen dari basis data. Anda yakin ingin melanjutkan?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>
                            Batalkan
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDelete}
                            isLoading={isSubmitting}
                            className="bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                        >
                            Ya, Hapus Data
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageEducations;