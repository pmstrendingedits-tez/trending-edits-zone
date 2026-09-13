import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        violetGlow: "#7c3aed",
        cyanGlow: "#06b6d4"
      },
      boxShadow: {
        glow: "0 0 45px rgba(124, 58, 237, .22)"
      }
    }
  },
  plugins: []
};

export default config;