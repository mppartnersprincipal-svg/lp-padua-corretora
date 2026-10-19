import { maskCep, maskCpf, maskDate, maskPhone, maskPlate } from "@/lib/format";
import type { QuoteField } from "@/lib/quote";

export interface QuoteFieldConfig {
  label: string;
  kind: "text" | "select";
  placeholder?: string;
  type?: "text" | "tel";
  inputMode?: "text" | "numeric";
  autoComplete?: string;
  options?: string[];
  mask?: (value: string) => string;
  /** Texto de apoio abaixo do campo */
  hint?: string;
  /** Ocupa as duas colunas quando o card é largo */
  isFullWidth?: boolean;
}

const ESTADO_CIVIL_OPTIONS = ["Solteiro(a)", "Casado(a)", "União estável", "Divorciado(a)", "Viúvo(a)"];

const SITUACAO_OPTIONS = [
  "Quero renovar ou comparar meu seguro atual",
  "Carro novo (0 km)",
  "Carro usado, sem seguro hoje",
];

const PROTECAO_OPTIONS = [
  "Imóvel, estoque e mercadorias",
  "Máquinas e equipamentos",
  "Responsabilidade civil",
  "Frota da empresa",
  "Ainda não sei, quero orientação",
];

export const QUOTE_FIELDS: Record<QuoteField, QuoteFieldConfig> = {
  nome: {
    label: "Nome completo",
    kind: "text",
    autoComplete: "name",
    placeholder: "Como está no seu documento",
    isFullWidth: true,
  },
  telefone: {
    label: "WhatsApp",
    kind: "text",
    type: "tel",
    inputMode: "numeric",
    autoComplete: "tel-national",
    placeholder: "(00) 00000-0000",
    mask: maskPhone,
  },
  nascimento: {
    label: "Data de nascimento",
    kind: "text",
    inputMode: "numeric",
    autoComplete: "bday",
    placeholder: "DD/MM/AAAA",
    mask: maskDate,
  },
  cpf: {
    label: "CPF",
    kind: "text",
    inputMode: "numeric",
    autoComplete: "off",
    placeholder: "000.000.000-00",
    mask: maskCpf,
    hint: "As seguradoras usam o CPF para calcular o seu preço.",
    isFullWidth: true,
  },
  estadoCivil: { label: "Estado civil", kind: "select", options: ESTADO_CIVIL_OPTIONS },
  profissao: {
    label: "Profissão",
    kind: "text",
    autoComplete: "organization-title",
    placeholder: "Ex.: professora, motorista",
  },
  cep: {
    label: "CEP onde o carro passa a noite",
    kind: "text",
    inputMode: "numeric",
    autoComplete: "postal-code",
    placeholder: "00000-000",
    mask: maskCep,
    isFullWidth: true,
  },
  cidade: {
    label: "Cidade / UF",
    kind: "text",
    autoComplete: "address-level2",
    placeholder: "Ex.: Campinas / SP",
  },
  veiculo: {
    label: "Modelo, versão e ano do veículo",
    kind: "text",
    placeholder: "Ex.: Onix LT 1.0 2023",
    isFullWidth: true,
  },
  placa: {
    label: "Placa (opcional)",
    kind: "text",
    autoComplete: "off",
    placeholder: "ABC1D23",
    mask: maskPlate,
    hint: "Ajuda a encontrar o veículo exato.",
    isFullWidth: true,
  },
  situacao: { label: "Qual é a sua situação?", kind: "select", options: SITUACAO_OPTIONS, isFullWidth: true },
  ramo: {
    label: "Ramo da empresa",
    kind: "text",
    placeholder: "Ex.: loja de roupas, oficina, escritório",
    isFullWidth: true,
  },
  protecao: { label: "O que você quer proteger?", kind: "select", options: PROTECAO_OPTIONS, isFullWidth: true },
};
