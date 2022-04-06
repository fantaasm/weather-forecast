module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto, sans-serif"],
      },
      colors: {
        lightPurple: "#BB86FC",
        dark: "#1A1A1A",
        "dark-el-1": "#2C2C2C", // dark elevated 1 step
      },
    },
  },
};
