import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper-shade px-5 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-2xl font-semibold tracking-[-0.02em]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-gold" />
          Voorna
        </Link>
        <div className="rounded-xl border border-line bg-white p-7 shadow-card">
          <h1 className="text-xl font-semibold tracking-[-0.015em]">{title}</h1>
          <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-5 text-center text-sm text-ink-soft">{footer}</p>
      </div>
    </main>
  );
}
