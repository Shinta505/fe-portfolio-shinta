import axios from 'axios';

/**
 * Instance Axios yang telah dikonfigurasi untuk komunikasi dengan backend.
 * Base URL mengarah ke endpoint API utama dari backend portofolio.
 */
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Aktifkan withCredentials jika di masa depan menggunakan cookies untuk autentikasi
    withCredentials: true,
});

/**
 * Request Interceptor
 * Berfungsi untuk menyisipkan JWT Access Token ke dalam header Authorization 
 * sebelum request dikirimkan ke server.
 */
axiosInstance.interceptors.request.use(
    (config) => {
        // Mengambil token yang disimpan pada localStorage saat proses login
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Berfungsi untuk menangani respon dari server secara global.
 * Khususnya menangani status HTTP 401 (Unauthorized) dan 403 (Forbidden) 
 * yang mengindikasikan token kedaluwarsa atau akses ditolak.
 */
axiosInstance.interceptors.response.use(
    (response) => {
        // Lanjutkan response jika berhasil (Status 2xx)
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            // Penanganan khusus jika token tidak valid atau sesi berakhir
            if (status === 401 || status === 403) {
                console.warn('Otentikasi gagal atau token telah kedaluwarsa.');

                // Opsional: Hapus token dan arahkan pengguna kembali ke halaman login
                // localStorage.removeItem('accessToken');
                // window.location.href = '/login'; 
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;