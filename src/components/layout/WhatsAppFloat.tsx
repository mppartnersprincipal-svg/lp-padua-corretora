import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Botão flutuante de WhatsApp (desktop). No mobile quem faz esse papel é a MobileCtaBar. */
export function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="fab_whatsapp"
      data-section="flutuante"
      aria-label="Falar com a Pádua no WhatsApp (abre em nova aba)"
      className="group fixed right-6 bottom-6 z-40 hidden items-center lg:flex"
    >
      <span className="mr-3 translate-x-2 rounded-full bg-navy-deep px-4 py-2 text-sm font-medium text-cream opacity-0 shadow-lift transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        Fale com a Pádua
      </span>
      <span className="relative grid size-16 place-items-center rounded-full bg-gold text-navy-deep shadow-gold transition-transform duration-300 group-hover:scale-110">
        <span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full bg-gold" />
        <WhatsAppIcon className="relative size-7" />
      </span>
    </a>
  );
}
