import Image from "next/image";
import { Clock, Eye, HeartHandshake, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { buildBreadcrumbSchema, JsonLd } from "@/components/seo/JsonLd";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { WhyPadua } from "@/components/sections/WhyPadua";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Sobre a Pádua",
  description:
    "Conheça a Pádua Corretora: uma corretora de seguros que nasceu para oferecer um pós-venda diferente, com atendimento próximo em todo o Brasil.",
  path: "/sobre",
});

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Proximidade",
    description: "Você fala com pessoas que conhecem o seu seguro e a sua história.",
  },
  {
    icon: Eye,
    title: "Transparência",
    description: "Explicamos coberturas, franquias e exclusões antes de você assinar.",
  },
  {
    icon: ShieldCheck,
    title: "Compromisso",
    description: "Acompanhamos renovação, alterações e sinistro até o fim.",
  },
  {
    icon: Clock,
    title: "Agilidade",
    description: "Cotação em até 1 hora, direto no seu WhatsApp.",
  },
];

const STORY_PARAGRAPHS = [
  "A Pádua nasceu com um propósito claro: oferecer um pós-venda diferente do que o mercado de seguros costuma entregar.",
  "O começo foi difícil, como todo começo. Mas a aposta no atendimento deu certo: cliente bem cuidado indica, e é assim que a Pádua cresce, atendendo pessoas e empresas de todos os perfis, em todo o Brasil.",
  "Hoje somos especialistas em Seguro Auto e Seguro Empresarial. Comparamos as seguradoras parceiras, buscamos descontos e, principalmente, ficamos do lado do cliente quando ele mais precisa.",
];

export default function SobrePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema("Sobre a Pádua", "/sobre")} />
      <PageHero
        breadcrumb="Sobre a Pádua"
        eyebrow="Nossa história"
        title={
          <>
            Uma corretora feita de <span className="text-gold">atendimento</span>
          </>
        }
        description="Seguro é promessa. E promessa se cumpre no dia a dia: na resposta rápida, na renovação sem susto e, principalmente, na hora do sinistro."
      />

      <section id="historia" aria-labelledby="historia-title" className="section-y">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal scale={0.96} y={0} className="relative">
            <div aria-hidden="true" className="dot-grid absolute -top-6 -left-6 h-32 w-36 opacity-50" />
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-lift">
              <Image
                src="/images/parceria.webp"
                alt="Aperto de mão entre corretor e cliente em um escritório"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-6">
            <Eyebrow>Quem somos</Eyebrow>
            <h2
              id="historia-title"
              className="text-[clamp(1.85rem,1.25rem+2.2vw,2.9rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance text-navy"
            >
              Crescemos de indicação em indicação
            </h2>
            {STORY_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-slate">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="valores" aria-labelledby="valores-title" className="section-y bg-navy">
        <div className="container-site">
          <SectionHeading
            id="valores-title"
            onDark
            align="center"
            eyebrow="No que acreditamos"
            title="O jeito Pádua de cuidar"
            className="mb-12 lg:mb-16"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {VALUES.map(({ icon: Icon, title, description }, index) => (
              <Reveal as="li" key={title} delay={index * 100}>
                <div className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold/60">
                  <span className="grid size-12 place-items-center rounded-xl bg-gold/15 text-gold transition-transform duration-500 group-hover:scale-110">
                    <Icon className="size-5.5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold text-cream">{title}</h3>
                  <p className="leading-relaxed text-slate-light">{description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <WhyPadua showAboutLink={false} />
      <FinalCta quoteHref="/#cotacao" ctaSuffix="sobre" />
    </>
  );
}
