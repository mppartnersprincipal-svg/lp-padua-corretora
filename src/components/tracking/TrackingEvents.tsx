"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, type TrackingEvent } from "@/lib/tracking";

const SCROLL_MARKS = [25, 50, 75, 100] as const;
const SCROLL_TOLERANCE = 1;

// Eventos aceitos em data-track (WhatsApp usa data-cta)
const CLICK_EVENTS = new Set<TrackingEvent>(["click_cta", "click_phone", "click_email", "click_instagram"]);

function isClickEvent(value: string | undefined): value is TrackingEvent {
  return value !== undefined && CLICK_EVENTS.has(value as TrackingEvent);
}

/**
 * Escuta cliques em [data-cta] (WhatsApp → click_whatsapp com cta_id) e
 * [data-track] (demais), marcas de rolagem e seções vistas (main section[id]).
 */
export function TrackingEvents(): null {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-cta],[data-track]");
      if (!element) return;

      const ctaId = element.dataset.cta;
      if (ctaId) {
        track("click_whatsapp", { cta_id: ctaId });
        return;
      }
      const eventName = element.dataset.track;
      if (!isClickEvent(eventName)) return;
      track(eventName, element.dataset.ctaId ? { cta_id: element.dataset.ctaId } : {});
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Rolagem e seções: reinicia a cada página visitada
  useEffect(() => {
    const firedMarks = new Set<number>();
    let frame = 0;
    let isTicking = false;

    function checkScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
      for (const mark of SCROLL_MARKS) {
        if (firedMarks.has(mark) || percent < mark - SCROLL_TOLERANCE) continue;
        firedMarks.add(mark);
        track(`scroll_${mark}`, { percent_scrolled: mark });
      }
      isTicking = false;
    }

    function handleScroll() {
      if (isTicking) return;
      isTicking = true;
      frame = requestAnimationFrame(checkScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          track("section_view", { section_id: entry.target.id });
        }
      },
      { rootMargin: "0px 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
