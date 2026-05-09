import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `Privacy Policy — ${LEGAL_INFO.appName}`,
  description: `How ${LEGAL_INFO.appName} collects, uses, and protects your information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      description={`This Privacy Policy explains how ${LEGAL_INFO.operator} (“we,” “us”) handles information collected through the ${LEGAL_INFO.appName} mobile application and related services (the “Service”).`}
    >
      <h2>1. Information we collect</h2>
      <p>
        We collect the minimum information necessary to operate the Service.
        Specifically:
      </p>
      <ul>
        <li>
          <strong>Account data</strong> — name, email address, profile photo,
          gender, country, and the authentication identifier provided by Google
          Sign-In or Firebase Authentication when you create an account.
        </li>
        <li>
          <strong>Profile content</strong> — bio, avatar, and any moments,
          posts, or media you choose to publish in the app.
        </li>
        <li>
          <strong>Live-room activity</strong> — the rooms you join or host, the
          gifts you send and receive, and the messages you post in chat. Audio
          streams are routed through the Agora real-time infrastructure and are
          not recorded by us by default.
        </li>
        <li>
          <strong>Wallet and transaction data</strong> — your in-app coin
          balance, recharge history, and gift history. Payments are processed
          by Google Play / Apple App Store; we do not receive or store your
          card or banking details.
        </li>
        <li>
          <strong>Device and diagnostic data</strong> — device model, OS
          version, app version, language, time zone, IP address, crash logs,
          and aggregate usage metrics.
        </li>
        <li>
          <strong>Push token</strong> — the Firebase Cloud Messaging
          registration token used to deliver notifications.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To create and authenticate your account.</li>
        <li>
          To operate live audio rooms, chat, gifting, and other social
          features.
        </li>
        <li>
          To process in-app coin recharges and credit purchased coins to your
          wallet.
        </li>
        <li>
          To send transactional and engagement push notifications. You can
          disable notifications from the app settings or your device.
        </li>
        <li>
          To detect and respond to abuse, fraud, security incidents, and
          violations of our Terms of Service.
        </li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with the
        service providers required to run the Service:
      </p>
      <ul>
        <li>
          <strong>Google / Firebase</strong> — authentication, push
          notifications, crash reporting.
        </li>
        <li>
          <strong>Agora</strong> — real-time audio infrastructure for live
          rooms.
        </li>
        <li>
          <strong>Cloudinary</strong> — media storage and image delivery.
        </li>
        <li>
          <strong>App stores</strong> — Google Play and Apple App Store handle
          payment processing and refunds.
        </li>
      </ul>
      <p>
        These providers are contractually required to use your information
        only to deliver their service to us. We may also disclose information
        when required by law or to protect the rights and safety of users.
      </p>

      <h2>4. Data retention</h2>
      <p>
        We retain account data while your account is active. When you delete
        your account, we remove your profile data within 30 days, subject to
        backups and limited records we are required to keep for fraud, tax, or
        legal-compliance reasons (typically up to 6 years for financial
        records).
      </p>

      <h2>5. Your choices and rights</h2>
      <ul>
        <li>You can edit your profile and content at any time in the app.</li>
        <li>You can disable push notifications from your device settings.</li>
        <li>
          You can request account deletion at any time — see our{' '}
          <a href="/delete-account">Delete Account</a> page.
        </li>
        <li>
          Depending on where you live, you may have additional rights such as
          access, correction, portability, and objection. To exercise them,
          email us at{' '}
          <a href={`mailto:${LEGAL_INFO.privacyEmail}`}>
            {LEGAL_INFO.privacyEmail}
          </a>
          .
        </li>
      </ul>

      <h2>6. Security</h2>
      <p>
        We use TLS for data in transit, server-side hashing for sensitive
        credentials, and access controls on our admin systems. No system is
        100% secure; you are responsible for keeping your account credentials
        confidential.
      </p>

      <h2>7. Children</h2>
      <p>
        {LEGAL_INFO.appName} is not directed to children. You must be at least{' '}
        {LEGAL_INFO.minimumAge} years old to use the Service. See our{' '}
        <a href="/child-safety">Child Safety</a> page for more.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Your information may be processed in countries other than the one you
        live in, including {LEGAL_INFO.jurisdiction} and the regions where our
        cloud providers operate. We rely on standard contractual safeguards
        for cross-border transfers.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update this Privacy Policy. We will revise the “Last updated”
        date and, for material changes, give you notice in the app. Continued
        use of the Service after changes take effect means you accept the
        revised policy.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions or privacy requests? Email{' '}
        <a href={`mailto:${LEGAL_INFO.privacyEmail}`}>
          {LEGAL_INFO.privacyEmail}
        </a>
        . Postal address: {LEGAL_INFO.operator}, {LEGAL_INFO.address}.
      </p>
    </LegalShell>
  );
}
