import { afterEach, describe, expect, it, vi } from "vitest";
import { lookupCep } from "@/lib/viacep";

function mockFetch(implementation: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(implementation));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("lookupCep", () => {
  it("devolve cidade/UF quando o CEP existe", async () => {
    mockFetch(async () => Response.json({ localidade: "Campinas", uf: "SP" }));
    await expect(lookupCep("13010000")).resolves.toEqual({ status: "found", city: "Campinas/SP" });
  });

  it("marca como não encontrado quando o ViaCEP responde erro", async () => {
    mockFetch(async () => Response.json({ erro: "true" }));
    await expect(lookupCep("99999999")).resolves.toEqual({ status: "not-found" });
  });

  it("não consulta CEP com formato inválido", async () => {
    mockFetch(async () => Response.json({}));
    await expect(lookupCep("1301")).resolves.toEqual({ status: "not-found" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("falha de rede vira erro sem quebrar o formulário", async () => {
    mockFetch(async () => {
      throw new TypeError("network");
    });
    await expect(lookupCep("13010000")).resolves.toEqual({ status: "error" });
  });

  it("requisição cancelada volta para idle", async () => {
    const controller = new AbortController();
    controller.abort();
    mockFetch(async () => {
      throw new DOMException("aborted", "AbortError");
    });
    await expect(lookupCep("13010000", controller.signal)).resolves.toEqual({ status: "idle" });
  });
});
