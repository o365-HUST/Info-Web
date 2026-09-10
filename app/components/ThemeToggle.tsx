"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-9 h-9 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.96] ${className}`}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
    >
      <Sun
        className={`absolute w-4 h-4 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
          isDark
            ? "opacity-0 scale-[0.25] blur-[4px] pointer-events-none"
            : "opacity-100 scale-100 blur-0"
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute w-4 h-4 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
          isDark
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-[0.25] blur-[4px] pointer-events-none"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
