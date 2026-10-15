import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "gold" | "navy" | "cream" | "outline-light" | "outline-dark";
type ButtonSize = "md" | "lg";

interface ButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

const BASE =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-xl font-semibold whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-out " +
  "hover:scale-[1.03] active:scale-[0.98] motion-reduce:hover:scale-100";

const VARIANTS: Record<ButtonVariant, string> = {
  gold: "bg-gold text-navy-deep shadow-[0_1px_0_rgb(255_255_255/0.25)_inset] hover:bg-gold-light hover:shadow-gold",
  navy: "bg-navy text-cream hover:bg-navy-soft hover:shadow-lift",
  cream: "bg-cream text-navy hover:bg-white hover:shadow-lift",
  "outline-light": "border border-cream/30 text-cream hover:border-gold hover:bg-white/5 hover:text-gold-light",
  "outline-dark": "border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-cream",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-[15px]",
  lg: "min-h-14 px-7 text-base",
};

const EXTERNAL_PATTERN = /^(https?:|mailto:|tel:)/;

/** Link com cara de botão (todos os CTAs do site são navegação). */
export function Button({
  href,
  variant = "gold",
  size = "md",
  icon,
  iconPosition = "end",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const iconNode = icon ? (
    <span
      aria-hidden="true"
      className={iconPosition === "end" ? "transition-transform duration-300 group-hover:translate-x-1" : ""}
    >
      {icon}
    </span>
  ) : null;
  const content = (
    <>
      {iconPosition === "start" && iconNode}
      {children}
      {iconPosition === "end" && iconNode}
    </>
  );

  if (EXTERNAL_PATTERN.test(href)) {
    const opensNewTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
