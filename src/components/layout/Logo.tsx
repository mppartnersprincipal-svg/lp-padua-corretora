import Image from "next/image";

// Proporção do viewBox do logo completo (1700 × 600)
const LOGO_RATIO = 1700 / 600;

interface LogoProps {
  variant?: "white" | "navy";
  height?: number;
  priority?: boolean;
  className?: string;
}

export function Logo({ variant = "white", height = 40, priority = false, className = "" }: LogoProps) {
  return (
    <Image
      src={`/brand/logo-full-${variant}.svg`}
      alt="Pádua Administradora e Corretora de Seguros"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      priority={priority}
      className={className}
    />
  );
}

interface ShieldMarkProps {
  className?: string;
  variant?: "gold" | "white" | "navy";
}

/** Escudo "PC" da marca, usado como marca d'água decorativa. */
export function ShieldMark({ className = "", variant = "gold" }: ShieldMarkProps) {
  return (
    <Image
      src={`/brand/logo-icon-${variant}.svg`}
      alt=""
      aria-hidden="true"
      width={500}
      height={571}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
