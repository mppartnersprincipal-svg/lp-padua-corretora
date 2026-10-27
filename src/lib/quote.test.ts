import { describe, expect, it } from "vitest";
import { fieldConfigFor } from "@/components/ui/quote/fieldConfig";
import {
  buildQuoteMessage,
  NEW_CAR_SITUATION,
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
  placa: "ABC1D23",
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

  it("placa é obrigatória e precisa estar no padrão antigo ou Mercosul", () => {
    expect(validateFields(["placa"], EMPTY_QUOTE).placa).toBe("Informe a placa do veículo.");
    expect(validateFields(["placa"], { ...EMPTY_QUOTE, placa: "AB12" }).placa).toBe("Confira a placa (ex.: ABC1D23).");
    expect(validateFields(["placa"], { ...EMPTY_QUOTE, placa: "ABC1234" })).toEqual({});
  });

  it("carro 0 km pode seguir sem placa, mas placa preenchida continua validada", () => {
    const newCar = { ...EMPTY_QUOTE, situacao: NEW_CAR_SITUATION };
    expect(validateFields(["placa"], newCar)).toEqual({});
    expect(validateFields(["placa"], { ...newCar, placa: "AB12" }).placa).toBe("Confira a placa (ex.: ABC1D23).");
    expect(validateFields(["placa"], { ...EMPTY_QUOTE, situacao: "Carro usado, sem seguro hoje" }).placa).toBeDefined();
  });

  it("a situação vem antes da placa, para o campo já saber se é 0 km", () => {
    const fields = QUOTE_STEPS.auto[2].fields;
    expect(fields.indexOf("situacao")).toBeLessThan(fields.indexOf("placa"));
  });

  it("campo da placa avisa que 0 km pode ficar sem placa", () => {
    expect(fieldConfigFor("placa", EMPTY_QUOTE).label).toBe("Placa");
    const config = fieldConfigFor("placa", { ...EMPTY_QUOTE, situacao: NEW_CAR_SITUATION });
    expect(config.placeholder).toBe("Ainda não tenho placa");
    expect(config.label).toBe("Placa (opcional para 0 km)");
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

  it("0 km sem placa avisa na mensagem em vez de omitir", () => {
    const message = buildQuoteMessage("auto", { ...AUTO_VALUES, placa: "" });
    expect(message).toContain("*Placa:* ainda não tem (carro 0 km)");
  });

  it("leva a placa e omite a origem sem UTM", () => {
    const message = buildQuoteMessage("auto", AUTO_VALUES);
    expect(message).toContain("*Placa:* ABC1D23");
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
