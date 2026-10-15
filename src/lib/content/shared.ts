import {
  ClipboardList,
  FileText,
  HeartHandshake,
  Scale,
  Search,
  Siren,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { FaqItem } from "@/components/ui/Accordion";

export interface IconItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const STEPS: IconItem[] = [
  {
    icon: ClipboardList,
    title: "Conte o que precisa",
    description: "Preencha o formulário ou chame no WhatsApp. Pedimos só o essencial para cotar.",
  },
  {
    icon: Search,
    title: "Cotamos no mercado",
    description:
      "Comparamos as seguradoras parceiras e negociamos descontos para chegar ao melhor custo-benefício.",
  },
  {
    icon: Scale,
    title: "Você decide com clareza",
    description: "Explicamos coberturas, franquia e assistências em linguagem simples, sem letra miúda.",
  },
  {
    icon: HeartHandshake,
    title: "A gente segue com você",
    description: "Renovação, alterações e sinistro: você tem uma corretora de verdade do seu lado.",
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 1, suffix: "h", label: "para receber sua cotação, em horário comercial" },
  { value: 27, suffix: "", label: "estados atendidos: cuidamos de clientes em todo o Brasil" },
  { value: 24, suffix: "h", label: "de assistência das seguradoras parceiras, todos os dias" },
];

export interface ComparisonRow {
  topic: string;
  insurance: string;
  association: string;
}

/** Comparativo informativo e neutro — sem afirmações sobre regulação das associações. */
export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    topic: "Quem garante",
    insurance: "Seguradora autorizada pela SUSEP, com reservas financeiras obrigatórias.",
    association: "Associação ou cooperativa, com custos divididos entre os associados.",
  },
  {
    topic: "Valor mensal",
    insurance: "Definido na contratação da apólice.",
    association: "Pode variar conforme os eventos do grupo (rateio).",
  },
  {
    topic: "Opções",
    insurance: "A corretora compara várias seguradoras por você.",
    association: "Uma única associação e suas próprias regras.",
  },
  {
    topic: "Contrato",
    insurance: "Apólice com coberturas, franquia e limites descritos.",
    association: "Regulamento interno da associação.",
  },
  {
    topic: "No sinistro",
    insurance: "Corretor habilitado que defende os seus interesses.",
    association: "Atendimento feito pela própria associação.",
  },
];

export interface ClaimShortcut extends IconItem {
  ctaId: string;
  message: string;
}

export const CLAIM_SHORTCUTS: ClaimShortcut[] = [
  {
    icon: Siren,
    title: "Aviso de sinistro",
    description: "Bateu, foi roubado ou teve um dano na empresa? Orientamos cada passo.",
    ctaId: "cta_whatsapp_sinistro",
    message: "Olá, Pádua! Preciso de ajuda para abrir um aviso de sinistro.",
  },
  {
    icon: Truck,
    title: "Assistência 24h",
    description: "Guincho, chaveiro ou pane: indicamos o canal certo da sua seguradora.",
    ctaId: "cta_whatsapp_assistencia",
    message: "Olá, Pádua! Preciso de assistência (guincho, chaveiro ou pane).",
  },
  {
    icon: FileText,
    title: "Dúvidas da apólice",
    description: "Endosso, troca de veículo, inclusão de condutor ou 2ª via de boleto.",
    ctaId: "cta_whatsapp_apolice",
    message: "Olá, Pádua! Tenho uma dúvida sobre a minha apólice.",
  },
];

export const GENERAL_FAQ: FaqItem[] = [
  {
    question: "Quanto tempo leva para receber a cotação?",
    answer:
      "Na maioria dos casos, em até 1 hora depois de recebermos seus dados, em horário comercial. Casos empresariais mais complexos podem levar um pouco mais, e a gente avisa o prazo.",
  },
  {
    question: "Vocês atendem fora da minha cidade?",
    answer:
      "Sim. O atendimento é feito pelo WhatsApp, então cuidamos de clientes em todo o Brasil com a mesma proximidade de quem está do lado.",
  },
  {
    question: "Contratar com corretora sai mais caro?",
    answer:
      "Não. O valor do seguro é definido pela seguradora, e a remuneração do corretor já faz parte dele. A diferença é que, com a Pádua, você compara várias seguradoras e tem quem cuide de você depois da contratação.",
  },
  {
    question: "O que acontece se eu precisar acionar o seguro?",
    answer:
      "Você fala com a gente. Orientamos o aviso de sinistro, ajudamos com os documentos e acompanhamos o processo com a seguradora até a conclusão.",
  },
  {
    question: "Posso trocar meu seguro atual pela Pádua?",
    answer:
      "Pode, e o melhor momento é na renovação. Cotamos de novo, comparamos com a sua apólice atual e cuidamos da transferência da classe de bônus.",
  },
];
