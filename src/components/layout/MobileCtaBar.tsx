"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getQuoteHref } from "@/lib/site";
import { useScrolledPast } from "@/lib/useScrolledPast";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const SHOW_AFTER_PX = 320;

/** Barra fixa de conversão no mobile: aparece depois que o visitante começa a rolar. */
export function MobileCtaBar() {
  const pathname = usePathname();
  const isVisible = useScrolledPast(SHOW_AFTER_PX);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-deep/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-lg transition-transform duration-500 ease-out lg:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      inert={!isVisible}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <Link
          href={getQuoteHref(pathname)}
          data-track="click_cta"
          data-cta-id="cta_cotar_barra_mobile"
          className="flex min-h-12 items-center justify-center rounded-xl border border-cream/25 text-[15px] font-semibold text-cream active:scale-[0.98]"
        >
          Fazer cotação
        </Link>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="cta_whatsapp_barra_mobile"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold text-[15px] font-semibold text-navy-deep active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
