import { bearer, verifyToken } from "./auth.js";

const NO_STORE = { "Cache-Control": "no-store" };

/** JSON sem cache (respostas do painel nunca podem ficar em CDN). */
export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: NO_STORE });
}

/** Token do /api/login no cabeçalho Authorization: Bearer … */
export function isAuthorized(request: Request): boolean {
  return verifyToken(bearer({ headers: { authorization: request.headers.get("authorization") ?? "" } }));
}

export function unauthorized(): Response {
  return json({ error: "Sessão expirada. Entre novamente." }, 401);
}

/** Query string como objeto simples (formato esperado por period.range). */
export function queryOf(request: Request): Record<string, string> {
  return Object.fromEntries(new URL(request.url).searchParams);
}
