/**
 * Coletor first-party do /dashboard (porte do tracker da LP Nova Ferragista para o Next).
 *
 * - Anônimo: sem IP, sem cookies. Sessão em sessionStorage (renova após 30 min parada);
 *   id de visitante persistente (localStorage, 13 meses) SÓ se o visitante não escolheu
 *   "Só o essencial" (chave pd-consent; o site ainda não tem banner).
 * - Independente do GTM/GA4/Pixel: não mexe no dataLayer.
 * - Não roda para bots (navigator.webdriver / UA) nem em /dashboard.
 * - Navegação SPA: cada rota abre um page_view com o próprio page_type; o lote é enviado
 *   antes de trocar de página, porque o servidor grava um page_type por lote.
 * - Fila com envio a cada 10 eventos / 5 s / aba oculta / pagehide (sendBeacon).
 *
 * Eventos próprios: page_view {sw, sh, ref_host}, page_leave {duration_ms (tempo VISÍVEL),
 * max_scroll_pct}, click {tag, text, href, section, x_pct, y_pct}, section_view {section}.
 * Os eventos do dataLayer chegam por collect(), chamado pelo track() de lib/tracking.ts.
 */

const ENDPOINT = "/api/collect";
const SESSION_KEY = "pd-s";
const VISITOR_KEY = "pd-v";
const CONSENT_KEY = "pd-consent";
const IDLE_MS = 30 * 60 * 1000;
const VISITOR_TTL_MS = 13 * 30 * 24 * 60 * 60 * 1000;
const FLUSH_MS = 5000;
const FLUSH_AT = 10;
const UTM_MAX_LENGTH = 120;
const TEXT_MAX_LENGTH = 80;
// Seção "vista": 40% dela na tela OU metade da tela ocupada (seções altas no celular)
const SECTION_MIN_RATIO = 0.4;
const SECTION_MIN_SCREEN = 0.5;
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp/i;

// Mesmos valores de PAGE_TYPES em src/server/analytics/payload.js
const PAGE_TYPE_BY_PATH: Record<string, string> = {
  "/": "home",
  "/seguro-auto": "seguro_auto",
  "/seguro-empresarial": "seguro_empresarial",
  "/sobre": "sobre",
  "/contato": "contato",
  "/politica-de-privacidade": "politica",
};

type Props = Record<string, string | number | boolean | null | undefined>;

interface QueuedEvent {
  n: string;
  t: number;
  p: Props;
}

interface SessionPayload {
  id: string;
  visitor_id: string | null;
  consent: string | null;
  landing_path?: string;
  referrer_host?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  gclid?: boolean;
  screen_w?: number;
  screen_h?: number;
  returning?: boolean;
  duration_ms?: number;
  max_scroll_pct?: number;
  wa_clicks?: number;
  phone_clicks?: number;
}

function storage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? localStorage : sessionStorage;
  } catch {
    return null;
  }
}

