"use client";

import { animated, easings, useInView, useSpring } from "@react-spring/web";

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/** Número que conta de 0 até o valor quando aparece na tela. */
export function Counter({ to, prefix = "", suffix = "", durationMs = 1600, className }: CounterProps) {
  const [ref, isInView] = useInView({ once: true });
  const { value } = useSpring({
    value: isInView ? to : 0,
    config: { duration: durationMs, easing: easings.easeOutCubic },
  });
  const finalLabel = `${prefix}${to}${suffix}`;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{finalLabel}</span>
      <animated.span aria-hidden="true">
        {value.to((current) => `${prefix}${Math.round(current)}${suffix}`)}
      </animated.span>
    </span>
  );
}
