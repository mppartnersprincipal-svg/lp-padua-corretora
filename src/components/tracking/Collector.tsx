"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initCollector, trackPageView } from "@/lib/collector";

/** Coletor first-party do /dashboard (lib/collector.ts): um page_view por rota visitada. */
export function Collector(): null {
  const pathname = usePathname();

  useEffect(() => {
    if (!initCollector()) return;
    // Espera a troca de rota terminar de mostrar a página nova (as visitadas ficam montadas ocultas)
    const id = window.setTimeout(() => trackPageView(pathname), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
