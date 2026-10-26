// API de Conversões da Meta: o mesmo Lead do Pixel, enviado pelo servidor (app/api/meta-lead).
// O navegador manda o event_id que também foi para o Pixel via GTM; a Meta junta os dois e conta um só.
// Recupera o lead quando o Pixel não chega: bloqueador, iOS ou o WhatsApp abrindo antes do envio.
// O IP vai só para a Meta (casamento do evento com o clique no anúncio); nada disso é gravado no banco.

const DEFAULT_PIXEL_ID = '1100323236037100';
// Versões da Graph API valem ~2 anos; trocar por META_GRAPH_VERSION sem precisar de deploy de código
const DEFAULT_GRAPH_VERSION = 'v23.0';
const TIMEOUT_MS = 4000;

const CONTENT_NAMES = new Set(['whatsapp', 'formulario']);
const EVENT_ID = /^[A-Za-z0-9-]{8,64}$/;
const CATEGORY = /^[a-z0-9_]{1,64}$/;
// _fbp = fb.1.<ms>.<aleatório>; _fbc = fb.1.<ms>.<fbclid>
const FBP = /^fb\.\d\.\d{10,13}\.\d{1,20}$/;
const FBC = /^fb\.\d\.\d{10,13}\.[A-Za-z0-9_-]{1,400}$/;
const MAX_URL = 500;

const match = (re, v) => (typeof v === 'string' && re.test(v) ? v : null);

function pageUrl(v) {
  if (typeof v !== 'string' || v.length > MAX_URL) return null;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

/**
 * @param {unknown} body  { event_id, content_name, content_category, url, fbp?, fbc? } vindo do navegador
 * @param {{ ip: string, userAgent: string, now?: number }} ctx
 * @returns {{ ok: false } | { ok: true, event: object }}
 */
export function buildLeadEvent(body, { ip, userAgent, now = Date.now() }) {
  if (!body || typeof body !== 'object' || !ip || !userAgent) return { ok: false };
  const eventId = match(EVENT_ID, body.event_id);
  const category = match(CATEGORY, body.content_category);
  const url = pageUrl(body.url);
  if (!eventId || !category || !url || !CONTENT_NAMES.has(body.content_name)) return { ok: false };

  const userData = { client_ip_address: ip, client_user_agent: userAgent.slice(0, 500) };
  const fbp = match(FBP, body.fbp);
  const fbc = match(FBC, body.fbc);
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  return {
    ok: true,
    event: {
      event_name: 'Lead',
      event_time: Math.floor(now / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: url,
      user_data: userData,
      custom_data: { content_name: body.content_name, content_category: category },
    },
  };
}

/**
 * Só envia em produção (preview e dev gerariam leads falsos no Pixel), exceto com código de teste,
 * que manda o evento para a aba "Eventos de teste" do Gerenciador de Eventos.
 * @returns {null | { token: string, pixelId: string, version: string, testCode: string | null }}
 */
export function capiConfig(env = process.env) {
  const testCode = env.META_CAPI_TEST_CODE || null;
  if (!env.META_CAPI_TOKEN || (env.VERCEL_ENV !== 'production' && !testCode)) return null;
  return {
    token: env.META_CAPI_TOKEN,
    pixelId: env.META_PIXEL_ID || env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_PIXEL_ID,
    version: env.META_GRAPH_VERSION || DEFAULT_GRAPH_VERSION,
    testCode,
  };
}

/** Token no corpo, nunca na URL (URLs aparecem em logs). Nunca lança. */
export async function sendToMeta(event, config, fetchImpl = fetch) {
  const body = { data: [event], access_token: config.token };
  if (config.testCode) body.test_event_code = config.testCode;
  try {
    const res = await fetchImpl(`https://graph.facebook.com/${config.version}/${config.pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) return { ok: true, status: res.status };
    const detail = await res.json().catch(() => null);
    return { ok: false, status: res.status, error: detail?.error?.message || res.statusText };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}
