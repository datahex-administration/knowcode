import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette pulled from KnowCode logo
        navy: {
          DEFAULT: "#0A1A35",
          50: "#eef2f9",
          900: "#0A1A35",
        },
        brand: {
          DEFAULT: "#2F6BFF",
          50: "#eef4ff",
          100: "#dbe6ff",
          400: "#5b9bff",
          500: "#2F6BFF",
          600: "#2356d6",
          700: "#1c45ab",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(10,26,53,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
