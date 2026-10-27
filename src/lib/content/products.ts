import {
  Briefcase,
  Building2,
  Car,
  CarFront,
  CloudLightning,
  Factory,
  Flame,
  HeartPulse,
  KeyRound,
  Laptop,
  Repeat,
  Scale,
  ShieldAlert,
  Sparkles,
  Store,
  TrendingDown,
  Truck,
  Users,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { FaqItem } from "@/components/ui/Accordion";
import type { IconItem } from "@/lib/content/shared";
import type { InsuranceType } from "@/lib/quote";

export interface ProductContent {
  type: InsuranceType;
  slug: string;
  name: string;
  icon: LucideIcon;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    bullets: string[];
    image: string;
  };
  card: {
    image: string;
    imageAlt: string;
    description: string;
    bullets: string[];
  };
  coveragesTitle: string;
  coverages: IconItem[];
  callout: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    imageAlt: string;
    ctaLabel: string;
    whatsappMessage: string;
  };
  audienceTitle: string;
  audience: IconItem[];
  faq: FaqItem[];
}

export const AUTO: ProductContent = {
  type: "auto",
  slug: "/seguro-auto",
  name: "Seguro Auto",
  icon: Car,
  metaTitle: "Seguro Auto com cotação em até 1h",
  metaDescription:
    "Cote seu seguro auto com a Pádua Corretora: comparamos várias seguradoras, buscamos descontos e acompanhamos você no sinistro. Atendimento pelo WhatsApp em todo o Brasil.",
  hero: {
    eyebrow: "Seguro Auto",
    title: "Seu carro protegido e você",
    highlight: "bem atendido",
    description:
      "Comparamos as seguradoras parceiras para encontrar a proteção certa pelo melhor custo-benefício. E quando precisar, é com a Pádua que você fala.",
    bullets: ["Colisão, roubo e terceiros", "Assistência 24h e carro reserva", "Bônus mantido na renovação"],
    image: "/images/hero-auto.webp",
  },
  card: {
    image: "/images/card-auto.webp",
    imageAlt: "Mão segurando a chave de um carro prata estacionado",
    description: "Proteção completa para o seu carro, com assistência 24h e quem cuide de você no sinistro.",
    bullets: ["Colisão, roubo e furto", "Danos a terceiros", "Carro reserva e guincho"],
  },
  coveragesTitle: "Coberturas para rodar tranquilo",
  coverages: [
    {
      icon: Car,
      title: "Colisão e perda total",
      description: "Reparo ou indenização em caso de batida, capotamento e outros acidentes.",
    },
    {
      icon: ShieldAlert,
      title: "Roubo e furto",
      description: "Indenização se o veículo for roubado ou furtado e não for recuperado.",
    },
    {
      icon: Users,
      title: "Danos a terceiros",
      description: "Cobre danos materiais e corporais causados a outras pessoas e veículos.",
    },
    {
      icon: Truck,
      title: "Assistência 24h",
      description: "Guincho, chaveiro, troca de pneu e pane seca, a qualquer hora do dia.",
    },
    {
      icon: KeyRound,
      title: "Carro reserva",
      description: "Um carro à sua disposição enquanto o seu está na oficina.",
    },
    {
      icon: Sparkles,
      title: "Vidros, faróis e lanternas",
      description: "Reparo ou troca com franquia reduzida, conforme o plano escolhido.",
    },
    {
      icon: CloudLightning,
      title: "Eventos da natureza",
      description: "Alagamento, granizo e queda de árvore sobre o veículo, conforme o plano.",
    },
    {
      icon: HeartPulse,
      title: "Acidentes pessoais (APP)",
      description: "Indenização para motorista e passageiros em caso de acidente.",
    },
  ],
  callout: {
    eyebrow: "Carro novo",
    title: "Comprou um 0 km? Cote com a Pádua antes de fechar na concessionária.",
    text: "Na hora da compra, a concessionária costuma oferecer o seguro junto com o carro. Antes de assinar, peça uma cotação para a gente: comparamos várias seguradoras, negociamos descontos e você continua com uma corretora do seu lado depois da compra.",
    image: "/images/chave.webp",
    imageAlt: "Entrega da chave de um carro novo",
    ctaLabel: "Cotar meu carro novo",
    whatsappMessage: "Olá, Pádua! Comprei (ou vou comprar) um carro 0 km e quero cotar o seguro.",
  },
  audienceTitle: "Para quem é o Seguro Auto da Pádua",
  audience: [
    {
      icon: CarFront,
      title: "Carro novo (0 km)",
      description: "Compare antes de aceitar o seguro oferecido na concessionária.",
    },
    {
      icon: Car,
      title: "Uso no dia a dia",
      description: "Proteção completa para quem depende do carro na rotina.",
    },
    {
      icon: Repeat,
      title: "Renovação",
      description: "Vai renovar? Cotamos de novo e mantemos a sua classe de bônus.",
    },
    {
      icon: Truck,
      title: "Utilitários e pick-ups",
      description: "Para quem usa o veículo também no trabalho.",
    },
  ],
  faq: [
    {
      question: "O que preciso para cotar o seguro auto?",
      answer:
        "CPF, data de nascimento, estado civil e profissão do principal condutor, o CEP onde o carro passa a noite e os dados do veículo (modelo, versão, ano e placa). Se tiver, a apólice atual também ajuda. Com isso a cotação sai rápido.",
    },
    {
      question: "Trocar de seguradora faz perder o bônus?",
      answer:
        "Não. A classe de bônus acompanha você na renovação, mesmo mudando de seguradora, desde que a renovação seja feita dentro do prazo. A Pádua cuida dessa transferência.",
    },
    {
      question: "O seguro da concessionária é mais barato?",
      answer:
        "Nem sempre. A concessionária trabalha com algumas seguradoras e condições próprias. A cotação com a Pádua é gratuita e mostra se dá para pagar menos ou ter coberturas melhores pelo mesmo valor.",
    },
    {
      question: "Posso incluir outro motorista na apólice?",
      answer:
        "Sim. Informe na cotação quem mais dirige o carro. Declarar os condutores corretamente evita problemas na hora de um sinistro.",
    },
    {
      question: "O que fazer em caso de batida?",
      answer:
        "Garanta a segurança de todos, acione o socorro se houver vítimas e registre fotos do local. Depois fale com a Pádua: orientamos o aviso de sinistro e acompanhamos até o fim.",
    },
  ],
};

