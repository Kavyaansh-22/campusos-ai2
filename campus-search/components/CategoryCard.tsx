import Link from "next/link";
import type { CategoryConfig } from "@/lib/categories";

export function CategoryCard({ category }: { category: CategoryConfig }) {
  return (
    <Link
      href={`/${category.slug}`}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-paper-raised p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ ["--cat" as string]: category.colorVar }}
    >
      <span
        className="absolute right-5 top-5 font-mono text-[10px] tracking-wider text-slate-light transition-colors group-hover:text-[var(--cat)]"
        aria-hidden
      >
        {category.code}
      </span>

      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
        style={{ backgroundColor: `color-mix(in srgb, ${category.colorVar} 14%, white)` }}
        aria-hidden
      >
        {category.icon}
      </span>

      <div>
        <h3 className="font-display text-base font-semibold text-ink transition-colors group-hover:text-[var(--cat)]">
          {category.label}
        </h3>
        <p className="mt-1 text-sm text-slate">{category.cardBlurb}</p>
      </div>
    </Link>
  );
}
