import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arc: {
          0: "#18181B", // Black / Background dark
          1: "#2563EB", // Blue
          2: "#DC2626", // Red
          3: "#16A34A", // Green
          4: "#EAB308", // Yellow
          5: "#6B7280", // Grey
          6: "#C026D3", // Magenta
          7: "#EA580C", // Orange
          8: "#0D9488", // Teal
          9: "#881337", // Maroon
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
