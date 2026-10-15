import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/seguro-auto", priority: 0.9 },
  { path: "/seguro-empresarial", priority: 0.9 },
  { path: "/sobre", priority: 0.6 },
  { path: "/contato", priority: 0.7 },
  { path: "/politica-de-privacidade", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
