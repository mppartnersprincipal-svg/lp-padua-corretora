import { ChevronDown, CircleAlert, CircleCheck } from "lucide-react";
import type { QuoteFieldConfig } from "@/components/ui/quote/fieldConfig";

export interface FieldHint {
  text: string;
  tone: "muted" | "success";
}

interface QuoteFieldInputProps {
  id: string;
  name: string;
  config: QuoteFieldConfig;
  value: string;
  error?: string;
  /** Substitui o hint do config (ex.: cidade encontrada pelo CEP) */
  hint?: FieldHint;
  onChange: (value: string) => void;
}

const INPUT_BASE =
  "h-12 w-full rounded-xl border bg-white px-4 text-base text-navy outline-none transition-[border-color,box-shadow] " +
  "placeholder:text-slate focus:border-gold focus:ring-4 focus:ring-gold/20";

function inputClass(hasError: boolean): string {
  return `${INPUT_BASE} ${hasError ? "border-[#b42318]" : "border-sand-dark hover:border-slate-light"}`;
}

export function QuoteFieldInput({ id, name, config, value, error, hint, onChange }: QuoteFieldInputProps) {
  const activeHint = hint ?? (config.hint ? { text: config.hint, tone: "muted" as const } : undefined);
  const hintId = activeHint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const hasError = Boolean(error);
  const commonProps = {
    id,
    name,
    value,
    "data-field": "",
    "aria-invalid": hasError,
    "aria-describedby": describedBy,
  };

  return (
    <div className={`flex flex-col gap-1.5 ${config.isFullWidth ? "@md:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-[13px] font-medium text-navy">
        {config.label}
      </label>

      {config.kind === "select" ? (
        <div className="relative">
          <select
            {...commonProps}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputClass(hasError)} appearance-none pr-11 ${value ? "" : "text-slate"}`}
          >
            <option value="" disabled>
              Selecione
            </option>
            {config.options?.map((option) => (
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
      ) : (
        <input
          {...commonProps}
          type={config.type ?? "text"}
          inputMode={config.inputMode}
          autoComplete={config.autoComplete}
          placeholder={config.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass(hasError)}
        />
      )}

      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-[13px] text-[#b42318]">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {activeHint && !error && (
        <p
          id={hintId}
          className={`flex items-center gap-1.5 text-xs ${activeHint.tone === "success" ? "font-medium text-[#1f7a4d]" : "text-slate"}`}
        >
          {activeHint.tone === "success" && <CircleCheck className="size-3.5 shrink-0" aria-hidden="true" />}
          {activeHint.text}
        </p>
      )}
    </div>
  );
}
