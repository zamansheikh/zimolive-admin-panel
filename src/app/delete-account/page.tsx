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
      title={{ en: 'Delete Your Account', zh: '删除您的账号' }}
      description={{
        en: `You can permanently delete your ${LEGAL_INFO.appName} account and the personal information associated with it at any time. This page describes how, and what happens to your data.`,
        zh: `您可以随时永久删除 ${LEGAL_INFO.appName} 账号及与之相关的个人信息。本页面将说明操作步骤,以及您的数据将如何被处理。`,
      }}
      enContent={<DeleteAccountEN />}
      zhContent={<DeleteAccountZH />}
    />
  );
}

function DeleteAccountEN() {
  return (
    <>
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
        <a
          href={`mailto:${LEGAL_INFO.supportEmail}?subject=Delete%20My%20Account`}
        >
          {LEGAL_INFO.supportEmail}
        </a>{' '}
        from the email address on file. Use the subject line{' '}
        <em>“Delete my account”</em> and include:
      </p>
      <ul>
        <li>Your username or user ID inside the app.</li>
        <li>The phone number or email used at sign-up, if different.</li>
        <li>
          A short statement that you want your account permanently deleted.
        </li>
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
        <li>
          Your wallet balance, transaction history references on your profile,
          and gift history visible to you.
        </li>
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
    </>
  );
}

function DeleteAccountZH() {
  return (
    <>
      <h2>1. 应用内删除(推荐方式)</h2>
      <ol>
        <li>
          打开 {LEGAL_INFO.appName} 应用,并登录您希望删除的账号。
        </li>
        <li>
          进入 <strong>个人资料 → 设置 → 账号 → 删除账号</strong>。
        </li>
        <li>
          确认删除。系统将立即排入处理队列,
          您的账号也会同步退出登录。
        </li>
      </ol>

      <h2>2. 通过邮件删除</h2>
      <p>
        如果您无法访问应用或账号,
        请使用账号绑定的邮箱发送删除申请至{' '}
        <a
          href={`mailto:${LEGAL_INFO.supportEmail}?subject=Delete%20My%20Account`}
        >
          {LEGAL_INFO.supportEmail}
        </a>
        ,邮件主题请填写 <em>"Delete my account"</em>,并附上以下信息:
      </p>
      <ul>
        <li>您在应用内的用户名或用户 ID。</li>
        <li>
          注册时使用的手机号或邮箱(如与当前邮箱不同)。
        </li>
        <li>简要说明您希望永久删除该账号的意愿。</li>
      </ul>
      <p>
        我们将在处理删除前核实账号的归属。
        我们将在 3 个工作日内确认收到申请,
        并力争在 30 天内完成删除。
      </p>

      <h2>3. 将被删除的数据</h2>
      <ul>
        <li>您的个人资料(姓名、头像、简介、性别、国家/地区)。</li>
        <li>
          您上传的动态、帖子及与账号绑定的其他内容。
        </li>
        <li>
          您的钱包余额、个人资料中的交易记录索引,以及您可见的礼物记录。
        </li>
        <li>您的推送通知令牌与设备注册信息。</li>
        <li>
          您的登录身份标识(Google 登录绑定、Firebase Auth 记录)。
        </li>
      </ul>

      <h2>4. 我们会保留的数据及原因</h2>
      <p>
        在账号删除后,因法律要求或保护平台的必要原因,
        部分数据将被保留,包括:
      </p>
      <ul>
        <li>
          <strong>财务记录</strong> —— 充值收据及相关交易日志,
          因税务与审计需要最长保留 6 年。
        </li>
        <li>
          <strong>滥用与安全记录</strong> ——
          因严重违反政策(例如 CSAE)被终止账号的有限记录,
          用于防止重新注册及配合执法机关。
        </li>
        <li>
          <strong>聚合化、去标识化的分析数据</strong> ——
          这类数据已无法关联到您个人。
        </li>
        <li>
          <strong>备份数据</strong> ——
          删除后您的数据可能在加密备份中保留最多 90 天,
          直至下一轮备份轮替为止。
        </li>
      </ul>

      <h2>5. 删除后无法恢复的内容</h2>
      <ul>
        <li>
          您的剩余金币余额。金币不可退款也不可转让;
          如希望使用,请在删除账号前消费完毕。
        </li>
        <li>
          您所收到的礼物,以及与账号绑定的虚拟徽章或成就。
        </li>
        <li>
          关注者、家族成员关系等与账号绑定的社交关系数据。
        </li>
      </ul>

      <h2>6. 取消订阅及周期性购买</h2>
      <p>
        删除 {LEGAL_INFO.appName} 账号<strong>不会</strong>
        自动取消您在应用商店购买的订阅。
        请先在 Google Play 或 Apple 账号中管理并取消相关订阅,
        再删除账号。
      </p>

      <h2>7. 账号恢复</h2>
      <p>
        账号删除为永久操作。
        若您在 30 天处理窗口期内改变主意,请尽快联系{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        —— 但恢复不保证一定成功。
        删除完成后,账号将无法恢复;如希望回归,需要重新注册新账号。
      </p>
    </>
  );
}
