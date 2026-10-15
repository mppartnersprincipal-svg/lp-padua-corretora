import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/lib/content/products";

const AUDIENCE_TAG = { auto: "Para você", empresarial: "Para sua empresa" } as const;

export function ProductCards() {
  return (
    <section id="seguros" aria-labelledby="seguros-title" className="section-y">
      <div className="container-site">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="seguros-title"
            eyebrow="Nossos seguros"
            title={
              <>
                Proteção para o que <Highlight>move a sua vida</Highlight> e o seu negócio
              </>
            }
          />
          <Reveal delay={120}>
            <p className="max-w-sm leading-relaxed text-slate">
              Duas especialidades e o mesmo cuidado: cotação comparada e acompanhamento de verdade depois da
              contratação.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {PRODUCTS.map((product, index) => {
            const Icon = product.icon;
            return (
              <Reveal key={product.slug} delay={index * 140} className="h-full">
                <Link
                  href={product.slug}
                  data-track="click_cta"
                  data-cta-id={`card_${product.type}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={product.card.image}
                      alt={product.card.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 600px, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-deep/55 via-transparent to-transparent" />
                    <span className="absolute top-5 left-5 rounded-full bg-cream/90 px-3.5 py-1.5 text-xs font-semibold text-navy backdrop-blur">
                      {AUDIENCE_TAG[product.type]}
                    </span>
                  </div>
                  <div className="relative flex flex-1 flex-col gap-5 p-7 pt-12 lg:p-9 lg:pt-14">
                    <span className="absolute -top-8 left-7 grid size-16 place-items-center rounded-2xl bg-navy text-gold shadow-lift ring-4 ring-white transition-transform duration-500 group-hover:-translate-y-1 lg:left-9">
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <h3 className="text-2xl font-semibold text-navy lg:text-[1.75rem]">{product.name}</h3>
                    <p className="leading-relaxed text-slate">{product.card.description}</p>
                    <ul className="flex flex-col gap-2.5">
                      {product.card.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-3 text-navy">
                          <Check className="size-4 shrink-0 text-gold-dark" strokeWidth={2.5} aria-hidden="true" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold text-navy">
                      Conhecer o {product.name}
                      <ArrowRight
                        className="size-4 text-gold-dark transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
