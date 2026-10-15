import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { buildBreadcrumbSchema, JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { GENERAL_FAQ } from "@/lib/content/shared";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Contato",
  description:
    "Fale com a Pádua Corretora pelo WhatsApp, e-mail ou Instagram. Atendimento em todo o Brasil e cotação de seguro auto e empresarial em até 1 hora.",
  path: "/contato",
});

interface ChannelCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  trackingProps?: Record<string, string>;
}

function ChannelCard({ icon, label, value, href, trackingProps = {} }: ChannelCardProps) {
  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-sand text-navy transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs font-semibold tracking-[0.18em] text-gold-dark uppercase">{label}</span>
        <span className="font-semibold [overflow-wrap:anywhere] text-navy">{value}</span>
      </span>
      {href && (
        <ArrowUpRight
          className="size-5 shrink-0 text-slate transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );
  const classes =
    "group flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-navy/8 transition-[box-shadow,transform] duration-300";

  if (!href) return <div className={classes}>{content}</div>;
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      className={`${classes} hover:-translate-y-0.5 hover:shadow-card`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...trackingProps}
    >
      {content}
    </a>
  );
}

export default function ContatoPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema("Contato", "/contato")} />
      <PageHero
        breadcrumb="Contato"
        eyebrow="Fale com a Pádua"
        title={
          <>
            Vamos conversar sobre o seu <span className="text-gold">seguro</span>?
          </>
        }
        description="Atendemos pelo WhatsApp em todo o Brasil. Escolha o canal que preferir ou faça sua cotação agora mesmo."
      />

      <section id="canais" aria-labelledby="canais-title" className="section-y">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="flex flex-col gap-4">
            <h2 id="canais-title" className="mb-2 text-2xl font-semibold text-navy">
              Canais de atendimento
            </h2>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="cta_whatsapp_contato"
              className="group flex items-center gap-4 rounded-2xl bg-navy p-6 text-cream shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-gold text-navy-deep">
                <WhatsAppIcon className="size-7" />
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                  WhatsApp · canal principal
                </span>
                <span className="text-lg font-semibold">{SITE.phoneDisplay}</span>
              </span>
              <ArrowUpRight className="size-5 shrink-0 text-gold" aria-hidden="true" />
            </a>
            <ChannelCard
              icon={<Mail className="size-5" aria-hidden="true" />}
              label="E-mail"
              value={SITE.email}
              href={`mailto:${SITE.email}`}
              trackingProps={{ "data-track": "click_email" }}
            />
            <ChannelCard
              icon={<InstagramIcon className="size-5" />}
              label="Instagram"
              value={SITE.instagramHandle}
              href={SITE.instagramUrl}
              trackingProps={{ "data-track": "click_instagram" }}
            />
            <ChannelCard icon={<Clock className="size-5" aria-hidden="true" />} label="Horário" value={SITE.hours} />
            <ChannelCard
              icon={<MapPin className="size-5" aria-hidden="true" />}
              label="Onde atendemos"
              value={
                SITE.address
                  ? `${SITE.address.street} — ${SITE.address.city}/${SITE.address.state}`
                  : "Todo o Brasil, de forma digital"
              }
            />
          </Reveal>

          <div id="cotacao" className="scroll-mt-28">
            <Reveal delay={120}>
              <QuoteForm formId="form_contato" title="Peça sua cotação" />
            </Reveal>
          </div>
        </div>
      </section>

      <FaqSection items={GENERAL_FAQ} ctaSuffix="contato" />
    </>
  );
}
