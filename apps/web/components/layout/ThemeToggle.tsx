"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-2 w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
