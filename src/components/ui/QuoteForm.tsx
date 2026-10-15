"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Building2, Car, ChevronDown, CircleAlert, CircleCheck, Lock, RotateCcw } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { maskPhone } from "@/lib/format";
import {
  buildQuoteMessage,
  EMPTY_QUOTE,
  validateQuote,
  type InsuranceType,
  type QuoteErrors,
  type QuoteValues,
} from "@/lib/quote";
import { getUtms, track } from "@/lib/tracking";
import { buildWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";

interface QuoteFormProps {
  /** Identifica o formulário no GTM (ex.: form_hero_home) */
  formId: string;
  defaultType?: InsuranceType;
  title?: string;
  subtitle?: string;
  className?: string;
}

const TYPE_OPTIONS = [
  { type: "auto", label: "Auto", Icon: Car },
  { type: "empresarial", label: "Empresarial", Icon: Building2 },
] as const;

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

const INPUT_BASE =
  "h-12 w-full rounded-xl border bg-white px-4 text-base text-navy outline-none transition-[border-color,box-shadow] " +
  "placeholder:text-slate focus:border-gold focus:ring-4 focus:ring-gold/20";

function inputClass(hasError: boolean): string {
  return `${INPUT_BASE} ${hasError ? "border-[#b42318]" : "border-sand-dark hover:border-slate-light"}`;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, error, className = "", children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[13px] font-medium text-navy">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-[13px] text-[#b42318]">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function QuoteForm({
  formId,
  defaultType = "auto",
  title = "Cotação gratuita",
  subtitle = "Leva menos de 1 minuto. A proposta chega no seu WhatsApp.",
  className = "",
}: QuoteFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<InsuranceType>(defaultType);
  const [values, setValues] = useState<QuoteValues>(EMPTY_QUOTE);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  // Para onde o foco vai depois de trocar entre formulário e confirmação
  const pendingFocus = useRef<"success" | "form" | null>(null);

  useEffect(() => {
    if (pendingFocus.current === "success") successRef.current?.focus();
    if (pendingFocus.current === "form") formRef.current?.querySelector<HTMLElement>('[name="nome"]')?.focus();
    pendingFocus.current = null;
  }, [sentUrl]);

  const fieldId = (name: keyof QuoteValues) => `${uid}-${name}`;
  const describedBy = (name: keyof QuoteValues) => (errors[name] ? `${fieldId(name)}-error` : undefined);

  function handleChange(field: keyof QuoteValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: field === "telefone" ? maskPhone(value) : value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateQuote(type, values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const url = buildWhatsAppUrl(buildQuoteMessage(type, values, getUtms()));
    track("form_submit", { form_id: formId, insurance_type: type });
    openWhatsApp(url);
    pendingFocus.current = "success";
    setSentUrl(url);
  }

  function handleReset() {
    pendingFocus.current = "form";
    setValues(EMPTY_QUOTE);
    setErrors({});
    setSentUrl(null);
  }

  return (
    <div className={`@container rounded-3xl bg-white p-6 shadow-lift ring-1 ring-navy/5 sm:p-8 ${className}`}>
      <div aria-live="polite">
        {sentUrl ? (
          <div ref={successRef} tabIndex={-1} className="flex flex-col items-start gap-4 py-6 outline-none">
            <span className="grid size-14 place-items-center rounded-full bg-gold/15 text-gold-dark">
              <CircleCheck className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-semibold text-navy">Pronto! Abrimos o WhatsApp.</h2>
            <p className="leading-relaxed text-slate">
              Sua mensagem já está escrita com os dados da cotação. É só tocar em enviar. Se o WhatsApp
              não abriu, use o botão abaixo.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={sentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-5 font-semibold text-navy-deep transition hover:bg-gold-light"
              >
                <WhatsAppIcon className="size-5" />
                Abrir WhatsApp
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-navy/15 px-5 font-semibold text-navy transition hover:border-navy"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Nova cotação
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {!sentUrl && (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={title}>
          <div className="mb-6 flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">Sem compromisso</p>
            <h2 className="text-2xl leading-tight font-semibold text-navy">{title}</h2>
            <p className="text-sm leading-relaxed text-slate">{subtitle}</p>
          </div>

          <fieldset className="mb-5">
            <legend className="sr-only">Tipo de seguro</legend>
            <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-sand p-1.5">
              {TYPE_OPTIONS.map(({ type: option, label, Icon }) => {
                const isActive = type === option;
                return (
                  <label
                    key={option}
                    className={`relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-300 has-focus-visible:ring-2 has-focus-visible:ring-gold ${
                      isActive ? "bg-navy text-cream shadow-card" : "text-slate hover:text-navy"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={option}
                      checked={isActive}
                      onChange={() => setType(option)}
                      className="sr-only"
                    />
                    <Icon className={`size-4.5 ${isActive ? "text-gold" : ""}`} aria-hidden="true" />
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 @md:grid-cols-2">
            <Field id={fieldId("nome")} label="Seu nome" error={errors.nome} className="@md:col-span-2">
              <input
                id={fieldId("nome")}
                name="nome"
                autoComplete="name"
                placeholder="Como podemos te chamar?"
                value={values.nome}
                onChange={(event) => handleChange("nome", event.target.value)}
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={describedBy("nome")}
                className={inputClass(Boolean(errors.nome))}
              />
            </Field>
            <Field id={fieldId("telefone")} label="WhatsApp" error={errors.telefone}>
              <input
                id={fieldId("telefone")}
                name="telefone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="(00) 00000-0000"
                value={values.telefone}
                onChange={(event) => handleChange("telefone", event.target.value)}
                aria-invalid={Boolean(errors.telefone)}
                aria-describedby={describedBy("telefone")}
                className={inputClass(Boolean(errors.telefone))}
              />
            </Field>
            <Field id={fieldId("cidade")} label="Cidade / UF" error={errors.cidade}>
              <input
                id={fieldId("cidade")}
                name="cidade"
                autoComplete="address-level2"
                placeholder="Ex.: Campinas / SP"
                value={values.cidade}
                onChange={(event) => handleChange("cidade", event.target.value)}
                aria-invalid={Boolean(errors.cidade)}
                aria-describedby={describedBy("cidade")}
                className={inputClass(Boolean(errors.cidade))}
              />
            </Field>

            {type === "auto" ? (
              <>
                <Field id={fieldId("veiculo")} label="Modelo e ano do veículo" error={errors.veiculo} className="@md:col-span-2">
                  <input
                    id={fieldId("veiculo")}
                    name="veiculo"
                    placeholder="Ex.: Onix LT 2023"
                    value={values.veiculo}
                    onChange={(event) => handleChange("veiculo", event.target.value)}
                    aria-invalid={Boolean(errors.veiculo)}
                    aria-describedby={describedBy("veiculo")}
                    className={inputClass(Boolean(errors.veiculo))}
                  />
                </Field>
                <Field id={fieldId("situacao")} label="Qual é a sua situação?" error={errors.situacao} className="@md:col-span-2">
                  <SelectInput
                    id={fieldId("situacao")}
                    name="situacao"
                    value={values.situacao}
                    options={SITUACAO_OPTIONS}
                    hasError={Boolean(errors.situacao)}
                    describedBy={describedBy("situacao")}
                    onChange={(value) => handleChange("situacao", value)}
                  />
                </Field>
              </>
            ) : (
              <>
                <Field id={fieldId("ramo")} label="Ramo da empresa" error={errors.ramo} className="@md:col-span-2">
                  <input
                    id={fieldId("ramo")}
                    name="ramo"
                    placeholder="Ex.: loja de roupas, oficina, escritório"
                    value={values.ramo}
                    onChange={(event) => handleChange("ramo", event.target.value)}
                    aria-invalid={Boolean(errors.ramo)}
                    aria-describedby={describedBy("ramo")}
                    className={inputClass(Boolean(errors.ramo))}
                  />
                </Field>
                <Field id={fieldId("protecao")} label="O que você quer proteger?" error={errors.protecao} className="@md:col-span-2">
                  <SelectInput
                    id={fieldId("protecao")}
                    name="protecao"
                    value={values.protecao}
                    options={PROTECAO_OPTIONS}
                    hasError={Boolean(errors.protecao)}
                    describedBy={describedBy("protecao")}
                    onChange={(value) => handleChange("protecao", value)}
                  />
                </Field>
              </>
            )}
          </div>

          <button
            type="submit"
            className="group mt-6 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-gold px-6 text-base font-semibold text-navy-deep transition-[transform,box-shadow,background-color] duration-300 hover:scale-[1.02] hover:bg-gold-light hover:shadow-gold active:scale-[0.98] motion-reduce:hover:scale-100"
          >
            <WhatsAppIcon className="size-5" />
            Cotar pelo WhatsApp
          </button>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Seus dados são usados só para a cotação.{" "}
              <Link href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-navy">
                Política de privacidade
              </Link>
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

interface SelectInputProps {
  id: string;
  name: string;
  value: string;
  options: string[];
  hasError: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}

function SelectInput({ id, name, value, options, hasError, describedBy, onChange }: SelectInputProps) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`${inputClass(hasError)} appearance-none pr-11 ${value ? "" : "text-slate"}`}
      >
        <option value="" disabled>
          Selecione
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-navy">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate"
        aria-hidden="true"
      />
    </div>
  );
}
