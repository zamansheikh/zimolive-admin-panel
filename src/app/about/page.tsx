import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `About — ${LEGAL_INFO.appName}`,
  description: `About ${LEGAL_INFO.appName}: a live audio social app built by ${LEGAL_INFO.operator}.`,
};

export default function AboutPage() {
  return (
    <LegalShell
      title={`About ${LEGAL_INFO.appName}`}
      description="Live audio rooms, real conversations, and a community built around fun."
    >
      <h2>What is {LEGAL_INFO.appName}?</h2>
      <p>
        {LEGAL_INFO.appName} is a live audio social platform. Users start or
        join voice rooms to talk, play games, listen to music, and meet new
        people. Hosts can decorate their rooms, moderate conversations, and
        receive virtual gifts from listeners. It’s designed for casual,
        fast-moving social interaction — short rooms, lots of voices, no
        pressure.
      </p>

      <h2>Core features</h2>
      <ul>
        <li>
          <strong>Live audio rooms</strong> — multi-mic voice rooms powered by
          real-time streaming, with host controls, mic management, and chat.
        </li>
        <li>
          <strong>Gifts &amp; cosmetics</strong> — send animated gifts to
          hosts and friends, and customise your profile with frames and
          badges.
        </li>
        <li>
          <strong>Family system</strong> — create or join families to hang
          out with the same group of people across rooms.
        </li>
        <li>
          <strong>Moments</strong> — share short text and media posts with
          your followers.
        </li>
        <li>
          <strong>Wallet &amp; recharges</strong> — buy in-app coins through
          Google Play or the App Store to send gifts and unlock features.
        </li>
        <li>
          <strong>Push notifications</strong> — never miss a friend going
          live or a room you care about.
        </li>
      </ul>

      <h2>Who builds it</h2>
      <p>
        {LEGAL_INFO.appName} is built and operated by{' '}
        <strong>{LEGAL_INFO.operator}</strong>, based in {LEGAL_INFO.address}.
        Our team works on real-time infrastructure, mobile, backend, and
        community safety — with a focus on keeping the platform fast,
        reliable, and friendly.
      </p>

      <h2>Safety and trust</h2>
      <p>
        We take community safety seriously. Live rooms are moderated by hosts
        and platform-wide enforcement, and we have a strict zero-tolerance
        policy on content that exploits or endangers minors. See our{' '}
        <a href="/child-safety">Child Safety</a>,{' '}
        <a href="/terms-of-service">Terms of Service</a>, and{' '}
        <a href="/privacy-policy">Privacy Policy</a> pages for the details.
      </p>

      <h2>Get in touch</h2>
      <p>
        Press, partnerships, or general questions: visit our{' '}
        <a href="/contact">Contact</a> page or email{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        .
      </p>
    </LegalShell>
  );
}
