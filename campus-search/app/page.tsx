import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/lib/categories";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-24">
          <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Find anything on campus.
          </h1>
          <p className="mt-4 text-base text-slate sm:text-lg">
            Search buildings, departments, faculty, labs, facilities and important offices.
          </p>
          <div className="mt-8">
            <SearchBar variant="hero" />
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-28">
          <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-wider text-slate-light">
            Browse by category
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
