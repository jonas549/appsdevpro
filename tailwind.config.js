/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Public site accent (unchanged)
        accent: '#4361EE',
        'accent-hover': '#3451D1',
        primary: '#EDF0FF',
        // Admin design system
        'adm-primary': '#2346d5',
        'adm-primary-container': '#4361ee',
        'adm-surface': '#fbf8ff',
        'adm-background': '#fbf8ff',
        'adm-on-surface': '#1a1b23',
        'adm-on-surface-variant': '#444655',
        'adm-surface-container': '#eeedf9',
        'adm-surface-container-high': '#e8e7f3',
        'adm-outline': '#747686',
        'adm-outline-variant': '#c4c5d7',
        'adm-error': '#ba1a1a',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
