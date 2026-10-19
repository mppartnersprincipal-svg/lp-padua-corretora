import { describe, expect, it } from "vitest";
import {
  buildQuoteMessage,
  EMPTY_QUOTE,
  QUOTE_STEPS,
  validateFields,
  validateQuote,
  type QuoteValues,
} from "@/lib/quote";

const AUTO_VALUES: QuoteValues = {
  ...EMPTY_QUOTE,
  nome: "Maria Silva",
  telefone: "(11) 98765-4321",
  nascimento: "15/03/1990",
  cpf: "529.982.247-25",
  estadoCivil: "Casado(a)",
  profissao: "Professora",
  cep: "13010-000",
  veiculo: "Onix LT 1.0 2023",
  situacao: "Carro novo (0 km)",
};

describe("passos do formulário", () => {
  it("auto pede os dados exigidos pela Pádua", () => {
    const fields = QUOTE_STEPS.auto.flatMap((step) => step.fields);
    expect(fields).toEqual(
      expect.arrayContaining(["cpf", "cep", "nascimento", "estadoCivil", "profissao", "veiculo"]),
    );
    expect(QUOTE_STEPS.auto).toHaveLength(3);
  });

  it("empresarial continua em passo único e sem CPF", () => {
    expect(QUOTE_STEPS.empresarial).toHaveLength(1);
    expect(QUOTE_STEPS.empresarial[0].fields).not.toContain("cpf");
  });
});

describe("validação", () => {
  it("valida só os campos do passo informado, na ordem da tela", () => {
    const errors = validateFields(QUOTE_STEPS.auto[0].fields, EMPTY_QUOTE);
    expect(Object.keys(errors)).toEqual(["nome", "telefone", "nascimento", "cpf"]);
  });

  it("exige nome e sobrenome", () => {
    expect(validateFields(["nome"], { ...EMPTY_QUOTE, nome: "Maria" }).nome).toBe("Informe nome e sobrenome.");
  });

  it("placa é opcional, mas validada quando preenchida", () => {
    expect(validateFields(["placa"], EMPTY_QUOTE)).toEqual({});
    expect(validateFields(["placa"], { ...EMPTY_QUOTE, placa: "AB12" }).placa).toBeDefined();
  });

  it("cotação auto completa não tem erros", () => {
    expect(validateQuote("auto", AUTO_VALUES)).toEqual({});
  });
});

describe("buildQuoteMessage", () => {
  it("leva todos os dados do auto, a cidade do CEP e a origem da campanha", () => {
    const message = buildQuoteMessage(
      "auto",
      AUTO_VALUES,
      { utm_source: "google", utm_medium: "cpc", utm_campaign: "auto" },
      { cepCity: "Campinas/SP" },
    );
    expect(message).toContain("*Seguro Auto*");
    expect(message).toContain("*CPF:* 529.982.247-25");
    expect(message).toContain("*Data de nascimento:* 15/03/1990");
    expect(message).toContain("*Estado civil:* Casado(a)");
    expect(message).toContain("*Profissão:* Professora");
    expect(message).toContain("*CEP de pernoite:* 13010-000 (Campinas/SP)");
    expect(message).toContain("*Veículo:* Onix LT 1.0 2023");
    expect(message).toContain("_Origem: site · google / cpc / auto_");
  });

  it("omite campos opcionais vazios e a origem sem UTM", () => {
    const message = buildQuoteMessage("auto", AUTO_VALUES);
    expect(message).not.toContain("Placa");
    expect(message).not.toContain("Origem");
  });

  it("empresarial não inclui campos do auto", () => {
    const message = buildQuoteMessage("empresarial", {
      ...AUTO_VALUES,
      cidade: "Campinas / SP",
      ramo: "Loja de roupas",
      protecao: "Frota da empresa",
    });
    expect(message).toContain("*Seguro Empresarial*");
    expect(message).toContain("*Ramo da empresa:* Loja de roupas");
    expect(message).not.toContain("CPF");
  });
});
