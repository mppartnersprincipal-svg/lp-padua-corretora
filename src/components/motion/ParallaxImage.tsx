"use client";

import Image from "next/image";
import { animated, useScroll } from "@react-spring/web";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface ParallaxImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Fração da rolagem aplicada à imagem (0.12 = move 12px a cada 100px) */
  strength?: number;
  className?: string;
  imageClassName?: string;
}

/** Imagem de fundo com parallax leve — só no desktop e sem reduced-motion. */
export function ParallaxImage({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  strength = 0.12,
  className = "",
  imageClassName = "",
}: ParallaxImageProps) {
  const isEnabled = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const { scrollY } = useScroll();
  const transform = isEnabled
    ? scrollY.to((value) => `translate3d(0, ${value * strength}px, 0)`)
    : "none";

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <animated.div className="absolute inset-x-0 -top-[12%] h-[124%]" style={{ transform }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
        />
      </animated.div>
    </div>
  );
}
