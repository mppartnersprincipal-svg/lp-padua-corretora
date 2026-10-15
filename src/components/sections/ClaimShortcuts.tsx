import { ArrowUpRight } from "lucide-react";
import { ShieldMark } from "@/components/layout/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CLAIM_SHORTCUTS } from "@/lib/content/shared";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ClaimShortcutsProps {
  /** Espaçamento: por padrão só embaixo (vem logo depois de uma seção clara) */
  className?: string;
}

/** "Como podemos cuidar de você?" — atalhos de pós-venda, no padrão das grandes seguradoras. */
export function ClaimShortcuts({ className = "pb-18 lg:pb-28" }: ClaimShortcutsProps) {
  return (
    <section id="sinistro" aria-labelledby="sinistro-title" className={className}>
      <div className="container-site">
        <Reveal y={40}>
          <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[2rem] bg-navy px-6 py-12 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-14 lg:py-16">
            <ShieldMark variant="white" className="absolute -top-16 -left-20 -z-10 w-80 opacity-[0.04]" />
            <div className="flex flex-col gap-5">
              <Eyebrow onDark>Pós-venda</Eyebrow>
              <h2
                id="sinistro-title"
                className="text-[clamp(1.75rem,1.2rem+2vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance text-cream"
              >
                Precisa acionar o seguro? <span className="text-gold">A gente resolve com você.</span>
              </h2>
              <p className="leading-relaxed text-slate-light">
                Na hora do imprevisto, você não fica sozinho com a seguradora. Fale com a Pádua e cuidamos de
                cada passo.
              </p>
            </div>

            <ul className="grid gap-3">
              {CLAIM_SHORTCUTS.map(({ icon: Icon, title, description, ctaId, message }) => (
                <li key={ctaId}>
                  <a
                    href={buildWhatsAppUrl(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={ctaId}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 transition-[border-color,background-color] duration-300 hover:border-gold/60 hover:bg-white/6"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="font-semibold text-cream">{title}</span>
                      <span className="text-sm leading-relaxed text-slate-light">{description}</span>
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
