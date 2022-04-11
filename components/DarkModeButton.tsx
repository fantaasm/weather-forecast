import { useTheme } from "next-themes";

/**
 * Generic dark mode toggle button
 */
const DarkModeButton = (): JSX.Element => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="text-2xl sm:text-3xl text-yellow-400 dark:text-yellow-300 focus:outline-none"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};

export default DarkModeButton;
