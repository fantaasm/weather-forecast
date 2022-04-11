module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto, sans-serif"],
      },
      colors: {
        "dark": "#090909",
        "white-100": "#F5F6F7",
        "lightPurple": "#BB86FC",
        // dark: "#1A1A1A",
        "dark-el-1": "#2C2C2C", // dark elevated 1 step
      },
    },
  },
};
