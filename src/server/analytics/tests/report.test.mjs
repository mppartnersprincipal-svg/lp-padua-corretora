// Agregações do /dashboard (api/_lib/report.js): funil, contatos, jornadas e KPIs.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { daily, funnels, kpis, contactReport, journeys, leads, SECTIONS } from '../report.js';

const ev = (session_id, ts, name, props = {}, page_type = 'home') => ({ session_id, ts, name, props, page_type });

test('funnel counts unique sessions per section over sessions that opened the page', () => {
  const events = [
    ev('a', 't', 'page_view'), ev('b', 't', 'page_view'),
    ev('a', 't', 'section_view', { section: 'seguros' }), ev('a', 't', 'section_view', { section: 'seguros' }),
    ev('b', 't', 'section_view', { section: 'topo' }),
  ];
  const f = funnels(events).home;
  assert.equal(f.sessions, 2);
  assert.equal(f.steps.find((s) => s.key === 'seguros').value, 1);
  assert.equal(f.steps.find((s) => s.key === 'seguros').pct, 50);
  assert.equal(f.steps.find((s) => s.key === 'topo').label, 'Topo (hero + cotação)');
});

test('funnel follows the section order of each page', () => {
  assert.deepEqual(SECTIONS.home.slice(0, 3), ['topo', 'diferenciais', 'seguros']);
  assert.equal(SECTIONS.home.at(-1), 'cta-final');
  assert.deepEqual(Object.keys(SECTIONS), ['home', 'seguro_auto', 'seguro_empresarial', 'sobre', 'contato']);
  assert.equal(SECTIONS.seguro_empresarial.includes('seguro-ou-protecao'), false);
});

test('funnel keeps pages apart (same section id on two pages)', () => {
  const events = [
    ev('a', 't', 'page_view'), ev('a', 't', 'section_view', { section: 'topo' }),
    ev('a', 't', 'page_view', {}, 'seguro_auto'),
  ];
  const f = funnels(events);
  assert.equal(f.home.steps[0].value, 1);
  assert.equal(f.seguro_auto.sessions, 1);
  assert.equal(f.seguro_auto.steps[0].value, 0);
});

test('conversion counts WhatsApp OR phone, once per session', () => {
  const k = kpis([{ id: 1, wa_clicks: 2 }, { id: 2, phone_clicks: 1 }, { id: 3 }, { id: 4, wa_clicks: 1, phone_clicks: 1 }]);
  assert.equal(k.converting_sessions, 3);
  assert.equal(k.conversion_rate, 75);
  assert.equal(k.contacts, 5);
});

test('contacts are grouped by cta_location and pivoted by channel', () => {
  const events = [
    ev('a', 't', 'whatsapp_click', { cta_location: 'cta_whatsapp_hero' }),
    ev('b', 't', 'whatsapp_click', { cta_location: 'cta_whatsapp_hero' }),
    ev('b', 't', 'phone_click', { cta_location: 'telefone · contato' }),
    ev('a', 't', 'cta_click', { cta_location: 'maps · contato' }),
  ];
  const channel = { a: 'google_ads', b: 'direct' };
  const c = contactReport(events, (id) => channel[id]);
  assert.deepEqual(c.wa_by_location, [{ key: 'cta_whatsapp_hero', value: 2 }]);
  assert.deepEqual(c.phone_by_location, [{ key: 'telefone · contato', value: 1 }]);
  assert.deepEqual(c.cta_by_location, [{ key: 'maps · contato', value: 1 }]);
  const hero = c.contact_location_x_channel.find((r) => r.row === 'wa|cta_whatsapp_hero');
  assert.deepEqual(hero.cols, { google_ads: 1, direct: 1 });
});

test('journeys default to sessions that contacted; "todas" keeps every session', () => {
  const sessions = [{ id: 'a', wa_clicks: 1 }, { id: 'b' }];
  const evs = { a: [ev('a', 't', 'page_view'), ev('a', 't', 'whatsapp_click', { cta_location: 'fab_whatsapp' })] };
  const conv = journeys(sessions, evs, 'conv');
  assert.equal(conv.length, 1);
  assert.deepEqual(conv[0].trail.map((s) => s.text), ['Abriu a home', 'WhatsApp (fab_whatsapp)']);
  assert.equal(journeys(sessions, evs, 'todas').length, 2);
});

test('click texts containing | keep text, section and page apart', async () => {
  const { clicks } = await import('../report.js');
  const [row] = clicks([{ session_id: 'a', name: 'click', page_type: 'home', props: { text: 'Seguro Auto', section: 'header' } }]);
  assert.deepEqual(row, { text: 'Seguro Auto', section: 'header', page: 'home', value: 1 });
});

test('leads split form submissions (cta_location = form_id) from WhatsApp buttons', () => {
  const events = [
    ev('a', '2026-10-22T12:00:00Z', 'whatsapp_click', { cta_location: 'form_hero_home', insurance_type: 'auto' }),
    ev('b', '2026-10-22T12:00:00Z', 'whatsapp_click', { cta_location: 'form_hero_empresarial', insurance_type: 'empresarial' }),
    ev('c', '2026-10-22T12:00:00Z', 'whatsapp_click', { cta_location: 'fab_whatsapp' }),
    ev('c', '2026-10-22T12:00:00Z', 'phone_click', { cta_location: 'telefone · contato' }),
  ];
  const l = leads(events);
  assert.equal(l.total, 3);
  assert.equal(l.form, 2);
  assert.equal(l.buttons, 1);
  assert.equal(l.form_share, 66.7);
  assert.deepEqual(l.form_by_type, [{ key: 'auto', value: 1 }, { key: 'empresarial', value: 1 }]);
  assert.deepEqual(l.buttons_by_location, [{ key: 'fab_whatsapp', value: 1 }]);
});

test('daily series counts form and button leads on the day of the click', () => {
  const from = new Date('2026-10-22T03:00:00Z'), to = new Date('2026-10-24T03:00:00Z');
  const sessions = [{ started_at: '2026-10-22T12:00:00Z', wa_clicks: 2 }];
  const events = [
    ev('a', '2026-10-22T12:00:00Z', 'whatsapp_click', { cta_location: 'form_hero_home' }),
    ev('a', '2026-10-23T12:00:00Z', 'whatsapp_click', { cta_location: 'cta_whatsapp_hero' }),
  ];
  const d = daily(sessions, from, to, events);
  assert.equal(d.length, 2);
  assert.deepEqual([d[0].form_leads, d[0].button_leads], [1, 0]);
  assert.deepEqual([d[1].form_leads, d[1].button_leads], [0, 1]);
});
