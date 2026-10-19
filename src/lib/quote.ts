import { isValidCep, isValidCpf, isValidPhone, isValidPlate, validateBirthDate } from "@/lib/format";
import type { Utms } from "@/lib/tracking";

export type InsuranceType = "auto" | "empresarial";

export const INSURANCE_LABEL: Record<InsuranceType, string> = {
  auto: "Seguro Auto",
  empresarial: "Seguro Empresarial",
};

export interface QuoteValues {
  nome: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  estadoCivil: string;
  profissao: string;
  cep: string;
  cidade: string;
  veiculo: string;
  placa: string;
  situacao: string;
  ramo: string;
  protecao: string;
}

export type QuoteField = keyof QuoteValues;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const EMPTY_QUOTE: QuoteValues = {
  nome: "",
  telefone: "",
  nascimento: "",
  cpf: "",
  estadoCivil: "",
  profissao: "",
  cep: "",
  cidade: "",
  veiculo: "",
  placa: "",
  situacao: "",
  ramo: "",
  protecao: "",
};

export interface QuoteStep {
  title: string;
  fields: QuoteField[];
}

/**
 * Auto: dados que a Pádua pede para cotar (CPF, CEP, nascimento, estado civil,
 * profissão e veículo), divididos em 3 passos curtos. Empresarial: passo único.
 */
export const QUOTE_STEPS: Record<InsuranceType, QuoteStep[]> = {
  auto: [
    { title: "Seus dados", fields: ["nome", "telefone", "nascimento", "cpf"] },
    { title: "Seu perfil", fields: ["estadoCivil", "profissao", "cep"] },
    { title: "Seu veículo", fields: ["veiculo", "placa", "situacao"] },
  ],
  empresarial: [{ title: "Sua empresa", fields: ["nome", "telefone", "cidade", "ramo", "protecao"] }],
};

type Validator = (value: string) => string | null;

const required =
  (message: string): Validator =>
  (value) =>
    value.trim() ? null : message;

const VALIDATORS: Record<QuoteField, Validator> = {
  nome: (value) => (/\S+\s+\S+/.test(value.trim()) ? null : "Informe nome e sobrenome."),
  telefone: (value) => (isValidPhone(value) ? null : "Informe um telefone com DDD."),
  nascimento: (value) => validateBirthDate(value),
  cpf: (value) => (isValidCpf(value) ? null : "Informe um CPF válido."),
  estadoCivil: required("Escolha uma opção."),
  profissao: required("Informe sua profissão."),
  cep: (value) => (isValidCep(value) ? null : "Informe um CEP com 8 números."),
  cidade: required("Informe sua cidade."),
  veiculo: required("Informe o modelo e o ano do veículo."),
  // Placa é opcional: só valida se foi preenchida
  placa: (value) => (!value.trim() || isValidPlate(value) ? null : "Confira a placa (ex.: ABC1D23)."),
  situacao: required("Escolha uma opção."),
  ramo: required("Informe o ramo da empresa."),
  protecao: required("Escolha uma opção."),
};

/** Erros na ordem dos campos informados (o primeiro recebe o foco). */
export function validateFields(fields: QuoteField[], values: QuoteValues): QuoteErrors {
  return fields.reduce<QuoteErrors>((errors, field) => {
    const message = VALIDATORS[field](values[field]);
    return message ? { ...errors, [field]: message } : errors;
  }, {});
}

export function getQuoteFields(type: InsuranceType): QuoteField[] {
  return QUOTE_STEPS[type].flatMap((step) => step.fields);
}

export function validateQuote(type: InsuranceType, values: QuoteValues): QuoteErrors {
  return validateFields(getQuoteFields(type), values);
}

const MESSAGE_LABELS: Record<QuoteField, string> = {
  nome: "Nome",
  telefone: "Telefone",
  nascimento: "Data de nascimento",
  cpf: "CPF",
  estadoCivil: "Estado civil",
  profissao: "Profissão",
  cep: "CEP de pernoite",
  cidade: "Cidade/UF",
  veiculo: "Veículo",
  placa: "Placa",
  situacao: "Situação",
  ramo: "Ramo da empresa",
  protecao: "O que proteger",
};

export interface QuoteMessageExtras {
  /** Cidade/UF encontrada pelo CEP, ex.: "Campinas/SP" */
  cepCity?: string;
}

function formatOrigin(utms: Utms): string | null {
  if (!utms.utm_source) return null;
  return [utms.utm_source, utms.utm_medium, utms.utm_campaign].filter(Boolean).join(" / ");
}

/** Mensagem que chega pronta no WhatsApp da Pádua (negrito no formato do WhatsApp). */
export function buildQuoteMessage(
  type: InsuranceType,
  values: QuoteValues,
  utms: Utms = {},
  extras: QuoteMessageExtras = {},
): string {
  const fieldLines = getQuoteFields(type)
    .filter((field) => values[field].trim())
    .map((field) => {
      const value = values[field].trim();
      const display = field === "cep" && extras.cepCity ? `${value} (${extras.cepCity})` : value;
      return `*${MESSAGE_LABELS[field]}:* ${display}`;
    });

  const lines = [`Olá, Pádua! Quero uma cotação de *${INSURANCE_LABEL[type]}*.`, "", ...fieldLines];
  const origin = formatOrigin(utms);
  if (origin) lines.push("", `_Origem: site · ${origin}_`);
  return lines.join("\n");
}
