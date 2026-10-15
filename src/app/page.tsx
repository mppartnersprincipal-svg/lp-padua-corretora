import { BenefitCards } from "@/components/sections/BenefitCards";
import { ClaimShortcuts } from "@/components/sections/ClaimShortcuts";
import { Comparison } from "@/components/sections/Comparison";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductCards } from "@/components/sections/ProductCards";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyPadua } from "@/components/sections/WhyPadua";
import { GENERAL_FAQ } from "@/lib/content/shared";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Pádua Corretora de Seguros | Seguro Auto e Empresarial",
  description:
    "Corretora de seguros com atendimento de verdade: comparamos seguradoras para seu carro ou sua empresa e acompanhamos você na renovação e no sinistro. Cotação pelo WhatsApp em até 1h.",
  path: "/",
  isAbsoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <BenefitCards />
      <ProductCards />
      <WhyPadua />
      <HowItWorks />
      <Comparison />
      <ClaimShortcuts />
      <Testimonials />
      <FaqSection items={GENERAL_FAQ} ctaSuffix="home" />
      <FinalCta quoteHref="#cotacao" ctaSuffix="home" />
    </>
  );
}
