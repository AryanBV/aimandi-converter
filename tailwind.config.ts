import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'float': 'float 20s linear infinite',
        'containerFloat': 'containerFloat 6s ease-in-out infinite',
        'borderPulse': 'borderPulse 4s ease-in-out infinite',
        'statusPulse': 'statusPulse 1.5s ease-in-out infinite',
        'cardSlideIn': 'cardSlideIn 0.4s ease',
        'slideInRight': 'slideInRight 0.3s ease',
        'slideOutRight': 'slideOutRight 0.3s ease',
        'uploadBounce': 'bounce 2s infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-30px) rotate(180deg)',
            opacity: '0.7',
          },
        },
        containerFloat: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateX(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-10px) rotateX(2deg)' 
          },
        },
        borderPulse: {
          '0%, 100%': { 
            opacity: '0.3' 
          },
          '50%': { 
            opacity: '0.6' 
          },
        },
        statusPulse: {
          '0%, 100%': { 
            opacity: '1' 
          },
          '50%': { 
            opacity: '0.7' 
          },
        },
        cardSlideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideOutRight: {
          from: {
            transform: 'translateX(0)',
            opacity: '1',
          },
          to: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        bounce: {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0,0,0)',
          },
          '40%, 43%': {
            transform: 'translate3d(0, -10px, 0)',
          },
          '70%': {
            transform: 'translate3d(0, -5px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -2px, 0)',
          },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-warning': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      },
      backdropBlur: {
        '20': '20px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
};

export default config;