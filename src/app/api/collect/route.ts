// POST /api/collect — recebe lotes anônimos do coletor (src/lib/collector.ts) e grava no Supabase.
// Sem IP, sem cookies. Cidade/região vêm dos cabeçalhos de geolocalização da Vercel.
import { isBotUA } from "@/server/analytics/classify.js";
import { configured, insert, rpc } from "@/server/analytics/db.js";
import { buildBatch } from "@/server/analytics/payload.js";

const MAX_BODY = 32 * 1024;

function noContent(): Response {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request) {
  if (!configured()) return noContent(); // sem banco configurado: descarta em silêncio
  if (isBotUA(request.headers.get("user-agent") ?? "")) return noContent();
  // O coletor só envia da própria página; navegadores marcam requisições vindas de outro site
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

  const batch = buildBatch(body, { headers: Object.fromEntries(request.headers) });
  if (!batch.ok) return new Response(null, { status: 400 });

  try {
    await rpc("padua_upsert_session", { p: batch.session });
    if (batch.rows.length) await insert("padua_events", batch.rows);
  } catch (err) {
    console.error("[collect]", err instanceof Error ? err.message : err);
  }
  // Nunca quebra a página por causa de analytics
  return noContent();
}
