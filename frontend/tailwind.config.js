/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366F1',
                    dark: '#4F46E5',
                    light: '#818CF8',
                },
                success: '#22C55E',
                error: '#EF4444',
                warning: '#F97316',
                info: '#EAB308',
                gray: {
                    400: '#94A3B8',
                }
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
