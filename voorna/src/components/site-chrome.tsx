import Link from "next/link";
import { Button } from "@/components/ui/button";

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 font-display text-[22px] font-bold tracking-[-0.01em] ${className}`}>
      <span className="inline-block h-2 w-2 rounded-full bg-gold" />
      Voorna
    </span>
  );
}

const NAV_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#templates", label: "Templates" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-wrap items-center justify-between px-7 py-[18px]">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-ink/75 transition-opacity hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3.5">
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Create Free Event</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#templates", label: "Templates" },
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Use cases",
    links: [
      { href: "/e/aurora-pageant-2026", label: "Pageants & modelling" },
      { href: "/signup", label: "Awards programmes" },
      { href: "/signup", label: "Festivals & community" },
      { href: "/signup", label: "School & charity" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/signup", label: "Support" },
      { href: "/signup", label: "Terms" },
      { href: "/signup", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-9 pt-16">
      <div className="mx-auto max-w-wrap px-7">
        <div className="mb-12 flex flex-wrap justify-between gap-12">
          <div>
            <Logo className="mb-3.5" />
            <p className="max-w-[280px] text-sm leading-relaxed text-ink-soft">
              Create voting experiences in minutes — for pageants, awards,
              festivals, and every contest in between.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-mono text-[12.5px]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Powered by Voorna
            </span>
          </div>
          <div className="flex flex-wrap gap-16">
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h4 className="mb-4 font-mono text-[13px] uppercase tracking-[0.1em] text-ink-soft">
                  {col.heading}
                </h4>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="mb-2.5 block text-sm text-ink/80 hover:text-ink hover:underline"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7 text-[13px] text-ink-soft">
          <span>© {new Date().getFullYear()} Voorna. All rights reserved.</span>
          <Link href="/signup" className="font-mono hover:text-ink">
            Create your own free voting event →
          </Link>
        </div>
      </div>
    </footer>
  );
}
