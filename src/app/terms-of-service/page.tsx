import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `Terms of Service — ${LEGAL_INFO.appName}`,
  description: `The terms governing your use of the ${LEGAL_INFO.appName} app and services.`,
};

export default function TermsOfServicePage() {
  return (
    <LegalShell
      title="Terms of Service"
      description={`These Terms of Service (“Terms”) govern your use of ${LEGAL_INFO.appName} (the “Service”), operated by ${LEGAL_INFO.operator}. By creating an account or using the Service, you agree to these Terms.`}
    >
      <h2>1. Eligibility</h2>
      <p>
        You must be at least {LEGAL_INFO.minimumAge} years old to use the
        Service. By using {LEGAL_INFO.appName}, you confirm that you meet this
        age requirement and that your use of the Service does not violate any
        law that applies to you.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>
          You are responsible for everything that happens under your account.
          Keep your sign-in credentials confidential.
        </li>
        <li>
          You agree to provide accurate registration information and to keep
          it up to date.
        </li>
        <li>
          One account per person. Selling, transferring, or sharing accounts is
          prohibited.
        </li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>
        While using {LEGAL_INFO.appName} you agree <strong>not</strong> to:
      </p>
      <ul>
        <li>
          Post, stream, or share content that is sexually explicit, contains
          nudity, or sexualises minors in any form.
        </li>
        <li>
          Harass, threaten, dox, impersonate, or harm other users; engage in
          hate speech, discrimination, or incitement to violence.
        </li>
        <li>
          Promote, sell, or facilitate the trade of illegal goods, drugs,
          weapons, gambling, or fraud.
        </li>
        <li>
          Distribute malware, scrape the Service, attempt to bypass security
          controls, or interfere with normal operation.
        </li>
        <li>
          Use bots, automated agents, or any automated means to inflate
          metrics, send gifts, or generate engagement.
        </li>
        <li>
          Infringe anyone’s intellectual-property rights, including by
          uploading content you do not have the right to share.
        </li>
        <li>
          Solicit or share personal information of others without their
          consent.
        </li>
      </ul>
      <p>
        We may remove content, suspend live rooms, restrict features, or
        terminate accounts that violate these Terms or that pose a risk to the
        community.
      </p>

      <h2>4. User-generated content</h2>
      <p>
        You retain ownership of content you create and upload (profile photos,
        moments, posts, room names, etc.). By posting content, you grant{' '}
        {LEGAL_INFO.operator} a non-exclusive, worldwide, royalty-free licence
        to host, store, reproduce, modify (for technical purposes such as
        compression and thumbnails), distribute, and display that content
        within the Service. This licence ends when you delete the content,
        except where we are required to retain it for legal or safety reasons.
      </p>

      <h2>5. Coins, gifts, and virtual items</h2>
      <ul>
        <li>
          {LEGAL_INFO.appName} uses an in-app virtual currency (“coins” or
          “diamonds”) that can be purchased through Google Play or the Apple
          App Store.
        </li>
        <li>
          Virtual items have no monetary value and cannot be redeemed for
          cash, exchanged with other users for real money, or transferred
          outside the Service except through features we expressly provide.
        </li>
        <li>
          We may adjust the price, rarity, or availability of virtual items at
          any time.
        </li>
        <li>
          See our <a href="/refund-policy">Refund Policy</a> for details on
          refunds.
        </li>
      </ul>

      <h2>6. Live audio rooms</h2>
      <p>
        Live rooms are public unless the host configures them otherwise.
        Anything you say or do in a room may be heard or seen by other
        participants and may be reported by them. Hosts are responsible for
        moderating their rooms; {LEGAL_INFO.operator} also enforces these
        Terms platform-wide.
      </p>

      <h2>7. Suspension and termination</h2>
      <p>
        We may suspend or terminate your access — temporarily or permanently —
        if we reasonably believe you have violated these Terms, abused other
        users, or created risk for the platform. You may stop using the
        Service and delete your account at any time. See{' '}
        <a href="/delete-account">Delete Account</a>.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        The Service is provided “as is” and “as available.” To the fullest
        extent permitted by law, {LEGAL_INFO.operator} disclaims all
        warranties, whether express, implied, or statutory, including
        warranties of merchantability, fitness for a particular purpose, and
        non-infringement. We do not guarantee that the Service will be
        uninterrupted, error-free, or secure.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {LEGAL_INFO.operator} will not
        be liable for indirect, incidental, special, consequential, or
        punitive damages, or for loss of profits, revenue, data, or goodwill.
        Our aggregate liability for any claim relating to the Service is
        limited to the amount you paid us in the 12 months before the event
        giving rise to the claim, or USD 50 — whichever is greater.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless {LEGAL_INFO.operator} and its
        officers, employees, and partners from any claim, damage, or expense
        arising out of (a) your use of the Service, (b) content you upload,
        or (c) your breach of these Terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of {LEGAL_INFO.jurisdiction},
        without regard to conflict-of-law principles. You agree to the
        exclusive jurisdiction of the competent courts located in{' '}
        {LEGAL_INFO.address}, except where applicable consumer-protection law
        gives you the right to bring proceedings elsewhere.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms. We will revise the “Last updated” date and,
        for material changes, give you notice in the app. Continued use of
        the Service after changes take effect means you accept the revised
        Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms? Email{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        .
      </p>
    </LegalShell>
  );
}
