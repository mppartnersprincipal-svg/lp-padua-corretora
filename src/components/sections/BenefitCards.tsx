import { Reveal } from "@/components/motion/Reveal";
import { BENEFITS } from "@/lib/content/home";

/** Cards que sobrepõem a borda inferior do hero. */
export function BenefitCards() {
  return (
    <section id="diferenciais" aria-label="Diferenciais da Pádua" className="relative z-10 -mt-20 lg:-mt-24">
      <div className="container-site">
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {BENEFITS.map(({ icon: Icon, title, description }, index) => (
            <Reveal as="li" key={title} delay={index * 110}>
              <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-card ring-1 ring-navy/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lift lg:p-8">
                <span className="mb-6 grid size-14 place-items-center rounded-2xl bg-navy text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-xl font-semibold text-navy">{title}</h3>
                <p className="leading-relaxed text-slate">{description}</p>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
