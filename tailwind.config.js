/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        canvas: '#0a0a0f',
        surface: '#111118',
        panel: '#16161f',
        border: '#1e1e2e',
        accent: '#7c6af7',
        'accent-dim': '#4f3fcf',
        trigger: '#f97316',
        action: '#7c6af7',
        condition: '#10b981',
        output: '#ec4899',
        muted: '#3a3a4a',
        subtle: '#6b6b80',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
