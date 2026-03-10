import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AIOS Dark theme — near-black palette
        'mc-bg': '#111111',
        'mc-bg-secondary': '#222222',
        'mc-bg-tertiary': '#2a2a2a',
        'mc-border': '#3a3a3a',
        'mc-text': '#e8e8e8',
        'mc-text-secondary': '#999999',
        'mc-accent': '#0033FF',
        'mc-accent-green': '#3fb950',
        'mc-accent-yellow': '#d29922',
        'mc-accent-red': '#f85149',
        'mc-accent-purple': '#a371f7',
        'mc-accent-pink': '#db61a2',
        'mc-accent-cyan': '#39d353',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-instrument-serif)', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['SF Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
