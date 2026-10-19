"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { QUOTE_FIELDS } from "@/components/ui/quote/fieldConfig";
import { QuoteFieldInput, type FieldHint } from "@/components/ui/quote/QuoteFieldInput";
import { QuoteSuccess } from "@/components/ui/quote/QuoteSuccess";
import { StepProgress } from "@/components/ui/quote/StepProgress";
import { TypeToggle } from "@/components/ui/quote/TypeToggle";
import { isValidCep, onlyDigits } from "@/lib/format";
import {
  buildQuoteMessage,
  EMPTY_QUOTE,
  QUOTE_STEPS,
  validateFields,
  type InsuranceType,
  type QuoteErrors,
  type QuoteField,
  type QuoteValues,
} from "@/lib/quote";
import { getUtms, track } from "@/lib/tracking";
import { lookupCep, type CepLookup } from "@/lib/viacep";
import { buildWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";

interface QuoteFormProps {
  /** Identifica o formulário no GTM (ex.: form_hero_home) */
  formId: string;
  defaultType?: InsuranceType;
  title?: string;
  className?: string;
}

const SUBTITLE: Record<InsuranceType, string> = {
  auto: "3 passos rápidos. A proposta chega no seu WhatsApp.",
  empresarial: "Leva menos de 1 minuto. A proposta chega no seu WhatsApp.",
};

type FocusTarget = "success" | "step" | null;

function cepHint(lookup: CepLookup): FieldHint {
  if (lookup.status === "found") return { text: lookup.city, tone: "success" };
  if (lookup.status === "loading") return { text: "Buscando a cidade…", tone: "muted" };
  return { text: "Usado para calcular o risco da região.", tone: "muted" };
}

export function QuoteForm({ formId, defaultType = "auto", title = "Cotação gratuita", className = "" }: QuoteFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<FocusTarget>(null);
  const cepRequest = useRef<AbortController | null>(null);
  const [type, setType] = useState<InsuranceType>(defaultType);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<QuoteValues>(EMPTY_QUOTE);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [cepLookup, setCepLookup] = useState<CepLookup>({ status: "idle" });
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const steps = QUOTE_STEPS[type];
  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  // Foco depois de trocar de passo ou mostrar a confirmação
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === "success") successRef.current?.focus();
    if (target === "step") formRef.current?.querySelector<HTMLElement>("[data-field]")?.focus();
  }, [sentUrl, step]);

  useEffect(() => () => cepRequest.current?.abort(), []);

  function requestCity(cep: string) {
    cepRequest.current?.abort();
    if (!isValidCep(cep)) {
      setCepLookup({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    cepRequest.current = controller;
    setCepLookup({ status: "loading" });
    lookupCep(onlyDigits(cep), controller.signal).then((result) => {
      if (!controller.signal.aborted) setCepLookup(result);
    });
  }

  function handleChange(field: QuoteField, rawValue: string) {
    const mask = QUOTE_FIELDS[field].mask;
    const value = mask ? mask(rawValue) : rawValue;
    setValues((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (field === "cep") requestCity(value);
  }

  function handleTypeChange(nextType: InsuranceType) {
    setType(nextType);
    setStep(0);
    setErrors({});
  }

  /** Valida só os campos do passo atual e foca o primeiro com erro. */
  function isCurrentStepValid(): boolean {
    const found = validateFields(currentStep.fields, values);
    const isCepUnknown = currentStep.fields.includes("cep") && !found.cep && cepLookup.status === "not-found";
    const stepErrors: QuoteErrors = isCepUnknown ? { ...found, cep: "CEP não encontrado. Confira os números." } : found;
    setErrors(stepErrors);
    const firstInvalid = currentStep.fields.find((field) => stepErrors[field]);
    if (!firstInvalid) return true;
    formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    return false;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCurrentStepValid()) return;

    if (!isLastStep) {
      // Funil do formulário no GTM (sem dados pessoais)
      track("form_step", { form_id: formId, insurance_type: type, step: step + 2 });
      pendingFocus.current = "step";
      setStep((current) => current + 1);
      return;
    }

    const cepCity = cepLookup.status === "found" ? cepLookup.city : undefined;
    const url = buildWhatsAppUrl(buildQuoteMessage(type, values, getUtms(), { cepCity }));
    track("form_submit", { form_id: formId, insurance_type: type });
    openWhatsApp(url);
    pendingFocus.current = "success";
    setSentUrl(url);
  }

  function handleBack() {
    setErrors({});
    pendingFocus.current = "step";
    setStep((current) => Math.max(0, current - 1));
  }

  function handleReset() {
    cepRequest.current?.abort();
    pendingFocus.current = "step";
    setValues(EMPTY_QUOTE);
    setErrors({});
    setCepLookup({ status: "idle" });
    setStep(0);
    setSentUrl(null);
  }

  return (
    <div className={`@container rounded-3xl bg-white p-6 shadow-lift ring-1 ring-navy/5 sm:p-8 ${className}`}>
      <div aria-live="polite">
        {sentUrl && <QuoteSuccess ref={successRef} whatsappUrl={sentUrl} onReset={handleReset} />}
      </div>

      {!sentUrl && (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={title}>
          <div className="mb-6 flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">Sem compromisso</p>
            <h2 className="text-2xl leading-tight font-semibold text-navy">{title}</h2>
            <p className="text-sm leading-relaxed text-slate">{SUBTITLE[type]}</p>
          </div>

          {step === 0 && <TypeToggle value={type} onChange={handleTypeChange} />}
          {steps.length > 1 && <StepProgress titles={steps.map((item) => item.title)} current={step} />}

          <div
            key={`${type}-${step}`}
            className="enter grid gap-4 @md:grid-cols-2"
            style={{ animationDuration: "0.45s" }}
          >
            {currentStep.fields.map((field) => (
              <QuoteFieldInput
                key={field}
                id={`${uid}-${field}`}
                name={field}
                config={QUOTE_FIELDS[field]}
                value={values[field]}
                error={errors[field]}
                hint={field === "cep" ? cepHint(cepLookup) : undefined}
                onChange={(value) => handleChange(field, value)}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Voltar ao passo anterior"
                className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-navy/15 px-4 font-semibold text-navy transition-colors hover:border-navy sm:px-5"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                <span className="hidden @sm:inline">Voltar</span>
              </button>
            )}
            <button
              type="submit"
              className="group flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-xl bg-gold px-6 text-base font-semibold text-navy-deep transition-[transform,box-shadow,background-color] duration-300 hover:scale-[1.02] hover:bg-gold-light hover:shadow-gold active:scale-[0.98] motion-reduce:hover:scale-100"
            >
              {isLastStep ? (
                <>
                  <WhatsAppIcon className="size-5" />
                  Cotar pelo WhatsApp
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight
                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Seus dados vão direto para o WhatsApp da Pádua e são usados só para a cotação.{" "}
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
