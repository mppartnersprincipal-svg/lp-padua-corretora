"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Globals } from "@react-spring/web";

const HEADER_OFFSET = -88;
const SCROLL_LERP = 0.1;

let lenisInstance: Lenis | null = null;

/** Acesso ao Lenis para pausar a rolagem (ex.: menu mobile aberto). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function SmoothScroll(): null {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Respeita o sistema: desliga todas as molas do react-spring
    Globals.assign({ skipAnimation: prefersReducedMotion });
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: SCROLL_LERP,
      anchors: { offset: HEADER_OFFSET },
    });
    lenisInstance = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
