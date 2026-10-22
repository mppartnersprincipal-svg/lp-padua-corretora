# Dashboard first-party do site da Pádua

Painel de comportamento dos visitantes em **/dashboard**, no modelo da LP Nova Ferragista (que veio da Construbloc,
Gaspar Lopes e Sólida), portado para o Next.js: coleta **própria, anônima e sempre ativa**, gravada no Supabase,
**sem tocar** no GTM/GA4/Pixel (que seguem o `README.md` e o `gtm/GTM-MRMP8MT7-importar.json`). Inclui as seções
**Google Ads** e **GA4**, lidas das APIs oficiais (só leitura).

## Como funciona

| Peça | Arquivo | O quê |
|---|---|---|
| Coletor | `src/lib/collector.ts` + `components/tracking/Collector.tsx` | Sessão anônima em `sessionStorage` (`pd-s`, renova após 30 min parada), id de visitante em `localStorage` por 13 meses (`pd-v`, apagado se `pd-consent = essential`), fila com envio a cada 10 eventos / 5 s / aba oculta / `pagehide` (`sendBeacon`). Sem IP, sem cookies. Não roda para bots nem no /dashboard. **SPA:** cada rota abre um `page_view` com o próprio `page_type`, e o lote é enviado antes de trocar de página. As páginas já visitadas ficam montadas e ocultas (`cacheComponents`); o funil só observa as seções visíveis. |
| Eventos | `collector.ts` + `track()` em `src/lib/tracking.ts` | Próprios: `page_view`, `page_leave` (tempo visível + rolagem máx.), `click` (texto, seção, posição), `section_view` (funil). Espelhados do `dataLayer` (`toCollector`): `click_whatsapp` **e `form_complete`** → `whatsapp_click` (o formulário abre o WhatsApp), `click_cta`/`click_email`/`click_instagram` → `cta_click`, `click_phone` → `phone_click` (todos com `cta_location`), `faq_open`, `form_step`. |
| Ingestão | `src/app/api/collect/route.ts` + `src/server/analytics/payload.js` | Valida o lote, descarta bots, deriva dispositivo/navegador/SO do user-agent e cidade/UF dos cabeçalhos de geolocalização da Vercel. |
| Banco | `supabase/migrations/0001_padua_analytics.sql` | `padua_sessions` / `padua_events` + RPC `padua_upsert_session`. RLS ligado sem policies (só a service role acessa). Projeto compartilhado `khipnjfbxjgvmjvyxero`. |
| Atribuição | `src/server/analytics/classify.js` | `gclid` → Google Ads; `utm_source=facebook/instagram` + `utm_medium` pago → **Meta Ads**; referrer → orgânico, direto, indicação. |
| Login | `src/app/api/login/route.ts` + `auth.js` | Senha única (`DASHBOARD_PASSWORD`) → token HMAC de 30 dias (`DASHBOARD_SECRET`). |
| Consulta | `src/app/api/dashboard/route.ts` + `report.js` | KPIs com comparação de período, série diária, origens, **página de entrada**, dispositivos, WhatsApp por botão/formulário + pivô por canal, outros links, funil por página, FAQ, campanhas UTM, jornadas, heatmap 7×24, geografia, cliques, consentimento, novo × recorrente, feed ao vivo. |
| Google Ads | `src/app/api/google-ads/route.ts` + `google-ads.js` | Consulta separada (se falhar, o resto do painel não espera). Hoje mostra "conexão pendente": a Pádua ainda não anuncia no Google. |
| GA4 | `src/app/api/ga4/route.ts` + `ga4.js` | GA4 Data API (conta de serviço, só leitura). Conta `click_whatsapp`, `form_complete`, `click_cta`, `click_phone`, `click_email`, `click_instagram`, `faq_open`. |
| UI | `public/dashboard/index.html` + `app.js` | HTML estático (rewrite `/dashboard` → `/dashboard/index.html` no `next.config.ts`), Chart.js via CDN, filtros na URL (período, origem, página de entrada), identidade da Pádua (navy/dourado, Archivo). `noindex` + `robots.ts`. |

O código de servidor (`src/server/analytics/*.js`) é o mesmo da Nova Ferragista, coberto por `node --test`
(`src/server/analytics/tests/`). O `package.json` da pasta só marca os arquivos como ES modules.

### Páginas e seções do funil

