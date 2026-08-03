"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MenuIcon } from "./Icons";

interface DrawerState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<DrawerState>({ open: false, setOpen: () => {}, toggle: () => {} });

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Stop the page behind the drawer from scrolling with it.
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo<DrawerState>(
    () => ({ open, setOpen, toggle: () => setOpen((o) => !o) }),
    [open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDrawer() {
  return useContext(Ctx);
}

export function MenuButton({ label }: { label: string }) {
  const { open, toggle } = useDrawer();
  return (
    <button
      type="button"
      className="icon-btn menu-toggle"
      aria-label={label}
      aria-expanded={open}
      aria-controls="sidebar"
      onClick={toggle}
    >
      <MenuIcon />
    </button>
  );
}

/**
 * The <aside> shell plus its scrim.
 *
 * The scrim MUST render inside .layout. That element is `position: relative;
 * z-index: 1`, i.e. a stacking context — a scrim outside it paints over the
 * whole layout including the drawer and swallows every tap aimed at the nav.
 * Its `position: fixed; display: none` also has to live outside any media
 * query, or it becomes a fourth grid item and collapses the desktop columns.
 * Both traps have bitten this site before; the CSS carries the fix.
 */
export function SidebarFrame({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const { open, setOpen } = useDrawer();
  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <div className={`scrim${open ? " is-open" : ""}`} onClick={close} aria-hidden="true" />
      <aside
        className={`sidebar${open ? " is-open" : ""}`}
        id="sidebar"
        aria-label={ariaLabel}
        // Closing here rather than on a pathname effect: tapping a link is the
        // event that should dismiss the drawer, and reacting to the route
        // change instead means a setState during render on every navigation.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a[href]")) close();
        }}
      >
        {children}
      </aside>
    </>
  );
}
