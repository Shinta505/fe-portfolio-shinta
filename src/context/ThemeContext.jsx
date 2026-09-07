import { createContext, useContext, useState, useEffect } from 'react';

// Inisialisasi context untuk manajemen warna aksen global
const ThemeContext = createContext();

/**
 * Komponen ThemeProvider berfungsi sebagai penyedia state global 
 * untuk mengelola preferensi warna aksen dinamis di seluruh aplikasi.
 */
export const ThemeProvider = ({ children }) => {
    // State manajemen untuk warna aksen dengan persistensi localStorage
    const [accentColor, setAccentColor] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedAccent = localStorage.getItem('accentColor');
            return savedAccent ? savedAccent : '#E5A93B';
        }
        return '#E5A93B';
    });

    // Efek samping untuk menerapkan warna aksen sebagai variabel CSS kustom pada root dokumen
    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--color-accent', accentColor);
        
        // Kalkulasi sederhana untuk warna hover (sedikit lebih cerah/pudar)
        root.style.setProperty('--color-accent-hover', accentColor); 
        
        localStorage.setItem('accentColor', accentColor);
    }, [accentColor]);

    /**
     * Fungsi mutator untuk memperbarui skema warna aksen antarmuka.
     * @param {string} color - Nilai heksadesimal warna aksen baru.
     */
    const changeAccentColor = (color) => {
        setAccentColor(color);
    };

    return (
        <ThemeContext.Provider value={{ accentColor, changeAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom Hook untuk mempermudah konsumsi ThemeContext pada hirarki komponen anak.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme harus digunakan di dalam struktur ThemeProvider');
    }
    return context;
};