# Site — Pádua Corretora de Seguros

Site institucional da Pádua (Seguro Auto + Seguro Empresarial) em **https://www.paduaseguros.com.br**.
Next.js 16 (App Router) + Tailwind 4, deploy na Vercel. Contexto do projeto em `CLAUDE.md`; painel em `DASHBOARD.md`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
npm test        # Vitest + node --test (analytics do painel)
```

## Rastreamento

| Ferramenta | ID | Onde |
|---|---|---|
| Google Tag Manager | `GTM-MRMP8MT7` | `NEXT_PUBLIC_GTM_ID` → `components/tracking/TrackingProvider.tsx` |
| GA4 | `G-NM41WZ5Y2C` (fluxo `16168285618`) | dentro do GTM |
| Meta Pixel | `1100323236037100` | dentro do GTM (HTML personalizado) |
| Google Ads | pendente (a Pádua ainda não anuncia no Google) | Vinculador de conversões já está no GTM |
| Painel próprio | `/dashboard` | ver `DASHBOARD.md` |

**Regra:** GA4, Pixel e Ads só pelo GTM. Nada de `gtag`/`fbq` direto no código (contaria em dobro).

### Contêiner do GTM

`gtm/GTM-MRMP8MT7-importar.json` (gerado pela skill `lp-tracking-dashboard`): Google Tag do GA4, uma tag de evento
GA4 com nome = `{{Event}}` para todos os eventos abaixo (com `cta_id`, `section_id`, `percent_scrolled`, `faq_question`,
`form_id`, `insurance_type`, `step` e UTMs), Vinculador de conversões, Meta Pixel (base + PageView em toda página e
em cada troca de rota), `Contact` no `click_whatsapp` e `Lead` no `form_submit`.

Importar: GTM → Administrador → Importar contêiner → arquivo → espaço de trabalho existente → **Mesclar** +
**Substituir conflitantes** → Visualizar → **Enviar → Publicar**. No GA4, marcar `click_whatsapp` e `form_submit`
como **eventos-chave**.

### Eventos (`src/lib/tracking.ts`)

| Evento | Quando | Parâmetros |
|---|---|---|
| `click_whatsapp` | qualquer link de WhatsApp (`data-cta`) | `cta_id` |
| `form_step` | avançou um passo do formulário de cotação | `form_id`, `insurance_type`, `step` |
| `form_submit` | enviou a cotação (abre o WhatsApp com a mensagem pronta) | `form_id`, `insurance_type` |
| `click_cta` | botões "Cotar", cards de seguro, links internos (`data-track`) | `cta_id` |
| `click_email` / `click_instagram` / `click_phone` | links de contato | — |
| `faq_open` | abriu uma pergunta | `faq_question` |
| `scroll_25/50/75/100` | rolagem (uma vez por página) | `percent_scrolled` |
| `section_view` | seção apareceu (`main section[id]`) | `section_id` |

Todos levam as UTMs da entrada (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`). Dados do
formulário (nome, CPF, telefone…) **nunca** vão para o `dataLayer` nem para o painel.

`cta_id` de WhatsApp: `cta_whatsapp_hero`, `cta_whatsapp_hero_auto`, `cta_whatsapp_hero_empresarial`, `fab_whatsapp`,
`cta_whatsapp_barra_mobile`, `cta_whatsapp_menu`, `cta_whatsapp_footer`, `cta_whatsapp_footer_contato`,
`cta_whatsapp_contato`, `cta_whatsapp_404`, `cta_whatsapp_sinistro`, `cta_whatsapp_assistencia`,
`cta_whatsapp_apolice`, `cta_whatsapp_faq_<home|auto|empresarial|contato>`.
`form_id`: `form_hero_home`, `form_hero_auto`, `form_hero_empresarial`, `form_contato`.
Outros `cta_id`: `cta_cotar_header`, `cta_cotar_hero`, `cta_cotar_menu`, `cta_cotar_barra_mobile`,
`cta_cotar_final_<home|auto|sobre>`, `cta_topbar_sinistro`, `card_auto`, `card_empresarial`, `cta_sobre`.

### Anúncios no Meta

Para o painel separar **Meta Ads** de Instagram/Facebook orgânico, use nos anúncios (Parâmetros de URL):

```
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}
```

(`utm_source=instagram` também funciona; o que marca "pago" é o `utm_medium` com `paid`, `cpc` ou `ads`.)
