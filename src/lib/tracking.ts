/**
 * Rastreamento — tudo via GTM (padrão M|P).
 * A página só envia eventos para o dataLayer; GA4, conversões do Google Ads
 * e Meta Pixel são configurados dentro do GTM. Não adicionar gtag/pixel direto.
 *
 * Eventos: click_whatsapp (cta_id) · click_cta · click_phone · click_email
 * · click_instagram · form_step (step) · form_complete · faq_open · scroll_25/50/75/100 · section_view
 * Nunca enviar dados pessoais do formulário (CPF, nome, telefone) para o dataLayer.
 *
 * O envio final do formulário se chama form_complete, NÃO form_submit: quando a medição
 * otimizada do GA4 ("interações com formulário") está ligada, o GTM gera internamente um
 * evento chamado form_submit a cada <form> enviado (inclusive o "Continuar" dos passos),
 * e qualquer acionador de evento personalizado "form_submit" dispararia junto (Lead no Pixel
 * a cada passo). form_start e form_submit são nomes reservados do GA4 — não usar.
 *
 * Cada evento também vai para o coletor do /dashboard (lib/collector.ts), traduzido:
 * click_whatsapp e form_complete (o formulário abre o WhatsApp) → whatsapp_click; demais
 * cliques → cta_click; todos com cta_location = cta_id, form_id ou o tipo do link.
 */

import { collect } from "@/lib/collector";
import { type LeadSource, newEventId, sendMetaLead } from "@/lib/meta-lead";

export type TrackingEvent =
  | "click_whatsapp"
  | "click_cta"
  | "click_phone"
  | "click_email"
  | "click_instagram"
  | "form_step"
  | "form_complete"
  | "faq_open"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "scroll_100"
  | "section_view";

export type TrackingParams = Record<string, string | number | undefined>;

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const UTM_STORAGE_KEY = "pd_utms";
const MAX_PARAM_LENGTH = 100;

// O dataLayer do GTM guarda o último valor de cada chave: zera a cada evento
const RESET_PARAMS: TrackingParams = {
  cta_id: undefined,
  section_id: undefined,
  percent_scrolled: undefined,
  faq_question: undefined,
  form_id: undefined,
  insurance_type: undefined,
  step: undefined,
  event_id: undefined,
};

export type Utms = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Guarda as UTMs da URL de entrada na sessão (chamar uma vez por carregamento). */
export function captureUtms(): void {
  try {
    const query = new URLSearchParams(window.location.search);
    const fromUrl: Utms = {};
    for (const key of UTM_KEYS) {
      const value = query.get(key);
      if (value) fromUrl[key] = value.slice(0, MAX_PARAM_LENGTH);
    }
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    }
  } catch {
    // sessionStorage indisponível (modo privado/bloqueado): segue sem UTMs
  }
}

export function getUtms(): Utms {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const utms: Utms = {};
    for (const key of UTM_KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string") utms[key] = value.slice(0, MAX_PARAM_LENGTH);
    }
    return utms;
  } catch {
    return {};
  }
}

// Nome do evento no coletor do /dashboard; os ausentes (scroll, section_view) ele mede sozinho
const COLLECTOR_EVENT: Partial<Record<TrackingEvent, string>> = {
  click_whatsapp: "whatsapp_click",
  form_complete: "whatsapp_click",
  click_phone: "phone_click",
  click_cta: "cta_click",
  click_email: "cta_click",
  click_instagram: "cta_click",
  faq_open: "faq_open",
  form_step: "form_step",
};

const LINK_LABEL: Partial<Record<TrackingEvent, string>> = {
  click_phone: "telefone",
  click_email: "email",
  click_instagram: "instagram",
};

/** Só parâmetros de botão/etapa, nunca dados do formulário. */
export function toCollector(event: TrackingEvent, params: TrackingParams): { name: string; props: TrackingParams } | null {
  const name = COLLECTOR_EVENT[event];
  if (!name) return null;
  if (event === "faq_open") return { name, props: { faq_question: params.faq_question } };
  if (event === "form_step") return { name, props: { form_id: params.form_id, insurance_type: params.insurance_type, step: params.step } };
  if (event === "form_complete") return { name, props: { cta_location: params.form_id, insurance_type: params.insurance_type } };
  return { name, props: { cta_location: params.cta_id ?? LINK_LABEL[event] } };
}

/** Eventos que viram Lead na Meta (tags do Pixel no GTM + API de Conversões), com a origem do lead. */
export function metaLeadOf(event: TrackingEvent, params: TrackingParams): { source: LeadSource; category?: string } | null {
  if (event === "click_whatsapp") return { source: "whatsapp", category: params.cta_id as string | undefined };
  if (event === "form_complete") return { source: "formulario", category: params.form_id as string | undefined };
  return null;
}

export function track(event: TrackingEvent, params: TrackingParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // Mesmo event_id no Pixel (dataLayer → tag Lead) e no servidor: a Meta deduplica e conta um lead só
  const lead = metaLeadOf(event, params);
  const eventId = lead ? newEventId() : undefined;
  window.dataLayer.push({ event, ...RESET_PARAMS, ...getUtms(), ...params, event_id: eventId });
  if (lead && eventId) sendMetaLead(eventId, lead.source, lead.category);

  const mirrored = toCollector(event, params);
  if (mirrored) collect(mirrored.name, mirrored.props);
}
