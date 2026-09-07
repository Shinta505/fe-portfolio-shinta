import { useEffect } from 'react';

/**
 * Hook untuk melindungi konten halaman dengan memblokir klik kanan,
 * kombinasi tombol shortcut untuk Inspect Element/Developer Tools, dan seleksi teks.
 */
const useContentProtection = (enabled = true) => {
    useEffect(() => {
        if (!enabled) return;

        // 1. Mencegah menu konteks (klik kanan)
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // 2. Mencegah shortcut keyboard untuk Inspect Element, Save Page, dan View Source
        const handleKeyDown = (e) => {
            // Mencegah F12
            if (e.key === 'F12') {
                e.preventDefault();
                return;
            }

            // Mencegah kombinasi Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
            if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
                e.preventDefault();
                return;
            }

            // Mencegah kombinasi Ctrl+U (View Source)
            if (e.ctrlKey && e.key.toUpperCase() === 'U') {
                e.preventDefault();
                return;
            }

            // Mencegah kombinasi Ctrl+S (Save Page)
            if (e.ctrlKey && e.key.toUpperCase() === 'S') {
                e.preventDefault();
                return;
            }

            // Mencegah kombinasi Ctrl+C (Copy) jika diperlukan proteksi penuh pada teks
            if (e.ctrlKey && e.key.toUpperCase() === 'C') {
                e.preventDefault();
            }
        };

        // 3. Mencegah event copy secara langsung
        const handleCopy = (e) => {
            e.preventDefault();
        };

        // Daftarkan event listener ke document
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('copy', handleCopy);

        // Bersihkan event listener saat komponen dilepas (unmount)
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('copy', handleCopy);
        };
    }, [enabled]);
};

export default useContentProtection;