import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#00ff88',
        'accent-dim': '#00cc6a',
        surface: '#0a0a0a',
        'surface-raised': '#111111',
        'surface-overlay': '#1a1a1a',
        border: '#222222',
        'border-bright': '#333333',
        muted: '#666666',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
