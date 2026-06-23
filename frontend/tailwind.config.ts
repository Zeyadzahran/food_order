import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff3eb',
          100: '#ffe0ca',
          200: '#ffc29a',
          300: '#f59c68',
          400: '#ea7b42',
          500: '#d9652a',
          600: '#b64f1f',
          700: '#8f3d1a',
          800: '#6f3018',
          900: '#481f10',
        },
        surface: {
          50: '#fffdf8',
          100: '#f8f3ea',
          200: '#eee4d6',
          300: '#d8cab5',
          400: '#b6a58d',
          500: '#8d7d69',
          600: '#6b5f51',
          700: '#51483f',
          800: '#372f2b',
          900: '#221d1a',
          950: '#161210',
        },
        accent: {
          DEFAULT: '#2f6b5f',
          hover: '#25574d',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '6px',
        DEFAULT: '4px',
        md: '10px',
        lg: '16px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '36px',
        full: '9999px',
      },
      boxShadow: {
        solid: '0 16px 35px -18px rgba(34, 29, 26, 0.45)',
        'solid-accent': '0 18px 40px -18px rgba(47, 107, 95, 0.45)',
        card: '0 20px 55px -28px rgba(34, 29, 26, 0.32)',
        float: '0 12px 30px -18px rgba(217, 101, 42, 0.35)',
      }
    },
  },
  plugins: [],
} satisfies Config;
