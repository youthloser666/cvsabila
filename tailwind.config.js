/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: "#0066cc",
          "blue-focus": "#0071e3",
          ink: "#1d1d1f",
          "ink-muted": "#7a7a7a",
          "ink-80": "#333333",
          divider: "#f0f0f0",
          hairline: "#e0e0e0",
          canvas: "#ffffff",
          parchment: "#f5f5f7",
          pearl: "#fafafc",
          dark: "#272729",
          chip: "#d2d2d7",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px",
      },
      boxShadow: {
        apple: "0 4px 20px rgba(0, 0, 0, 0.06)",
        "apple-hover": "0 8px 30px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
