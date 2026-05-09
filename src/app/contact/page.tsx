import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `Contact — ${LEGAL_INFO.appName}`,
  description: `Get in touch with the ${LEGAL_INFO.appName} team for support, privacy, or partnership inquiries.`,
};

export default function ContactPage() {
  return (
    <LegalShell
      title="Contact"
      description={`Reach the ${LEGAL_INFO.appName} team. We aim to respond to most messages within a few business days.`}
    >
      <h2>General support</h2>
      <p>
        Bug reports, account issues, missing coins, billing questions, or
        anything else about using the app:
      </p>
      <ul>
        <li>
          Email:{' '}
          <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
            {LEGAL_INFO.supportEmail}
          </a>
        </li>
      </ul>
      <p>
        When emailing about an account, please include your username and the
        email or phone number used to sign up — it helps us help you faster.
      </p>

      <h2>Privacy and data requests</h2>
      <p>
        Requests to access, correct, export, or delete your data, or any
        question about our{' '}
        <a href="/privacy-policy">Privacy Policy</a>:
      </p>
      <ul>
        <li>
          Email:{' '}
          <a
            href={`mailto:${LEGAL_INFO.privacyEmail}?subject=Privacy%20Request`}
          >
            {LEGAL_INFO.privacyEmail}
          </a>{' '}
          with the subject line <em>“Privacy Request.”</em>
        </li>
      </ul>

      <h2>Account deletion</h2>
      <p>
        See the dedicated <a href="/delete-account">Delete Account</a> page
        for in-app and email deletion steps.
      </p>

      <h2>Child safety reports</h2>
      <p>
        To report content or behaviour that endangers a minor, see our{' '}
        <a href="/child-safety">Child Safety Standards</a> page. For urgent
        reports, email{' '}
        <a
          href={`mailto:${LEGAL_INFO.supportEmail}?subject=Child%20Safety%20Report`}
        >
          {LEGAL_INFO.supportEmail}
        </a>{' '}
        with the subject line <em>“Child Safety Report.”</em>
      </p>

      <h2>Press &amp; partnerships</h2>
      <p>
        For media, partnership, or business-development inquiries, email{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}?subject=Partnership`}>
          {LEGAL_INFO.supportEmail}
        </a>
        .
      </p>

      <h2>Postal address</h2>
      <p>
        {LEGAL_INFO.operator}
        <br />
        {LEGAL_INFO.address}
      </p>
    </LegalShell>
  );
}
