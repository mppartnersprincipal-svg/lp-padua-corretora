/**
 * Dados institucionais da Pádua — ÚNICO lugar para trocar contatos.
 * Itens marcados com PLACEHOLDER ainda não foram enviados pelo cliente.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const SITE = {
  name: "Pádua Corretora",
  legalName: "Pádua Administradora e Corretora de Seguros",
  tagline: "Administradora e Corretora de Seguros",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://paduaseguros.com.br",
  email: "contato@paduaseguros.com.br",
  instagramUrl: "https://www.instagram.com/paduaseguros/",
  instagramHandle: "@paduaseguros",
  // PLACEHOLDER: número de WhatsApp com DDI + DDD, só dígitos (ex.: 5511999999999)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5500000000000",
  // PLACEHOLDER: telefone exibido e link tel:
  phoneDisplay: "(00) 00000-0000",
  phoneHref: "tel:+5500000000000",
  // PLACEHOLDER: dados legais
  cnpj: "00.000.000/0001-00",
  susep: "000000000",
  // PLACEHOLDER: endereço (null esconde o bloco de endereço e o mapa)
  address: null as null | {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  },
  // PLACEHOLDER: horário de atendimento a confirmar com o cliente
  hours: "Segunda a sexta, das 8h às 18h",
  areaServed: "Todo o Brasil",
} as const;

const PLACEHOLDER_PHONE_PREFIX = "5500";

export function hasRealPhone(): boolean {
  return !SITE.whatsappNumber.startsWith(PLACEHOLDER_PHONE_PREFIX);
}

// Páginas que têm o formulário de cotação (âncora #cotacao)
const PAGES_WITH_QUOTE_FORM = ["/", "/seguro-auto", "/seguro-empresarial", "/contato"];

/** Destino do botão "Cotar": o formulário da própria página ou o da home. */
export function getQuoteHref(pathname: string): string {
  return PAGES_WITH_QUOTE_FORM.includes(pathname) ? "#cotacao" : "/#cotacao";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Seguro Auto", href: "/seguro-auto" },
  { label: "Seguro Empresarial", href: "/seguro-empresarial" },
  { label: "Sobre a Pádua", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export const QUOTE_ANCHOR = "#cotacao";
