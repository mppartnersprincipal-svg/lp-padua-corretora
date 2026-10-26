// POST /api/meta-lead — repassa o Lead do clique de WhatsApp para a API de Conversões da Meta
// (src/server/analytics/meta-capi.js). Chamado por sendBeacon em lib/meta-lead.ts. Nada é gravado.
import { isBotUA } from "@/server/analytics/classify.js";
import { buildLeadEvent, capiConfig, sendToMeta } from "@/server/analytics/meta-capi.js";
import { clientIp } from "@/server/analytics/rate-limit.js";

const MAX_BODY = 4 * 1024;
// Teto por IP e instância: uma pessoa real não gera mais que isso; segura spam de leads falsos no Pixel
const MAX_LEADS_PER_IP = 10;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_TRACKED_IPS = 5000;
const recent = new Map<string, number[]>();

function noContent(): Response {
  return new Response(null, { status: 204 });
}

function overLimit(ip: string, now: number): boolean {
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_LEADS_PER_IP) return true;
  if (!recent.has(ip) && recent.size >= MAX_TRACKED_IPS) recent.delete(recent.keys().next().value as string);
  recent.set(ip, [...times, now]);
  return false;
}

export async function POST(request: Request) {
  const config = capiConfig();
  if (!config) return noContent(); // sem token ou fora de produção: descarta em silêncio
  const userAgent = request.headers.get("user-agent") ?? "";
  if (isBotUA(userAgent)) return noContent();
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return noContent();
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) return new Response(null, { status: 413 });

  const text = await request.text();
  if (text.length > MAX_BODY) return new Response(null, { status: 413 });
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }

  const ip = clientIp((name: string) => request.headers.get(name));
  const now = Date.now();
  const built = buildLeadEvent(body, { ip: ip === "desconhecido" ? "" : ip, userAgent, now });
  if (!built.ok) return new Response(null, { status: 400 });
  if (overLimit(ip, now)) return noContent();

  const result = await sendToMeta(built.event, config);
  if (!result.ok) console.error("[meta-lead]", result.status, result.error);
  return noContent();
}
