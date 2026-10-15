import Image from "next/image";
import { ArrowRight, Check, Headset } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_POINTS } from "@/lib/content/home";

interface WhyPaduaProps {
  /** Esconde o botão "Conheça a Pádua" (usado na própria página Sobre) */
  showAboutLink?: boolean;
}

export function WhyPadua({ showAboutLink = true }: WhyPaduaProps) {
  return (
    <section id="por-que-a-padua" aria-labelledby="porque-title" className="section-y relative overflow-hidden bg-sand">
      <div className="container-site grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 pb-10 lg:order-1 lg:pb-0">
          <div aria-hidden="true" className="dot-grid absolute -top-6 -left-4 h-32 w-32 opacity-50" />
          <Reveal className="relative w-[86%]">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-lift sm:aspect-5/4 lg:aspect-4/5">
              <Image
                src="/images/atendimento.webp"
                alt="Atendente da corretora sorrindo ao telefone com um cliente"
                fill
                sizes="(min-width: 1024px) 480px, 86vw"
                className="object-cover object-[62%_center]"
              />
            </div>
          </Reveal>
          <Reveal delay={160} y={44} className="absolute right-0 -bottom-2 w-[46%]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border-[6px] border-sand shadow-lift">
              <Image
                src="/images/consultoria.webp"
                alt="Corretora apertando a mão de uma cliente após a reunião"
                fill
                sizes="(min-width: 1024px) 260px, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={320} x={24} y={0} className="absolute top-8 right-0 sm:right-6 lg:-right-4">
            <div className="flex animate-float items-center gap-3 rounded-2xl bg-navy px-5 py-4 text-cream shadow-lift">
              <span className="grid size-10 place-items-center rounded-full bg-gold/15 text-gold">
                <Headset className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">Atendimento humano</span>
                <span className="text-xs text-slate-light">do primeiro contato ao sinistro</span>
              </span>
            </div>
          </Reveal>
        </div>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <SectionHeading
            id="porque-title"
            eyebrow="Por que a Pádua"
            title={
              <>
                Seguro bom é o que <Highlight>funciona quando você precisa</Highlight>
              </>
            }
            description="Trabalhamos com várias seguradoras para comparar preços e coberturas. Mas o que faz diferença é o depois: renovação, alterações e, principalmente, a hora do sinistro."
          />
          <ul className="flex flex-col gap-4">
            {WHY_POINTS.map((point, index) => (
              <Reveal as="li" key={point} delay={index * 80} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold text-navy-deep">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="leading-relaxed text-navy">{point}</span>
              </Reveal>
            ))}
          </ul>
          {showAboutLink && (
            <Reveal>
              <Button
                href="/sobre"
                variant="outline-dark"
                icon={<ArrowRight className="size-4" />}
                data-track="click_cta"
                data-cta-id="cta_sobre"
              >
                Conheça a Pádua
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
