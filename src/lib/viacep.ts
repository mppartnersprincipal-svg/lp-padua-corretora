/** Consulta de CEP no ViaCEP (serviço público, sem chave) para mostrar a cidade ao cliente. */

export type CepLookup =
  | { status: "idle" | "loading" | "not-found" | "error" }
  | { status: "found"; city: string };

const VIACEP_URL = "https://viacep.com.br/ws";
const CEP_PATTERN = /^\d{8}$/;

interface ViaCepResponse {
  localidade?: unknown;
  uf?: unknown;
  erro?: unknown;
}

/** Nunca lança erro: falha de rede vira "error" e o formulário segue sem a cidade. */
export async function lookupCep(cepDigits: string, signal?: AbortSignal): Promise<CepLookup> {
  if (!CEP_PATTERN.test(cepDigits)) return { status: "not-found" };
  try {
    const response = await fetch(`${VIACEP_URL}/${cepDigits}/json/`, { signal });
    if (!response.ok) return { status: response.status === 400 ? "not-found" : "error" };

    const data: unknown = await response.json();
    if (!data || typeof data !== "object") return { status: "error" };
    const { localidade, uf, erro } = data as ViaCepResponse;
    if (erro) return { status: "not-found" };
    if (typeof localidade !== "string" || typeof uf !== "string") return { status: "error" };
    return { status: "found", city: `${localidade}/${uf}` };
  } catch {
    // Requisição cancelada porque o CEP mudou: não é erro para o usuário
    return { status: signal?.aborted ? "idle" : "error" };
  }
}
