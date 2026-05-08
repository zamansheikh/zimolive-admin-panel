import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // `--font-sans` is wired in app/layout.tsx via next/font (Inter).
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand palette derived from the Zimo logo: warm pink/magenta as the
        // primary, with the full orange→pink→purple gradient as the hero
        // background. Pink is chosen as the swatch because it sits in the
        // middle of the gradient and reads well on white surfaces.
        brand: {
          DEFAULT: '#E91E63',
          50: '#FFF1F5',
          100: '#FFE4EC',
          200: '#FFC9DA',
          300: '#FF9CBA',
          400: '#FF6595',
          500: '#FF2E72',
          600: '#E91E63',
          700: '#BC1349',
          800: '#8E0D38',
          900: '#650825',
          light: '#FF6595',
          dark: '#8E0D38',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        'card': '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 8px 24px -8px rgb(15 23 42 / 0.08)',
      },
      backgroundImage: {
        // Mirrors the logo's orange → red → pink → purple sweep.
        'brand-gradient':
          'linear-gradient(135deg, #FF8A3D 0%, #FF3D7F 35%, #D63DFF 70%, #8B3DFF 100%)',
        'mesh-gradient':
          'radial-gradient(at 20% 0%, #FFE4EC 0px, transparent 50%), radial-gradient(at 80% 0%, #F3D6FF 0px, transparent 50%), radial-gradient(at 0% 100%, #FFD7B5 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