function read(kind: "local" | "session", key: string): string | null {
  try {
    return storage(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(kind: "local" | "session", key: string, value: string | null): void {
  try {
    const store = storage(kind);
    if (!store) return;
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {
    // sem storage (modo privado/bloqueado): segue só em memória
  }
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Lê { id, at } guardado e renova o "at"; null se ausente ou vencido. */
function readStamp(kind: "local" | "session", key: string, ttl: number): string | null {
  const raw = read(kind, key);
  if (!raw) return null;
  try {
    const stamp = JSON.parse(raw) as { id?: string; at?: number };
    if (!stamp.id || !stamp.at || Date.now() - stamp.at >= ttl) return null;
    write(kind, key, JSON.stringify({ id: stamp.id, at: Date.now() }));
    return stamp.id;
  } catch {
    return null;
  }
}

function newStamp(kind: "local" | "session", key: string): string {
  const id = uuid();
  write(kind, key, JSON.stringify({ id, at: Date.now() }));
  return id;
}

export function pageTypeOf(pathname: string): string | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PAGE_TYPE_BY_PATH[path] ?? null;
}

function isExcluded(pathname: string): boolean {
  return /^\/(dashboard|api)(\/|$)/.test(pathname);
}

function referrerHost(): string {
  try {
    return document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

function scrollPct(): number {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  return height > 0 ? Math.min(100, Math.round((window.scrollY / height) * 100)) : 100;
}

// ---------- estado ----------
let enabled = false;
let sessionId = "";
let visitorId: string | null = null;
let session: SessionPayload | null = null;
let queue: QueuedEvent[] = [];
let timer: number | null = null;
let t0 = 0;

// página atual
let currentPath: string | null = null;
let pageType: string | null = null;
let pageVisibleMs = 0;
let visibleSince: number | null = null;
let pageMaxScroll = 0;
let leaveSent = true;
let seenSections = new Set<string>();
let sectionObserver: IntersectionObserver | null = null;

// sessão inteira (o banco guarda o maior valor recebido)
let sessionVisibleMs = 0;
let sessionMaxScroll = 0;

function consent(): string | null {
  return read("local", CONSENT_KEY);
}

function resolveVisitor(): { id: string | null; isReturning: boolean } {
  if (consent() === "essential") {
    write("local", VISITOR_KEY, null);
    return { id: null, isReturning: false };
  }
  const existing = readStamp("local", VISITOR_KEY, VISITOR_TTL_MS);
  return existing ? { id: existing, isReturning: true } : { id: newStamp("local", VISITOR_KEY), isReturning: false };
}

/** Atribuição só no primeiro lote da sessão (refresh e navegação interna não sobrescrevem). */
function firstSessionPayload(isReturning: boolean): SessionPayload {
  const query = new URLSearchParams(window.location.search);
  const utm = (key: string) => query.get(key)?.slice(0, UTM_MAX_LENGTH) ?? null;
  return {
    id: sessionId,
    visitor_id: visitorId,
    consent: consent(),
    // Só o caminho: a query pode trazer dados que não são de campanha (UTMs e gclid já vão separados)
    landing_path: window.location.pathname,
    referrer_host: referrerHost() || null,
    utm_source: utm("utm_source"),
    utm_medium: utm("utm_medium"),
    utm_campaign: utm("utm_campaign"),
    utm_content: utm("utm_content"),
    utm_term: utm("utm_term"),
    gclid: query.has("gclid") || query.has("gbraid") || query.has("wbraid"),
    screen_w: window.screen.width,
    screen_h: window.screen.height,
    returning: isReturning,
  };
}

function updatePayload(): SessionPayload {
  return { id: sessionId, visitor_id: visitorId, consent: consent() };
}

// ---------- envio ----------
function send(useBeacon: boolean): void {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (!queue.length || !session) return;
  const body = JSON.stringify({ s: session, e: queue, pt: pageType });
  queue = [];
  session = updatePayload(); // lotes seguintes só atualizam contadores
  if (useBeacon && navigator.sendBeacon) {
    try {
      if (navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    } catch {
      // cai no fetch abaixo
    }
  }
  fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
    () => {},
  );
}

function enqueue(name: string, props: Props = {}): void {
  if (!enabled || !session) return;
  queue.push({ n: name, t: Math.round(performance.now() - t0), p: props });
  if (name === "whatsapp_click") session.wa_clicks = (session.wa_clicks ?? 0) + 1;
  if (name === "phone_click") session.phone_clicks = (session.phone_clicks ?? 0) + 1;
  if (queue.length >= FLUSH_AT) send(false);
  else if (timer === null) timer = window.setTimeout(() => send(false), FLUSH_MS);
}

/** Espelho dos eventos do dataLayer (chamado por track() em lib/tracking.ts). */
export function collect(name: string, props: Props = {}): void {
  if (name !== "page_view") enqueue(name, props);
}

// ---------- tempo visível, rolagem e saída ----------
function pauseClock(): void {
  if (visibleSince === null) return;
  const elapsed = Date.now() - visibleSince;
  pageVisibleMs += elapsed;
  sessionVisibleMs += elapsed;
  visibleSince = null;
}

function onScroll(): void {
  const pct = scrollPct();
  if (pct > pageMaxScroll) pageMaxScroll = pct;
}

function leavePage(): void {
  if (currentPath === null || leaveSent) return;
  pauseClock();
  sessionMaxScroll = Math.max(sessionMaxScroll, pageMaxScroll);
  queue.push({
    n: "page_leave",
    t: Math.round(performance.now() - t0),
    p: { duration_ms: pageVisibleMs, max_scroll_pct: pageMaxScroll },
  });
  leaveSent = true;
  if (session) {
    session.duration_ms = sessionVisibleMs;
    session.max_scroll_pct = sessionMaxScroll;
  }
}

function onVisibilityChange(): void {
  if (document.visibilityState === "hidden") {
    leavePage();
    send(true);
    return;
  }
  // Voltou para a aba: reabre a MESMA página sem novo page_view
  if (currentPath !== null) {
    leaveSent = false;
    pageVisibleMs = 0;
    visibleSince = Date.now();
  }
}

function onPageHide(): void {
  leavePage();
  send(true);
}

// ---------- seções vistas (funil de leitura) ----------
// A rota nova pode terminar de renderizar depois (streaming): procura seções de novo por alguns segundos
const SECTION_RESCAN_MS = [400, 1200, 3000];
let observedSections = new WeakSet<Element>();
let rescanTimers: number[] = [];

function observeVisibleSections(): void {
  // Páginas já visitadas continuam montadas e ocultas: observa só as seções visíveis
  document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
    if (section.offsetParent === null || observedSections.has(section)) return;
    observedSections.add(section);
    sectionObserver?.observe(section);
  });
}

function watchSections(): void {
  sectionObserver?.disconnect();
  rescanTimers.forEach((id) => window.clearTimeout(id));
  observedSections = new WeakSet();
  if (!("IntersectionObserver" in window)) return;
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const isSeen =
          entry.intersectionRatio >= SECTION_MIN_RATIO ||
          entry.intersectionRect.height >= window.innerHeight * SECTION_MIN_SCREEN;
        if (!isSeen) continue;
        const key = (entry.target as HTMLElement).id;
        sectionObserver?.unobserve(entry.target);
        if (!key || seenSections.has(key)) continue;
        seenSections.add(key);
        enqueue("section_view", { section: key });
      }
    },
    { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
  );
  observeVisibleSections();
  rescanTimers = SECTION_RESCAN_MS.map((delay) => window.setTimeout(observeVisibleSections, delay));
}

// ---------- cliques (nome do botão e de onde veio) ----------
function hrefKind(anchor: HTMLAnchorElement): string {
  const href = anchor.getAttribute("href") ?? "";
  if (/wa\.me|api\.whatsapp\.com/.test(href)) return "wa.me";
  if (/^tel:/.test(href)) return "tel:";
  if (/^mailto:/.test(href)) return "mailto:";
  if (/^#/.test(href)) return href;
  try {
    const url = new URL(href, window.location.href);
    return url.host === window.location.host ? url.pathname + url.hash : url.hostname;
  } catch {
    return href.slice(0, TEXT_MAX_LENGTH);
  }
}

function sectionOf(element: Element): string {
  const marked = element.closest<HTMLElement>("[data-section]");
  if (marked?.dataset.section) return marked.dataset.section;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return element.closest("section[id]")?.id ?? "";
}

function onClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  const element = event.target.closest<HTMLElement>("a,button,[role=button],input[type=submit],summary,select");
  if (!element) return;
  const label = element.getAttribute("data-cta") || element.getAttribute("aria-label") || element.textContent || "";
  const props: Props = {
    tag: element.tagName.toLowerCase(),
    text: label.replace(/\s+/g, " ").trim().slice(0, TEXT_MAX_LENGTH),
    section: sectionOf(element),
    x_pct: Math.round((event.clientX / window.innerWidth) * 100),
    y_pct: Math.round((event.clientY / window.innerHeight) * 100),
  };
  if (element instanceof HTMLAnchorElement) props.href = hrefKind(element);
  enqueue("click", props);
}

// ---------- ciclo de vida ----------
/** Abre uma página (carregamento inicial ou navegação SPA). */
export function trackPageView(pathname: string): void {
  if (!enabled || pathname === currentPath) return;
  if (isExcluded(pathname)) return;

  // Fecha a página anterior e envia com o page_type dela
  leavePage();
  send(false);

  const isFirstPage = currentPath === null;
  currentPath = pathname;
  pageType = pageTypeOf(pathname);
  pageVisibleMs = 0;
  // Medido na abertura: página que cabe na tela já conta 100% (no page_leave o DOM pode ser de outra rota)
  pageMaxScroll = scrollPct();
  leaveSent = false;
  seenSections = new Set();
  visibleSince = document.visibilityState === "visible" ? Date.now() : null;

  const ref = isFirstPage ? referrerHost() || null : null;
  enqueue("page_view", { sw: window.innerWidth, sh: window.innerHeight, ref_host: ref });
  watchSections();
}

/** Inicializa uma única vez (chamado pelo <Collector /> do layout). */
export function initCollector(): boolean {
  if (enabled) return true;
  if (typeof window === "undefined" || navigator.webdriver || BOT_RE.test(navigator.userAgent)) return false;
  if (isExcluded(window.location.pathname)) return false;

  t0 = performance.now();
  const existingSession = readStamp("session", SESSION_KEY, IDLE_MS);
  sessionId = existingSession ?? newStamp("session", SESSION_KEY);
  const visitor = resolveVisitor();
  visitorId = visitor.id;
  session = existingSession ? updatePayload() : firstSessionPayload(visitor.isReturning);
  enabled = true;

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("click", onClick, true);
  return true;
}
