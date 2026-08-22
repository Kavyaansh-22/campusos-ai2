import Link from "next/link";
import type { CampusEntity, CategorySlug } from "@/types";
import { getCategory } from "@/lib/categories";
import { entityHref, entitySubtitle, entityLocationLine } from "@/lib/entityDisplay";

export async function ResultCard({ entity, category }: { entity: CampusEntity; category: CategorySlug }) {
  const cat = getCategory(category);
  const subtitle = await entitySubtitle(entity);
  const location = await entityLocationLine(entity);

  return (
    <Link
      href={entityHref(category, entity.id)}
      className="group flex items-start gap-3 rounded-xl border border-border bg-paper-raised p-4 transition-colors hover:border-border-strong hover:shadow-sm"
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
        style={{ backgroundColor: `color-mix(in srgb, ${cat.colorVar} 14%, white)` }}
        aria-hidden
      >
        {cat.icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold text-ink group-hover:underline">
          {entity.name}
        </p>
        {subtitle && <p className="mt-0.5 line-clamp-2 text-sm text-slate">{subtitle}</p>}
        {location && <p className="mt-1 font-mono text-xs text-slate-light">📍 {location}</p>}
      </div>
    </Link>
  );
}