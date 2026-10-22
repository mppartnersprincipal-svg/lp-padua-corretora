// GET /api/dashboard?de=YYYY-MM-DD&ate=YYYY-MM-DD&origem=<canal>&pagina=<page_type>&jornadas=conv|todas
// GET /api/dashboard?live=1  → últimos eventos (feed ao vivo)
// Autenticação: Authorization: Bearer <token de /api/login>
// Google Ads e GA4 ficam em rotas separadas (não seguram o painel).
import { configured, selectAll } from "@/server/analytics/db.js";
import { isAuthorized, json, queryOf, unauthorized } from "@/server/analytics/http";
import { PAGE_TYPES } from "@/server/analytics/payload.js";
import { range } from "@/server/analytics/period.js";
import { buildReport } from "@/server/analytics/report.js";

const CHANNELS = new Set([
  "google_ads", "google_organic", "instagram", "meta_ads", "facebook", "search_other", "direct", "referral", "other",
]);
const LIVE_EVENTS = 40;
const MAX_ROWS = 50000; // teto padrão do selectAll

interface LiveEvent {
  ts: string;
  name: string;
  page_type: string | null;
  props: Record<string, unknown>;
  session_id: string;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  if (!configured()) return json({ error: "Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." }, 503);

  const q = queryOf(request);
  try {
    return json(q.live ? await live() : await report(q));
  } catch (err) {
    console.error("[dashboard]", err instanceof Error ? err.message : err);
    return json({ error: "Falha ao consultar o banco." }, 500);
  }
}

async function live() {
  const events: LiveEvent[] = await selectAll(
    "padua_events",
    "select=ts,name,page_type,props,session_id&order=ts.desc&name=not.in.(page_leave,section_view)",
    LIVE_EVENTS,
    LIVE_EVENTS,
  );
  const ids = [...new Set(events.map((e) => e.session_id))];
  const sessions: { id: string }[] = ids.length
    ? await selectAll("padua_sessions", `select=id,channel,device,city,utm_campaign&id=in.(${ids.join(",")})`)
    : [];
  const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));
  return { events: events.map((e) => ({ ...e, session: byId[e.session_id] ?? null })) };
}

async function report(q: Record<string, string>) {
  const r = range(q);
  // Filtros só aceitam valores conhecidos (entram na comparação, nunca na URL do PostgREST)
  const origem = CHANNELS.has(q.origem) ? q.origem : null;
  const pagina = PAGE_TYPES.has(q.pagina) ? q.pagina : null;
  const jornadas = q.jornadas === "todas" ? "todas" : "conv";
  const from = r.from.toISOString();
  const to = r.to.toISOString();
  const prevFrom = r.prevFrom.toISOString();
  const prevTo = r.prevTo.toISOString();
  const [sessionsAll, prevAll, eventsAll, prevEventsAll] = await Promise.all([
    selectAll("padua_sessions", `select=*&started_at=gte.${from}&started_at=lt.${to}&order=started_at.desc,id.asc`),
    selectAll(
      "padua_sessions",
      `select=id,visitor_id,wa_clicks,phone_clicks,duration_ms,max_scroll_pct,channel,landing_page_type&started_at=gte.${prevFrom}&started_at=lt.${prevTo}&order=id.asc`,
    ),
    selectAll("padua_events", `select=session_id,ts,name,page_type,props&ts=gte.${from}&ts=lt.${to}&order=ts.asc,id.asc`),
    // Só os leads do período anterior (comparação dos cards "Leads")
    selectAll("padua_events", `select=session_id,ts,name,props&name=eq.whatsapp_click&ts=gte.${prevFrom}&ts=lt.${prevTo}&order=id.asc`),
  ]);

  return {
    range: { de: r.de, ate: r.ate, days: r.days },
    origem: origem ?? "todas",
    pagina: pagina ?? "todas",
    jornadas,
    ...buildReport({ r, sessionsAll, prevAll, eventsAll, prevEventsAll, origem, pagina, jornadas }),
    // selectAll para em MAX_ROWS: avisa o painel em vez de cortar em silêncio
    truncated: [sessionsAll, prevAll, eventsAll].some((rows) => rows.length >= MAX_ROWS),
    generated_at: new Date().toISOString(),
  };
}
