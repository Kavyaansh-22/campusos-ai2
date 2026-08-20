# CampusOS — Campus Search (MVP)

A clean, fast search-and-browse interface for MIT-WPU campus information:
buildings, departments, faculty, labs, facilities, and important offices.

This is **Phase 1** only — Campus Search. There is no AI assistant, no
authentication, no dashboard. See [Future phases](#future-phases-not-built)
at the bottom for what's intentionally *not* here yet.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
npx tsc --noEmit   # type check
```

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design tokens (colors, fonts) live in `app/globals.css`
- In-memory **TypeScript data files** as the data layer (see below) —
  no database required to run this MVP

## Project structure

```
app/
  page.tsx                    Homepage (hero search + category cards)
  search/page.tsx             Search results, grouped by category
  [category]/page.tsx         Browse page — serves all 6 categories
                               (/buildings, /departments, /faculty,
                                /labs, /facilities, /offices)
  [category]/[id]/page.tsx    Detail page — serves all 6 entity types
  layout.tsx, globals.css     Root layout, fonts, design tokens

components/                   Header, SearchBar, CategoryCard, ResultCard,
                               EmptyState, InfoList, Breadcrumb,
                               MapPlaceholder, Footer

lib/
  data.ts                     ⭐ Single chokepoint all pages read data
                               through. Swap this file's internals for a
                               real database call later — nothing else
                               needs to change.
  search.ts                   Cross-category search engine: partial +
                               case-insensitive matching, relevance
                               scoring, cross-referencing (e.g. searching
                               "electronics" also surfaces faculty in that
                               department and the building housing it).
  categories.ts                Category labels, colors, icons, codes —
                               single source of truth.
  entityDisplay.ts            Turns any entity into display text
                               (subtitles, location lines, detail fields).
  relations.ts                Resolves a Building's departments/facilities
                               and a Department's faculty/labs.

data/
  buildings.ts, departments.ts, faculty.ts, labs.ts,
  facilities.ts, offices.ts   ⚠️ Sample data — see below.

types/index.ts                Shared TypeScript interfaces for all
                               six entity types.
```

Why `[category]` and `[category]/[id]` are single dynamic routes instead
of twelve separate files: all six categories share identical page
structure (search-within-category, a grid of results, an empty state;
or: a spec-sheet of fields, related items, a breadcrumb). One
parameterised route per pattern avoids maintaining six near-duplicate
files that would drift out of sync.

## ⚠️ Adding real MIT-WPU data

Everything in `/data` is clearly-labeled **sample/placeholder data**,
not verified MIT-WPU information — the homepage footer says so, and
every record has `isSampleData: true`.

To replace it:

1. Open the relevant file in `/data` (e.g. `data/buildings.ts` for
   buildings).
2. Each file opens with a comment block explaining what to replace.
3. Edit the objects directly — keep the same shape (see `types/index.ts`
   for the exact fields each entity type needs).
4. **IDs matter**: other files reference entities by `id`
   (e.g. a department's `buildingId`, a lab's `departmentId`). If you
   change an `id`, update every file that references it, or search
   cross-references will silently break.
5. Set `isSampleData: false` once a record is verified against real
   MIT-WPU information.
6. Only include contact info (email/phone) that's actually meant to be
   public — the spec is explicit about this for faculty and offices.

No code changes are needed elsewhere — pages, search, and cards all read
through `lib/data.ts`, which just re-exports these arrays.

## Migrating to a real database later

Only `lib/data.ts` needs to change. Today it does:

```ts
export const dataByCategory = { buildings, departments, faculty, labs, facilities, offices };
export function getAll(category) { return dataByCategory[category]; }
export function getById(category, id) { return dataByCategory[category].find(x => x.id === id); }
```

Swap the bodies of `getAll` / `getById` (and `dataByCategory`, if you
fetch everything up front) for real queries against Postgres — the
function signatures, and everything that calls them, stay identical.

## Where the Phase 2 AI assistant plugs in

This MVP deliberately does **not** include the AI assistant — but the
architecture was built so it can be added without a rewrite:

- `lib/search.ts` and `lib/data.ts` are plain, framework-independent
  TypeScript functions — not tied to React or a specific route. A
  chatbot running inside this same app can call them directly.
- If the chatbot is a **separate service**, the natural integration
  point is a thin API route (e.g. `app/api/search/route.ts`) that
  wraps `search()` / `searchGrouped()` and returns JSON — a few lines,
  not a restructure.
- Entity types in `types/index.ts` are the shared contract either way.

## Future phases (not built)

Per the product spec, intentionally out of scope for this MVP:

- **Phase 2** — AI Campus Assistant
- **Phase 3** — Events & Clubs
- **Phase 4** — AI Career/Resume Analyzer

## Manual test checklist (verified working)

- [x] Search a building, department, faculty member, lab, facility, office
- [x] Partial/case-insensitive search (`"electro"` finds "Electronics")
- [x] Cross-referenced results (`"electronics"` also surfaces faculty
      and the building, not just the literal name match)
- [x] Open a result → detail page → navigate back via breadcrumb
- [x] Category filter chips on the search results page
- [x] Empty search state (no results, and no query yet)
- [x] Invalid category / invalid item id → 404
- [x] All six `/category` browse pages
- [x] Responsive: mobile nav collapses to a hamburger below 1024px width;
      tested that this doesn't overlap on tablet-width screens
