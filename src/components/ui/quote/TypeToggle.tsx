import { Building2, Car } from "lucide-react";
import type { InsuranceType } from "@/lib/quote";

interface TypeToggleProps {
  value: InsuranceType;
  onChange: (type: InsuranceType) => void;
}

const TYPE_OPTIONS = [
  { type: "auto", label: "Auto", Icon: Car },
  { type: "empresarial", label: "Empresarial", Icon: Building2 },
] as const;

/** Seletor Auto / Empresarial (radios nativos: teclado e leitor de tela funcionam sem JS extra). */
export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <fieldset className="mb-5">
      <legend className="sr-only">Tipo de seguro</legend>
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-sand p-1.5">
        {TYPE_OPTIONS.map(({ type, label, Icon }) => {
          const isActive = value === type;
          return (
            <label
              key={type}
              className={`relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[background-color,color,box-shadow] duration-300 has-focus-visible:ring-2 has-focus-visible:ring-gold ${
                isActive ? "bg-navy text-cream shadow-card" : "text-slate hover:text-navy"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={type}
                checked={isActive}
                onChange={() => onChange(type)}
                className="sr-only"
              />
              <Icon className={`size-4.5 ${isActive ? "text-gold" : ""}`} aria-hidden="true" />
              {label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
