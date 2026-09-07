import { createContext, useState, useEffect, useContext } from 'react';
import { loginAdmin, getCurrentAdmin, logoutAdmin } from '../api/backendApi';

// Context tidak diekspor langsung untuk menghindari error Fast Refresh di Vite
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Memeriksa token dan sesi saat aplikasi dimuat pertama kali
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    // Mengambil data admin jika token valid berdasarkan backendApi.js
                    const response = await getCurrentAdmin();
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Sesi telah berakhir atau token tidak valid:', error);
                    localStorage.removeItem('accessToken');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Fungsi login yang terhubung dengan backendApi.js
    const login = async (credentials) => {
        try {
            const response = await loginAdmin(credentials);
            const { accessToken, data, message } = response.data;

            // Simpan token ke localStorage sesuai dengan interceptor di axiosConfig.js
            localStorage.setItem('accessToken', accessToken);
            setUser(data);
            setIsAuthenticated(true);

            return { success: true, message: message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Proses masuk gagal.'
            };
        }
    };

    // Fungsi logout yang terhubung dengan backendApi.js
    const logout = async () => {
        try {
            await logoutAdmin();
        } catch (error) {
            console.error('Terjadi kesalahan saat logout:', error);
        } finally {
            // Selalu bersihkan state dan localStorage, baik request berhasil atau gagal
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {/* Hanya render children jika tidak dalam proses loading awal untuk mencegah layout berkedip */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk mengakses context autentikasi
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};