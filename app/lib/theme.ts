export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "o365-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveTheme(stored: Theme | null): Theme {
  return stored ?? "dark";
}

/** Apply theme class on <html> without smearing transitions (better-ui). */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const style = document.createElement("style");
  style.append(
    document.createTextNode("*,*::before,*::after{transition:none !important}")
  );
  document.head.append(style);

  root.classList.remove("light", "dark");
  root.classList.add(theme);

  void document.body?.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove());
  });
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}
