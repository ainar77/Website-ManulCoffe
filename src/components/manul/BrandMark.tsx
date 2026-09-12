import { Coffee } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3 font-display font-semibold text-primary-foreground">
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary-foreground/35">
        <Coffee aria-hidden="true" className="size-4" strokeWidth={1.7} />
      </span>
      {!compact && <span className="text-xl sm:text-2xl">ManulCoffee</span>}
    </span>
  );
}