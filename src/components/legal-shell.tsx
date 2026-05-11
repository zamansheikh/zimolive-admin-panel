'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  LANDING_LOCALES,
  type Locale,
  useLandingLocale,
} from '@/lib/landing-i18n';
import { LEGAL_INFO } from '@/lib/legal-info';

/**
 * Wrapper for every legal/info page (Privacy, Terms, Child Safety,
 * Refund, Delete Account, About, Contact). Renders the brand header,
 * the page title + last-updated stamp, the active locale's content,
 * and a brand-only footer.
 *
 * Both EN and ZH content trees are passed in by the page; the shell
 * picks one at runtime based on the persisted locale (shared with the
 * landing-page / login toggle via localStorage). Both trees serialize
 * to the same HTML page on first render, which keeps SEO simple
 * (search engines index the EN content) and switching is a pure
 * client-side state change — no extra fetch, no route change.
 */
type Bilingual<T> = { en: T; zh: T };

type LegalShellProps = {
  title: Bilingual<string>;
  description?: Bilingual<string>;
  lastUpdated?: string;
  enContent: React.ReactNode;
  zhContent: React.ReactNode;
};

export function LegalShell({
  title,
  description,
  lastUpdated = LEGAL_INFO.lastUpdated,
  enContent,
  zhContent,
}: LegalShellProps) {
  const { locale, setLocale, t } = useLandingLocale();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
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
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {t.legalBackHome}
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title[locale]}
          </h1>
          {description ? (
            <p className="mt-3 text-base text-slate-600">
              {description[locale]}
            </p>
          ) : null}
          <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
            {t.legalLastUpdated}: {lastUpdated}
          </p>
        </header>

        {/* prose-zimo wraps both versions; only the active locale's
            tree is mounted so styling applies once. */}
        <div className="prose-zimo">
          {locale === 'en' ? enContent : zhContent}
        </div>
      </article>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-slate-500 sm:px-6">
          {t.footerCopyright(new Date().getFullYear())}
        </div>
      </footer>
    </div>
  );
}

/**
 * EN | 中文 segmented control — same look as the landing-page header
 * so the toggle reads as the same control no matter which surface the
 * user is on.
 */
function LocaleToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (l: Locale) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 p-0.5 text-xs shadow-soft backdrop-blur"
    >
      {LANDING_LOCALES.map((l) => {
        const active = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => onChange(l.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 font-medium transition ${
              active
                ? 'bg-brand-700 text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
