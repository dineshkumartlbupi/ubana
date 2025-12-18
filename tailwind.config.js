/** @type {import('tailwindcss').Config} */
export default   {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'soft-lg':
          '0 125px 35px 0 rgba(97,97,97,0), 0 80px 32px 0 rgba(97,97,97,0.01), 0 45px 27px 0 rgba(97,97,97,0.05), 0 20px 20px 0 rgba(97,97,97,0.09), 0 5px 11px 0 rgba(97,97,97,0.10)',
      },
      colors: {
        'indigo-glow': 'rgba(151, 158, 243, 0.6)',
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
};
