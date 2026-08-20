"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_QUERIES = [
  "Electronics lab",
  "Library",
  "AI faculty",
  "Admissions office",
  "School of Engineering",
];

interface SearchBarProps {
  /** "hero" shows the example-query chips below the input; "compact" doesn't. */
  variant?: "hero" | "compact";
  initialQuery?: string;
  autoFocus?: boolean;
  /** Base path a submitted search navigates to. Defaults to the global results page. */
  scopeHref?: string;
}

export function SearchBar({
  variant = "hero",
  initialQuery = "",
  autoFocus,
  scopeHref = "/search",
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  function goToResults(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`${scopeHref}?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToResults(value);
  }

  function handleExampleClick(example: string) {
    setValue(example);
    goToResults(example);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="campus-search" className="sr-only">
          Search CampusOS
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-border-strong bg-paper-raised px-4 py-3 shadow-sm transition-colors focus-within:border-signal sm:gap-3 sm:px-5 sm:py-4">
          <span aria-hidden className="text-lg sm:text-xl">
            🔎
          </span>
          <input
            id="campus-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search CampusOS…"
            autoFocus={autoFocus}
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-slate-light sm:text-lg"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-1 text-slate-light hover:text-ink"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-ink px-3 py-2 text-sm font-medium text-paper-raised transition-colors hover:bg-signal-ink sm:px-4"
          >
            Search
          </button>
        </div>
      </form>

      {variant === "hero" && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate">Try:</span>
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-slate transition-colors hover:border-signal hover:text-ink"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
