import type { ReactNode } from "react";
import { ShieldMark } from "@/components/layout/Logo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface PageHeroProps {
  breadcrumb: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
}

/** Topo das páginas institucionais (Sobre, Contato, Política). */
export function PageHero({ breadcrumb, eyebrow, title, description }: PageHeroProps) {
  return (
    <section
      id="topo"
      aria-labelledby="pagina-title"
      className="navy-glow relative isolate overflow-hidden pt-[calc(var(--header-h)+40px)] pb-16 lg:pt-[calc(var(--header-h)+96px)] lg:pb-24"
    >
      <ShieldMark variant="gold" className="absolute -right-16 -bottom-24 -z-10 w-72 opacity-[0.07] lg:right-[6%] lg:w-96" />
      <div className="container-site">
       <div className="flex max-w-4xl flex-col gap-6">
        <div className="enter" style={{ animationDelay: "0ms" }}>
          <Breadcrumbs current={breadcrumb} />
        </div>
        <div className="enter" style={{ animationDelay: "60ms" }}>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
        </div>
        <div className="enter" style={{ animationDelay: "130ms" }}>
          <h1
            id="pagina-title"
            className="text-[clamp(2.2rem,1.4rem+3.6vw,3.9rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-cream"
          >
            {title}
          </h1>
        </div>
        {description && (
          <div className="enter" style={{ animationDelay: "200ms" }}>
            <p className="max-w-2xl text-lg leading-relaxed text-pretty text-slate-light">{description}</p>
          </div>
        )}
       </div>
      </div>
    </section>
  );
}
