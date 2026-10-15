import Link from "next/link";
import { Clock, Mail, MapPin } from "lucide-react";
import { Logo, ShieldMark } from "@/components/layout/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const FOOTER_COLUMNS = [
  {
    title: "Seguros",
    links: [
      { label: "Seguro Auto", href: "/seguro-auto" },
      { label: "Seguro Empresarial", href: "/seguro-empresarial" },
      { label: "Fazer cotação", href: "/#cotacao" },
      { label: "Sinistro e assistência", href: "/#sinistro" },
    ],
  },
  {
    title: "A Pádua",
    links: [
      { label: "Sobre a Pádua", href: "/sobre" },
      { label: "Contato", href: "/contato" },
      { label: "Perguntas frequentes", href: "/#perguntas-frequentes" },
      { label: "Política de privacidade", href: "/politica-de-privacidade" },
    ],
  },
];

const SOCIAL_LINK =
  "grid size-11 place-items-center rounded-full border border-white/15 text-cream transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold";

// Cache Components: valores do relógio precisam ser cacheados no prerender
async function getCopyrightYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCopyrightYear();

  return (
    <footer className="relative isolate overflow-hidden bg-navy-deep text-slate-light">
      <ShieldMark className="absolute -right-24 -bottom-32 -z-10 w-[420px] opacity-[0.025] lg:w-[560px]" />

      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:py-20">
        <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
          <Logo height={44} className="h-11 w-auto self-start" />
          <p className="max-w-xs leading-relaxed">
            Corretora de seguros com foco em atendimento: do primeiro contato ao pós-venda.
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${SITE.instagramHandle} (abre em nova aba)`}
              data-track="click_instagram"
              className={SOCIAL_LINK}
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Pádua (abre em nova aba)"
              data-cta="cta_whatsapp_footer"
              className={SOCIAL_LINK}
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-5 text-xs font-semibold tracking-[0.22em] text-gold uppercase">{column.title}</h2>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-5 text-xs font-semibold tracking-[0.22em] text-gold uppercase">Atendimento</h2>
          <ul className="flex flex-col gap-4">
            <li>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="cta_whatsapp_footer_contato"
                className="flex items-center gap-3 transition-colors hover:text-cream"
              >
                <WhatsAppIcon className="size-4 shrink-0 text-gold" />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                data-track="click_email"
                className="flex items-center gap-3 break-all transition-colors hover:text-cream"
              >
                <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-gold" aria-hidden="true" />
              {SITE.hours}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
              {SITE.address
                ? `${SITE.address.street} — ${SITE.address.city}/${SITE.address.state}`
                : "Atendimento em todo o Brasil"}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 pt-6 pb-28 text-xs leading-relaxed sm:pb-24 lg:flex-row lg:items-center lg:justify-between lg:pb-6">
          <p>
            © {year} {SITE.legalName} · CNPJ {SITE.cnpj} · SUSEP {SITE.susep}
          </p>
          <p className="text-slate-light/80">
            As coberturas seguem as condições gerais de cada seguradora. Consulte sempre a sua apólice.
          </p>
        </div>
      </div>
    </footer>
  );
}
