import { BadgePercent, Clock, Headset, HeartHandshake, MapPin, Scale, ShieldCheck } from "lucide-react";
import type { IconItem } from "@/lib/content/shared";

export const HERO_BADGES = [
  { icon: Clock, label: "Cotação em até 1h" },
  { icon: MapPin, label: "Todo o Brasil" },
  { icon: Scale, label: "Várias seguradoras" },
  { icon: HeartHandshake, label: "Pós-venda dedicado" },
];

export const BENEFITS: IconItem[] = [
  {
    icon: Headset,
    title: "Atendimento humano",
    description: "Nada de robô ou central sem fim. Você fala com quem conhece o seu seguro.",
  },
  {
    icon: BadgePercent,
    title: "Melhor custo-benefício",
    description: "Comparamos seguradoras e negociamos descontos antes de apresentar a proposta.",
  },
  {
    icon: ShieldCheck,
    title: "Presença no sinistro",
    description: "Quando você mais precisa, a Pádua acompanha cada etapa com a seguradora.",
  },
];

export const WHY_POINTS = [
  "Atendimento próximo do primeiro contato até o sinistro",
  "Comparação entre seguradoras para encontrar o melhor custo-benefício",
  "Negociação de descontos direto com as seguradoras",
  "Lembrete e nova cotação na renovação, sem perder o bônus",
  "Tudo pelo WhatsApp, com agilidade, em qualquer lugar do Brasil",
];

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

/**
 * PLACEHOLDER: depoimentos reais enviados pela Pádua.
 * Enquanto a lista estiver vazia, a seção mostra o manifesto da marca.
 */
export const TESTIMONIALS: Testimonial[] = [];

export const MANIFESTO = {
  quote:
    "Nascemos com um objetivo simples: atender tão bem no pós-venda que cada cliente se torne uma indicação.",
  author: "Pádua Corretora",
};
