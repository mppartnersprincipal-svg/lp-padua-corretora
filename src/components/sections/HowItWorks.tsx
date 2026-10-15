import { ShieldMark } from "@/components/layout/Logo";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { TimelineTrack } from "@/components/motion/TimelineTrack";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { STATS, STEPS } from "@/lib/content/shared";

interface HowItWorksProps {
  showStats?: boolean;
}

export function HowItWorks({ showStats = true }: HowItWorksProps) {
  return (
    <section id="como-funciona" aria-labelledby="como-title" className="section-y navy-glow relative isolate overflow-hidden">
      <ShieldMark variant="white" className="absolute top-10 -left-40 -z-10 w-[460px] opacity-[0.03]" />
      <div className="container-site">
        <SectionHeading
          id="como-title"
          onDark
          align="center"
          eyebrow="Como funciona"
          title={
            <>
              Do pedido à apólice, <Highlight onDark>sem complicação</Highlight>
            </>
          }
          description="Um processo simples, feito para caber na sua rotina."
          className="mb-14 lg:mb-20"
        />

        <TimelineTrack>
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal as="li" key={title} delay={200 + index * 180} className="relative flex gap-6 lg:flex-col lg:gap-7">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-gold/50 bg-navy-deep text-gold">
                <Icon className="size-6" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-gold text-[11px] font-bold text-navy-deep">
                  {index + 1}
                </span>
              </span>
              <div className="flex flex-col gap-2 pt-1 lg:pt-0">
                <h3 className="text-lg font-semibold text-cream">{title}</h3>
                <p className="leading-relaxed text-slate-light">{description}</p>
              </div>
            </Reveal>
          ))}
        </TimelineTrack>

        {showStats && (
          <dl className="mt-16 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-3 lg:mt-24">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 120} className="flex flex-col gap-2">
                <dt className="order-2 max-w-[16rem] text-sm leading-relaxed text-slate-light">{stat.label}</dt>
                <dd className="order-1 text-5xl font-semibold tracking-tight text-gold lg:text-6xl">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
