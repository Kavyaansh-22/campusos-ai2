import Link from "next/link";
import type { DetailField } from "@/lib/entityDisplay";

export function InfoList({ fields }: { fields: DetailField[] }) {
  if (fields.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-light">{field.label}</dt>
          <dd className="mt-1 text-sm text-ink">
            {field.href ? (
              <Link
                href={field.href}
                className="underline decoration-border-strong underline-offset-2 hover:decoration-ink"
              >
                {field.value}
              </Link>
            ) : (
              field.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
