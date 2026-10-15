import type { Metadata } from "next";
import { SITE } from "@/lib/site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** true = não aplica o sufixo "| Pádua Corretora" do template */
  isAbsoluteTitle?: boolean;
}

/** Title, description, canonical e Open Graph de cada página. */
export function buildMetadata({ title, description, path, isAbsoluteTitle = false }: PageMetadataInput): Metadata {
  return {
    title: isAbsoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE.name,
      url: path,
      title: isAbsoluteTitle ? title : `${title} | ${SITE.name}`,
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}
