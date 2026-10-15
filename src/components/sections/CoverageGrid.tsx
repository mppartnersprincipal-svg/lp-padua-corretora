import { Info } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProductContent } from "@/lib/content/products";

interface CoverageGridProps {
  product: ProductContent;
}

const STAGGER_MS = 70;

export function CoverageGrid({ product }: CoverageGridProps) {
  return (
    <section id="coberturas" aria-labelledby="coberturas-title" className="section-y">
      <div className="container-site">
        <SectionHeading
          id="coberturas-title"
          eyebrow="Coberturas"
          title={product.coveragesTitle}
          description="Montamos a apólice com as coberturas que fazem sentido para você, e explicamos cada uma antes de contratar."
          className="mb-12 lg:mb-16"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {product.coverages.map(({ icon: Icon, title, description }, index) => (
            <Reveal as="li" key={title} delay={(index % 4) * STAGGER_MS}>
              <div className="group flex h-full flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-navy/8 transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-1 hover:bg-navy hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-xl bg-sand text-navy transition-colors duration-500 group-hover:bg-gold group-hover:text-navy-deep">
                  <Icon className="size-5.5" aria-hidden="true" />
                </span>
                <h3 className="text-lg leading-snug font-semibold text-navy transition-colors duration-500 group-hover:text-cream">
                  {title}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate transition-colors duration-500 group-hover:text-slate-light">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <p className="mt-8 flex items-start gap-2.5 text-sm leading-relaxed text-slate">
            <Info className="mt-0.5 size-4 shrink-0 text-gold-dark" aria-hidden="true" />
            As coberturas e assistências variam conforme a seguradora e o plano escolhido. A Pádua apresenta
            tudo por escrito antes da contratação.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
