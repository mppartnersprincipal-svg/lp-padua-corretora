import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MANIFESTO, TESTIMONIALS } from "@/lib/content/home";

/**
 * Depoimentos reais quando existirem; até lá, o manifesto da marca
 * (nunca publicar depoimento inventado).
 */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    return (
      <section id="compromisso" aria-labelledby="compromisso-title" className="section-y relative overflow-hidden bg-sand">
        <div aria-hidden="true" className="dot-grid absolute right-[8%] bottom-10 h-28 w-40 opacity-40" />
        <div className="container-site">
          <Reveal>
            <figure className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-navy text-gold">
                <Quote className="size-7" aria-hidden="true" />
              </span>
              <h2 id="compromisso-title" className="sr-only">
                Nosso compromisso
              </h2>
              <blockquote>
                <p className="text-[clamp(1.6rem,1rem+2.4vw,2.7rem)] leading-snug font-medium tracking-[-0.015em] text-balance text-navy">
                  “{MANIFESTO.quote}”
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-gold-dark uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
                {MANIFESTO.author}
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="depoimentos" aria-labelledby="depoimentos-title" className="section-y bg-sand">
      <div className="container-site">
        <SectionHeading
          id="depoimentos-title"
          align="center"
          eyebrow="Depoimentos"
          title="Quem é cliente, indica"
          className="mb-12 lg:mb-16"
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.name} delay={index * 120}>
              <figure className="flex h-full flex-col gap-6 rounded-3xl bg-white p-8 shadow-card">
                <Quote className="size-8 text-gold" aria-hidden="true" />
                <blockquote className="flex-1 leading-relaxed text-navy">{testimonial.quote}</blockquote>
                <figcaption className="border-t border-navy/10 pt-5">
                  <p className="font-semibold text-navy">{testimonial.name}</p>
                  <p className="text-sm text-slate">{testimonial.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
