/**
 * Rastreamento — tudo via GTM (padrão M|P).
 * A página só envia eventos para o dataLayer; GA4, conversões do Google Ads
 * e Meta Pixel são configurados dentro do GTM. Não adicionar gtag/pixel direto.
 *
 * Eventos: click_whatsapp (cta_id) · click_cta · click_phone · click_email
 * · click_instagram · form_submit · faq_open · scroll_25/50/75/100 · section_view
 */

export type TrackingEvent =
  | "click_whatsapp"
  | "click_cta"
  | "click_phone"
  | "click_email"
  | "click_instagram"
  | "form_submit"
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

export function track(event: TrackingEvent, params: TrackingParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...RESET_PARAMS, ...getUtms(), ...params });
}
