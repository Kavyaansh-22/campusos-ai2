import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InfoList } from "@/components/InfoList";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { ResultCard } from "@/components/ResultCard";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getAll, getById } from "@/lib/data";
import { entityIntro, buildDetailFields } from "@/lib/entityDisplay";
import { getRelatedGroups } from "@/lib/relations";
import type { CampusEntity, CategorySlug } from "@/types";

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

interface DetailPageProps {
  params: Promise<{ category: string; id: string }>;
}

export async function generateStaticParams() {
  const paths: { category: string; id: string }[] = [];
  
  for (const cat of CATEGORIES) {
    const entities = await getAll<CampusEntity>(cat.slug);
    for (const entity of entities) {
      paths.push({ category: cat.slug, id: entity.id });
    }
  }
  
  return paths;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { category, id } = await params;
  if (!isCategorySlug(category)) return {};
  
  const entity = await getById(category, id);
  if (!entity) return {};
  
  return { title: `${entity.name} — CampusOS` };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { category, id } = await params;
  if (!isCategorySlug(category)) notFound();

  // Await the database fetch
  const entity = await getById(category, id);
  if (!entity) notFound();

  const cat = getCategory(category);
  const intro = entityIntro(entity);
  
  // Await the UI mapping helpers
  const fields = await buildDetailFields(entity);
  const relatedGroups = await getRelatedGroups(entity);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: cat.label, href: `/${category}` },
              { label: entity.name },
            ]}
          />

          <div className="mt-4 flex items-start gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundColor: `color-mix(in srgb, ${cat.colorVar} 14%, white)` }}
              aria-hidden
            >
              {cat.icon}
            </span>
            <div>
              <p className="font-mono text-xs tracking-wider" style={{ color: cat.colorVar }}>
                {cat.code}
              </p>
              <h1 className="mt-0.5 font-display text-2xl font-semibold text-ink sm:text-3xl">
                {entity.name}
              </h1>
              {entity.isSampleData && (
                <span className="mt-2 inline-block rounded-full border border-border px-2.5 py-0.5 text-[11px] text-slate-light">
                  Sample data — not verified
                </span>
              )}
            </div>
          </div>

          {intro && <p className="mt-6 text-sm text-slate sm:text-base">{intro}</p>}

          {fields.length > 0 && (
            <div className="mt-8 border-t border-border pt-8">
              <InfoList fields={fields} />
            </div>
          )}

          {entity.type === "building" && (
            <div className="mt-8">
              <MapPlaceholder label={entity.name} />
            </div>
          )}

          {relatedGroups.map((group) => (
            <div key={group.label} className="mt-10">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-light">
                {group.label}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {group.entities.map((related) => (
                  <ResultCard key={related.id} entity={related} category={group.category} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}