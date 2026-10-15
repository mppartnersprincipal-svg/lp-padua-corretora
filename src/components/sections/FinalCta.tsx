import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface FinalCtaProps {
  /** Âncora do formulário da página (#cotacao) ou /#cotacao */
  quoteHref: string;
  ctaSuffix: string;
  title?: string;
  description?: string;
}

export function FinalCta({
  quoteHref,
  ctaSuffix,
  title = "Vamos encontrar o seguro certo para você?",
  description = "Faça sua cotação em menos de 1 minuto. A Pádua compara, explica e acompanha você do começo ao fim.",
}: FinalCtaProps) {
  return (
    <section id="cta-final" aria-labelledby="cta-final-title" className="relative isolate overflow-hidden bg-navy-deep">
      <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[55%]">
        <Image
          src="/images/familia-carro.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-[60%_center]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-navy-deep/88 lg:bg-transparent lg:bg-[linear-gradient(90deg,var(--cor-primaria-profunda)_42%,rgb(12_24_48/0.6)_62%,rgb(12_24_48/0.1)_100%)]"
      />
      <div className="container-site section-y">
        <Reveal className="flex max-w-xl flex-col gap-6">
          <Eyebrow onDark>Cotação gratuita</Eyebrow>
          <h2
            id="cta-final-title"
            className="text-[clamp(2rem,1.3rem+2.8vw,3.4rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance text-cream"
          >
            {title}
          </h2>
          <p className="text-lg leading-relaxed text-slate-light">{description}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              href={quoteHref}
              size="lg"
              icon={<ArrowRight className="size-5" />}
              data-track="click_cta"
              data-cta-id={`cta_cotar_final_${ctaSuffix}`}
            >
              Fazer cotação
            </Button>
            <WhatsAppButton ctaId={`cta_whatsapp_final_${ctaSuffix}`} variant="outline-light" size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
