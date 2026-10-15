import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProductContent } from "@/lib/content/products";

interface AudienceGridProps {
  product: ProductContent;
}

export function AudienceGrid({ product }: AudienceGridProps) {
  return (
    <section id="para-quem" aria-labelledby="para-quem-title" className="section-y">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionHeading
          id="para-quem-title"
          eyebrow="Para quem é"
          title={product.audienceTitle}
          description="Se você se encaixa em um destes perfis, a Pádua tem uma proposta pensada para você."
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {product.audience.map(({ icon: Icon, title, description }, index) => (
            <Reveal as="li" key={title} delay={index * 90}>
              <div className="group flex h-full gap-5 border-t border-navy/10 py-7">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/50 text-gold-dark transition-[background-color,color] duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold text-navy">{title}</h3>
                  <p className="leading-relaxed text-slate">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
