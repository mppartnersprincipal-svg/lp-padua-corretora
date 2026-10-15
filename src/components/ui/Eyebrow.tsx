import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** true quando está sobre fundo navy */
  onDark?: boolean;
  className?: string;
}

/** Filete dourado + rótulo em caixa alta, como no manual de marca. */
export function Eyebrow({ children, onDark = false, className = "" }: EyebrowProps) {
  const color = onDark ? "text-gold" : "text-gold-dark";
  return (
    <p
      className={`inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] uppercase sm:text-xs ${color} ${className}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-gold" />
      {children}
    </p>
  );
}
