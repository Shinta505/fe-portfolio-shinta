import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuLogOut, LuUser, LuSettings, LuMenu } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../api/backendApi';

const AdminHeader = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchHeaderProfile = async () => {
            try {
                const response = await getProfile();
                const profileData = response.data?.data || response.data;
                if (profileData && profileData.profile_image && isMounted) {
                    setProfileImage(profileData.profile_image);
                }
            } catch (error) {
                console.error('Gagal memuat foto profil untuk header:', error);
            }
        };

        fetchHeaderProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-bgSurface/80 backdrop-blur-md border-b border-borderMuted">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl bg-bgMain border border-borderMuted text-gray-300 hover:text-goldPrimary hover:border-goldPrimary transition-colors lg:hidden focus:outline-none"
                    aria-label="Toggle Sidebar"
                >
                    <LuMenu className="w-5 h-5" />
                </button>

                <h1 className="text-lg sm:text-xl font-bold font-poppins text-gray-100 truncate">
                    Admin <span className="text-gradient">Pages</span>
                </h1>
            </div>

            <div className="relative flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-2 rounded-xl bg-bgMain border border-borderMuted hover:border-goldPrimary transition-colors focus:outline-none"
                        aria-label="User Menu"
                    >
                        {/* Avatar / Foto Profil */}
                        <div className="w-10 h-10 rounded-lg bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center text-goldPrimary font-bold font-poppins shrink-0 overflow-hidden">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={user?.username || 'Admin'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.username ? user.username.charAt(0).toUpperCase() : 'A'
                            )}
                        </div>

                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-gray-200 font-poppins">
                                {user?.username || 'Administrator'}
                            </p>
                            <p className="text-xs text-goldPrimary uppercase tracking-wider">
                                {user?.role || 'admin'}
                            </p>
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 bg-bgMain border border-borderMuted rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                            <div className="p-4 border-b border-borderMuted sm:hidden">
                                <p className="text-sm font-semibold text-gray-200 font-poppins">
                                    {user?.username || 'Administrator'}
                                </p>
                                <p className="text-xs text-goldPrimary uppercase tracking-wider">
                                    {user?.role || 'admin'}
                                </p>
                            </div>

                            <div className="p-2 space-y-1">
                                <Link
                                    to="/admin/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-bgSurface/50 transition-colors"
                                >
                                    <LuUser className="w-4 h-4 text-goldPrimary" />
                                    <span>Profil Akun</span>
                                </Link>
                                <Link
                                    to="/admin/settings"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-bgSurface/50 transition-colors"
                                >
                                    <LuSettings className="w-4 h-4 text-goldPrimary" />
                                    <span>Pengaturan</span>
                                </Link>
                            </div>

                            <div className="p-2 border-t border-borderMuted">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <LuLogOut className="w-4 h-4" />
                                    <span>Keluar (Logout)</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
