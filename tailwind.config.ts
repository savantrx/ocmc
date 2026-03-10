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
        // AIOS Dark theme — warm charcoal palette
        'mc-bg': '#373737',
        'mc-bg-secondary': '#424242',
        'mc-bg-tertiary': '#4d4d4d',
        'mc-border': '#5a5a5a',
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
