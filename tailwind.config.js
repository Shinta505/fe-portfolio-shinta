/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgMain: '#12151C',
                bgSurface: '#202531',
                borderMuted: '#3A4255',
                goldPrimary: '#E5A93B',
                goldHover: '#FCD34D',
                goldDark: '#A87118'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif']
            }
        },
    },
    plugins: [],
}