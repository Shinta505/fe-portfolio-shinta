import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuBriefcaseBusiness, LuPlus, LuPen, LuTrash2,
    LuMapPin, LuCalendar, LuCircleAlert, LuCheck, LuUpload, LuX
} from 'react-icons/lu';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    getSkills
} from '../../api/backendApi';

const locationTypes = ['Di lokasi', 'Gabungan', 'Jarak Jauh'];
const employmentTypes = ['Penuh Waktu', 'Paruh Waktu', 'Pekerja Mandiri', 'Pekerja Lepas', 'Kontrak'];
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const initialFormState = {
    position: '',
    company: '',
    location: '',
    location_type: locationTypes[0],
    employment_type: employmentTypes[0],
    start_month: months[0],
    start_year: currentYear.toString(),
    end_month: '',
    end_year: '',
    description: '',
    skills: [],
    media_link: '',
    media_file: null
};

const ManageExperiences = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [experiences, setExperiences] = useState([]);
    // Referensi keahlian berdasarkan stack pengembangan
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [status, setStatus] = useState({ type: null, message: '' });

    // State untuk API Wilayah
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [selectedProv, setSelectedProv] = useState({ id: '', name: '' });
    const [selectedReg, setSelectedReg] = useState({ id: '', name: '' });

    const fileInputRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Eksekusi pemanggilan API secara paralel
                const [expRes, skillsRes] = await Promise.all([
                    getExperiences(),
                    getSkills()
                ]);

                if (isMounted) {
                    const expData = expRes.data?.data || expRes.data;
                    setExperiences(Array.isArray(expData) ? expData : []);

                    const skillsData = skillsRes.data?.data || skillsRes.data;
                    // Asumsi struktur data skill memiliki properti 'name'
                    setAvailableSkills(Array.isArray(skillsData) ? skillsData : []);
                }
            } catch (error) {
                console.error('Gagal mengambil data inisial:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchInitialData();

        // Fetch Provinsi dari EMSIFA API tetap berjalan di sini...
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(res => res.json())
            .then(data => {
                if (isMounted) setProvinces(data);
            })
            .catch(err => console.error('Gagal memuat provinsi', err));

        return () => { isMounted = false; };
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

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const response = await getExperiences();
            const data = response.data?.data || response.data;
            setExperiences(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Gagal mengambil data pengalaman:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProvChange = (e) => {
        const provId = e.target.value;
        const provName = e.target.options[e.target.selectedIndex].text;
        setSelectedProv({ id: provId, name: provName });
        setSelectedReg({ id: '', name: '' });
        setRegencies([]);
    };

    const handleRegChange = (e) => {
        const regId = e.target.value;
        const regName = e.target.options[e.target.selectedIndex].text;
        setSelectedReg({ id: regId, name: regName });

        // Normalisasi format string lokasi (contoh: "Sleman, DI Yogyakarta")
        const formattedLocation = `${regName.replace(/^(KABUPATEN|KOTA)\s+/i, '')}, ${selectedProv.name}`;
        setFormData(prev => ({ ...prev, location: formattedLocation }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSkillToggle = (skill) => {
        setFormData(prev => {
            const skills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills };
        });
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, media_file: file }));
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setSelectedProv({ id: '', name: '' });
        setSelectedReg({ id: '', name: '' });
        setStatus({ type: null, message: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (exp) => {
        setEditingId(exp.uuid);

        // Pemrosesan string tanggal kembali ke dropdown
        const [sMonth, sYear] = (exp.start_date || '').split(' ');
        const [eMonth, eYear] = (exp.end_date || '').split(' ');

        setFormData({
            position: exp.position,
            company: exp.company,
            location: exp.location,
            location_type: exp.location_type || locationTypes[0],
            employment_type: exp.employment_type || employmentTypes[0],
            start_month: sMonth || months[0],
            start_year: sYear || currentYear.toString(),
            end_month: eMonth || '',
            end_year: eYear || '',
            description: exp.description,
            skills: exp.skills ? exp.skills.split(',').map(s => s.trim()) : [],
            media_link: exp.media || '',
            media_file: null
        });
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

        try {
            // Pembentukan payload sesuai struktur API
            const payload = { ...formData };
            payload.start_date = `${formData.start_month} ${formData.start_year}`;
            payload.end_date = formData.end_month && formData.end_year ? `${formData.end_month} ${formData.end_year}` : '';
            payload.skills = formData.skills.join(', ');

            // Integrasi FormData untuk upload file (menyesuaikan spesifikasi backend)
            const dataToSubmit = new FormData();
            Object.keys(payload).forEach(key => {
                if (key !== 'media_file') dataToSubmit.append(key, payload[key]);
            });
            if (formData.media_file) {
                dataToSubmit.append('media_file', formData.media_file);
            }

            if (editingId) {
                await updateExperience(editingId, dataToSubmit); // Pastikan API mendukung multipart/form-data
                setStatus({ type: 'success', message: 'Pengalaman berhasil diperbarui.' });
            } else {
                await createExperience(dataToSubmit);
                setStatus({ type: 'success', message: 'Pengalaman berhasil ditambahkan.' });
            }
            fetchExperiences();
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
            await deleteExperience(deleteId);
            fetchExperiences();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus pengalaman:', error);
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
                                    <LuBriefcaseBusiness className="text-goldPrimary" /> Manage Experiences
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Kelola riwayat pekerjaan dan pengalaman profesional Anda.
                                </p>
                            </div>
                            <Button variant="primary" iconLeft={LuPlus} onClick={openAddModal}>
                                Tambah Pengalaman
                            </Button>
                        </motion.div>

                        {loading ? (
                            <LoadingSpinner text="Memuat daftar pengalaman..." />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                <AnimatePresence>
                                    {experiences.map((exp) => (
                                        <motion.div
                                            key={exp.uuid}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Card className="h-full p-6 bg-bgSurface/40 border-borderMuted flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-bold font-poppins text-gray-100">{exp.position}</h4>
                                                        <p className="text-goldPrimary font-medium text-sm flex items-center gap-2">
                                                            <LuBriefcaseBusiness className="w-4 h-4" /> {exp.company}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <LuCalendar className="w-4 h-4" />
                                                        <span>{exp.start_date} — {exp.end_date || 'Sekarang'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <LuMapPin className="w-4 h-4" />
                                                        <span>{exp.location}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="px-2.5 py-1 bg-bgMain border border-borderMuted text-gray-300 text-[10px] rounded-full uppercase font-semibold">
                                                        {exp.employment_type}
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-goldPrimary/10 border border-goldPrimary/20 text-goldPrimary text-[10px] rounded-full uppercase font-semibold">
                                                        {exp.location_type}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-300 line-clamp-3 mb-4">{exp.description}</p>

                                                {exp.skills && (
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {exp.skills.split(',').map((skill, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-bgMain border border-borderMuted text-gray-400">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-auto flex gap-2 pt-4 border-t border-borderMuted/60">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex-1"
                                                        iconLeft={LuPen}
                                                        onClick={() => openEditModal(exp)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                                                        onClick={() => openDeleteConfirm(exp.uuid)}
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

            {/* Modal Form Tambah/Edit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Pengalaman" : "Tambah Pengalaman"}
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                    {status.message && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            }`}>
                            {status.type === 'error' ? <LuCircleAlert className="w-5 h-5 shrink-0" /> : <LuCheck className="w-5 h-5 shrink-0" />}
                            <span>{status.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Posisi / Jabatan</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Perusahaan</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Provinsi</label>
                            <select
                                value={selectedProv.id}
                                onChange={handleProvChange}
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                            >
                                <option value="">Pilih Provinsi</option>
                                {provinces.map(prov => (
                                    <option key={prov.id} value={prov.id} className="bg-bgMain">{prov.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Kota / Kabupaten</label>
                            <select
                                value={selectedReg.id}
                                onChange={handleRegChange}
                                disabled={!selectedProv.id}
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors disabled:opacity-50"
                            >
                                <option value="">Pilih Kota/Kabupaten</option>
                                {regencies.map(reg => (
                                    <option key={reg.id} value={reg.id} className="bg-bgMain">{reg.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Tipe Lokasi</label>
                            <select
                                name="location_type"
                                value={formData.location_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                            >
                                {locationTypes.map(type => (
                                    <option key={type} value={type} className="bg-bgMain">{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Tipe Pekerjaan</label>
                            <select
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors"
                            >
                                {employmentTypes.map(type => (
                                    <option key={type} value={type} className="bg-bgMain">{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Tanggal Mulai</label>
                            <div className="flex gap-2">
                                <select name="start_month" value={formData.start_month} onChange={handleInputChange} className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none">
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select name="start_year" value={formData.start_year} onChange={handleInputChange} className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none">
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Tanggal Berakhir (Opsional)</label>
                            <div className="flex gap-2">
                                <select name="end_month" value={formData.end_month} onChange={handleInputChange} className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none">
                                    <option value="">Sekarang</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select name="end_year" value={formData.end_year} onChange={handleInputChange} disabled={!formData.end_month} className="w-1/2 px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none disabled:opacity-50">
                                    <option value="">Sekarang</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Deskripsi Pekerjaan</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Keahlian (Pilih dari Daftar Skills)
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 bg-bgMain border border-borderMuted rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                            {availableSkills.map((skill) => (
                                <button
                                    key={skill.uuid || skill.id} // Gunakan ID unik dari database
                                    type="button"
                                    onClick={() => handleSkillToggle(skill.name)} // Pastikan atribut 'name' sesuai dengan struktur response API
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.skills.includes(skill.name)
                                            ? 'bg-goldPrimary/20 border-goldPrimary/50 text-goldPrimary'
                                            : 'bg-bgSurface border-borderMuted text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {skill.name}
                                </button>
                            ))}

                            {availableSkills.length === 0 && (
                                <span className="text-xs text-gray-500 italic">Daftar keahlian belum tersedia di database.</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Media Pendukung</label>

                        <input
                            type="url"
                            name="media_link"
                            value={formData.media_link}
                            onChange={handleInputChange}
                            placeholder="Tautan eksternal (Opsional)"
                            className="w-full px-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 focus:outline-none focus:border-goldPrimary transition-colors mb-3"
                        />

                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                            onClick={() => fileInputRef.current.click()}
                            className="w-full border-2 border-dashed border-borderMuted rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-goldPrimary/50 hover:bg-bgSurface/30 transition-all"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => setFormData(prev => ({ ...prev, media_file: e.target.files[0] }))}
                                className="hidden"
                            />
                            {formData.media_file ? (
                                <div className="flex items-center gap-3 text-sm text-emerald-400">
                                    <LuCheck className="w-5 h-5" />
                                    <span>{formData.media_file.name}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, media_file: null })) }}>
                                        <LuX className="w-4 h-4 text-red-400" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <LuUpload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400 text-center">Tarik & letakkan gambar di sini atau <span className="text-goldPrimary">klik untuk mengunggah</span>.</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-borderMuted/60 sticky bottom-0 bg-bgSurface py-2">
                        <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            Simpan Pengalaman
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Hapus */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Pengalaman"
                maxWidth="sm"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <LuCircleAlert className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-100">Hapus Data?</h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Tindakan ini tidak dapat dibatalkan. Data riwayat pekerjaan akan dihapus secara permanen.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-borderMuted/60">
                        <Button variant="ghost" type="button" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
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

export default ManageExperiences;