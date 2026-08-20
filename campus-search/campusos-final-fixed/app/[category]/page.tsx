import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";
import { EmptyState } from "@/components/EmptyState";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getAll } from "@/lib/data";
import { search } from "@/lib/search";
import type { CampusEntity, CategorySlug } from "@/types";

/**
 * This single dynamic route serves all six category browse pages
 * (/buildings, /departments, /faculty, /labs, /facilities, /offices).
 * They share identical structure — search-within-category, a grid of
 * results, an empty state — so one parameterised page replaces six
 * near-duplicate files. generateStaticParams pre-renders exactly those
 * six paths; anything else 404s via notFound() below.
 */

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategorySlug(category)) return {};
  const cat = getCategory(category);
  return { title: `${cat.label} — CampusOS`, description: cat.cardBlurb };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const cat = getCategory(category);

  const items: CampusEntity[] = query
    ? search(query, [category]).map((r) => r.entity)
    : getAll<CampusEntity>(category);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pb-6 pt-12 sm:px-6 sm:pt-16">
          <p className="font-mono text-xs tracking-wider" style={{ color: cat.colorVar }}>
            {cat.code}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {cat.label}
          </h1>
          <p className="mt-2 text-sm text-slate sm:text-base">{cat.cardBlurb}</p>
          <div className="mt-6">
            <SearchBar variant="compact" initialQuery={query} scopeHref={`/${category}`} />
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-28">
          <p className="mb-4 text-xs text-slate-light">
            {items.length} {items.length === 1 ? cat.singular.toLowerCase() : cat.label.toLowerCase()}
          </p>

          {items.length === 0 ? (
            <EmptyState
              title="No matches here"
              message={`Try a different search, or clear it to browse all ${cat.label.toLowerCase()}.`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <ResultCard key={item.id} entity={item} category={category} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
