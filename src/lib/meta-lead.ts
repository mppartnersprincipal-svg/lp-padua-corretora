/**
 * Lead para a API de Conversões da Meta (app/api/meta-lead), além do Pixel no GTM.
 *
 * - O mesmo event_id vai para o dataLayer (tag Lead do Pixel) e para o servidor: a Meta conta um só.
 * - sendBeacon sobrevive à troca para o WhatsApp, que costuma cortar o envio do Pixel no celular.
 * - Sem dados pessoais: só botão/formulário de origem, URL da página e os cookies _fbp/_fbc da Meta.
 * - Respeita "Só o essencial" (pd-consent), como o coletor do /dashboard.
 */

const ENDPOINT = "/api/meta-lead";
const FBCLID_KEY = "pd_fbclid";
const CONSENT_KEY = "pd-consent";
const MAX_FBCLID_LENGTH = 400;

export type LeadSource = "whatsapp" | "formulario";

export interface MetaLeadPayload {
  event_id: string;
  content_name: LeadSource;
  content_category: string;
  url: string;
  fbp?: string;
  fbc?: string;
}

interface StoredFbclid {
  id: string;
  ts: number;
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function readCookie(cookies: string, name: string): string | undefined {
  const prefix = `${name}=`;
  const found = cookies.split(";").map((c) => c.trim()).find((c) => c.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : undefined;
}

/** _fbc do Pixel; se o Pixel foi bloqueado, monta no mesmo formato a partir do fbclid da entrada. */
export function resolveFbc(cookie: string | undefined, fbclid: StoredFbclid | null): string | undefined {
  if (cookie) return cookie;
  return fbclid ? `fb.1.${fbclid.ts}.${fbclid.id}` : undefined;
}

/** Guarda o fbclid da URL de entrada (chamar uma vez por carregamento, junto com as UTMs). */
export function captureFbclid(): void {
  try {
    const id = new URLSearchParams(window.location.search).get("fbclid");
    if (!id) return;
    const stored: StoredFbclid = { id: id.slice(0, MAX_FBCLID_LENGTH), ts: Date.now() };
    sessionStorage.setItem(FBCLID_KEY, JSON.stringify(stored));
  } catch {
    // sessionStorage indisponível: segue só com o cookie do Pixel
  }
}

function storedFbclid(): StoredFbclid | null {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(FBCLID_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return null;
    const { id, ts } = parsed as Record<string, unknown>;
    return typeof id === "string" && typeof ts === "number" ? { id, ts } : null;
  } catch {
    return null;
  }
}

function essentialOnly(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "essential";
  } catch {
    return false;
  }
}

export function sendMetaLead(eventId: string, source: LeadSource, category: string | undefined): void {
  if (typeof window === "undefined" || !category || essentialOnly()) return;
  const payload: MetaLeadPayload = {
    event_id: eventId,
    content_name: source,
    content_category: category,
    url: window.location.href,
    fbp: readCookie(document.cookie, "_fbp"),
    fbc: resolveFbc(readCookie(document.cookie, "_fbc"), storedFbclid()),
  };
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
  } catch {
    // cai no fetch abaixo
  }
  fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
    () => {},
  );
}
