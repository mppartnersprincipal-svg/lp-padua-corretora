@AGENTS.md

# Site — Pádua Corretora

Site institucional da Pádua Administradora e Corretora de Seguros (Seguro Auto + Seguro Empresarial), com foco em levar o visitante ao WhatsApp e servir de destino para o Google Ads.

---

## Cliente

| Campo | Valor |
|-------|-------|
| Cliente | Pádua Administradora e Corretora de Seguros |
| Responsável comercial | Carmilene (fecha as vendas pelo WhatsApp) |
| Segmento | Corretora de seguros — Auto e Empresarial, atendimento em todo o Brasil |
| Diferencial (kick-off) | Pós-venda / atendimento; cotação fechada em até 1h |
| Concorrência | Concessionárias (demanda) e cooperativas/proteção veicular (preço) |
| Objetivo do site | Visibilidade + leads no WhatsApp; destino das campanhas |
| WhatsApp | (62) 98229-4264 — `5562982294264` (`lib/site.ts`, sobrescrito por `NEXT_PUBLIC_WHATSAPP_NUMBER`) |
| URL de produção | **https://www.paduaseguros.com.br** (o domínio sem www redireciona para o www) — `NEXT_PUBLIC_SITE_URL` |

Insumos em `../` : `M_P - Kick Off Padua Corretora.docx.pdf`, `Referências/` (TrustShield, Assurena) e `Pádua — Manual de Marca/`. Referência de estrutura: portoseguro.com.br.

---

## Stack

| Tecnologia | Versão | Função |
|---|---|---|
| Next.js | 16.4 (App Router, Turbopack, `cacheComponents` ligado) | Framework |
| React | 19.3 | UI |
| TypeScript | 5 | Tipagem |
| Tailwind CSS | 4 (tokens em `src/app/globals.css`) | Estilização |
| @react-spring/web | 10 | Animações |
| Lenis | 1.3 | Smooth scroll (desligado com reduced-motion) |
| lucide-react | 1.x | Ícones (WhatsApp/Instagram são SVG próprios em `ui/icons.tsx`) |

---

## Estrutura

```
src/
├── app/            layout, page (home), seguro-auto, seguro-empresarial, sobre, contato,
│                   politica-de-privacidade, not-found, sitemap, robots, opengraph-image, icon.svg
├── components/
│   ├── layout/     Header (+TopBar, MobileMenu), Footer, Logo/ShieldMark, WhatsAppFloat (desktop), MobileCtaBar (mobile)
│   ├── sections/   Hero, BenefitCards, ProductCards, WhyPadua, HowItWorks, Comparison, ClaimShortcuts,
│   │               Testimonials, FaqSection, FinalCta, ProductHero, CoverageGrid, ProductCallout, AudienceGrid, PageHero
│   ├── motion/     Reveal, ParallaxImage, Counter, TimelineTrack, SmoothScroll
│   ├── tracking/   TrackingProvider (GTM), TrackingEvents, UTMCapture
│   ├── seo/        JsonLd (+ builders InsuranceAgency, FAQPage, Service, Breadcrumb)
│   └── ui/         Button, WhatsAppButton, Eyebrow, SectionHeading/Highlight, QuoteForm, Accordion, Breadcrumbs, icons
└── lib/
    ├── site.ts     ÚNICO lugar com contatos/dados legais (placeholders marcados)
    ├── content/    home.ts, products.ts (AUTO, EMPRESARIAL), shared.ts (passos, FAQ, comparativo, atalhos)
    ├── tracking.ts, whatsapp.ts, quote.ts, format.ts, metadata.ts, useMediaQuery.ts, useScrolledPast.ts
public/brand (logos SVG sem metadados) · public/images (fotos Unsplash em WebP)
```

---

## Design (manual de marca)

| Elemento | Valor |
|----------|-------|
| Fonte | Archivo (única família, via `next/font`) |
| Navy (primária) | `#16284A` · profundo `#0C1830` |
| Dourado (secundária) | `#B9975B` — só em detalhes; para TEXTO sobre fundo claro usar `gold-dark #7D6232` (contraste) |
| Creme / areia | `#F5F2EC` / `#EDEBE4` / `#E3E0D8` |
| Texto suave | `#5C6878` (claro) · `#AEB7C6` (sobre navy) |
| Assinatura | filete dourado + eyebrow em caixa alta com tracking largo; escudo PC como marca d'água |

Destaque em títulos: `<Highlight>` (dourado no navy; sublinhado dourado no creme).