| `page_type` | Rota | Seções (`id` da `<section>`, na ordem) |
|---|---|---|
| `home` | `/` | `topo`, `diferenciais`, `seguros`, `por-que-a-padua`, `como-funciona`, `seguro-ou-protecao`, `sinistro`, `compromisso` (vira `depoimentos` quando houver depoimentos reais), `perguntas-frequentes`, `cta-final` |
| `seguro_auto` | `/seguro-auto` | `topo`, `coberturas`, `destaque`, `para-quem`, `como-funciona`, `seguro-ou-protecao`, `sinistro`, `perguntas-frequentes`, `cta-final` |
| `seguro_empresarial` | `/seguro-empresarial` | `topo`, `coberturas`, `destaque`, `para-quem`, `como-funciona`, `sinistro`, `perguntas-frequentes` |
| `sobre` | `/sobre` | `topo`, `historia`, `valores`, `cta-final` |
| `contato` | `/contato` | `topo`, `canais`, `perguntas-frequentes` |
| `politica` | `/politica-de-privacidade` | (sem funil) |

Seção nova ou página nova: atualizar `PAGE_TYPE_BY_PATH` (`collector.ts`), `PAGE_TYPES` (`payload.js`), `SECTIONS`
(`report.js`) e os nomes em `public/dashboard/app.js` (`PAGE`, `SECTION`, `CTA`). Botão novo: `cta_id` único + nome em `CTA`.

## Variáveis de ambiente (Vercel → projeto → Settings → Environment Variables)

Nenhuma chave vai no código nem no front. Depois de cadastrar, faça **Redeploy**.

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | `GTM-MRMP8MT7` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.paduaseguros.com.br` |
| `SUPABASE_URL` | `https://khipnjfbxjgvmjvyxero.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | mesma dos outros clientes (`.env.local` da Construbloc) (**secreta**) |
| `DASHBOARD_PASSWORD` | senha da tela de login (mín. 8) |
| `DASHBOARD_SECRET` | string aleatória longa (mín. 16) |
| `GA4_PROPERTY_ID` | ID numérico da **propriedade** (GA4 → Administrador → Detalhes da propriedade). Não é o `G-NM41WZ5Y2C` nem o ID do fluxo `16168285618` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON da conta de serviço `dashboard-ga4@` (**secreto**). Adicione o `client_email` dela como **Leitor** na propriedade GA4 da Pádua |
| `GOOGLE_ADS_*` | só quando a Pádua anunciar no Google (ver `.env.example`; `GOOGLE_ADS_CUSTOMER_ID` = conta da Pádua, 10 dígitos) |

Use senha longa (16+ caracteres): o login não tem limite de tentativas por IP (se precisar, regra de rate limit
no Vercel Firewall para `/api/login` e `/api/collect`). O token de login vale 30 dias; trocar só a senha **não**
derruba quem já entrou: para isso, troque também o `DASHBOARD_SECRET` e faça redeploy.

Sem as duas do Supabase, a coleta descarta em silêncio (o site nunca quebra por causa de analytics). Sem
senha/segredo, o login responde 503. Sem as do Ads/GA4, cada seção mostra "conexão pendente".

## Desenvolvimento local

```
cp .env.example .env.local   # e preencha
npm run dev                  # http://localhost:3000 (site + /api + /dashboard)
npm test                     # Vitest (site) + node --test (classify, collect, agregações, Google Ads e GA4 simulados)
```

## QA depois do deploy

- `/dashboard` 200 com `X-Robots-Tag: noindex`; `/api/collect` 204; login com senha errada → "Senha incorreta.".
- Abrir o site com `?utm_source=facebook&utm_medium=paid&utm_content=qa-seed`, navegar entre páginas, clicar no
  WhatsApp, abrir uma pergunta do FAQ e conferir em /dashboard (período "Hoje", seção "Ao vivo").
- Limpar a visita de teste (SQL Editor do Supabase): `delete from padua_sessions where utm_content = 'qa-seed';`
- **Nunca** rode `drop`/`delete` sem o prefixo `padua_` nesse projeto: ele é compartilhado com Sólida, Gaspar,
  LM Tubos, Construbloc e Nova Ferragista.

## LGPD

Coleta anônima e agregada: sem IP, sem cookies, sem dados pessoais (o formulário nunca entra no coletor nem no
`dataLayer`; há teste para isso). A política de privacidade cita a estatística própria, o GA4 e o Meta Pixel. O site
ainda não tem banner de cookies; se entrar, basta gravar `localStorage['pd-consent'] = 'accepted' | 'essential'`.
