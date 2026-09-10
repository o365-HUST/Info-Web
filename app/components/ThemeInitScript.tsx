"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/app/lib/theme";

const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t!=="light"&&t!=="dark")t="dark";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add("dark");}})();`;

const emptySubscribe = () => () => {};

/**
 * Emits the FOUC-prevention script only on the server render and the matching
 * hydration pass. React 19 warns if a <script> is created during a client
 * render (those scripts never execute), so we drop the tag after hydration.
 */
export default function ThemeInitScript() {
  const isServerRender = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  );

  if (!isServerRender) return null;

  return (
    <script
      id="o365-theme-init"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
