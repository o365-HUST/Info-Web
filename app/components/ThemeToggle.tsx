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
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.96] ${className}`}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
    >
      <span className="grid size-4 place-items-center" aria-hidden="true">
        <Sun
          className={`col-start-1 row-start-1 h-4 w-4 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
            isDark
              ? "pointer-events-none scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-0"
          }`}
          strokeWidth={2}
        />
        <Moon
          className={`col-start-1 row-start-1 h-4 w-4 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
            isDark
              ? "scale-100 opacity-100 blur-0"
              : "pointer-events-none scale-[0.25] opacity-0 blur-[4px]"
          }`}
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
