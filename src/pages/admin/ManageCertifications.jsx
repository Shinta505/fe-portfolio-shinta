import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuAward,
    LuPlus,
    LuPen,
    LuTrash2,
    LuImagePlus,
    LuCircleAlert,
    LuCheck,
    LuUpload,
    LuExternalLink,
} from "react-icons/lu";
import { FaBuilding } from "react-icons/fa";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    getSkills,
} from "../../api/backendApi";

// Initial state outside component (Not exported to prevent Vite Fast Refresh issues)
const initialFormState = {
    name: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    skills: [],
    image: null,
};

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const currentYear = new Date().getFullYear();

// Issue Date: Hanya tahun berjalan mundur ke 30 tahun yang lalu
const ISSUE_YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

// Expiration Date: Dari 10 tahun ke depan mundur 40 tahun (Mencakup masa depan dan masa lalu)
const EXPIRATION_YEARS = Array.from({ length: 41 }, (_, i) => (currentYear + 10) - i);

const ManageCertifications = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [certifications, setCertifications] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const [status, setStatus] = useState({ type: null, message: "" });
    const fileInputRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [certRes, skillsRes] = await Promise.all([
                    getCertifications(),
                    getSkills(),
                ]);

                if (isMounted) {
                    const certData = certRes.data?.data || certRes.data || [];
                    setCertifications(Array.isArray(certData) ? certData : []);

                    const skillData = skillsRes.data?.data || skillsRes.data || [];
                    setAvailableSkills(Array.isArray(skillData) ? skillData : []);
                }
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const fetchCertifications = async () => {
        setLoading(true);
        try {
            const response = await getCertifications();
            const data = response.data?.data || response.data || [];
            setCertifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data sertifikasi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSkillToggle = (skillName) => {
        setFormData((prev) => {
            const currentSkills = prev.skills || [];
            if (currentSkills.includes(skillName)) {
                return {
                    ...prev,
                    skills: currentSkills.filter((s) => s !== skillName),
                };
            } else {
                return { ...prev, skills: [...currentSkills, skillName] };
            }
        });
    };

    const processFile = (file) => {
        if (file && file.type.startsWith("image/")) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setStatus({
                type: "error",
                message: "Hanya file gambar yang diizinkan.",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setImagePreview(null);
        setStatus({ type: null, message: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (cert) => {
        setEditingId(cert.uuid);
        setFormData({
            name: cert.name || "",
            issuer: cert.issuer || "",
            issueDate: cert.issueDate || "",
            expirationDate: cert.expirationDate || "",
            credentialId: cert.credentialId || "",
            credentialUrl: cert.credentialUrl || "",
            skills: cert.skills ? cert.skills.split(",").map((s) => s.trim()) : [],
            image: null,
        });
        setImagePreview(cert.media || null);
        setStatus({ type: null, message: "" });
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (uuid) => {
        setDeleteId(uuid);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: "" });

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("issuer", formData.issuer);
        submitData.append("issueDate", formData.issueDate);
        if (formData.expirationDate)
            submitData.append("expirationDate", formData.expirationDate);
        if (formData.credentialId)
            submitData.append("credentialId", formData.credentialId);
        if (formData.credentialUrl)
            submitData.append("credentialUrl", formData.credentialUrl);

        const skillsString = formData.skills.join(", ");
        submitData.append("skills", skillsString);

        // Endpoint backend expects "image" field for Multer
        if (formData.image) {
            submitData.append("image", formData.image);
        }

        try {
            if (editingId) {
                await updateCertification(editingId, submitData);
                setStatus({
                    type: "success",
                    message: "Sertifikasi berhasil diperbarui.",
                });
            } else {
                await createCertification(submitData);
                setStatus({
                    type: "success",
                    message: "Sertifikasi berhasil ditambahkan.",
                });
            }
            fetchCertifications();
            setTimeout(() => setIsModalOpen(false), 1500);
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error.response?.data?.message ||
                    "Terjadi kesalahan saat menyimpan data.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteCertification(deleteId);
            fetchCertifications();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Gagal menghapus sertifikasi:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getParsedDate = (dateString) => {
        if (!dateString) return { month: "", year: "" };
        const [month = "", year = ""] = dateString.split(" ");
        return { month, year };
    };

    const handleDropdownDateChange = (field, type, value) => {
        setFormData((prev) => {
            const current = getParsedDate(prev[field]);
            let newMonth = type === "month" ? value : current.month;
            let newYear = type === "year" ? value : current.year;

            // Default penanganan jika salah satu diisi terlebih dahulu
            if (newMonth && !newYear) newYear = currentYear.toString();
            if (!newMonth && newYear) newMonth = "Januari";

            // Kosongkan seluruh string jika kedua dropdown dikosongkan (untuk expiration date)
            if (!newMonth && !newYear) return { ...prev, [field]: "" };

            return { ...prev, [field]: `${newMonth} ${newYear}`.trim() };
        });
    };

    const issue = getParsedDate(formData.issueDate);
    const expiration = getParsedDate(formData.expirationDate);

    return (
        <div className="flex h-screen overflow-hidden font-sans w-screen text-gray-100 bg-bgMain">
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-6 overflow-y-auto sm:p-8">
                    <div className="max-w-7xl pb-12 mx-auto space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
                        >
                            <div>
                                <h2 className="flex items-center gap-3 text-2xl font-bold font-poppins text-gray-100 sm:text-3xl">
                                    <LuAward className="text-goldPrimary" /> Manage Certifications
                                </h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Kelola daftar lisensi, sertifikasi profesional, dan
                                    penghargaan.
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                iconLeft={LuPlus}
                                onClick={openAddModal}
                            >
                                Tambah Sertifikasi
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner text="Memuat data sertifikasi..." />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="overflow-hidden border bg-bgSurface/40 border-borderMuted rounded-2xl"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left whitespace-nowrap">
                                        <thead className="text-xs uppercase bg-bgMain/50 text-gray-400 border-b border-borderMuted font-poppins">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">
                                                    Sertifikasi & Penerbit
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    Tanggal Berjangka
                                                </th>
                                                <th className="px-6 py-4 font-semibold">Kredensial</th>
                                                <th className="px-6 py-4 font-semibold text-right">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-borderMuted/50">
                                            {certifications.length > 0 ? (
                                                certifications.map((cert) => (
                                                    <tr
                                                        key={cert.uuid}
                                                        className="transition-colors hover:bg-bgMain/30"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center justify-center w-10 h-10 border rounded-lg shrink-0 bg-bgMain border-borderMuted text-goldPrimary">
                                                                    {cert.media ? (
                                                                        <img
                                                                            src={
                                                                                cert.media.startsWith("http")
                                                                                    ? cert.media
                                                                                    : `https://be-portfolio-shinta.vercel.app${cert.media}`
                                                                            }
                                                                            alt="Media"
                                                                            className="object-cover w-full h-full rounded-lg"
                                                                        />
                                                                    ) : (
                                                                        <LuAward className="w-5 h-5" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-100">
                                                                        {cert.name}
                                                                    </p>
                                                                    <p className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                                                                        <FaBuilding className="w-3 h-3" />{" "}
                                                                        {cert.issuer}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-gray-300">
                                                                <p>
                                                                    Mulai:{" "}
                                                                    <span className="font-medium text-goldPrimary">
                                                                        {cert.issueDate}
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-0.5">
                                                                    Berakhir: {cert.expirationDate || "Selamanya"}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {cert.credentialUrl ? (
                                                                <a
                                                                    href={cert.credentialUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-2 text-goldPrimary hover:underline"
                                                                >
                                                                    Lihat Link <LuExternalLink />
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-500">-</span>
                                                            )}
                                                            {cert.credentialId && (
                                                                <p className="mt-1 text-xs text-gray-400 font-mono">
                                                                    ID: {cert.credentialId}
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => openEditModal(cert)}
                                                                    className="p-2 transition-colors rounded-lg text-blue-400 bg-blue-400/10 hover:bg-blue-400/20"
                                                                >
                                                                    <LuPen className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteConfirm(cert.uuid)}
                                                                    className="p-2 transition-colors rounded-lg text-red-400 bg-red-400/10 hover:bg-red-400/20"
                                                                >
                                                                    <LuTrash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="py-8 text-center text-gray-500"
                                                    >
                                                        Belum ada data sertifikasi yang ditambahkan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal Form Tambah/Edit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && setIsModalOpen(false)}
                title={editingId ? "Edit Sertifikasi" : "Tambah Sertifikasi Baru"}
                maxWidth="3xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence>
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${status.type === "error"
                                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    }`}
                            >
                                {status.type === "error" ? (
                                    <LuCircleAlert className="w-5 h-5" />
                                ) : (
                                    <LuCheck className="w-5 h-5" />
                                )}
                                <span>{status.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Nama Sertifikasi *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Contoh: AWS Certified Cloud Practitioner"
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Penerbit (Issuer) *
                            </label>
                            <input
                                type="text"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleInputChange}
                                required
                                placeholder="Contoh: Amazon Web Services (AWS)"
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                            />
                        </div>

                        {/* TANGGAL MULAI (ISSUE DATE) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Tanggal Mulai (Issue Date) *
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={issue.month}
                                    onChange={(e) => handleDropdownDateChange('issueDate', 'month', e.target.value)}
                                    required
                                    className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                                >
                                    <option value="" disabled>Pilih Bulan</option>
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select
                                    value={issue.year}
                                    onChange={(e) => handleDropdownDateChange('issueDate', 'year', e.target.value)}
                                    required
                                    className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                                >
                                    <option value="" disabled>Pilih Tahun</option>
                                    {/* Gunakan ISSUE_YEARS */}
                                    {ISSUE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* TANGGAL BERAKHIR (EXPIRATION) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Tanggal Berakhir (Expiration)
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={expiration.month}
                                    onChange={(e) => handleDropdownDateChange('expirationDate', 'month', e.target.value)}
                                    className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                                >
                                    <option value="">- Kosong -</option>
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select
                                    value={expiration.year}
                                    onChange={(e) => handleDropdownDateChange('expirationDate', 'year', e.target.value)}
                                    className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                                >
                                    <option value="">- Kosong -</option>
                                    {/* Gunakan EXPIRATION_YEARS */}
                                    {EXPIRATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Kosongkan kedua pilihan jika sertifikasi tidak memiliki masa berlaku.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Credential ID
                            </label>
                            <input
                                type="text"
                                name="credentialId"
                                value={formData.credentialId}
                                onChange={handleInputChange}
                                placeholder="ID Sertifikat"
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Credential URL
                            </label>
                            <input
                                type="url"
                                name="credentialUrl"
                                value={formData.credentialUrl}
                                onChange={handleInputChange}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Pilih Keahlian (Skills) terkait
                            </label>
                            <div className="flex flex-wrap gap-2 p-4 border rounded-xl bg-bgMain border-borderMuted max-h-48 overflow-y-auto custom-scrollbar">
                                {availableSkills.map((skill) => {
                                    const isSelected = formData.skills.includes(skill.name);
                                    return (
                                        <button
                                            type="button"
                                            key={skill.uuid}
                                            onClick={() => handleSkillToggle(skill.name)}
                                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors border ${isSelected
                                                ? "bg-goldPrimary/20 border-goldPrimary text-goldHover"
                                                : "bg-bgSurface border-borderMuted text-gray-400 hover:border-goldPrimary/50"
                                                }`}
                                        >
                                            {skill.name}
                                        </button>
                                    );
                                })}
                                {availableSkills.length === 0 && (
                                    <span className="text-sm text-gray-500">
                                        Tidak ada data keahlian.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-semibold tracking-wider uppercase text-gray-300 font-poppins">
                                Upload Media / Logo (Opsional)
                            </label>
                            <div
                                className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${isDragging
                                    ? "border-goldPrimary bg-goldPrimary/5"
                                    : "border-borderMuted bg-bgMain hover:border-goldPrimary/50"
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/jpeg, image/png, image/webp"
                                    className="hidden"
                                />

                                {imagePreview ? (
                                    <div className="relative w-full h-full p-2 group">
                                        <img
                                            src={
                                                imagePreview.startsWith("http")
                                                    ? imagePreview
                                                    : imagePreview
                                            }
                                            alt="Preview"
                                            className="object-contain w-full h-full rounded-xl"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-bgMain/60 rounded-xl group-hover:opacity-100">
                                            <p className="flex items-center gap-2 text-sm font-medium text-white">
                                                <LuImagePlus className="w-4 h-4" /> Ganti Gambar
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500 pointer-events-none">
                                        <LuUpload className="w-8 h-8 mb-1 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-300">
                                            Drag & drop atau klik untuk memilih file
                                        </p>
                                        <p className="text-xs">JPG, PNG, atau WEBP (Max. 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-borderMuted">
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {editingId ? "Simpan Perubahan" : "Tambah Sertifikasi"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
                title="Hapus Sertifikasi"
                maxWidth="md"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500">
                            <LuTrash2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-100 font-poppins">
                                Konfirmasi Penghapusan
                            </h3>
                            <p className="mt-2 text-sm text-gray-400">
                                Apakah Anda yakin ingin menghapus data sertifikasi ini secara
                                permanen? Data yang dihapus tidak dapat dipulihkan.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium transition-colors bg-red-500 rounded-lg text-bgMain hover:bg-red-600 disabled:opacity-50"
                        >
                            {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageCertifications;