export const EMPRESARIAL: ProductContent = {
  type: "empresarial",
  slug: "/seguro-empresarial",
  name: "Seguro Empresarial",
  icon: Building2,
  metaTitle: "Seguro Empresarial sob medida para o seu negócio",
  metaDescription:
    "Seguro empresarial para comércios, escritórios e indústrias: incêndio, roubo, danos elétricos, responsabilidade civil e mais. Cotação com a Pádua Corretora pelo WhatsApp.",
  hero: {
    eyebrow: "Seguro Empresarial",
    title: "Seu negócio protegido para",
    highlight: "seguir crescendo",
    description:
      "Montamos a apólice a partir da realidade da sua empresa: o que você tem, onde opera e o que não pode parar. Sem cobertura de prateleira.",
    bullets: ["Incêndio, roubo e danos elétricos", "Responsabilidade civil", "Lucros cessantes"],
    image: "/images/hero-empresarial.webp",
  },
  card: {
    image: "/images/card-empresarial.webp",
    imageAlt: "Empreendedor atendendo uma cliente no balcão da loja",
    description: "Proteção sob medida para o patrimônio, os equipamentos e a operação da sua empresa.",
    bullets: ["Incêndio, roubo e danos elétricos", "Responsabilidade civil", "Assistência 24h empresarial"],
  },
  coveragesTitle: "Coberturas para o seu negócio não parar",
  coverages: [
    {
      icon: Flame,
      title: "Incêndio, raio e explosão",
      description: "A cobertura básica que protege o imóvel e o conteúdo da empresa.",
    },
    {
      icon: ShieldAlert,
      title: "Roubo e furto qualificado",
      description: "Bens, mercadorias e equipamentos protegidos contra roubo e arrombamento.",
    },
    {
      icon: Zap,
      title: "Danos elétricos",
      description: "Curto-circuito e oscilação de energia em máquinas e instalações.",
    },
    {
      icon: Scale,
      title: "Responsabilidade civil",
      description: "Danos causados a clientes e terceiros dentro do seu estabelecimento.",
    },
    {
      icon: TrendingDown,
      title: "Lucros cessantes",
      description: "Ajuda a manter as contas em dia se a operação parar por um sinistro coberto.",
    },
    {
      icon: Laptop,
      title: "Equipamentos eletrônicos",
      description: "Computadores, maquininhas e equipamentos do dia a dia da empresa.",
    },
    {
      icon: Wind,
      title: "Vendaval e granizo",
      description: "Danos causados por eventos climáticos ao imóvel e ao conteúdo.",
    },
    {
      icon: Wrench,
      title: "Assistência 24h",
      description: "Chaveiro, eletricista, encanador e vidraceiro quando você precisar.",
    },
  ],
  callout: {
    eyebrow: "Sob medida",
    title: "Cada negócio tem riscos diferentes. A sua apólice também deveria ter.",
    text: "Uma loja de rua, um escritório e um galpão não precisam da mesma proteção. Entendemos a sua operação antes de cotar, para você não pagar por cobertura que não usa nem ficar descoberto no que importa.",
    image: "/images/comercio.webp",
    imageAlt: "Atendimento em uma loja com clientes no balcão",
    ctaLabel: "Falar sobre minha empresa",
    whatsappMessage: "Olá, Pádua! Quero entender qual seguro empresarial faz sentido para o meu negócio.",
  },
  audienceTitle: "Para quem é o Seguro Empresarial",
  audience: [
    {
      icon: Store,
      title: "Comércio e lojas",
      description: "Estoque, vitrine, caixa e clientes protegidos no dia a dia.",
    },
    {
      icon: Briefcase,
      title: "Escritórios e consultórios",
      description: "Equipamentos, mobiliário e responsabilidade com quem você atende.",
    },
    {
      icon: Factory,
      title: "Indústrias e galpões",
      description: "Máquinas, matéria-prima e a continuidade da produção.",
    },
    {
      icon: Wrench,
      title: "Prestadores de serviço",
      description: "Oficinas, salões, restaurantes e negócios de todos os portes.",
    },
  ],
  faq: [
    {
      question: "Quais empresas podem contratar?",
      answer:
        "Comércios, escritórios, consultórios, indústrias e prestadores de serviço de todos os portes. A apólice é montada conforme a atividade e o local.",
    },
    {
      question: "MEI pode fazer seguro empresarial?",
      answer:
        "Pode. Existem planos pensados para pequenos negócios, com coberturas essenciais e valores acessíveis. A gente ajuda a escolher o que faz sentido.",
    },
    {
      question: "O seguro cobre imóvel alugado?",
      answer:
        "Sim. É possível segurar o conteúdo e as benfeitorias, e muitos contratos de aluguel exigem seguro contra incêndio. A Pádua ajuda a atender essa exigência.",
    },
    {
      question: "Como é definido o valor do seguro empresarial?",
      answer:
        "O valor depende da atividade, da localização, dos bens protegidos e das coberturas escolhidas. Por isso cotamos depois de entender o seu negócio.",
    },
  ],
};

export const PRODUCTS: ProductContent[] = [AUTO, EMPRESARIAL];
