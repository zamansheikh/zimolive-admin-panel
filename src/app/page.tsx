'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { authStorage } from '@/lib/auth';
import { COMPANY_LINKS, LEGAL_INFO, LEGAL_LINKS } from '@/lib/legal-info';

const FEATURES = [
  {
    icon: '◯',
    title: 'Users & Agencies',
    body: 'Search, scope, and moderate app users, agencies, and resellers with role-based access.',
  },
  {
    icon: '✿',
    title: 'Gifts & Cosmetics',
    body: 'Manage the live monetization catalog — assets, pricing, deactivation, all in one place.',
  },
  {
    icon: '$',
    title: 'Transactions',
    body: 'Audit recharges, withdrawals, and exchanges with searchable, paginated transaction history.',
  },
  {
    icon: '✉',
    title: 'Push & Engagement',
    body: 'Compose push notifications, schedule banners, and run daily-reward campaigns from the same console.',
  },
  {
    icon: '⚡',
    title: 'Live Moderation',
    body: 'Review user moments, manage Agora rooms, and keep the platform safe in real time.',
  },
  {
    icon: '✦',
    title: 'Granular Permissions',
    body: 'Custom roles with per-feature permissions — give every team member exactly what they need.',
  },
];

export default function LandingPage() {
  // Auth-aware CTA: shows "Open Console" if signed in, "Sign in" otherwise.
  // Initialised to null so SSR and the first client render match (no
  // hydration mismatch); resolves on mount via the localStorage check.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    setSignedIn(!!authStorage.getAccessToken());
  }, []);

  const ctaHref = signedIn ? '/dashboard' : '/login';
  const ctaLabel = signedIn ? 'Open console' : 'Sign in';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
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
            <span className="text-base font-semibold text-slate-900">Zimo Live</span>
          </Link>

          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800"
          >
            {ctaLabel}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft mesh background — purely decorative, doesn't grab events. */}
        <div className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
              Admin Console
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Run the party app from{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">one console</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Manage gifts, users, agencies, transactions, push notifications, and live moderation —
              all backed by granular role-based access.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href={ctaHref}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-700 px-6 py-3 text-base font-medium text-white shadow-card transition hover:bg-brand-800 sm:w-auto"
              >
                {ctaLabel}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-2 h-4 w-4"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                What's inside
              </a>
            </div>

            {/* Light-touch hint that this site has a companion app —
                the prominent badge is in the dedicated section below
                so admins aren't visually fighting with the mobile
                CTA for attention. */}
            <p className="mt-6 text-sm text-slate-500">
              Looking for the mobile app?{' '}
              <a
                href="#get-the-app"
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                Download Zimo Live on Google Play
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Everything you need to operate
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Six modules. One sign-in. Designed for fast triage on desktop and quick checks on mobile.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-700 transition group-hover:bg-brand-100">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get the app — the consumer-facing CTA, distinct from the
          admin console strip below so the mobile-app marketing isn't
          buried at the bottom of the page. */}
      <section
        id="get-the-app"
        className="border-t border-slate-200 bg-slate-950"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              Now on Google Play
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Take {LEGAL_INFO.appName} with you.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              Join live audio rooms, send gifts, chat with families, and meet
              new people on the go. The {LEGAL_INFO.appName} mobile app is
              free on Google Play — iOS support is on the way.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} />
              {LEGAL_INFO.appStoreUrl ? (
                <AppStoreBadge href={LEGAL_INFO.appStoreUrl} />
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 px-4 py-3 text-xs text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span>iOS coming soon</span>
                </div>
              )}
            </div>
          </div>

          {/* Visual: phone-shaped frame with the app logo. Pure CSS,
              no asset to manage. Hidden below `lg` so the section
              stays compact on phones / tablets. */}
          <div className="hidden lg:flex lg:justify-center">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Admin CTA strip — kept after the consumer section so the
          staff sign-in still has a clear final-call placement. */}
      <section className="border-t border-slate-200 bg-brand-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:px-6 sm:text-left">
          <div>
            <h3 className="text-xl font-semibold text-white sm:text-2xl">
              Ready when you are.
            </h3>
            <p className="mt-1 text-sm text-brand-100">
              Sign in with your admin credentials to access the console.
            </p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-medium text-brand-800 shadow-card transition hover:bg-brand-50"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {/* Brand column */}
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
                <span className="text-base font-semibold text-white">Zimo Live</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                Live audio rooms, gifts, and community — built for fast, fun
                social interaction.
              </p>
              <div className="mt-5">
                <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} compact />
              </div>
            </div>

            {/* Legal column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Legal
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {LEGAL_LINKS.map((link) => (
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

            {/* Company column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Company
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {COMPANY_LINKS.map((link) => (
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
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Programmer Nexus. All rights reserved.</span>
            <span>Zimo Live Admin Console</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// Store badges + mockup
// ============================================================================

/**
 * Custom-styled "Get it on Google Play" button. Mirrors the visual
 * weight of Google's official badge (dark pill, "GET IT ON" eyebrow,
 * "Google Play" wordmark, triangular play icon in brand colors) but
 * implemented as native HTML so it scales crisply at any size.
 *
 * Google's badge-usage policy allows custom CTAs that don't claim
 * official-badge styling — i.e. we can't replicate the exact
 * pixel-perfect badge image, but a clearly-different alternative
 * referencing "Google Play" by name is fine and standard practice.
 *
 * `compact` halves the width for footer placements.
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
      {/* Official Google Play triangle, recreated as inline SVG with the
          four-color fill the badge uses. */}
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
        <path d="M70 28C58 34 50 47 50 64v384c0 17 8 30 20 36l219-220L70 28z" fill="url(#gpBlue)" />
        <path d="M289 264L70 484c8 4 19 4 31-2l255-145-67-73z" fill="url(#gpRed)" />
        <path d="M356 337l66-37c26-15 26-39 0-54l-66-37-71 75 71 53z" fill="url(#gpYellow)" />
        <path d="M289 264l67-73L101 26c-12-6-23-6-31-2l219 240z" fill="url(#gpGreen)" />
      </svg>
      <div className="text-left">
        <div className={`leading-none text-slate-400 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          GET IT ON
        </div>
        <div className={`leading-tight font-semibold text-white ${compact ? 'text-sm' : 'text-lg'}`}>
          Google Play
        </div>
      </div>
    </a>
  );
}

/**
 * Apple App Store equivalent — only renders when [LEGAL_INFO.appStoreUrl]
 * is set, so we don't ship a dead link before iOS launches. Pre-built
 * here so the iOS launch is a one-line config flip in legal-info.ts.
 */
function AppStoreBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Zimo Live on the App Store"
      className="inline-flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900 px-5 py-3 transition hover:border-slate-500/80 hover:bg-slate-800"
    >
      <svg
        viewBox="0 0 384 512"
        fill="currentColor"
        className="h-8 w-8 text-white"
        aria-hidden
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <div className="text-left">
        <div className="text-[10px] leading-none text-slate-400">Download on the</div>
        <div className="text-lg font-semibold leading-tight text-white">App Store</div>
      </div>
    </a>
  );
}

/**
 * Pure-CSS phone silhouette wrapping the logo, plus a soft brand glow.
 * Replaces a screenshot asset — keeps the page bundle small, and any
 * brand refresh is a CSS edit rather than a Photoshop job. Visible
 * only at lg+ where there's room for it next to the copy.
 */
function PhoneMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-brand-gradient opacity-25 blur-3xl" aria-hidden />
      <div className="relative h-[480px] w-60 rounded-[40px] border-[10px] border-slate-800 bg-slate-950 shadow-card">
        {/* Camera notch */}
        <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-800" aria-hidden />
        {/* Screen interior */}
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
              <div className="mt-1 text-xs text-slate-400">
                Live the party. Anywhere.
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" aria-hidden />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
