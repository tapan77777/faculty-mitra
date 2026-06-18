import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0A2E2A",
          teal: "#0D9488",
          mint: "#CCFBF1",
          seafoam: "#5EEAD4",
        },
        stripe: {
          navy: '#0A2540',
          gray: '#425466',
          light: '#8898AA',
          bg: '#F6F9FC',
          border: '#E3E8EE',
          indigo: '#635BFF',
          indigoDark: '#5851DB',
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
