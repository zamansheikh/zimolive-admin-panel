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
      title={{ en: 'Refund Policy', zh: '退款政策' }}
      description={{
        en: `This Refund Policy applies to in-app coin recharges purchased through Google Play or the Apple App Store inside ${LEGAL_INFO.appName}.`,
        zh: `本退款政策适用于在 ${LEGAL_INFO.appName} 内通过 Google Play 或 Apple App Store 购买的金币充值。`,
      }}
      enContent={<RefundEN />}
      zhContent={<RefundZH />}
    />
  );
}

function RefundEN() {
  return (
    <>
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
        <li>The store’s standard refund window has passed.</li>
        <li>The account shows a pattern of refund-then-spend abuse.</li>
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
    </>
  );
}

function RefundZH() {
  return (
    <>
      <h2>1. 您购买的是什么</h2>
      <p>
        {LEGAL_INFO.appName} 出售一种应用内虚拟货币
        (称为"金币"或"钻石"),
        您可在应用内将其用于送礼、房间功能或其他可消耗的虚拟物品。
        金币属于数字化、可消耗的虚拟商品,
        在应用外不具有货币价值,亦不可兑换为现金。
      </p>

      <h2>2. 退款由应用商店处理</h2>
      <p>
        所有金币充值的款项均由 <strong>Google Play</strong>(Android)或{' '}
        <strong>Apple App Store</strong>(iOS)处理。{LEGAL_INFO.operator}
        <em>不会</em>直接向您的银行卡扣款,
        在技术上也无法直接向您的银行或电子钱包发起退款。
        退款申请须向您下单所在的应用商店提出。
      </p>

      <h3>如何通过 Google Play 申请退款</h3>
      <ol>
        <li>
          在浏览器中打开 <em>play.google.com</em>,
          使用购买时的 Google 账号登录。
        </li>
        <li>在购买记录中找到相应订单。</li>
        <li>
          选择 <em>"申请退款"</em>或 <em>"反馈问题"</em>,
          并按页面指引操作。
        </li>
      </ol>

      <h3>如何通过 Apple App Store 申请退款</h3>
      <ol>
        <li>
          访问 <em>reportaproblem.apple.com</em>,使用 Apple ID 登录。
        </li>
        <li>
          找到 {LEGAL_INFO.appName} 相关订单,选择原因并提交申请。
        </li>
      </ol>

      <h2>3. 通常会获批退款的情形</h2>
      <p>退款由各应用商店自行裁定。通常下列情形较易获批:</p>
      <ul>
        <li>因技术故障导致金币已购买但未到账。</li>
        <li>购买系误操作或他人未经授权在您的设备上完成。</li>
        <li>申请在应用商店标准退款窗口期内提出。</li>
      </ul>

      <h2>4. 通常被拒绝退款的情形</h2>
      <p>下列情形通常会被拒绝退款:</p>
      <ul>
        <li>
          申请退款时金币已被使用(例如在直播间送礼)。
          金币属于消耗品,一经消费即无法返还。
        </li>
        <li>已超出应用商店的标准退款窗口期。</li>
        <li>账号存在反复"退款后再消费"的滥用情形。</li>
      </ul>

      <h2>5. 退款后的账号处理</h2>
      <p>
        若应用商店为您退还充值款项,我们将同步扣减对应的金币余额,
        以及由这些金币所衍生的任何权益。
        若已退款的金币已被消费或从钱包中划出,
        由此产生的负余额可能导致充值及其他付费功能被暂停,
        直至余额恢复至零。
        反复滥用退款可能根据
        <a href="/terms-of-service">服务条款</a>导致账号被终止。
      </p>

      <h2>6. 我们能提供的协助</h2>
      <p>
        我们无法直接发起退款,但可以协助您排查问题 ——
        例如成功扣款后金币未到账的情况。请发送邮件至{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        ,并附上:
      </p>
      <ul>
        <li>您的用户名或账号注册邮箱。</li>
        <li>
          来自 Google Play 或 App Store 的订单号或收据(截图亦可)。
        </li>
        <li>购买日期与金额。</li>
        <li>问题的简要描述。</li>
      </ul>

      <h2>7. 法定权利</h2>
      <p>
        本政策的任何内容均不限制您依据所在国家/地区法律
        所享有的不可放弃的消费者保护权利。
      </p>
    </>
  );
}
