"use client";

import type { CSSProperties, ReactNode } from "react";
import { animated, useInView, useSpring } from "@react-spring/web";

type RevealTag = "div" | "li" | "article" | "span";

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  /** Atraso em ms — use para escalonar itens de uma lista */
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
}

const TAGS = {
  div: animated.div,
  li: animated.li,
  article: animated.article,
  span: animated.span,
};

/** Entrada padrão do site: fade + slide-up quando o elemento entra na tela. */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  className,
  style,
}: RevealProps) {
  const [ref, isInView] = useInView({ once: true, rootMargin: "0px 0px -8% 0px" });
  const spring = useSpring({
    opacity: isInView ? 1 : 0,
    transform: isInView
      ? "translate3d(0px, 0px, 0px) scale(1)"
      : `translate3d(${x}px, ${y}px, 0px) scale(${scale})`,
    delay: isInView ? delay : 0,
    config: { tension: 170, friction: 26 },
  });
  const Tag = TAGS[as] as typeof animated.div;

  return (
    <Tag ref={ref} className={className} style={{ ...style, ...spring }} data-reveal="">
      {children}
    </Tag>
  );
}
