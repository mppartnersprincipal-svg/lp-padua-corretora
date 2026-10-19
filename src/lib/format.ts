/** Máscaras e validações dos campos do formulário de cotação (padrões brasileiros). */

const CPF_LENGTH = 11;
const CEP_LENGTH = 8;
const PLATE_LENGTH = 7;
const MIN_INSURED_AGE = 18;
const MAX_INSURED_AGE = 100;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Telefone: (11) 98765-4321 ou (11) 3456-7890 */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const splitAt = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

/** CPF: 000.000.000-00 */
export function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, CPF_LENGTH);
  const body = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean).join(".");
  const checkDigits = digits.slice(9);
  return checkDigits ? `${body}-${checkDigits}` : body;
}

function cpfCheckDigit(digits: string): number {
  const weightStart = digits.length + 1;
  const sum = [...digits].reduce((total, digit, index) => total + Number(digit) * (weightStart - index), 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** Valida os dois dígitos verificadores e rejeita sequências repetidas (111.111.111-11). */
export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== CPF_LENGTH || /^(\d)\1+$/.test(digits)) return false;
  const first = cpfCheckDigit(digits.slice(0, 9));
  const second = cpfCheckDigit(digits.slice(0, 10));
  return first === Number(digits[9]) && second === Number(digits[10]);
}

/** CEP: 00000-000 */
export function maskCep(value: string): string {
  const digits = onlyDigits(value).slice(0, CEP_LENGTH);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === CEP_LENGTH;
}

/** Data: DD/MM/AAAA */
export function maskDate(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
}

/** Converte DD/MM/AAAA em data real (rejeita 31/02, 00/10 etc.). */
export function parseBrazilianDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  const isSameDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isSameDate ? date : null;
}

function ageOn(birth: Date, today: Date): number {
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  return today.getFullYear() - birth.getFullYear() - (hadBirthday ? 0 : 1);
}

/** Retorna a mensagem de erro, ou null se a data de nascimento for válida para um segurado. */
export function validateBirthDate(value: string, today: Date = new Date()): string | null {
  const birth = parseBrazilianDate(value);
  if (!birth || birth > today) return "Informe uma data válida (DD/MM/AAAA).";
  const age = ageOn(birth, today);
  if (age < MIN_INSURED_AGE) return "O segurado precisa ter 18 anos ou mais.";
  if (age > MAX_INSURED_AGE) return "Confira o ano de nascimento.";
  return null;
}

/** Placa: só letras/números em maiúsculas (aceita padrão antigo ABC1234 e Mercosul ABC1D23). */
export function maskPlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, PLATE_LENGTH);
}

export function isValidPlate(value: string): boolean {
  return /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(maskPlate(value));
}
