import Link from "next/link";
import { Mail, MapPin, Siren } from "lucide-react";
import { SITE } from "@/lib/site";

/** Barra utilitária do topo (desktop), no padrão das grandes seguradoras. */
export function TopBar() {
  return (
    <div className="hidden h-10 border-b border-white/10 bg-navy-deep text-[13px] text-slate-light lg:block">
      <div className="container-site flex h-full items-center justify-between gap-6">
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 text-gold" aria-hidden="true" />
          Corretora de seguros com atendimento em todo o Brasil
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${SITE.email}`}
            data-track="click_email"
            className="flex items-center gap-2 transition-colors hover:text-cream"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            {SITE.email}
          </a>
          <Link
            href="/#sinistro"
            data-track="click_cta"
            data-cta-id="cta_topbar_sinistro"
            className="flex items-center gap-2 font-medium text-gold transition-colors hover:text-gold-light"
          >
            <Siren className="size-3.5" aria-hidden="true" />
            Sinistro e assistência
          </Link>
        </div>
      </div>
    </div>
  );
}
