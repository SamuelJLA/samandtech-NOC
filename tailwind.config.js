/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Fondos estilo SaaS Enterprise
        'space-cadet': '#020617',
        'slate-dark': '#0f172a',
        'slate-border': '#1e293b',
        // Acentos Cyber-Ops
        'neon-cyan': '#22d3ee',
        'neon-emerald': '#10b981',
        'neon-rose': '#f43f5e',
      },
      fontFamily: {
        // Una fuente limpia para datos y una mono para logs
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}