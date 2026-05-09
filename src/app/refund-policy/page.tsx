import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `Refund Policy — ${LEGAL_INFO.appName}`,
  description: `How refunds work for in-app coin recharges in ${LEGAL_INFO.appName}.`,
};

export default function RefundPolicyPage() {
  return (
    <LegalShell
      title="Refund Policy"
      description={`This Refund Policy applies to in-app coin recharges purchased through Google Play or the Apple App Store inside ${LEGAL_INFO.appName}.`}
    >
      <h2>1. What you are buying</h2>
      <p>
        {LEGAL_INFO.appName} sells an in-app virtual currency (“coins” or
        “diamonds”) that you can spend inside the app on gifts, room features,
        and other consumable items. Coins are a digital, consumable virtual
        good. They have no monetary value outside the app and cannot be
        redeemed for cash.
      </p>

      <h2>2. Refunds are handled by the store</h2>
      <p>
        All payments for coin recharges are processed by{' '}
        <strong>Google Play</strong> (Android) or the{' '}
        <strong>Apple App Store</strong> (iOS). {LEGAL_INFO.operator} does
        <em> not</em> charge your card and does not have the technical ability
        to issue a refund directly to your bank or wallet. Refund requests
        must be filed with the store from which you made the purchase.
      </p>

      <h3>How to request a refund on Google Play</h3>
      <ol>
        <li>
          Open <em>play.google.com</em> in a browser and sign in with the
          Google account used for the purchase.
        </li>
        <li>Find the order in your purchase history.</li>
        <li>
          Choose <em>“Request a refund”</em> or <em>“Report a problem”</em>{' '}
          and follow the prompts.
        </li>
      </ol>

      <h3>How to request a refund on the Apple App Store</h3>
      <ol>
        <li>
          Visit <em>reportaproblem.apple.com</em> and sign in with your Apple
          ID.
        </li>
        <li>
          Find the {LEGAL_INFO.appName} purchase, choose a reason, and submit.
        </li>
      </ol>

      <h2>3. When refunds are usually granted</h2>
      <p>
        Each store decides refunds at its own discretion. Refunds are most
        commonly granted when:
      </p>
      <ul>
        <li>
          Coins were purchased but never credited to your in-app wallet
          because of a technical fault.
        </li>
        <li>
          A purchase was made by accident or by an unauthorised person on
          your device.
        </li>
        <li>The request is made within the store’s standard refund window.</li>
      </ul>

      <h2>4. When refunds are usually denied</h2>
      <p>Refund requests are typically declined when:</p>
      <ul>
        <li>
          The coins have already been spent — for example, sent as gifts in
          live rooms — at the time the refund is requested. Coins are
          consumable; once consumed, they cannot be returned.
        </li>
        <li>
          The store’s standard refund window has passed.
        </li>
        <li>
          The account shows a pattern of refund-then-spend abuse.
        </li>
      </ul>

      <h2>5. Account actions on refund</h2>
      <p>
        If a store refunds a recharge, we will reverse the corresponding coin
        balance and any benefits derived from those coins. If the refunded
        coins have already been spent or withdrawn from your wallet, the
        resulting negative balance may suspend recharges and other paid
        features until the balance is brought back to zero. Repeated refund
        abuse may result in account termination under our{' '}
        <a href="/terms-of-service">Terms of Service</a>.
      </p>

      <h2>6. Help from us</h2>
      <p>
        We cannot issue refunds directly, but we can help you investigate
        problems — for example, missing coins after a successful charge. Email{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>{' '}
        and include:
      </p>
      <ul>
        <li>The username or registered email of your account.</li>
        <li>
          The order ID or receipt from Google Play or the App Store (a
          screenshot is fine).
        </li>
        <li>The date and amount of the purchase.</li>
        <li>A short description of the problem.</li>
      </ul>

      <h2>7. Statutory rights</h2>
      <p>
        Nothing in this policy limits any non-waivable consumer-protection
        rights you have under the law of your country of residence.
      </p>
    </LegalShell>
  );
}
