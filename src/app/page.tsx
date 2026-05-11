'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { authStorage } from '@/lib/auth';
import {
  LANDING_LOCALES,
  type LandingStrings,
  type Locale,
  useLandingLocale,
} from '@/lib/landing-i18n';
import { LEGAL_INFO } from '@/lib/legal-info';

// ============================================================================
// Public marketing landing page for Zimo Live.
//
// Consumer-first. Admins reach login via a small footer link only.
//
// Copy is bilingual (English / 中文) via `useLandingLocale`. Default
// locale is English so first-visit / SEO matches what Google indexes;
// returning visitors get the locale they last picked from
// localStorage. Positioning leans on Chinese-origin signalling
// (footer line, language order in the toggle) per product intent.
// ============================================================================

export default function LandingPage() {
  const { locale, setLocale, t } = useLandingLocale();

  // Auth-aware staff CTA — only matters for admins who have signed in
  // before. Consumers will never see the "Open console" wording.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    setSignedIn(!!authStorage.getAccessToken());
  }, []);

  const staffHref = signedIn ? '/dashboard' : '/login';
  const staffLabel = signedIn ? t.footerStaffSignedIn : t.footerStaffSignedOut;

  const features = buildFeatures(t);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================================================================
          Header — brand left, locale toggle + Features + Download right. */}
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg shadow-soft">
              <Image
                src="/zimolive-logo.webp"
                alt="Zimo Live"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-base font-semibold text-slate-900">
              Zimo Live
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <a
              href="#features"
              className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
            >
              {t.navFeatures}
            </a>
            <a
              href={LEGAL_INFO.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white shadow-soft transition hover:bg-brand-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              {t.navDownload}
            </a>
          </div>
        </div>
      </header>

      {/* ===================================================================
          Hero — consumer-first. Play Store badge is the primary CTA. */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-70"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-brand-600"
                  aria-hidden
                />
                {t.heroEyebrow}
              </div>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t.heroTitleA}{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  {t.heroTitleB}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                {t.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-3 lg:items-start lg:justify-start">
                <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} />
                {LEGAL_INFO.appStoreUrl ? (
                  <AppStoreBadge href={LEGAL_INFO.appStoreUrl} />
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-500">
                    <AppleIcon className="h-5 w-5" />
                    <span>{t.iosComingSoon}</span>
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-slate-500">{t.heroFootnote}</p>
            </div>

            <div className="hidden justify-center lg:flex">
              <PhoneMockup tagline={`${t.heroTitleA} ${t.heroTitleB}`} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Features grid. */}
      <section id="features" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t.featuresHeading}
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              {t.featuresSubhead}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card sm:p-6"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-700 transition group-hover:bg-brand-100">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          Bottom CTA. */}
      <section
        id="get-the-app"
        className="border-t border-slate-200 bg-slate-950"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t.ctaHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
            {t.ctaBody}
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} />
            {LEGAL_INFO.appStoreUrl ? (
              <AppStoreBadge href={LEGAL_INFO.appStoreUrl} />
            ) : null}
          </div>
        </div>
      </section>

      {/* ===================================================================
          Footer. Legal pages stay English-only (per landing-i18n.ts note)
          so the labels coming out of LEGAL_LINKS / COMPANY_LINKS aren't
          translated. */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
                  <Image
                    src="/zimolive-logo.webp"
                    alt="Zimo Live"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-base font-semibold text-white">
                  Zimo Live
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                {t.footerTagline}
              </p>
              <div className="mt-5">
                <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} compact />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t.footerLegal}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {t.legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t.footerCompany}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {t.companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={staffHref}
                    className="text-slate-500 transition hover:text-slate-300"
                  >
                    {staffLabel}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:text-sm">
            <span>{t.footerCopyright(new Date().getFullYear())}</span>
            <span>{t.footerMadeIn}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// Locale toggle
// ============================================================================

/**
 * EN | 中文 segmented control. Compact enough to live next to the
 * Download CTA on phones without crowding the header. Chinese sits in
 * the second slot but is the visually heavier glyph, which keeps the
 * bilingual signal readable at a glance.
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

// ============================================================================
// Features helper
// ============================================================================

function buildFeatures(t: LandingStrings) {
  return [
    { icon: '🎙', title: t.feature1Title, body: t.feature1Body },
    { icon: '🎁', title: t.feature2Title, body: t.feature2Body },
    { icon: '✦', title: t.feature3Title, body: t.feature3Body },
    { icon: '💬', title: t.feature4Title, body: t.feature4Body },
    { icon: '🛡', title: t.feature5Title, body: t.feature5Body },
    { icon: '🌍', title: t.feature6Title, body: t.feature6Body },
  ];
}

// ============================================================================
// Store badges + mockup
// ============================================================================

/**
 * Custom-styled "Get it on Google Play" button. Native HTML so it
 * scales crisply at any size. `compact` halves the width for footer
 * placements.
 */
function GooglePlayBadge({
  href,
  compact = false,
}: {
  href: string;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Zimo Live on Google Play"
      className={`inline-flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900 transition hover:border-slate-500/80 hover:bg-slate-800 ${
        compact ? 'px-3 py-2' : 'px-5 py-3'
      }`}
    >
      <svg
        viewBox="0 0 512 512"
        className={compact ? 'h-7 w-7' : 'h-9 w-9'}
        aria-hidden
      >
        <defs>
          <linearGradient id="gpBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00A0FF" />
            <stop offset="100%" stopColor="#00E1FF" />
          </linearGradient>
          <linearGradient id="gpYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE000" />
            <stop offset="100%" stopColor="#FFBD00" />
          </linearGradient>
          <linearGradient id="gpRed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF3A44" />
            <stop offset="100%" stopColor="#C31162" />
          </linearGradient>
          <linearGradient id="gpGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00F076" />
            <stop offset="100%" stopColor="#00C168" />
          </linearGradient>
        </defs>
        <path
          d="M70 28C58 34 50 47 50 64v384c0 17 8 30 20 36l219-220L70 28z"
          fill="url(#gpBlue)"
        />
        <path
          d="M289 264L70 484c8 4 19 4 31-2l255-145-67-73z"
          fill="url(#gpRed)"
        />
        <path
          d="M356 337l66-37c26-15 26-39 0-54l-66-37-71 75 71 53z"
          fill="url(#gpYellow)"
        />
        <path
          d="M289 264l67-73L101 26c-12-6-23-6-31-2l219 240z"
          fill="url(#gpGreen)"
        />
      </svg>
      <div className="text-left">
        <div
          className={`leading-none text-slate-400 ${
            compact ? 'text-[9px]' : 'text-[10px]'
          }`}
        >
          GET IT ON
        </div>
        <div
          className={`leading-tight font-semibold text-white ${
            compact ? 'text-sm' : 'text-lg'
          }`}
        >
          Google Play
        </div>
      </div>
    </a>
  );
}

function AppStoreBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Zimo Live on the App Store"
      className="inline-flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900 px-5 py-3 transition hover:border-slate-500/80 hover:bg-slate-800"
    >
      <AppleIcon className="h-8 w-8 text-white" />
      <div className="text-left">
        <div className="text-[10px] leading-none text-slate-400">
          Download on the
        </div>
        <div className="text-lg font-semibold leading-tight text-white">
          App Store
        </div>
      </div>
    </a>
  );
}

function AppleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 384 512"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/**
 * Pure-CSS phone silhouette with the logo on a brand-coloured glow.
 * Tagline is fed by the active locale so the mockup stays in sync.
 */
function PhoneMockup({ tagline }: { tagline: string }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-8 rounded-full bg-brand-gradient opacity-25 blur-3xl"
        aria-hidden
      />
      <div className="relative h-[480px] w-60 rounded-[40px] border-[10px] border-slate-800 bg-slate-950 shadow-card">
        <div
          className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-800"
          aria-hidden
        />
        <div className="absolute inset-2 overflow-hidden rounded-[30px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="h-24 w-24 overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/zimolive-logo.webp"
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-5 text-center">
              <div className="text-xl font-bold text-white">Zimo Live</div>
              <div className="mt-1 text-xs text-slate-400">{tagline}</div>
            </div>
            <div className="mt-8 flex gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand-500"
                aria-hidden
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-slate-700"
                aria-hidden
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-slate-700"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
