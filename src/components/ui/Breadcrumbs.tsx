import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  current: string;
}

export function Breadcrumbs({ current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Você está em" className="text-sm text-slate-light">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition-colors hover:text-cream">
            Início
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3.5 text-gold" />
        </li>
        <li aria-current="page" className="text-cream">
          {current}
        </li>
      </ol>
    </nav>
  );
}
