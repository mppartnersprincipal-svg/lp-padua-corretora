interface StepProgressProps {
  titles: string[];
  current: number;
}

/** "Passo 2 de 3 · Seu perfil" + barras douradas de progresso. */
export function StepProgress({ titles, current }: StepProgressProps) {
  return (
    <div className="mb-5">
      <p className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
        <span className="text-navy">{titles[current]}</span>
        <span className="text-slate">
          Passo {current + 1} de {titles.length}
        </span>
      </p>
      <div aria-hidden="true" className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${titles.length}, 1fr)` }}>
        {titles.map((title, index) => (
          <span key={title} className="h-1.5 overflow-hidden rounded-full bg-sand">
            <span
              className={`block h-full origin-left rounded-full bg-gold transition-transform duration-500 ease-out ${
                index <= current ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
