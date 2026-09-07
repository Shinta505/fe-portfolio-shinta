import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuWrench, LuPlus, LuPen, LuTrash2,
    LuCircleAlert, LuCheck
} from 'react-icons/lu';
import * as SiIcons from 'react-icons/si';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api/backendApi';

const ManageSkills = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools'];

    const initialFormState = {
        name: '',
        category: skillCategories[0],
        icon: ''
    };

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [status, setStatus] = useState({ type: null, message: '' });

    useEffect(() => {
        let isMounted = true;

        const loadSkills = async () => {
            setLoading(true);
            try {
                const response = await getSkills();
                const data = response.data?.data || response.data;

                if (isMounted) {
                    setSkills(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Gagal mengambil data skills:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadSkills();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await getSkills();
            const data = response.data?.data || response.data;
            setSkills(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Gagal mengambil data skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (skill) => {
        setEditingId(skill.uuid);
        setFormData({
            name: skill.name,
            category: skill.category,
            icon: skill.icon || ''
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

        try {
            if (editingId) {
                await updateSkill(editingId, formData);
                setStatus({ type: 'success', message: 'Data keahlian berhasil diperbarui.' });
            } else {
                await createSkill(formData);
                setStatus({ type: 'success', message: 'Data keahlian berhasil ditambahkan.' });
            }
            fetchSkills();
            setTimeout(() => setIsModalOpen(false), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data keahlian.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteSkill(deleteId);
            fetchSkills();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus keahlian:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderSkillIcon = (iconName) => {
        if (iconName && SiIcons[iconName]) {
            const DynamicIcon = SiIcons[iconName];
            return <DynamicIcon className="w-6 h-6" />;
        }
        return <LuWrench className="w-6 h-6" />;
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
                                    <LuWrench className="text-goldPrimary" /> Manage Skills
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Kelola daftar keahlian dan teknologi yang ditampilkan pada portofolio.
                                </p>
                            </div>
                            <Button variant="primary" iconLeft={LuPlus} onClick={openAddModal}>
                                Tambah Skill Baru
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner text="Memuat daftar keahlian..." />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            >
                                <AnimatePresence>
                                    {skills.map((skill) => (
                                        <motion.div
                                            key={skill.uuid}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Card className="h-full flex flex-col p-5 bg-bgSurface/40 border-borderMuted">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
                                                        {renderSkillIcon(skill.icon)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-base font-bold font-poppins text-gray-100 truncate">{skill.name}</h4>
                                                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">{skill.category}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex gap-2 pt-3 border-t border-borderMuted/60">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex-1"
                                                        iconLeft={LuPen}
                                                        onClick={() => openEditModal(skill)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                                                        onClick={() => openDeleteConfirm(skill.uuid)}
                                                    >
                                                        <LuTrash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                    </div>
                </main>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={editingId ? "Edit Keahlian" : "Tambah Keahlian Baru"}
                maxWidth="md"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {status.message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                            {status.type === 'error' ? <LuCircleAlert className="w-4 h-4" /> : <LuCheck className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Nama Keahlian / Teknologi</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Contoh: React.js"
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Kategori</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                        >
                            {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Icon (Simple Icons / SI)</label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleInputChange}
                            placeholder="Contoh: SiReact, SiNodedotjs, SiTailwindcss"
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                            Salin nama icon dari <a href="https://react-icons.github.io/react-icons/icons/si" target="_blank" rel="noopener noreferrer" className="text-goldPrimary underline">Simple Icons</a> (awalan Si, misal: <code className="bg-bgMain px-1 py-0.5 rounded text-gray-300">SiReact</code>).
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>{editingId ? "Perbarui" : "Simpan"}</Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Konfirmasi Hapus"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-300">Apakah Anda yakin ingin menghapus data keahlian ini? Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button variant="primary" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} isLoading={isSubmitting}>Hapus</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageSkills;