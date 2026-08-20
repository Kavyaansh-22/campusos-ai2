"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/#categories" },
  ...CATEGORIES.map((c) => ({
    label: c.slug === "offices" ? "Offices" : c.label,
    href: `/${c.slug}`,
  })),
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper-raised/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex flex-col leading-none gap-1" onClick={() => setMenuOpen(false)}>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            CampusOS
          </span>
          <span className="hidden text-[11px] text-slate sm:block">Your MIT-WPU Campus Guide</span>
        </Link>

        {/* Desktop nav — switches on at lg (1024px), not md. 8 links need
            roughly 750px on their own; turning them on at md (768px) would
            overlap the logo on tablet-width screens, which the product
            spec explicitly requires supporting. */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = link.href !== "/#categories" && pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-paper font-medium text-ink"
                    : "text-slate hover:bg-paper hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile/tablet menu toggle — 44px touch target (WCAG 2.5.5) */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-ink lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden className="text-base">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile/tablet menu panel */}
      {menuOpen && (
        <nav
          className="border-t border-border bg-paper-raised px-4 py-3 lg:hidden"
          aria-label="Primary"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const active = link.href !== "/#categories" && pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-sm",
                      active ? "font-medium text-ink bg-paper" : "text-slate"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
