import { buildBreadcrumbSchema, buildServiceSchema, JsonLd } from "@/components/seo/JsonLd";
import { AudienceGrid } from "@/components/sections/AudienceGrid";
import { ClaimShortcuts } from "@/components/sections/ClaimShortcuts";
import { CoverageGrid } from "@/components/sections/CoverageGrid";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductCallout } from "@/components/sections/ProductCallout";
import { ProductHero } from "@/components/sections/ProductHero";
import { EMPRESARIAL } from "@/lib/content/products";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: EMPRESARIAL.metaTitle,
  description: EMPRESARIAL.metaDescription,
  path: EMPRESARIAL.slug,
});

export default function SeguroEmpresarialPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(EMPRESARIAL.name, EMPRESARIAL.slug)} />
      <JsonLd data={buildServiceSchema(EMPRESARIAL.name, EMPRESARIAL.metaDescription, EMPRESARIAL.slug)} />
      <ProductHero product={EMPRESARIAL} />
      <CoverageGrid product={EMPRESARIAL} />
      <ProductCallout product={EMPRESARIAL} />
      <AudienceGrid product={EMPRESARIAL} />
      <HowItWorks showStats={false} />
      <ClaimShortcuts className="section-y" />
      <FaqSection items={EMPRESARIAL.faq} ctaSuffix="empresarial" />
      <FinalCta
        quoteHref="#cotacao"
        ctaSuffix="empresarial"
        title="Vamos proteger o seu negócio?"
        description="Conte um pouco sobre a sua empresa. A Pádua monta a proposta sob medida e acompanha você depois da contratação."
      />
    </>
  );
}
