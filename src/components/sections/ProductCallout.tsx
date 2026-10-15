import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { ProductContent } from "@/lib/content/products";

interface ProductCalloutProps {
  product: ProductContent;
}

export function ProductCallout({ product }: ProductCalloutProps) {
  const { callout } = product;
  return (
    <section id="destaque" aria-labelledby="destaque-title" className="section-y relative overflow-hidden bg-sand">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal scale={0.96} y={0} className="relative">
          <div aria-hidden="true" className="dot-grid absolute -right-4 -bottom-6 h-32 w-36 opacity-50" />
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-lift lg:aspect-5/4">
            <Image
              src={callout.image}
              alt={callout.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-6">
          <Eyebrow>{callout.eyebrow}</Eyebrow>
          <h2
            id="destaque-title"
            className="text-[clamp(1.85rem,1.25rem+2.2vw,2.9rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance text-navy"
          >
            {callout.title}
          </h2>
          <p className="text-lg leading-relaxed text-slate">{callout.text}</p>
          <WhatsAppButton
            ctaId={`cta_whatsapp_destaque_${product.type}`}
            message={callout.whatsappMessage}
            label={callout.ctaLabel}
            variant="navy"
            size="lg"
            className="self-start"
          />
        </Reveal>
      </div>
    </section>
  );
}
