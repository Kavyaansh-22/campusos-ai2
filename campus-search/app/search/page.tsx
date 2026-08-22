import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { searchGrouped } from "@/lib/search";
import { getCategory, CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";
import type { CategorySlug } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — CampusOS",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

function isCategorySlug(value: string | undefined): value is CategorySlug {
  return !!value && CATEGORIES.some((c) => c.slug === value);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const activeCategory = isCategorySlug(params.cat) ? params.cat : undefined;

  // Await the asynchronous searchGrouped function
  const grouped = query ? await searchGrouped(query) : null;
  
  const groupsToShow = grouped
    ? activeCategory
      ? grouped.groups.filter((g) => g.category === activeCategory)
      : grouped.groups
    : [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
          <SearchBar variant="compact" initialQuery={query} autoFocus={!query} />
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-28">
          {!query || !grouped ? (
            <EmptyState title="What are you looking for?" />
          ) : (
            <>
              <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                Search results for &ldquo;{query}&rdquo;
              </h1>
              <p className="mt-1 text-sm text-slate">
                {grouped.totalCount} {grouped.totalCount === 1 ? "result" : "results"} found
              </p>

              {grouped.totalCount > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <FilterChip
                    href={`/search?q=${encodeURIComponent(query)}`}
                    active={!activeCategory}
                    label={`All (${grouped.totalCount})`}
                  />
                  {grouped.groups.map((g) => {
                    const cat = getCategory(g.category);
                    return (
                      <FilterChip
                        key={g.category}
                        href={`/search?q=${encodeURIComponent(query)}&cat=${g.category}`}
                        active={activeCategory === g.category}
                        label={`${cat.label} (${g.results.length})`}
                      />
                    );
                  })}
                </div>
              )}

              {grouped.totalCount === 0 ? (
                <EmptyState />
              ) : (
                <div className="mt-8 flex flex-col gap-10">
                  {groupsToShow.map((group) => {
                    const cat = getCategory(group.category);
                    return (
                      <div key={group.category}>
                        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-slate-light">
                          <span aria-hidden>{cat.icon}</span> {cat.label}
                        </h2>
                        <div className="flex flex-col gap-3">
                          {group.results.map((r) => (
                            <ResultCard key={r.entity.id} entity={r.entity} category={group.category} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-paper-raised"
          : "border-border text-slate hover:border-border-strong hover:text-ink"
      )}
    >
      {label}
    </Link>
  );
}