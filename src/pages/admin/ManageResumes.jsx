import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuFileCode, LuPlus, LuPen, LuTrash2,
    LuCircleCheck, LuCircleX, LuCircleAlert,
    LuStar, LuLink, LuCheck
} from 'react-icons/lu';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Impor API tanpa fungsi uploadFile yang tidak terdefinisi
import {
    getAllResumes,
    createResume,
    updateResume,
    deleteResume,
    setActiveResume
} from '../../api/backendApi';

const ManageResumes = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialFormState = {
        version_name: '',
        cv_url: '',
        is_active: false
    };

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [status, setStatus] = useState({ type: null, message: '' });

    useEffect(() => {
        let isMounted = true;
        const fetchResumes = async () => {
            setLoading(true);
            try {
                const response = await getAllResumes();
                const data = response.data?.data || response.data;
                if (isMounted) {
                    setResumes(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Galat saat mengambil data resume:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchResumes();
        return () => { isMounted = false; };
    }, []);

    const refreshResumes = async () => {
        setLoading(true);
        try {
            const response = await getAllResumes();
            const data = response.data?.data || response.data;
            setResumes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Galat saat memuat ulang data resume:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (resume) => {
        setEditingId(resume.uuid);
        setFormData({
            version_name: resume.version_name,
            cv_url: resume.cv_url,
            is_active: resume.is_active
        });
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            if (editingId) {
                await updateResume(editingId, formData);
                setStatus({ type: 'success', message: 'Data resume berhasil diperbarui.' });
            } else {
                await createResume(formData);
                setStatus({ type: 'success', message: 'Entri resume baru berhasil ditambahkan.' });
            }
            refreshResumes();
            setTimeout(() => setIsModalOpen(false), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi galat sistem saat proses penyimpanan data.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetMain = async (uuid) => {
        try {
            await setActiveResume(uuid);
            refreshResumes();
        } catch (error) {
            console.error('Galat saat mengaktifkan status resume utama:', error);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteResume(deleteId);
            refreshResumes();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Galat saat mengeksekusi penghapusan resume:', error);
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
                                    <LuFileCode className="text-goldPrimary" /> Kelola Data Resume
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Modul manajemen versi dokumen Curriculum Vitae serta konfigurasi resume aktif untuk antarmuka publik.
                                </p>
                            </div>
                            <Button variant="primary" iconLeft={LuPlus} onClick={openAddModal}>
                                Tambah Versi Baru
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner size="lg" text="Memuat himpunan data resume..." />
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {resumes.map((resume) => (
                                        <motion.div
                                            key={resume.uuid}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className={`p-6 bg-bgSurface/40 border transition-all duration-300 flex flex-col h-full ${resume.is_active ? 'border-goldPrimary shadow-lg shadow-goldPrimary/10' : 'border-borderMuted hover:border-goldPrimary'}`}>

                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 rounded-xl ${resume.is_active ? 'bg-goldPrimary text-bgMain' : 'bg-bgMain text-gray-400 border border-borderMuted'}`}>
                                                        <LuFileCode className="w-6 h-6" />
                                                    </div>
                                                    {resume.is_active && (
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-goldPrimary/10 text-goldPrimary text-xs font-semibold rounded-full border border-goldPrimary/20 uppercase tracking-wider">
                                                            <LuStar className="w-3.5 h-3.5" /> Aktif
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-3">
                                                    <h3 className="text-xl font-bold font-poppins text-gray-100 leading-snug">
                                                        {resume.version_name}
                                                    </h3>
                                                    <a
                                                        href={resume.cv_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-goldPrimary transition-colors truncate w-full"
                                                    >
                                                        <LuLink className="w-4 h-4 shrink-0" />
                                                        <span className="truncate">{resume.cv_url}</span>
                                                    </a>
                                                </div>

                                                <div className="flex items-center gap-2 pt-6 mt-4 border-t border-borderMuted/60">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex-1 text-xs"
                                                        iconLeft={LuPen}
                                                        onClick={() => openEditModal(resume)}
                                                    >
                                                        Ubah Data
                                                    </Button>
                                                    {!resume.is_active && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs"
                                                            iconLeft={LuCircleCheck}
                                                            onClick={() => handleSetMain(resume.uuid)}
                                                        >
                                                            Tetapkan Utama
                                                        </Button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(resume.uuid);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                                    >
                                                        <LuTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {resumes.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-gray-500 bg-bgSurface/40 rounded-2xl border border-dashed border-borderMuted">
                                        <LuFileCode className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                                        <p>Belum terdapat entri data resume pada basis data sistem.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </div>
                </main>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={editingId ? 'Pembaruan Entri Resume' : 'Penambahan Entri Resume'}
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">

                    {status.message && (
                        <div className={`p-3 rounded-xl border flex items-center gap-3 text-sm ${status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            }`}>
                            {status.type === 'error' ? <LuCircleAlert className="w-5 h-5 shrink-0" /> : <LuCircleCheck className="w-5 h-5 shrink-0" />}
                            <span>{status.message}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                            Penamaan Versi Dokumen <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="version_name"
                            value={formData.version_name}
                            onChange={handleInputChange}
                            required
                            placeholder="Contoh: Resume Utama - Frontend Developer"
                            className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                            Tautan Eksternal CV (URL) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="url"
                            name="cv_url"
                            value={formData.cv_url}
                            onChange={handleInputChange}
                            required
                            placeholder="https://drive.google.com/file/d/.../view"
                            className="w-full px-4 py-3 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-bgMain border border-borderMuted rounded-xl hover:border-goldPrimary/50 transition-colors">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="peer appearance-none w-5 h-5 border border-borderMuted rounded bg-bgSurface checked:bg-goldPrimary checked:border-goldPrimary cursor-pointer transition-colors"
                            />
                            <LuCheck className="absolute w-3.5 h-3.5 text-bgMain opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-200 font-poppins">Terapkan sebagai Entri Aktif</p>
                            <p className="text-xs text-gray-500">Versi dokumen ini akan diindeks sebagai resume utama pada antarmuka publik.</p>
                        </div>
                    </label>

                    <div className="pt-6 border-t border-borderMuted flex gap-4">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Batalkan
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                            Simpan Data
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Penghapusan Entri Resume"
                maxWidth="sm"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <LuCircleX className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-100 font-poppins">Konfirmasi Eksekusi Hapus</h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Anda hendak menghapus entri resume ini dari basis data. Instruksi ini bersifat destruktif dan tidak memiliki mekanisme pemulihan (rollback).
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>
                            Batalkan
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 bg-red-500! hover:bg-red-600! text-white! shadow-red-500/20!"
                            onClick={handleDelete}
                            isLoading={isSubmitting}
                        >
                            Eksekusi Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageResumes;