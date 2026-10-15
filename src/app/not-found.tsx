import { ArrowLeft } from "lucide-react";
import { ShieldMark } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function NotFound() {
  return (
    <section
      id="nao-encontrada"
      aria-labelledby="erro-title"
      className="navy-glow relative isolate flex min-h-[80svh] items-center overflow-hidden pt-(--header-h)"
    >
      <ShieldMark className="absolute top-1/2 right-[-6rem] -z-10 w-96 -translate-y-1/2 opacity-[0.07] lg:right-[8%]" />
      <div className="container-site flex max-w-2xl flex-col gap-6 py-20">
        <p className="text-sm font-semibold tracking-[0.24em] text-gold uppercase">Erro 404</p>
        <h1 id="erro-title" className="text-[clamp(2.2rem,1.5rem+3vw,3.6rem)] leading-tight font-semibold text-cream">
          Esta página não existe, mas o seu seguro pode.
        </h1>
        <p className="text-lg text-slate-light">
          O endereço pode ter mudado. Volte para o início ou fale com a gente pelo WhatsApp.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/" icon={<ArrowLeft className="size-4" />} iconPosition="start">
            Voltar ao início
          </Button>
          <WhatsAppButton ctaId="cta_whatsapp_404" variant="outline-light" />
        </div>
      </div>
    </section>
  );
}
