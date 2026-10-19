import type { Ref } from "react";
import { CircleCheck, RotateCcw } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";

interface QuoteSuccessProps {
  ref?: Ref<HTMLDivElement>;
  whatsappUrl: string;
  onReset: () => void;
}

export function QuoteSuccess({ ref, whatsappUrl, onReset }: QuoteSuccessProps) {
  return (
    <div ref={ref} tabIndex={-1} className="flex flex-col items-start gap-4 py-6 outline-none">
      <span className="grid size-14 place-items-center rounded-full bg-gold/15 text-gold-dark">
        <CircleCheck className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-2xl font-semibold text-navy">Pronto! Abrimos o WhatsApp.</h2>
      <p className="leading-relaxed text-slate">
        Sua mensagem já está escrita com os dados da cotação. É só tocar em enviar. Se o WhatsApp não
        abriu, use o botão abaixo.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-5 font-semibold text-navy-deep transition hover:bg-gold-light"
        >
          <WhatsAppIcon className="size-5" />
          Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-navy/15 px-5 font-semibold text-navy transition hover:border-navy"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Nova cotação
        </button>
      </div>
    </div>
  );
}
