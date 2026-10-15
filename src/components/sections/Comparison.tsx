import { Check, Minus, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { COMPARISON_ROWS } from "@/lib/content/shared";

/** Seguro x proteção veicular: responde à concorrência das cooperativas por preço. */
export function Comparison() {
  return (
    <section id="seguro-ou-protecao" aria-labelledby="comparativo-title" className="section-y">
      <div className="container-site">
        <SectionHeading
          id="comparativo-title"
          align="center"
          eyebrow="Escolha consciente"
          title={
            <>
              Seguro ou proteção veicular? <Highlight>Entenda antes de decidir</Highlight>
            </>
          }
          description="Muita gente compara só o valor da mensalidade. Veja o que muda de verdade entre as duas opções."
          className="mb-12 lg:mb-16"
        />

        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl bg-navy p-7 text-cream shadow-lift sm:p-9">
              <div aria-hidden="true" className="absolute -top-20 -right-20 size-56 rounded-full bg-gold/10 blur-2xl" />
              <div className="relative mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-gold text-navy-deep">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold">Seguro com a Pádua</h3>
                </div>
                <span className="rounded-full border border-gold/50 px-3 py-1 text-xs font-semibold text-gold">
                  Recomendado
                </span>
              </div>
              <dl className="relative flex flex-col gap-5">
                {COMPARISON_ROWS.map((row) => (
                  <div key={row.topic} className="flex gap-3.5 border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                    <Check className="mt-1 size-4.5 shrink-0 text-gold" strokeWidth={2.5} aria-hidden="true" />
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">{row.topic}</dt>
                      <dd className="leading-relaxed text-cream/90">{row.insurance}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-navy/10 sm:p-9">
              <div className="mb-8 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-sand text-slate">
                  <Users className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold text-navy">Proteção veicular</h3>
              </div>
              <dl className="flex flex-col gap-5">
                {COMPARISON_ROWS.map((row) => (
                  <div key={row.topic} className="flex gap-3.5 border-t border-navy/10 pt-5 first:border-t-0 first:pt-0">
                    <Minus className="mt-1 size-4.5 shrink-0 text-slate" strokeWidth={2.5} aria-hidden="true" />
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs font-semibold tracking-[0.18em] text-slate uppercase">{row.topic}</dt>
                      <dd className="leading-relaxed text-slate">{row.association}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate">
            Comparativo geral e informativo. As regras variam conforme cada seguradora e cada associação: leia
            sempre as condições antes de contratar. Ficou com dúvida? A gente explica sem compromisso.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
