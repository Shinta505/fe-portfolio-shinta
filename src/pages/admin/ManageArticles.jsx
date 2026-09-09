import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuFileText, LuPlus, LuPen, LuTrash2,
    LuImagePlus, LuCircleAlert, LuCheck, LuCalendar
} from 'react-icons/lu';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../../api/backendApi';

const ManageArticles = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const articleStatuses = ['draft', 'published'];

    const initialFormState = {
        title: '',
        slug: '',
        content: '',
        status: 'draft',
        publishedAt: new Date().toISOString().slice(0, 16),
        image: null
    };

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [status, setStatus] = useState({ type: null, message: '' });

    // Fungsi helper untuk memeriksa, mengubah status secara lokal, dan mengupdate database jika sudah waktunya
    const processArticlesWithSchedule = async (articleList) => {
        const nowTime = new Date().getTime();
        const updatedArticles = await Promise.all(
            articleList.map(async (article) => {
                if (article.status === 'draft' && article.publishedAt) {
                    const publishTime = new Date(article.publishedAt).getTime();
                    
                    // Jika waktu saat ini sudah melewati atau sama dengan waktu publish
                    if (!isNaN(publishTime) && nowTime >= publishTime) {
                        try {
                            // Kirim request ke backend untuk mengubah status menjadi 'published' secara permanen
                            const submitData = new FormData();
                            submitData.append('status', 'published');
                            submitData.append('title', article.title);
                            submitData.append('slug', article.slug);
                            submitData.append('content', article.content);
                            if (article.publishedAt) {
                                submitData.append('publishedAt', article.publishedAt);
                            }

                            await updateArticle(article.uuid, submitData);
                            
                            return { ...article, status: 'published' };
                        } catch (error) {
                            console.error(`Gagal otomatis publish artikel ${article.uuid}:`, error);
                        }
                    }
                }
                return article;
            })
        );
        return updatedArticles;
    };

    useEffect(() => {
        let isMounted = true;

        const loadArticles = async () => {
            setLoading(true);
            try {
                const response = await getArticles();
                const data = response.data?.data || response.data;

                if (isMounted) {
                    const rawArticles = Array.isArray(data) ? data : [];
                    const processed = await processArticlesWithSchedule(rawArticles);
                    setArticles(processed);
                }
            } catch (error) {
                console.error('Gagal mengambil data artikel:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadArticles();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await getArticles();
            const data = response.data?.data || response.data;
            const rawArticles = Array.isArray(data) ? data : [];
            const processed = await processArticlesWithSchedule(rawArticles);
            setArticles(processed);
        } catch (error) {
            console.error('Gagal mengambil data artikel:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await getArticles();
            const data = response.data?.data || response.data;
            const rawArticles = Array.isArray(data) ? data : [];
            setArticles(processArticlesWithSchedule(rawArticles));
        } catch (error) {
            console.error('Gagal mengambil data artikel:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === 'title' && !editingId) {
                updated.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9 ]/g, '')
                    .replace(/\s+/g, '-');
            }
            return updated;
        });
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

    const openEditModal = (article) => {
        setEditingId(article.uuid);
        setFormData({
            title: article.title,
            slug: article.slug,
            content: article.content,
            status: article.status || 'draft',
            publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            image: null
        });
        setImagePreview(article.image || null);
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

        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                submitData.append(key, formData[key]);
            }
        });

        try {
            if (editingId) {
                await updateArticle(editingId, submitData);
                setStatus({ type: 'success', message: 'Artikel berhasil diperbarui.' });
            } else {
                await createArticle(submitData);
                setStatus({ type: 'success', message: 'Artikel berhasil dibuat.' });
            }
            fetchArticles();
            setTimeout(() => setIsModalOpen(false), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan artikel.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteArticle(deleteId);
            fetchArticles();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus artikel:', error);
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
                                    <LuFileText className="text-goldPrimary" /> Manage Articles
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Kelola postingan blog, tulisan artikel, status publikasi, dan unggah media sampul.
                                </p>
                            </div>
                            <Button variant="primary" iconLeft={LuPlus} onClick={openAddModal}>
                                Buat Artikel Baru
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner text="Memuat daftar artikel..." />
                        ) : articles.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-bgSurface/40 border border-borderMuted rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-bgMain border border-borderMuted flex items-center justify-center text-goldPrimary">
                                    <LuFileText size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold font-poppins text-gray-100">Belum Ada Artikel Tersedia</h3>
                                    <p className="text-sm text-gray-400 max-w-md">
                                        Saat ini belum ada data artikel atau tulisan blog di dalam database. Silakan buat artikel baru menggunakan tombol di atas.
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
                                    {articles.map((article) => (
                                        <motion.div
                                            key={article.uuid}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Card className="h-full flex flex-col bg-bgSurface/40 border-borderMuted">
                                                <div className="h-48 w-full bg-bgMain border-b border-borderMuted relative flex items-center justify-center overflow-hidden">
                                                    {article.image ? (
                                                        <img
                                                            src={article.image}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <LuImagePlus className="w-12 h-12 text-borderMuted" />
                                                    )}
                                                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase border backdrop-blur ${article.status === 'published'
                                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                        }`}>
                                                        {article.status}
                                                    </span>
                                                </div>

                                                <div className="p-5 flex flex-col grow">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                                        <LuCalendar className="w-3.5 h-3.5 text-goldPrimary" />
                                                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>

                                                    <h4 className="text-lg font-bold font-poppins text-gray-100 line-clamp-1">{article.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{article.content?.replace(/<[^>]+>/g, '')}</p>

                                                    <div className="mt-auto pt-4 border-t border-borderMuted/60 flex gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="flex-1"
                                                            iconLeft={LuPen}
                                                            onClick={() => openEditModal(article)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                                                            onClick={() => openDeleteConfirm(article.uuid)}
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

            {/* Modal Form Tambah/Edit Artikel */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={editingId ? "Edit Artikel" : "Buat Artikel Baru"}
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {status.message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                            {status.type === 'error' ? <LuCircleAlert className="w-4 h-4" /> : <LuCheck className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase">Judul Artikel</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Masukkan judul artikel..."
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase">Slug URL</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                placeholder="judul-artikel-anda"
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase">Status Publikasi</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                            >
                                {articleStatuses.map((st) => (
                                    <option key={st} value={st} className="bg-bgMain text-gray-100 uppercase">
                                        {st}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase">Tanggal Publikasi</label>
                            <input
                                type="datetime-local"
                                name="publishedAt"
                                value={formData.publishedAt}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Konten Artikel</label>
                        <textarea
                            name="content"
                            rows={6}
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            placeholder="Tulis atau tempel konten artikel di sini..."
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary resize-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase">Upload Media / Gambar Sampul</label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bgMain border border-borderMuted hover:border-goldPrimary rounded-xl cursor-pointer transition-colors text-sm text-gray-300">
                                <LuImagePlus className="w-5 h-5 text-goldPrimary" />
                                <span>{formData.image ? formData.image.name : 'Pilih file gambar...'}</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {imagePreview && (
                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-borderMuted shrink-0 bg-bgMain">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-borderMuted">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>
                            {editingId ? "Simpan Perubahan" : "Publikasikan Artikel"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Konfirmasi Hapus Artikel"
                maxWidth="sm"
            >
                <div className="space-y-5">
                    <p className="text-sm text-gray-300">
                        Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            isLoading={isSubmitting}
                            onClick={handleDelete}
                        >
                            Ya, Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageArticles;
