// GET /api/ga4?de=YYYY-MM-DD&ate=YYYY-MM-DD → relatório da propriedade GA4 (só leitura).
// Sempre 200: o estado (ready | not_configured | error) vai no corpo, com mensagem segura.
import { fetchGa4Report } from "@/server/analytics/ga4.js";
import { isAuthorized, json, queryOf, unauthorized } from "@/server/analytics/http";
import { range } from "@/server/analytics/period.js";

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const r = range(queryOf(request));
  return json(await fetchGa4Report({ from: r.from, to: r.to, prevFrom: r.prevFrom, prevTo: r.prevTo }));
}
