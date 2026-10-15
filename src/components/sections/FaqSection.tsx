import { MessageCircleQuestion } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { buildFaqSchema, JsonLd } from "@/components/seo/JsonLd";
import { Accordion, type FaqItem } from "@/components/ui/Accordion";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface FaqSectionProps {
  items: FaqItem[];
  /** Sufixo do cta_id do botão de WhatsApp (ex.: home, auto) */
  ctaSuffix: string;
}

export function FaqSection({ items, ctaSuffix }: FaqSectionProps) {
  return (
    <section id="perguntas-frequentes" aria-labelledby="faq-title" className="section-y">
      <JsonLd data={buildFaqSchema(items)} />
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow="Perguntas frequentes"
            title={
              <>
                Tire suas dúvidas <Highlight>antes de contratar</Highlight>
              </>
            }
          />
          <Reveal delay={120}>
            <div className="flex flex-col gap-4 rounded-2xl bg-navy p-6 text-cream sm:p-7">
              <span className="flex items-center gap-3 font-semibold">
                <MessageCircleQuestion className="size-5 text-gold" aria-hidden="true" />
                Não encontrou sua resposta?
              </span>
              <p className="text-sm leading-relaxed text-slate-light">
                Pergunte direto para quem entende. Respondemos pelo WhatsApp, sem compromisso.
              </p>
              <WhatsAppButton ctaId={`cta_whatsapp_faq_${ctaSuffix}`} label="Perguntar no WhatsApp" className="self-start" />
            </div>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
