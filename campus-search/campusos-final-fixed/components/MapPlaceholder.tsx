export function MapPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-paper text-center sm:h-64">
      <span aria-hidden className="text-2xl">
        🗺️
      </span>
      <p className="text-sm text-slate">Map placeholder</p>
      <p className="max-w-xs text-xs text-slate-light">
        Real MIT-WPU campus map integration for {label} goes here.
      </p>
    </div>
  );
}
