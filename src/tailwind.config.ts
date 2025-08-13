
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        allura: ['var(--font-allura)', 'cursive'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
       boxShadow: {
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'text-shadow-lg': '0 2px 10px rgb(0 0 0 / 0.5)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'flash-green': {
          '0%, 100%': { boxShadow: '0 0 0 0px hsl(var(--primary) / 0)' },
          '50%': { boxShadow: '0 0 4px 2px hsl(var(--chart-1) / 0.7)' },
        },
        'flash-red': {
          '0%, 100%': { boxShadow: '0 0 0 0px hsl(var(--destructive) / 0)' },
          '50%': { boxShadow: '0 0 4px 2px hsl(var(--destructive) / 0.7)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'border-pulse': {
          '0%, 100%': { 'border-color': 'hsl(var(--primary) / 0.5)' },
          '50%': { 'border-color': 'hsl(var(--accent) / 0.7)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'cue-stick-aim-subtle': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-5px)' },
        },
        'cue-stick-release': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '20%': { transform: 'translateX(var(--shot-power-release))', opacity: '1' },
          '100%': { transform: 'translateX(var(--shot-power-release))', opacity: '0' },
        },
        '8-ball-sink': {
            '0%': { transform: 'translateY(-50%) scale(1)', opacity: '1' },
            '100%': { transform: 'translateY(200%) scale(0.5)', opacity: '0' },
        },
        'tumble': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '25%': { transform: 'scale(1.2) rotate(90deg)', opacity: '0.8' },
          '50%': { transform: 'scale(0.8) rotate(-90deg)', opacity: '0.8' },
          '75%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'flash-green': 'flash-green 0.7s ease-in-out',
        'flash-red': 'flash-red 0.7s ease-in-out',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'border-pulse': 'border-pulse 2s infinite',
        'fade-out': 'fade-out 4s ease-out forwards',
        'cue-stick-aim-subtle': 'cue-stick-aim-subtle 1.5s ease-in-out infinite',
        'cue-stick-release': 'cue-stick-release 0.3s ease-out forwards',
        '8-ball-sink': '8-ball-sink 1s ease-in forwards 1s',
        'tumble': 'tumble 0.5s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
