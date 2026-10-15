import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  /** id do h2, para aria-labelledby da seção */
  id?: string;
  className?: string;
}

interface HighlightProps {
  children: ReactNode;
  onDark?: boolean;
}

/**
 * Destaque dentro de títulos. No navy vira dourado; no creme o dourado
 * não tem contraste, então o destaque vira um sublinhado dourado.
 */
export function Highlight({ children, onDark = false }: HighlightProps) {
  if (onDark) return <span className="text-gold">{children}</span>;
  return (
    <span className="bg-[linear-gradient(transparent_62%,rgb(185_151_91/0.38)_62%,rgb(185_151_91/0.38)_92%,transparent_92%)] box-decoration-clone">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  id,
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto items-center text-center" : "items-start text-left";
  const titleColor = onDark ? "text-cream" : "text-navy";
  const descriptionColor = onDark ? "text-slate-light" : "text-slate";

  return (
    <Reveal className={`flex max-w-3xl flex-col gap-5 ${alignment} ${className}`}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={`text-[clamp(1.9rem,1.25rem+2.4vw,3.1rem)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance ${titleColor}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`max-w-2xl text-base leading-relaxed text-pretty sm:text-lg ${descriptionColor}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
