import { buildBreadcrumbSchema, buildServiceSchema, JsonLd } from "@/components/seo/JsonLd";
import { AudienceGrid } from "@/components/sections/AudienceGrid";
import { ClaimShortcuts } from "@/components/sections/ClaimShortcuts";
import { Comparison } from "@/components/sections/Comparison";
import { CoverageGrid } from "@/components/sections/CoverageGrid";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductCallout } from "@/components/sections/ProductCallout";
import { ProductHero } from "@/components/sections/ProductHero";
import { AUTO } from "@/lib/content/products";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: AUTO.metaTitle,
  description: AUTO.metaDescription,
  path: AUTO.slug,
});

export default function SeguroAutoPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(AUTO.name, AUTO.slug)} />
      <JsonLd data={buildServiceSchema(AUTO.name, AUTO.metaDescription, AUTO.slug)} />
      <ProductHero product={AUTO} />
      <CoverageGrid product={AUTO} />
      <ProductCallout product={AUTO} />
      <AudienceGrid product={AUTO} />
      <HowItWorks showStats={false} />
      <Comparison />
      <ClaimShortcuts />
      <FaqSection items={AUTO.faq} ctaSuffix="auto" />
      <FinalCta quoteHref="#cotacao" ctaSuffix="auto" title="Pronto para cotar o seu seguro auto?" />
    </>
  );
}
