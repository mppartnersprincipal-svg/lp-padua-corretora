import type { FaqItem } from "@/components/ui/Accordion";
import { hasRealPhone, SITE } from "@/lib/site";

type JsonLdData = Record<string, unknown>;

interface JsonLdProps {
  data: JsonLdData;
}

/** Dados estruturados. Conteúdo é estático (do próprio site); `<` é escapado por segurança. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function buildOrganizationSchema(): JsonLdData {
  const schema: JsonLdData = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "@id": `${SITE.url}/#organizacao`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo-full-navy.svg`,
    image: `${SITE.url}/opengraph-image`,
    email: SITE.email,
    description:
      "Corretora de seguros especializada em Seguro Auto e Seguro Empresarial, com atendimento próximo do primeiro contato ao pós-venda.",
    areaServed: { "@type": "Country", name: "Brasil" },
    sameAs: [SITE.instagramUrl],
    knowsAbout: ["Seguro Auto", "Seguro Empresarial"],
  };
  // Só publica telefone/endereço quando o cliente enviar os dados reais
  if (hasRealPhone()) schema.telephone = `+${SITE.whatsappNumber}`;
  if (SITE.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: "BR",
    };
  }
  return schema;
}

export function buildFaqSchema(items: FaqItem[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildServiceSchema(name: string, description: string, path: string): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE.url}${path}`,
    provider: { "@id": `${SITE.url}/#organizacao` },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

export function buildBreadcrumbSchema(name: string, path: string): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
      { "@type": "ListItem", position: 2, name, item: `${SITE.url}${path}` },
    ],
  };
}
