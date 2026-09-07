import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuMail, LuTrash2, LuEye, LuCircleAlert, LuCheck,
    LuCalendar, LuUser, LuSearch
} from 'react-icons/lu';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Asumsi pemanggilan API dari file backendApi.js. 
// Sesuaikan nama fungsi export dari file API Anda jika berbeda.
import { getContactMessages, deleteContactMessage } from '../../api/backendApi';

// Konstanta tidak diekspor untuk mengatasi peringatan Vite Fast Refresh
const TABLE_HEADERS = ['Nama Lengkap', 'Email Pengirim', 'Cuplikan Pesan', 'Tanggal', 'Aksi'];

const ManageMessages = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk Modal Lihat & Hapus
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadMessages = async () => {
            setLoading(true);
            try {
                const response = await getContactMessages();
                const data = response.data?.data || response.data;

                if (isMounted) {
                    setMessages(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Gagal mengambil data pesan:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await getContactMessages();
            const data = response.data?.data || response.data;
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Gagal menyegarkan data pesan:', error);
        } finally {
            setLoading(false);
        }
    };

    const openViewModal = (msg) => {
        setSelectedMessage(msg);
        setIsViewModalOpen(true);
    };

    const openDeleteConfirm = (uuid) => {
        setDeleteId(uuid);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            await deleteContactMessage(deleteId);
            setStatus({ type: 'success', message: 'Pesan berhasil dihapus.' });
            fetchMessages();
            setIsDeleteModalOpen(false);

            // Sembunyikan notifikasi setelah 3 detik
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Gagal menghapus pesan.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter pencarian berdasarkan nama atau email
    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex w-screen h-screen overflow-hidden font-sans text-gray-100 bg-bgMain">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-6 overflow-y-auto sm:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
                        >
                            <div>
                                <h2 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl font-poppins text-gray-100">
                                    <LuMail className="text-goldPrimary" /> Kelola Pesan Masuk
                                </h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Baca dan kelola pesan yang dikirimkan pengunjung melalui formulir kontak.
                                </p>
                            </div>
                        </motion.div>

                        {/* Notifikasi Status */}
                        <AnimatePresence>
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${status.type === 'error'
                                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        }`}
                                >
                                    {status.type === 'error' ? <LuCircleAlert className="w-5 h-5" /> : <LuCheck className="w-5 h-5" />}
                                    <span>{status.message}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bar Pencarian */}
                        <Card className="p-4 bg-bgSurface/40 border-borderMuted">
                            <div className="relative max-w-md">
                                <LuSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama atau email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2.5 pl-10 pr-4 text-sm transition-colors border outline-none bg-bgMain border-borderMuted rounded-xl text-gray-100 placeholder-gray-500 focus:border-goldPrimary"
                                />
                            </div>
                        </Card>

                        {/* Tabel Data Pesan */}
                        <Card className="overflow-hidden bg-bgSurface/40 border-borderMuted">
                            <div className="overflow-x-auto custom-scrollbar">
                                {loading ? (
                                    <div className="py-20">
                                        <LoadingSpinner size="md" text="Memuat daftar pesan..." />
                                    </div>
                                ) : filteredMessages.length > 0 ? (
                                    <table className="w-full text-sm text-left whitespace-nowrap">
                                        <thead className="text-xs uppercase bg-bgSurface text-gray-400 border-b border-borderMuted font-poppins tracking-wider">
                                            <tr>
                                                {TABLE_HEADERS.map((header, idx) => (
                                                    <th key={idx} className="px-6 py-4 font-semibold">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-borderMuted">
                                            {filteredMessages.map((msg) => (
                                                <tr key={msg.uuid} className="transition-colors hover:bg-bgSurface/60 group">
                                                    <td className="px-6 py-4 font-medium text-gray-200">
                                                        {msg.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-goldPrimary">
                                                        {msg.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        <span className="block max-w-50 truncate">
                                                            {msg.message}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => openViewModal(msg)}
                                                                className="p-2 transition-colors rounded-lg text-gray-400 bg-bgMain border border-borderMuted hover:text-goldPrimary hover:border-goldPrimary"
                                                                aria-label="Lihat Detail Pesan"
                                                            >
                                                                <LuEye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteConfirm(msg.uuid)}
                                                                className="p-2 transition-colors rounded-lg text-gray-400 bg-bgMain border border-borderMuted hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10"
                                                                aria-label="Hapus Pesan"
                                                            >
                                                                <LuTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <LuMail className="w-12 h-12 mb-3 text-borderMuted" />
                                        <p className="text-gray-400">Belum ada pesan yang masuk atau ditemukan.</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                    </div>
                </main>
            </div>

            {/* Modal Lihat Detail Pesan */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detail Pesan Masuk"
                maxWidth="2xl"
            >
                {selectedMessage && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-borderMuted/60">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-poppins">Nama Pengirim</p>
                                <p className="flex items-center gap-2 text-sm font-medium text-gray-200">
                                    <LuUser className="w-4 h-4 text-goldPrimary" /> {selectedMessage.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-poppins">Alamat Email</p>
                                <p className="flex items-center gap-2 text-sm font-medium text-gray-200">
                                    <LuMail className="w-4 h-4 text-goldPrimary" /> {selectedMessage.email}
                                </p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-poppins">Tanggal Dikirim</p>
                                <p className="flex items-center gap-2 text-sm font-medium text-gray-200">
                                    <LuCalendar className="w-4 h-4 text-goldPrimary" />
                                    {new Date(selectedMessage.createdAt).toLocaleString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase font-poppins">Isi Pesan</p>
                            <div className="p-4 rounded-xl bg-bgSurface border border-borderMuted text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Tutup</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Hapus Pesan"
                maxWidth="md"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 text-sm text-red-400 border rounded-xl bg-red-500/10 border-red-500/30">
                        <LuCircleAlert className="w-6 h-6 shrink-0" />
                        <p>Tindakan ini permanen. Apakah Anda yakin ingin menghapus pesan ini dari database?</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDelete}
                            isLoading={isSubmitting}
                            className="bg-red-500! hover:bg-red-600! shadow-red-500/20"
                        >
                            Ya, Hapus
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default ManageMessages;