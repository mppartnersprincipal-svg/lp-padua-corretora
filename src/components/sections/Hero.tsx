import { ArrowRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { HERO_BADGES } from "@/lib/content/home";

export function Hero() {
  return (
    <section
      id="topo"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-navy-deep pt-[calc(var(--header-h)+40px)] pb-32 lg:pt-[calc(var(--header-h)+104px)] lg:pb-44"
    >
      <ParallaxImage
        src="/images/hero-home.webp"
        alt=""
        priority
        className="-z-20"
        imageClassName="object-[70%_center] lg:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_24_48/0.92)_0%,rgb(12_24_48/0.8)_45%,var(--cor-primaria-profunda)_100%)] lg:bg-[linear-gradient(100deg,var(--cor-primaria-profunda)_12%,rgb(12_24_48/0.86)_46%,rgb(12_24_48/0.4)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-navy-deep to-transparent"
      />
      <div aria-hidden="true" className="dot-grid absolute top-36 right-[6%] -z-10 hidden h-36 w-52 opacity-20 lg:block" />

      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="flex flex-col gap-7">
          <div className="enter" style={{ animationDelay: "0ms" }}>
            <Eyebrow onDark>Corretora de seguros · Auto e Empresarial</Eyebrow>
          </div>
          <div className="enter" style={{ animationDelay: "90ms" }}>
            <h1
              id="hero-title"
              className="text-[clamp(2.35rem,1.35rem+4.3vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance text-cream"
            >
              Seguro com quem <span className="text-gold">cuida de você</span> depois da assinatura.
            </h1>
          </div>
          <div className="enter" style={{ animationDelay: "180ms" }}>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-slate-light">
              A Pádua compara as seguradoras parceiras para encontrar o melhor custo-benefício para o seu carro
              ou a sua empresa. E continua do seu lado na renovação e no sinistro.
            </p>
          </div>
          <div className="enter flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "260ms" }}>
            <Button
              href="#cotacao"
              size="lg"
              icon={<ArrowRight className="size-5" />}
              data-track="click_cta"
              data-cta-id="cta_cotar_hero"
            >
              Fazer minha cotação
            </Button>
            <WhatsAppButton ctaId="cta_whatsapp_hero" variant="outline-light" size="lg" />
          </div>
          <div className="enter" style={{ animationDelay: "340ms" }}>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-white/10 pt-7 sm:grid-cols-4">
              {HERO_BADGES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm leading-snug text-cream/90">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="cotacao" className="scroll-mt-28">
          <div className="enter" style={{ animationDelay: "220ms" }}>
            <QuoteForm formId="form_hero_home" />
          </div>
        </div>
      </div>
    </section>
  );
}
