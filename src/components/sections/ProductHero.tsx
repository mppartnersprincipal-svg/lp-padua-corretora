import { Check } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { QuoteForm } from "@/components/ui/QuoteForm";
import type { ProductContent } from "@/lib/content/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ProductHeroProps {
  product: ProductContent;
}

export function ProductHero({ product }: ProductHeroProps) {
  const { hero } = product;
  return (
    <section
      id="topo"
      aria-labelledby="produto-title"
      className="relative isolate overflow-hidden bg-navy-deep pt-[calc(var(--header-h)+32px)] pb-20 lg:pt-[calc(var(--header-h)+88px)] lg:pb-28"
    >
      <ParallaxImage src={hero.image} alt="" priority className="-z-20" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_24_48/0.9)_0%,rgb(12_24_48/0.82)_50%,var(--cor-primaria-profunda)_100%)] lg:bg-[linear-gradient(100deg,var(--cor-primaria-profunda)_14%,rgb(12_24_48/0.84)_48%,rgb(12_24_48/0.45)_100%)]"
      />

      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex flex-col gap-7">
          <div className="enter" style={{ animationDelay: "0ms" }}>
            <Breadcrumbs current={product.name} />
          </div>
          <div className="enter" style={{ animationDelay: "60ms" }}>
            <Eyebrow onDark>{hero.eyebrow}</Eyebrow>
          </div>
          <div className="enter" style={{ animationDelay: "130ms" }}>
            <h1
              id="produto-title"
              className="text-[clamp(2.25rem,1.35rem+3.9vw,4rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-cream"
            >
              {hero.title} <span className="text-gold">{hero.highlight}</span>
            </h1>
          </div>
          <div className="enter" style={{ animationDelay: "200ms" }}>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-slate-light">{hero.description}</p>
          </div>
          <div className="enter" style={{ animationDelay: "270ms" }}>
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {hero.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5 text-cream/90">
                  <span className="grid size-5 place-items-center rounded-full bg-gold text-navy-deep">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="enter" style={{ animationDelay: "330ms" }}>
            <p className="text-sm text-slate-light">
              Prefere conversar?{" "}
              <a
                href={buildWhatsAppUrl(`Olá, Pádua! Quero saber mais sobre o ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                data-cta={`cta_whatsapp_hero_${product.type}`}
                className="font-semibold text-gold underline-offset-4 hover:underline"
              >
                Chame a Pádua no WhatsApp
              </a>
            </p>
          </div>
        </div>

        <div id="cotacao" className="scroll-mt-28">
          <div className="enter" style={{ animationDelay: "220ms" }}>
            <QuoteForm
              formId={`form_hero_${product.type}`}
              defaultType={product.type}
              title={`Cotação de ${product.name}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
