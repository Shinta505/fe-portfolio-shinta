import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LuLayoutDashboard,
    LuFolderGit2,
    LuFileText,
    LuGraduationCap,
    LuBriefcaseBusiness,
    LuAward,
    LuWrench,
    LuMail,
    LuUser,
    LuFileCode,
    LuSettings,
    LuLogOut,
    LuX
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LuLayoutDashboard },
    { name: 'Profile', path: '/admin/profile', icon: LuUser },
    { name: 'Projects', path: '/admin/projects', icon: LuFolderGit2 },
    { name: 'Articles', path: '/admin/articles', icon: LuFileText },
    { name: 'Education', path: '/admin/education', icon: LuGraduationCap },
    { name: 'Experience', path: '/admin/experience', icon: LuBriefcaseBusiness },
    { name: 'Certifications', path: '/admin/certifications', icon: LuAward },
    { name: 'Skills', path: '/admin/skills', icon: LuWrench },
    { name: 'Resumes', path: '/admin/resumes', icon: LuFileCode },
    { name: 'Messages', path: '/admin/messages', icon: LuMail },
    { name: 'Settings', path: '/admin/settings', icon: LuSettings },
];

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout gagal:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Overlay hitam transparan saat sidebar terbuka di layar mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-bgSurface border-r border-borderMuted flex flex-col h-screen 
        transform transition-transform duration-300 ease-in-out select-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-6 border-b border-borderMuted flex items-center justify-between">
                    <span className="text-xl font-bold font-poppins text-gradient tracking-wide">
                        Admin<span className="text-gray-100">.Panel</span>
                    </span>
                    {/* Tombol close khusus tampilan mobile */}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-bgMain/50 lg:hidden transition-colors"
                    >
                        <LuX className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose} // Menutup sidebar otomatis saat menu dipilih di mobile
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 ${isActive
                                        ? 'bg-goldPrimary text-bgMain font-semibold shadow-md shadow-goldPrimary/20'
                                        : 'text-gray-300 hover:text-goldPrimary hover:bg-bgMain/50'
                                    }`
                                }
                            >
                                <IconComponent className="w-5 h-5 shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-borderMuted bg-bgSurface/60">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-300 text-sm font-medium focus:outline-none disabled:opacity-50"
                    >
                        <LuLogOut className="w-5 h-5 shrink-0" />
                        <span>{isLoggingOut ? 'Keluar...' : 'Keluar Sesi'}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;