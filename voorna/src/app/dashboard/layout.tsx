import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, BarChart3, Users, Wallet, Plus } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard#events", label: "Participants", icon: Users },
  { href: "/dashboard#analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard#payouts", label: "Payouts", icon: Wallet },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper-shade">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.02em]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              Voorna
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-paper-mute hover:text-ink"
                >
                  <item.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/dashboard/events/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Create event
            </Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-8">{children}</main>
    </div>
  );
}
