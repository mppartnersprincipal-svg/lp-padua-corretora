"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { getQuoteHref, NAV_ITEMS } from "@/lib/site";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useScrolledPast } from "@/lib/useScrolledPast";

const SCROLL_THRESHOLD = 24;

export function Header() {
  const pathname = usePathname();
  const isScrolled = useScrolledPast(SCROLL_THRESHOLD);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // Guarda a página em que o menu abriu: navegar (inclusive voltar) ou virar para desktop fecha o menu
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const isMenuOpen = menuOpenedAt === pathname && !isDesktop;
  const closeMenu = useCallback(() => setMenuOpenedAt(null), []);
  const quoteHref = getQuoteHref(pathname);
  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${
        isScrolled ? "lg:-translate-y-10" : ""
      }`}
    >
      <TopBar />
      <div
        className={`transition-[background-color,box-shadow] duration-500 ${
          isSolid
            ? "bg-navy-deep/90 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.55)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
          <Link href="/" aria-label="Pádua Corretora — página inicial" className="shrink-0">
            <Logo height={38} priority className="h-8 w-auto sm:h-[38px]" />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative px-4 py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-4 after:bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 ${
                        isActive
                          ? "text-gold after:scale-x-100"
                          : "text-cream/85 after:scale-x-0 hover:text-cream hover:after:scale-x-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* No mobile a MobileCtaBar já oferece "Fazer cotação" */}
            <div className="hidden sm:block">
              <Button href={quoteHref} data-track="click_cta" data-cta-id="cta_cotar_header">
                Cotar agora
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpenedAt(isMenuOpen ? null : pathname)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-mobile"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="grid size-12 place-items-center rounded-xl border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        pathname={pathname}
        quoteHref={quoteHref}
      />
    </header>
  );
}
