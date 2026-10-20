"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animated, useTrail, useTransition } from "@react-spring/web";
import { ArrowUpRight, Mail } from "lucide-react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NAV_ITEMS, SITE } from "@/lib/site";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  quoteHref: string;
}

export function MobileMenu({ isOpen, onClose, pathname, quoteHref }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: "translate3d(0, -12px, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0px, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -12px, 0)" },
    config: { tension: 260, friction: 28 },
  });

  const trail = useTrail(NAV_ITEMS.length, {
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translate3d(0, 0px, 0)" : "translate3d(0, 16px, 0)",
    delay: isOpen ? 80 : 0,
    config: { tension: 240, friction: 26 },
  });

  // Trava a rolagem, isola o conteúdo de trás (inert), fecha no Esc e cuida do foco
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = [document.getElementById("conteudo"), document.querySelector("footer")];

    root.style.overflow = "hidden";
    background.forEach((element) => element?.setAttribute("inert", ""));
    getLenis()?.stop();
    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      background.forEach((element) => element?.removeAttribute("inert"));
      getLenis()?.start();
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  return transitions(
    (style, isVisible) =>
      isVisible && (
        <animated.div
          id="menu-mobile"
          style={style}
          className="fixed inset-x-0 top-(--header-h) bottom-0 overflow-y-auto bg-navy-deep lg:hidden"
          data-lenis-prevent=""
          data-section="menu"
        >
          <nav aria-label="Menu mobile" className="container-site flex min-h-full flex-col gap-10 pt-8 pb-12">
            <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {trail.map((itemStyle, index) => {
                const item = NAV_ITEMS[index];
                const isActive = pathname === item.href;
                return (
                  <animated.li key={item.href} style={itemStyle}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-16 items-center justify-between text-2xl font-semibold ${
                        isActive ? "text-gold" : "text-cream"
                      }`}
                    >
                      {item.label}
                      <ArrowUpRight className="size-5 text-gold" aria-hidden="true" />
                    </Link>
                  </animated.li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3">
              <Button
                href={quoteHref}
                variant="cream"
                size="lg"
                onClick={onClose}
                data-track="click_cta"
                data-cta-id="cta_cotar_menu"
              >
                Fazer cotação
              </Button>
              <WhatsAppButton ctaId="cta_whatsapp_menu" size="lg" />
            </div>

            <a
              href={`mailto:${SITE.email}`}
              data-track="click_email"
              className="mt-auto flex items-center gap-2 text-sm text-slate-light"
            >
              <Mail className="size-4 text-gold" aria-hidden="true" />
              {SITE.email}
            </a>
          </nav>
        </animated.div>
      ),
  );
}
