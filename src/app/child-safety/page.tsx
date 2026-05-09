import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `Child Safety Standards — ${LEGAL_INFO.appName}`,
  description: `${LEGAL_INFO.appName}'s zero-tolerance policy on child sexual abuse and exploitation, and how we keep minors off the platform.`,
};

export default function ChildSafetyPage() {
  return (
    <LegalShell
      title="Child Safety Standards"
      description={`${LEGAL_INFO.appName} has zero tolerance for child sexual abuse and exploitation (CSAE). This page describes our standards and the steps we take to enforce them — required by Google Play's Child Safety Standards Policy.`}
    >
      <h2>1. Our commitment</h2>
      <p>
        {LEGAL_INFO.operator} prohibits child sexual abuse material (CSAM) and
        any content that sexualises, endangers, or exploits minors anywhere on{' '}
        {LEGAL_INFO.appName}. We work to keep minors off the platform and to
        respond quickly when prohibited content or behaviour is reported.
      </p>

      <h2>2. Minimum age</h2>
      <p>
        {LEGAL_INFO.appName} is not intended for children. Users must be at
        least <strong>{LEGAL_INFO.minimumAge} years old</strong> to register
        an account or use any feature of the Service. We do not knowingly
        collect personal information from anyone under this age. If we learn
        that a user is below the minimum age, we will disable the account and
        delete associated data.
      </p>

      <h2>3. Prohibited content and behaviour</h2>
      <p>The following are strictly prohibited on {LEGAL_INFO.appName}:</p>
      <ul>
        <li>
          Child sexual abuse material (CSAM) of any kind, including
          AI-generated, drawn, animated, or synthetic depictions.
        </li>
        <li>
          Sexualised content involving minors, including suggestive posing,
          attire, language, or commentary.
        </li>
        <li>
          Grooming — adults building relationships with minors for sexual or
          exploitative purposes.
        </li>
        <li>
          Sextortion, solicitation of sexual content from minors, and any
          off-platform exploitation coordinated through the Service.
        </li>
        <li>
          Trafficking, abduction, or endangerment of minors in any form.
        </li>
        <li>
          Promotion, normalisation, or instruction of any of the above.
        </li>
      </ul>

      <h2>4. How we enforce</h2>
      <ul>
        <li>
          <strong>Detection.</strong> We combine automated abuse detection,
          provider-side safety tooling (Firebase, Google), and human review of
          reports to identify prohibited content.
        </li>
        <li>
          <strong>Removal.</strong> Content found to violate this policy is
          removed promptly. Accounts involved are suspended or terminated.
        </li>
        <li>
          <strong>Reporting to authorities.</strong> Confirmed CSAM is
          reported to the National Center for Missing &amp; Exploited Children
          (NCMEC) or the equivalent authority in our operating jurisdiction,
          as required by law.
        </li>
        <li>
          <strong>Preservation.</strong> We preserve relevant data so it can
          be provided to law enforcement under valid legal process.
        </li>
        <li>
          <strong>Escalation path.</strong> CSAE reports are routed to a
          designated child-safety contact for prioritised review.
        </li>
      </ul>

      <h2>5. How to report</h2>
      <p>
        If you encounter content or behaviour on {LEGAL_INFO.appName} that
        endangers or exploits a minor:
      </p>
      <ol>
        <li>
          Use the in-app report function on the room, profile, or message.
        </li>
        <li>
          Email our designated child-safety contact at{' '}
          <a href={`mailto:${LEGAL_INFO.supportEmail}?subject=Child%20Safety%20Report`}>
            {LEGAL_INFO.supportEmail}
          </a>{' '}
          with the subject line <em>“Child Safety Report.”</em>
        </li>
        <li>
          If a child is in immediate danger, contact your local emergency
          services first.
        </li>
      </ol>
      <p>
        We aim to acknowledge child-safety reports within 24 hours and to
        investigate them promptly.
      </p>

      <h2>6. Designated child-safety contact</h2>
      <p>
        Child-safety inquiries from regulators, NGOs, or law-enforcement
        agencies can be directed to:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
            {LEGAL_INFO.supportEmail}
          </a>
        </li>
        <li>
          <strong>Postal address:</strong> {LEGAL_INFO.operator},{' '}
          {LEGAL_INFO.address}
        </li>
      </ul>

      <h2>7. For parents and guardians</h2>
      <p>
        If you believe your child is using {LEGAL_INFO.appName} below the
        minimum age, or if you would like to request the removal of an
        account, email us at{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>{' '}
        and include the username or registered email of the account.
      </p>

      <h2>8. External resources</h2>
      <ul>
        <li>
          National Center for Missing &amp; Exploited Children (USA):
          missingkids.org
        </li>
        <li>INHOPE (international hotline network): inhope.org</li>
        <li>Internet Watch Foundation: iwf.org.uk</li>
      </ul>
    </LegalShell>
  );
}
