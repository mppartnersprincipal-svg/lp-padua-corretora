"use client";

import type { ReactNode } from "react";
import { animated, easings, useInView, useSpring } from "@react-spring/web";

interface TimelineTrackProps {
  children: ReactNode;
}

/**
 * Lista ordenada com uma linha dourada que "se desenha" ao entrar na tela.
 * Horizontal no desktop, vertical no mobile. Os passos (<li>) vêm como children.
 */
export function TimelineTrack({ children }: TimelineTrackProps) {
  const [ref, isInView] = useInView({ once: true, rootMargin: "0px 0px -20% 0px" });
  const { progress } = useSpring({
    progress: isInView ? 1 : 0,
    config: { duration: 1400, easing: easings.easeInOutCubic },
  });

  return (
    <div ref={ref} className="relative">
      {/* Termina no centro do último ícone: 25% da largura − gap (24px) − meio ícone (28px) */}
      <span aria-hidden="true" className="absolute top-7 right-[calc(25%-52px)] left-7 hidden h-px bg-white/10 lg:block" />
      <animated.span
        aria-hidden="true"
        className="absolute top-7 right-[calc(25%-52px)] left-7 hidden h-px origin-left bg-gold lg:block"
        style={{ transform: progress.to((value) => `scaleX(${value})`) }}
      />
      <span aria-hidden="true" className="absolute top-7 bottom-7 left-7 w-px bg-white/10 lg:hidden" />
      <animated.span
        aria-hidden="true"
        className="absolute top-7 bottom-7 left-7 w-px origin-top bg-gold lg:hidden"
        style={{ transform: progress.to((value) => `scaleY(${value})`) }}
      />
      <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">{children}</ol>
    </div>
  );
}
