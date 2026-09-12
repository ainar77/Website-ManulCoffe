export function SectionHeading({ eyebrow, title, light = false }: { eyebrow?: string; title: string; light?: boolean }) {
  return (
    <div className={`mb-10 sm:mb-14 ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-label text-accent">{eyebrow}</p>}
      <h2 className="max-w-3xl font-display text-4xl font-semibold leading-none sm:text-6xl lg:text-7xl">{title}</h2>
    </div>
  );
}