/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f7f1ea",
        bronze: "#f4d4a8",
      },
      boxShadow: {
        soft: "0 24px 48px -24px rgba(28, 25, 23, 0.25)",
      },
    },
  },
  plugins: [],
};
