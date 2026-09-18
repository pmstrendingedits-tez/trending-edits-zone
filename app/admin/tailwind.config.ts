import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink:"#101014", violet:"#8b5cf6", cyan:"#22d3ee" } } }, plugins: [] };
export default config;