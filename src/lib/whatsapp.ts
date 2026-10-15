import { SITE } from "@/lib/site";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, Pádua! Vim pelo site e gostaria de fazer uma cotação de seguro.";

export function buildWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Abre o WhatsApp numa nova aba; se o navegador bloquear o pop-up,
 * navega na mesma aba para não perder o lead.
 */
export function openWhatsApp(url: string): void {
  const win = window.open(url, "_blank");
  if (win) {
    win.opener = null;
    return;
  }
  window.location.href = url;
}