---

## Conversão e trackeamento

- Todo CTA de WhatsApp tem `data-cta="<id único>"` → `click_whatsapp` + `cta_id`. Outros CTAs: `data-track="click_cta" data-cta-id="..."`.
- `QuoteForm` (passos e campos em `lib/quote.ts` → `QUOTE_STEPS`; rótulos/máscaras em `components/ui/quote/fieldConfig.ts`):
  - **Auto, 3 passos** (pedido da dona da Pádua em 16/10/2026): 1) nome completo, WhatsApp, nascimento, CPF · 2) estado civil, profissão, CEP de pernoite (cidade via ViaCEP) · 3) modelo/versão/ano, placa (obrigatória desde 27/10/2026), situação.
  - **Empresarial, 1 passo**: nome, WhatsApp, cidade, ramo, o que proteger.
  - Valida CPF (dígitos verificadores), nascimento (data real, 18+), CEP, telefone e placa (antiga/Mercosul).
  - Dispara `form_step` (`step` 2 e 3) e `form_complete` (`form_id`, `insurance_type`) e abre `wa.me` com a mensagem pronta + origem (UTMs).
  - **Nunca** colocar CPF, nome, telefone ou outro dado do formulário no dataLayer (teste E2E confere).
- Automáticos: `scroll_25/50/75/100`, `section_view` (toda `main section[id]`), `faq_open`.
- GTM só carrega com `NEXT_PUBLIC_GTM_ID` válido (`GTM-MRMP8MT7`). GA4 (`G-NM41WZ5Y2C`) e Meta Pixel (`1100323236037100`) ficam DENTRO do GTM: contêiner em `gtm/GTM-MRMP8MT7-importar.json` (IDs e eventos no `README.md`). Google Ads: ainda sem conversões (só Meta por enquanto).
- Painel `/dashboard` (`DASHBOARD.md`): coletor anônimo `lib/collector.ts` (SPA, um `page_type` por rota), rotas `app/api/{collect,login,dashboard,ga4,google-ads}`, lógica em `src/server/analytics` (mesma da Nova Ferragista), banco Supabase `padua_*`. Página/seção/botão novo: atualizar os mapas listados no DASHBOARD.md.

---

## Regras do projeto

- Não inventar números, depoimentos ou selos. `TESTIMONIALS` em `lib/content/home.ts` está vazio de propósito (a seção mostra o manifesto até chegarem depoimentos reais).
- O comparativo Seguro x Proteção veicular é neutro/informativo — não afirmar nada sobre regulação das associações.
- `Reveal` controla `transform` via estilo inline: efeitos de hover com transform ficam num elemento filho.
- Heróis usam a classe CSS `.enter` (não `Reveal`) para não atrasar o LCP.
- `cacheComponents`: valores de relógio (`new Date()`) precisam de função com `"use cache"` (ver `Footer`). Páginas visitadas ficam montadas ocultas, então IDs como `#cotacao` podem existir 2x no DOM — testado, a âncora rola para o visível.
- `Button` define `inline-flex`: para esconder por breakpoint, envolva num wrapper (`hidden sm:block`).

---

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
npm test        # Vitest: máscaras/validações, mensagem do WhatsApp, ViaCEP
```

---

## Pendências do cliente

- [x] Número de WhatsApp/telefone — (62) 98229-4264 (recebido em 19/10/2026)
- [ ] CNPJ, registro SUSEP, endereço e horário real (`lib/site.ts`)
- [ ] Depoimentos reais, fotos da Carmilene/equipe, logos das seguradoras parceiras
- [x] Domínio, GTM, GA4 e Meta Pixel (20/10/2026)
- [ ] Conversões do Google Ads (quando a Pádua anunciar no Google)
- [ ] ID numérico da propriedade GA4 (`GA4_PROPERTY_ID`) para o painel

## Histórico

- 2026-10-15 — Site criado (5 páginas + política), trackeamento fase 1, build/lint verdes, QA em 360/390/1440.
- 2026-10-16 — Cotação auto em 3 passos com CPF, CEP, nascimento, estado civil, profissão e veículo (pedido da cliente); testes Vitest (24); política e FAQ atualizadas.
- 2026-10-20 — Trackeamento fases 2 e 3: contêiner do GTM (GA4 + Meta Pixel), coletor first-party e painel /dashboard portados da Nova Ferragista para o Next, canonical no www, política de privacidade citando Pixel e estatística própria.
