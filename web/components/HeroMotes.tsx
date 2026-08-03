"use client";

import { useEffect } from "react";

interface Mote {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  a: number;
  p: number;
  sp: number;
}

/**
 * Drifting Qi motes behind the home page hero.
 *
 * Ported from site.js initMotes(). Renders nothing: the <canvas> it drives
 * lives inside the hero markup (see lib/home/hero.ts), so this only finds it
 * and animates it — wrapping the hero's absolutely positioned children in a
 * React element would disturb the layout.
 *
 * Respects prefers-reduced-motion, and stops the loop entirely when the tab is
 * hidden rather than burning a frame budget nobody is watching.
 */
export function HeroMotes() {
  useEffect(() => {
    const found = document.querySelector<HTMLCanvasElement>("canvas.hero-motes");
    if (!found) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const context = found.getContext("2d");
    if (!context) return;

    // Bound after the guards so the helpers below close over non-nullable
    // values — narrowing does not survive into a hoisted function declaration.
    const canvas = found;
    const ctx = context;

    let motes: Mote[] = [];
    let raf: number | null = null;
    let w = 0;
    let h = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const n = Math.round(Math.min(70, Math.max(24, w / 18)));
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vy: -(0.1 + Math.random() * 0.34),
        vx: (Math.random() - 0.5) * 0.18,
        a: 0.16 + Math.random() * 0.55,
        p: Math.random() * Math.PI * 2,
        sp: 0.006 + Math.random() * 0.018,
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.p += m.sp;
        m.y += m.vy;
        m.x += m.vx + Math.sin(m.p) * 0.22;
        if (m.y < -12) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        if (m.x < -12) m.x = w + 10;
        if (m.x > w + 12) m.x = -10;

        const pulse = m.a * (0.62 + 0.38 * Math.sin(m.p * 1.7));
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
        g.addColorStop(0, `rgba(246, 215, 123, ${pulse.toFixed(3)})`);
        g.addColorStop(0.4, `rgba(224, 180, 76, ${(pulse * 0.32).toFixed(3)})`);
        g.addColorStop(1, "rgba(224, 180, 76, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    size();
    seed();
    frame();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        size();
        seed();
      }, 160);
    };
    const onVisibility = () => {
      if (document.hidden) {
        if (raf !== null) cancelAnimationFrame(raf);
        raf = null;
      } else if (raf === null) {
        frame();
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
