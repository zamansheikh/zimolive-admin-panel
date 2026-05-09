import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `Delete Account — ${LEGAL_INFO.appName}`,
  description: `How to permanently delete your ${LEGAL_INFO.appName} account and the data associated with it.`,
};

export default function DeleteAccountPage() {
  return (
    <LegalShell
      title="Delete Your Account"
      description={`You can permanently delete your ${LEGAL_INFO.appName} account and the personal information associated with it at any time. This page describes how, and what happens to your data.`}
    >
      <h2>1. In-app deletion (recommended)</h2>
      <ol>
        <li>
          Open the {LEGAL_INFO.appName} app and sign in to the account you
          want to delete.
        </li>
        <li>
          Go to <strong>Profile → Settings → Account → Delete Account</strong>.
        </li>
        <li>
          Confirm the deletion. The request is queued immediately and your
          account is signed out.
        </li>
      </ol>

      <h2>2. Email-based deletion</h2>
      <p>
        If you can no longer access the app or your account, send a deletion
        request to{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}?subject=Delete%20My%20Account`}>
          {LEGAL_INFO.supportEmail}
        </a>{' '}
        from the email address on file. Use the subject line{' '}
        <em>“Delete my account”</em> and include:
      </p>
      <ul>
        <li>Your username or user ID inside the app.</li>
        <li>The phone number or email used at sign-up, if different.</li>
        <li>A short statement that you want your account permanently deleted.</li>
      </ul>
      <p>
        We will verify ownership of the account before processing the
        deletion. We aim to acknowledge requests within 3 business days and
        complete deletion within 30 days.
      </p>

      <h2>3. What gets deleted</h2>
      <ul>
        <li>Your profile (name, avatar, bio, gender, country).</li>
        <li>
          Your moments, posts, and other content you uploaded that is tied to
          your account.
        </li>
        <li>Your wallet balance, transaction history references on your profile, and gift history visible to you.</li>
        <li>Your push-notification token and device registrations.</li>
        <li>
          Your sign-in identifiers (Google Sign-In linkage, Firebase Auth
          record).
        </li>
      </ul>

      <h2>4. What we keep, and why</h2>
      <p>
        Some data is retained after account deletion because we are legally
        required to keep it or because it is necessary to protect the
        platform. This includes:
      </p>
      <ul>
        <li>
          <strong>Financial records</strong> — recharge receipts and related
          transaction logs, retained for tax and audit purposes for up to 6
          years.
        </li>
        <li>
          <strong>Abuse and safety records</strong> — limited records about
          accounts terminated for severe policy violations (e.g. CSAE), kept
          to prevent re-registration and to cooperate with law enforcement.
        </li>
        <li>
          <strong>Aggregated, de-identified analytics</strong> — these cannot
          be linked back to you personally.
        </li>
        <li>
          <strong>Backups</strong> — your data may persist in encrypted
          backups for up to 90 days after deletion before they cycle out.
        </li>
      </ul>

      <h2>5. Things you cannot recover after deletion</h2>
      <ul>
        <li>
          Your remaining coin balance. Coins are non-refundable and
          non-transferable; spend them before you delete the account if you
          want to use them.
        </li>
        <li>
          Gifts you received and any virtual badges or achievements tied to
          your account.
        </li>
        <li>
          Followers, family memberships, and other social graph data tied to
          your account.
        </li>
      </ul>

      <h2>6. Cancelling subscriptions and recurring purchases</h2>
      <p>
        Deleting your {LEGAL_INFO.appName} account does <strong>not</strong>{' '}
        automatically cancel any store-side subscriptions you may have
        purchased. Manage subscriptions from your Google Play or Apple
        account before deleting.
      </p>

      <h2>7. Restoring an account</h2>
      <p>
        Account deletion is permanent. If you change your mind during the
        30-day processing window, contact{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>{' '}
        as soon as possible — recovery is not guaranteed. Once the deletion
        is complete, your account cannot be restored, and you would need to
        register a new account if you want to return.
      </p>
    </LegalShell>
  );
}
