import { Button, type ButtonVariant } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  /** ID único do botão para o GTM (ex.: cta_whatsapp_hero) */
  ctaId: string;
  message?: string;
  label?: string;
  variant?: ButtonVariant;
  size?: "md" | "lg";
  className?: string;
}

export function WhatsAppButton({
  ctaId,
  message,
  label = "Falar no WhatsApp",
  variant = "gold",
  size = "md",
  className,
}: WhatsAppButtonProps) {
  return (
    <Button
      href={buildWhatsAppUrl(message)}
      variant={variant}
      size={size}
      className={className}
      icon={<WhatsAppIcon className="size-5" />}
      iconPosition="start"
      data-cta={ctaId}
      aria-label={`${label} (abre em nova aba)`}
    >
      {label}
    </Button>
  );
}
