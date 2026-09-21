/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        inst: {
          navy: '#0F172A',
          darkBlue: '#1E3A8A',
          subBlue: '#2563EB',
          lightBlue: '#EFF6FF',
          accent: '#3B82F6',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          textMuted: '#64748B',
          textMain: '#0F172A',
          green: '#10B981',
          red: '#EF4444',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
