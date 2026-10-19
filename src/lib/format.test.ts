import { describe, expect, it } from "vitest";
import {
  isValidCep,
  isValidCpf,
  isValidPhone,
  isValidPlate,
  maskCep,
  maskCpf,
  maskDate,
  maskPhone,
  maskPlate,
  parseBrazilianDate,
  validateBirthDate,
} from "@/lib/format";

// CPF de exemplo com dígitos verificadores válidos (amplamente usado em testes)
const VALID_CPF = "529.982.247-25";
const TODAY = new Date(2026, 9, 16);

describe("máscaras", () => {
  it("formata CPF enquanto o usuário digita", () => {
    expect(maskCpf("529")).toBe("529");
    expect(maskCpf("5299822")).toBe("529.982.2");
    expect(maskCpf("52998224725")).toBe(VALID_CPF);
    expect(maskCpf("529.982.247-2599")).toBe(VALID_CPF);
  });

  it("formata CEP, data, telefone e placa", () => {
    expect(maskCep("13010")).toBe("13010");
    expect(maskCep("13010000")).toBe("13010-000");
    expect(maskDate("15031990")).toBe("15/03/1990");
    expect(maskDate("1503")).toBe("15/03");
    expect(maskPhone("11987654321")).toBe("(11) 98765-4321");
    expect(maskPhone("1934567890")).toBe("(19) 3456-7890");
    expect(maskPlate("abc-1d23")).toBe("ABC1D23");
  });
});

describe("isValidCpf", () => {
  it("aceita CPF com dígitos verificadores corretos, com ou sem máscara", () => {
    expect(isValidCpf(VALID_CPF)).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita dígito verificador errado, sequência repetida e tamanho errado", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("529.982.247")).toBe(false);
  });
});

describe("isValidCep, isValidPhone e isValidPlate", () => {
  it("valida CEP com 8 números", () => {
    expect(isValidCep("13010-000")).toBe(true);
    expect(isValidCep("1301-000")).toBe(false);
  });

  it("valida telefone fixo e celular com DDD", () => {
    expect(isValidPhone("(11) 98765-4321")).toBe(true);
    expect(isValidPhone("(19) 3456-7890")).toBe(true);
    expect(isValidPhone("98765-4321")).toBe(false);
  });

  it("aceita placa antiga e Mercosul", () => {
    expect(isValidPlate("ABC1234")).toBe(true);
    expect(isValidPlate("ABC1D23")).toBe(true);
    expect(isValidPlate("AB12345")).toBe(false);
  });
});

describe("datas de nascimento", () => {
  it("rejeita datas que não existem no calendário", () => {
    expect(parseBrazilianDate("31/02/1990")).toBeNull();
    expect(parseBrazilianDate("15/13/1990")).toBeNull();
    expect(parseBrazilianDate("15/03/1990")).toEqual(new Date(1990, 2, 15));
  });

  it("aceita segurado adulto", () => {
    expect(validateBirthDate("15/03/1990", TODAY)).toBeNull();
    expect(validateBirthDate("16/10/2008", TODAY)).toBeNull();
  });

  it("recusa menor de 18 anos, data futura, formato errado e idade improvável", () => {
    expect(validateBirthDate("17/10/2008", TODAY)).toBe("O segurado precisa ter 18 anos ou mais.");
    expect(validateBirthDate("01/01/2030", TODAY)).toBe("Informe uma data válida (DD/MM/AAAA).");
    expect(validateBirthDate("1990-03-15", TODAY)).toBe("Informe uma data válida (DD/MM/AAAA).");
    expect(validateBirthDate("01/01/1900", TODAY)).toBe("Confira o ano de nascimento.");
  });
});
