// POST /api/login { password } → { token } (30 dias). Senha única em DASHBOARD_PASSWORD.
// Máx. 5 falhas por IP a cada 15 min; depois 429 + Retry-After (src/server/analytics/rate-limit.js).
import { authConfigured, checkPassword, issueToken } from "@/server/analytics/auth.js";
import { json } from "@/server/analytics/http";
import {
  checkLoginLimit,
  clientIp,
  hashIp,
  recordLoginAttempt,
  tooManyAttemptsMessage,
} from "@/server/analytics/rate-limit.js";

const BRUTE_FORCE_DELAY_MS = 400;

export async function POST(request: Request) {
  if (!authConfigured()) {
    return json(
      { error: "Dashboard não configurado: defina DASHBOARD_PASSWORD (≥ 8) e DASHBOARD_SECRET (≥ 16) na Vercel." },
      503,
    );
  }
  const ipHash = hashIp(clientIp((name: string) => request.headers.get(name)));
  const retryAfter = await checkLoginLimit(ipHash);
  if (retryAfter > 0) {
    return json({ error: tooManyAttemptsMessage(retryAfter) }, 429, { "Retry-After": String(retryAfter) });
  }
  const body: unknown = await request.json().catch(() => null);
  // Atraso fixo contra força bruta trivial
  await new Promise((resolve) => setTimeout(resolve, BRUTE_FORCE_DELAY_MS));
  const password = body && typeof body === "object" ? (body as { password?: unknown }).password : undefined;
  if (typeof password !== "string" || !checkPassword(password)) {
    await recordLoginAttempt(ipHash, false);
    return json({ error: "Senha incorreta." }, 401);
  }
  await recordLoginAttempt(ipHash, true);
  return json({ token: issueToken() });
}
