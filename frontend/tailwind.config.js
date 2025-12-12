/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                fitia: {
                    green: '#00D09C',       // Vibrant Mint (Primary) - More energetic than Emerald
                    greenLight: '#E0F9F1',  // Very soft mint for backgrounds
                    greenDark: '#00A87E',   // Darker mint for hover states

                    orange: '#FF844B',      // Coral/Orange (Secondary) - Warm and friendly
                    orangeLight: '#FFF1EB', // Soft coral for alerts/cards

                    dark: '#1E293B',        // Slate 800 - Good for text
                    gray: '#F8FAFC',        // Slate 50 - Cleaner background
                    card: '#FFFFFF',        // Pure white for cards with shadow
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Smooth shadow
                'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
            }
        }
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
