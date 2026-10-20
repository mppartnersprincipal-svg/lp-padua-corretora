// GET /api/google-ads?de=YYYY-MM-DD&ate=YYYY-MM-DD → relatório da conta (só leitura).
// Sempre 200: o estado (ready | not_configured | error) vai no corpo, com mensagem segura.
import { fetchGoogleAdsReport } from "@/server/analytics/google-ads.js";
import { isAuthorized, json, queryOf, unauthorized } from "@/server/analytics/http";
import { range } from "@/server/analytics/period.js";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const r = range(queryOf(request));
  return json(await fetchGoogleAdsReport({ from: r.from, to: r.to }));
}
