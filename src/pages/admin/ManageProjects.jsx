import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuFolderGit2, LuPlus, LuPen, LuTrash2,
    LuImagePlus, LuCircleAlert, LuCheck, LuExternalLink
} from 'react-icons/lu';
import { FaGithub, FaFigma } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getProjects, createProject, updateProject, deleteProject, getSkills } from '../../api/backendApi';

const ManageProjects = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const projectCategories = ['Website Development', 'Machine Learning', 'UI/UX Design', 'Lainnya'];

    const initialFormState = {
        title: '',
        category: projectCategories[0],
        description: '',
        tools: '',
        github_url: '',
        figma_url: '',
        website_url: '',
        image: null
    };

    const [projects, setProjects] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]); // State untuk daftar skill dari getSkills
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [status, setStatus] = useState({ type: null, message: '' });

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [projRes, skillsRes] = await Promise.all([
                    getProjects(),
                    getSkills()
                ]);

                const projData = projRes.data?.data || projRes.data;
                const skillsData = skillsRes.data?.data || skillsRes.data;

                if (isMounted) {
                    setProjects(Array.isArray(projData) ? projData : []);
                    setAvailableSkills(Array.isArray(skillsData) ? skillsData : []);
                }
            } catch (error) {
                console.error('Gagal mengambil data inisial:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            const data = response.data?.data || response.data;
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Gagal mengambil data projek:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Fungsi untuk memilih/menghapus skill dari daftar chips
    const handleSkillToggle = (skillName) => {
        const currentTools = formData.tools
            ? formData.tools.split(',').map((s) => s.trim()).filter(Boolean)
            : [];

        let updatedTools;
        if (currentTools.includes(skillName)) {
            updatedTools = currentTools.filter((s) => s !== skillName);
        } else {
            updatedTools = [...currentTools, skillName];
        }

        setFormData((prev) => ({ ...prev, tools: updatedTools.join(', ') }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setImagePreview(null);
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingId(project.uuid);
        setFormData({
            title: project.title,
            category: project.category,
            description: project.description,
            tools: project.tools || '',
            github_url: project.github_url || '',
            figma_url: project.figma_url || '',
            website_url: project.website_url || '',
            image: null
        });
        setImagePreview(project.image || null);
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                submitData.append(key, formData[key]);
            }
        });

        try {
            if (editingId) {
                await updateProject(editingId, submitData);
                setStatus({ type: 'success', message: 'Projek berhasil diperbarui.' });
            } else {
                await createProject(submitData);
                setStatus({ type: 'success', message: 'Projek berhasil ditambahkan.' });
            }
            fetchProjects();
            setTimeout(() => setIsModalOpen(false), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteProject(deleteId);
            fetchProjects();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus projek:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Ubah tools string yang sedang aktif menjadi array untuk pengecekan tombol aktif
    const activeToolsArray = formData.tools
        ? formData.tools.split(',').map((s) => s.trim())
        : [];

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
                                    <LuFolderGit2 className="text-goldPrimary" /> Manage Projects
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Kelola daftar portofolio, atur detail proyek, media, dan tautan repositori.
                                </p>
                            </div>
                            <Button variant="primary" iconLeft={LuPlus} onClick={openAddModal}>
                                Tambah Projek Baru
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner text="Memuat daftar projek..." />
                        ) : projects.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-bgSurface/40 border border-borderMuted rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
                                    <LuFolderGit2 size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold font-poppins text-gray-100">Belum Ada Projek Tersedia</h3>
                                    <p className="text-sm text-gray-400 max-w-md">
                                        Saat ini belum ada data projek di dalam database. Silakan tambahkan projek baru menggunakan tombol di atas.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {projects.map((project) => (
                                        <motion.div
                                            key={project.uuid}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Card className="h-full flex flex-col bg-bgSurface/40 border-borderMuted">
                                                <div className="h-48 w-full bg-bgMain border-b border-borderMuted relative flex items-center justify-center overflow-hidden">
                                                    {project.image ? (
                                                        <img
                                                            src={project.image}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <LuImagePlus className="w-12 h-12 text-borderMuted" />
                                                    )}
                                                    <span className="absolute top-3 right-3 bg-bgMain/90 backdrop-blur border border-borderMuted px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-goldPrimary uppercase">
                                                        {project.category}
                                                    </span>
                                                </div>

                                                <div className="p-5 flex flex-col grow">
                                                    <h4 className="text-lg font-bold font-poppins text-gray-100 line-clamp-1">{project.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{project.description}</p>

                                                    <div className="flex gap-2 mt-4 pt-4 border-t border-borderMuted/60 mb-2">
                                                        {project.github_url && <FaGithub className="text-gray-400" />}
                                                        {project.figma_url && <FaFigma className="text-gray-400" />}
                                                        {project.website_url && <LuExternalLink className="text-gray-400" />}
                                                    </div>

                                                    <div className="mt-auto flex gap-2 pt-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="flex-1"
                                                            iconLeft={LuPen}
                                                            onClick={() => openEditModal(project)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                                                            onClick={() => openDeleteConfirm(project.uuid)}
                                                        >
                                                            <LuTrash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
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

            {/* Modal Form Tambah/Edit Projek */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={editingId ? "Edit Projek" : "Tambah Projek Baru"}
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                    {status.message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                            {status.type === 'error' ? <LuCircleAlert className="w-4 h-4" /> : <LuCheck className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase">Judul Projek</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
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
                                {projectCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Teknologi / Tools (Pilih dari Daftar Skills atau Ketik Manual)</label>

                        {/* Daftar Pilihan Skills dari getSkills */}
                        <div className="flex flex-wrap gap-2 p-3 bg-bgMain border border-borderMuted rounded-xl max-h-36 overflow-y-auto custom-scrollbar mb-2">
                            {availableSkills.map((skill) => {
                                const isSelected = activeToolsArray.includes(skill.name);
                                return (
                                    <button
                                        key={skill.uuid || skill.id}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill.name)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${isSelected
                                            ? 'bg-goldPrimary/20 border-goldPrimary/50 text-goldPrimary font-medium'
                                            : 'bg-bgSurface border-borderMuted text-gray-400 hover:text-gray-200'
                                            }`}
                                    >
                                        {skill.name}
                                    </button>
                                );
                            })}
                            {availableSkills.length === 0 && (
                                <span className="text-xs text-gray-500 italic">Belum ada data keahlian.</span>
                            )}
                        </div>

                        <input
                            type="text"
                            name="tools"
                            value={formData.tools}
                            onChange={handleInputChange}
                            required
                            placeholder="React.js, Node.js, Tailwind CSS..."
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Deskripsi</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase flex items-center gap-1"><FaGithub /> GitHub URL</label>
                            <input type="url" name="github_url" value={formData.github_url} onChange={handleInputChange} className="w-full px-3 py-2 bg-bgMain border border-borderMuted rounded-lg text-sm text-gray-100 focus:border-goldPrimary" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase flex items-center gap-1"><FaFigma /> Figma URL</label>
                            <input type="url" name="figma_url" value={formData.figma_url} onChange={handleInputChange} className="w-full px-3 py-2 bg-bgMain border border-borderMuted rounded-lg text-sm text-gray-100 focus:border-goldPrimary" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase flex items-center gap-1"><LuExternalLink /> Website URL</label>
                            <input type="url" name="website_url" value={formData.website_url} onChange={handleInputChange} className="w-full px-3 py-2 bg-bgMain border border-borderMuted rounded-lg text-sm text-gray-100 focus:border-goldPrimary" />
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Unggah Thumbnail/Gambar</label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-borderMuted shrink-0">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-bgSurface file:text-goldPrimary hover:file:bg-borderMuted transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-borderMuted/60 flex justify-end gap-3 sticky bottom-0 bg-bgSurface py-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>Simpan Projek</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Konfirmasi Hapus"
                maxWidth="sm"
            >
                <div className="space-y-5">
                    <p className="text-sm text-gray-300">
                        Apakah Anda yakin ingin menghapus data projek ini? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button variant="primary" className="bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white" onClick={handleDelete} isLoading={isSubmitting}>
                            Ya, Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageProjects;