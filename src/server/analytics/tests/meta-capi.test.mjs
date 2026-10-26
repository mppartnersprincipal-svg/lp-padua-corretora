// API de Conversões da Meta (src/server/analytics/meta-capi.js): validação do lead e envio.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildLeadEvent, capiConfig, sendToMeta } from '../meta-capi.js';

const NOW = Date.parse('2026-10-26T18:00:00Z');
const ctx = { ip: '200.1.2.3', userAgent: 'Mozilla/5.0 (iPhone)', now: NOW };
const valid = {
  event_id: 'b3f1c2d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  content_name: 'whatsapp',
  content_category: 'cta_whatsapp_barra_mobile',
  url: 'https://www.paduaseguros.com.br/seguro-auto?utm_source=facebook&utm_medium=paid',
  fbp: 'fb.1.1761500000000.1234567890',
  fbc: 'fb.1.1761500000000.IwAR0abc-DEF_123',
};

test('monta o Lead com event_id do Pixel, IP, user agent e cookies da Meta', () => {
  const r = buildLeadEvent(valid, ctx);
  assert.equal(r.ok, true);
  assert.deepEqual(r.event, {
    event_name: 'Lead',
    event_time: NOW / 1000,
    event_id: valid.event_id,
    action_source: 'website',
    event_source_url: valid.url,
    user_data: { client_ip_address: '200.1.2.3', client_user_agent: 'Mozilla/5.0 (iPhone)', fbp: valid.fbp, fbc: valid.fbc },
    custom_data: { content_name: 'whatsapp', content_category: 'cta_whatsapp_barra_mobile' },
  });
});

test('fbp e fbc são opcionais e descartados se vierem fora do formato da Meta', () => {
  const r = buildLeadEvent({ ...valid, fbp: 'qualquer', fbc: undefined }, ctx);
  assert.equal(r.ok, true);
  assert.equal('fbp' in r.event.user_data, false);
  assert.equal('fbc' in r.event.user_data, false);
});

test('recusa event_id, origem ou URL inválidos', () => {
  assert.equal(buildLeadEvent({ ...valid, event_id: '' }, ctx).ok, false);
  assert.equal(buildLeadEvent({ ...valid, event_id: 'x'.repeat(65) }, ctx).ok, false);
  assert.equal(buildLeadEvent({ ...valid, content_name: 'compra' }, ctx).ok, false);
  assert.equal(buildLeadEvent({ ...valid, content_category: '<script>' }, ctx).ok, false);
  assert.equal(buildLeadEvent({ ...valid, url: 'javascript:alert(1)' }, ctx).ok, false);
  assert.equal(buildLeadEvent(null, ctx).ok, false);
});

test('sem IP ou user agent não envia (a Meta não consegue casar o evento)', () => {
  assert.equal(buildLeadEvent(valid, { ...ctx, ip: '' }).ok, false);
  assert.equal(buildLeadEvent(valid, { ...ctx, userAgent: '' }).ok, false);
});

test('config: só produção envia, a menos que haja código de teste; pixel tem padrão', () => {
  assert.equal(capiConfig({ META_CAPI_TOKEN: 't', VERCEL_ENV: 'preview' }), null);
  assert.equal(capiConfig({ VERCEL_ENV: 'production' }), null);
  assert.deepEqual(capiConfig({ META_CAPI_TOKEN: 't', VERCEL_ENV: 'production' }), {
    token: 't', pixelId: '1100323236037100', version: 'v23.0', testCode: null,
  });
  assert.equal(capiConfig({ META_CAPI_TOKEN: 't', VERCEL_ENV: 'preview', META_CAPI_TEST_CODE: 'TEST1' }).testCode, 'TEST1');
});

test('envia o token no corpo (nunca na URL) e devolve o erro da Meta sem lançar', async () => {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ error: { message: 'Invalid OAuth access token' } }), { status: 400 });
  };
  const config = { token: 'segredo', pixelId: '123', version: 'v23.0', testCode: 'TEST1' };
  const event = buildLeadEvent(valid, ctx).event;
  const r = await sendToMeta(event, config, fakeFetch);
  assert.equal(calls[0].url, 'https://graph.facebook.com/v23.0/123/events');
  assert.equal(calls[0].url.includes('segredo'), false);
  assert.equal(calls[0].body.access_token, 'segredo');
  assert.equal(calls[0].body.test_event_code, 'TEST1');
  assert.deepEqual(calls[0].body.data, [event]);
  assert.deepEqual(r, { ok: false, status: 400, error: 'Invalid OAuth access token' });
});

test('falha de rede vira { ok: false } em vez de exceção', async () => {
  const r = await sendToMeta({}, { token: 't', pixelId: '1', version: 'v23.0', testCode: null }, async () => { throw new Error('timeout'); });
  assert.deepEqual(r, { ok: false, status: 0, error: 'timeout' });
});
