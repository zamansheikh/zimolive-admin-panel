'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { authStorage } from '@/lib/auth';
import { COMPANY_LINKS, LEGAL_INFO, LEGAL_LINKS } from '@/lib/legal-info';

// ============================================================================
// Public marketing landing page for Zimo Live.
//
// The page targets *consumers* who land here from the Play Store
// listing, social posts, or word of mouth. Admins still need a way in,
// but the staff sign-in is intentionally small (a "Staff" link in the
// header + a one-line note in the footer) so it doesn't compete with
// the mobile-app CTA for the consumer eye.
//
// Mobile-first: every element renders sensibly at 320 px wide, then
// progressively enhances at `sm:` (640), `md:` (768), and `lg:` (1024).
// ============================================================================

const FEATURES = [
  {
    icon: '🎙',
    title: 'Live audio rooms',
    body: 'Drop into a voice room, take a seat, and talk in real time with hosts and friends. No video pressure — just voice.',
  },
  {
    icon: '🎁',
    title: 'Send and receive gifts',
    body: 'Animated gifts that pop on screen, frames that follow you around, and a wall that shows off what you have received.',
  },
  {
    icon: '✦',
    title: 'Families and SVIP',
    body: 'Join a family, climb the SVIP ladder, and unlock cosmetic perks: room themes, vehicles, mic effects, badges.',
  },
  {
    icon: '💬',
    title: 'Direct chat',
    body: 'One-tap private threads with anyone you meet in a room. Real-time, with full media support.',
  },
  {
    icon: '🛡',
    title: 'Safe and moderated',
    body: 'Block and report anyone in a tap. Built-in word filter on every room chat. 18+ age gate enforced.',
  },
  {
    icon: '🌍',
    title: 'Made for everyone',
    body: 'English and Bengali in the app today; more languages coming. Optimised for mid-range Android phones.',
  },
];

export default function LandingPage() {
  // Auth-aware staff CTA — only matters for admins who have signed in
  // before. Consumers will never see the "Open console" wording.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    setSignedIn(!!authStorage.getAccessToken());
  }, []);

  const staffHref = signedIn ? '/dashboard' : '/login';
  const staffLabel = signedIn ? 'Open console' : 'Staff sign in';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================================================================
          Header — brand left, primary nav right. On phones we drop the
          Download / Features text links to keep the bar uncluttered;
          the staff link stays so admins can always reach login. */}
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

          {/* Staff sign-in deliberately omitted from the header —
              it lives in the footer's Company column for admins who
              know to look there. Keeps the public-facing surface
              focused on the consumer download CTA. */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href={LEGAL_INFO.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white shadow-soft transition hover:bg-brand-800 sm:px-4 sm:py-2 sm:text-sm"
            >
              Download
            </a>
          </div>
        </div>
      </header>

      {/* ===================================================================
          Hero — consumer-first. The Play Store badge is the primary CTA.
          Phone mockup only shows ≥ lg; below that the text stack is
          full-width centred so the badge stays above the fold on phones. */}
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
                Now on Google Play
              </div>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Live the party.{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  Anywhere.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                Zimo Live is a live audio social app — voice rooms, gifts,
                families, and real-time chat. Join hosts from your country
                or jump into a room halfway across the world.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-3 lg:items-start lg:justify-start">
                <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} />
                {LEGAL_INFO.appStoreUrl ? (
                  <AppStoreBadge href={LEGAL_INFO.appStoreUrl} />
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-500">
                    <AppleIcon className="h-5 w-5" />
                    <span>iOS coming soon</span>
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Free to download · 18+ · No ads
              </p>
            </div>

            <div className="hidden justify-center lg:flex">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Features — describe what's inside the *mobile app*, not the
          admin console. 1 col on phones, 2 on tablets, 3 on desktop. */}
      <section id="features" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              What you can do
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Designed for fast triage on the phone and quick moves between
              rooms. Everything below is in the app today.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {FEATURES.map((f) => (
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
          Bottom CTA — final consumer prompt before the footer. */}
      <section
        id="get-the-app"
        className="border-t border-slate-200 bg-slate-950"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to drop in?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
            Free on Google Play. Sign-up takes a single Google tap.
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
          Footer — legal + company links + a discreet staff sign-in. */}
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
                Live audio rooms, gifts, and community — built for fast,
                fun social interaction.
              </p>
              <div className="mt-5">
                <GooglePlayBadge href={LEGAL_INFO.playStoreUrl} compact />
              </div>
            </div>

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
                <li>
                  {/* Staff sign-in lives here, deliberately understated.
                      Admins know to look in the footer; consumers don't
                      need it surfaced. */}
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
            <span>
              © {new Date().getFullYear()} Programmer Nexus. All rights
              reserved.
            </span>
            <span>Made in Bangladesh.</span>
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
 * "Google Play" wordmark, triangular play icon in brand colours) but
 * implemented as native HTML so it scales crisply at any size.
 *
 * Google's badge-usage policy allows custom CTAs that don't claim
 * official-badge styling; this is the standard pattern.
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

/**
 * Apple App Store equivalent — only renders when [LEGAL_INFO.appStoreUrl]
 * is set, so we don't ship a dead link before iOS launches.
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
 * Replaces a screenshot asset; any brand refresh is a CSS edit.
 * Hidden below `lg` so the section stays compact on phones / tablets.
 */
function PhoneMockup() {
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
              <div className="mt-1 text-xs text-slate-400">
                Live the party. Anywhere.
              </div>
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
