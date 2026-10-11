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
        slate: {
          850: '#151c2c',
          925: '#0b0f19',
          950: '#070a12',
        },
        wisteria: {
          DEFAULT: '#D3D3FF',
          50: '#f7f7ff',
          100: '#ececff',
          200: '#dedeff',
          300: '#D3D3FF',
          400: '#b4b4ff',
          500: '#9494ff',
          dim: 'rgba(211, 211, 255, 0.08)',
          glow: 'rgba(211, 211, 255, 0.25)',
        },
        cherry: {
          DEFAULT: '#FFB7C5',
          50: '#fff5f7',
          100: '#ffebf0',
          200: '#ffd6e1',
          300: '#FFB7C5',
          400: '#ff8da5',
          500: '#ff668a',
          dim: 'rgba(255, 183, 197, 0.08)',
          glow: 'rgba(255, 183, 197, 0.25)',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
