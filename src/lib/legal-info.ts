// Centralised constants used across the legal/info pages so the operator
// can update brand details (entity name, contact email, address, etc.)
// in one place. All public-facing legal pages and the landing-page footer
// pull from here.

export const LEGAL_INFO = {
  appName: 'Zimo Live',
  operator: 'Programmer Nexus',
  jurisdiction: 'Bangladesh',
  address: 'Mymensingh, Bangladesh',
  supportEmail: 'support@zimolive.com',
  privacyEmail: 'support@zimolive.com',
  // ISO date — bump whenever you materially change a page.
  lastUpdated: '2026-05-09',
  // Minimum age to register an account. Live-streaming apps with adult
  // social features generally require 18+; bump down only after confirming
  // store-side age gating.
  minimumAge: 18,
} as const;

export const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/child-safety', label: 'Child Safety' },
  { href: '/refund-policy', label: 'Refund Policy' },
  { href: '/delete-account', label: 'Delete Account' },
] as const;

export const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
