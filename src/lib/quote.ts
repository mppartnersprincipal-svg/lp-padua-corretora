import { isValidPhone } from "@/lib/format";
import type { Utms } from "@/lib/tracking";

export type InsuranceType = "auto" | "empresarial";

export const INSURANCE_LABEL: Record<InsuranceType, string> = {
  auto: "Seguro Auto",
  empresarial: "Seguro Empresarial",
};

export interface QuoteValues {
  nome: string;
  telefone: string;
  cidade: string;
  veiculo: string;
  situacao: string;
  ramo: string;
  protecao: string;
}

export type QuoteErrors = Partial<Record<keyof QuoteValues, string>>;

export const EMPTY_QUOTE: QuoteValues = {
  nome: "",
  telefone: "",
  cidade: "",
  veiculo: "",
  situacao: "",
  ramo: "",
  protecao: "",
};

const MIN_NAME_LENGTH = 2;

/** Erros na ordem dos campos na tela (o primeiro recebe o foco). */
export function validateQuote(type: InsuranceType, values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {};
  if (values.nome.trim().length < MIN_NAME_LENGTH) errors.nome = "Informe seu nome.";
  if (!isValidPhone(values.telefone)) errors.telefone = "Informe um telefone com DDD.";
  if (!values.cidade.trim()) errors.cidade = "Informe sua cidade.";

  if (type === "auto") {
    if (!values.veiculo.trim()) errors.veiculo = "Informe o modelo e o ano do veículo.";
    if (!values.situacao) errors.situacao = "Escolha uma opção.";
  } else {
    if (!values.ramo.trim()) errors.ramo = "Informe o ramo da empresa.";
    if (!values.protecao) errors.protecao = "Escolha uma opção.";
  }
  return errors;
}

function formatOrigin(utms: Utms): string | null {
  if (!utms.utm_source) return null;
  return [utms.utm_source, utms.utm_medium, utms.utm_campaign].filter(Boolean).join(" / ");
}

/** Mensagem que chega pronta no WhatsApp da Pádua (negrito no formato do WhatsApp). */
export function buildQuoteMessage(type: InsuranceType, values: QuoteValues, utms: Utms = {}): string {
  const lines = [
    `Olá, Pádua! Quero uma cotação de *${INSURANCE_LABEL[type]}*.`,
    "",
    `*Nome:* ${values.nome.trim()}`,
    `*Telefone:* ${values.telefone.trim()}`,
    `*Cidade/UF:* ${values.cidade.trim()}`,
  ];

  if (type === "auto") {
    lines.push(`*Veículo:* ${values.veiculo.trim()}`, `*Situação:* ${values.situacao}`);
  } else {
    lines.push(`*Ramo da empresa:* ${values.ramo.trim()}`, `*O que proteger:* ${values.protecao}`);
  }

  const origin = formatOrigin(utms);
  if (origin) lines.push("", `_Origem: site · ${origin}_`);
  return lines.join("\n");
}
