"use client";

import { useCallback, useSyncExternalStore } from "react";
import { TaijiIcon } from "./Icons";
import { THEME_STORAGE_KEY } from "./ThemeScript";

const THEME_EVENT = "wiki:themechange";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function readTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Yin / Yang toggle.
 *
 * <html data-theme> is owned by the pre-paint snippet, not by React — setting
 * it here would reintroduce the flash that snippet exists to prevent. So the
 * attribute is treated as external state and read through
 * useSyncExternalStore, which stays correct through SSR and hydration without
 * a setState-in-effect round trip.
 */
export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as const);

  const toggle = useCallback(() => {
    const next = readTheme() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode — the theme just will not persist */
    }
    // Also what tells any client-rendered diagram to redraw in the new palette.
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  }, []);

  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label={label}
      title="Yin / Yang"
      aria-pressed={theme === "light"}
    >
      <TaijiIcon />
    </button>
  );
}
