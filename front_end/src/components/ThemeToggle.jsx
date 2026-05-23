import { motion } from "framer-motion";
import { HiMoon, HiSun } from "react-icons/hi2";

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-slate-950/5 backdrop-blur transition hover:border-brand/40 hover:text-brand dark:bg-slate-900/70"
      aria-label="Toggle theme"
    >
      {isDark ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </motion.button>
  );
}
