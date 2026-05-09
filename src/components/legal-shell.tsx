import Image from 'next/image';
import Link from 'next/link';

import { LEGAL_INFO } from '@/lib/legal-info';

type LegalShellProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export function LegalShell({
  title,
  description,
  lastUpdated = LEGAL_INFO.lastUpdated,
  children,
}: LegalShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header — kept simple and consistent with the landing page. */}
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg shadow-soft">
              <Image
                src="/zimolive-logo.webp"
                alt={LEGAL_INFO.appName}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-base font-semibold text-slate-900">
              {LEGAL_INFO.appName}
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-base text-slate-600">{description}</p>
          ) : null}
          <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="prose-zimo">{children}</div>
      </article>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-slate-500 sm:px-6">
          © {new Date().getFullYear()} {LEGAL_INFO.operator}. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
