import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0B0F17",
          card: "#131B2A",
          border: "#1E293B",
          accent: "#00F2FE",
          cyan: "#4FACFE",
          warning: "#FF9F43",
          danger: "#FF5252",
          success: "#10AC84",
          purple: "#7928CA",
        },
        canvas: "#06090F",
        panel: "#131B2A",
        line: "#1E293B",
        cyan: "#00F2FE",
        lime: "#10AC84",
        amber: "#FF9F43",
        danger: "#FF5252",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 26px rgba(84, 209, 220, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
