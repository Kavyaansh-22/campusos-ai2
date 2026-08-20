interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No results found",
  message = "Try searching for a building, faculty member, department, lab, facility or office.",
}: EmptyStateProps) {
  return (
    <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
      <span aria-hidden className="text-2xl">
        🔎
      </span>
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-slate">{message}</p>
    </div>
  );
}
