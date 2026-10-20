// POST /api/login { password } → { token } (30 dias). Senha única em DASHBOARD_PASSWORD.
import { authConfigured, checkPassword, issueToken } from "@/server/analytics/auth.js";
import { json } from "@/server/analytics/http";

const BRUTE_FORCE_DELAY_MS = 400;

export async function POST(request: Request) {
  if (!authConfigured()) {
    return json(
      { error: "Dashboard não configurado: defina DASHBOARD_PASSWORD (≥ 8) e DASHBOARD_SECRET (≥ 16) na Vercel." },
      503,
    );
  }
  const body: unknown = await request.json().catch(() => null);
  // Atraso fixo contra força bruta trivial
  await new Promise((resolve) => setTimeout(resolve, BRUTE_FORCE_DELAY_MS));
  const password = body && typeof body === "object" ? (body as { password?: unknown }).password : undefined;
  if (typeof password !== "string" || !checkPassword(password)) return json({ error: "Senha incorreta." }, 401);
  return json({ token: issueToken() });
}
