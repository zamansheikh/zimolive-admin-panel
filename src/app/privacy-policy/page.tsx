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
      title={{ en: 'Privacy Policy', zh: '隐私政策' }}
      description={{
        en: `This Privacy Policy explains how ${LEGAL_INFO.operator} (“we,” “us”) handles information collected through the ${LEGAL_INFO.appName} mobile application and related services (the “Service”).`,
        zh: `本隐私政策说明 ${LEGAL_INFO.operator}(以下简称“我们”)如何处理通过 ${LEGAL_INFO.appName} 移动应用及相关服务(以下简称“本服务”)收集的信息。`,
      }}
      enContent={<PrivacyEN />}
      zhContent={<PrivacyZH />}
    />
  );
}

function PrivacyEN() {
  return (
    <>
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
        live in, including the regions where our cloud providers operate. We
        rely on standard contractual safeguards for cross-border transfers.
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
        .
      </p>
    </>
  );
}

function PrivacyZH() {
  return (
    <>
      <h2>1. 我们收集的信息</h2>
      <p>我们仅收集运营本服务所必需的最少信息,具体包括:</p>
      <ul>
        <li>
          <strong>账号信息</strong> —— 您创建账号时提供的姓名、邮箱地址、
          头像、性别、国家/地区,以及由 Google 登录或 Firebase Authentication
          提供的身份验证标识。
        </li>
        <li>
          <strong>个人资料内容</strong> —— 您在应用中发布的简介、头像,
          以及任何动态、帖子或媒体内容。
        </li>
        <li>
          <strong>直播间活动</strong> —— 您加入或主持的房间、收发的礼物,
          以及在聊天中发送的消息。语音流通过 Agora 实时音频架构传输,
          我们默认不会进行录制。
        </li>
        <li>
          <strong>钱包与交易数据</strong> —— 您在应用内的金币余额、
          充值记录与礼物记录。所有付款由 Google Play 或 Apple App Store
          处理,我们不会接收或存储您的银行卡或银行账户信息。
        </li>
        <li>
          <strong>设备与诊断数据</strong> —— 设备型号、操作系统版本、
          应用版本、语言、时区、IP 地址、崩溃日志与汇总使用指标。
        </li>
        <li>
          <strong>推送令牌</strong> —— 用于发送通知的 Firebase Cloud
          Messaging 注册令牌。
        </li>
      </ul>

      <h2>2. 信息使用方式</h2>
      <ul>
        <li>用于创建和验证您的账号。</li>
        <li>用于运营语音直播间、聊天、礼物及其他社交功能。</li>
        <li>用于处理应用内金币充值,并将所购金币计入您的钱包。</li>
        <li>
          用于发送交易类与互动类推送通知。
          您可以在应用设置或设备系统中关闭通知。
        </li>
        <li>用于侦测和应对滥用、欺诈、安全事件以及违反服务条款的行为。</li>
        <li>用于履行法律义务。</li>
      </ul>

      <h2>3. 信息共享</h2>
      <p>
        我们不会出售您的个人信息。
        仅在为运营本服务所必需的情况下与下列服务提供商共享数据:
      </p>
      <ul>
        <li>
          <strong>Google / Firebase</strong> —— 身份验证、推送通知、崩溃报告。
        </li>
        <li>
          <strong>Agora</strong> —— 直播间所需的实时音频架构。
        </li>
        <li>
          <strong>Cloudinary</strong> —— 媒体文件存储与图片分发。
        </li>
        <li>
          <strong>应用商店</strong> —— Google Play 与 Apple App Store
          负责支付处理与退款。
        </li>
      </ul>
      <p>
        上述服务提供商根据合同约定,仅能将您的信息用于向我们提供相应服务。
        在法律要求或为保护用户权益与安全的必要情况下,我们也可能披露信息。
      </p>

      <h2>4. 数据保留</h2>
      <p>
        在您的账号处于活跃状态期间,我们将保留账号数据。
        当您删除账号后,我们将在 30 天内删除您的个人资料数据;
        但出于防欺诈、税务或法律合规要求需要保留的备份和有限记录除外
        (财务记录通常最长保留 6 年)。
      </p>

      <h2>5. 您的选择与权利</h2>
      <ul>
        <li>您可以随时在应用内编辑个人资料和内容。</li>
        <li>您可以通过设备系统设置关闭推送通知。</li>
        <li>
          您可以随时申请删除账号 —— 详见
          <a href="/delete-account">删除账号</a>页面。
        </li>
        <li>
          根据您所在地区的法律,您可能享有其他权利,
          例如访问权、更正权、可携权与反对权。
          如需行使,请发送邮件至{' '}
          <a href={`mailto:${LEGAL_INFO.privacyEmail}`}>
            {LEGAL_INFO.privacyEmail}
          </a>
          。
        </li>
      </ul>

      <h2>6. 安全</h2>
      <p>
        我们使用 TLS 加密传输数据,
        对敏感凭据进行服务器端哈希处理,并对管理系统实施访问控制。
        没有任何系统能做到百分之百安全;
        您也有责任妥善保管您的账号凭据。
      </p>

      <h2>7. 未成年人保护</h2>
      <p>
        {LEGAL_INFO.appName} 并非面向儿童的产品。使用本服务必须年满{' '}
        {LEGAL_INFO.minimumAge} 周岁。
        更多信息请参阅<a href="/child-safety">儿童安全</a>页面。
      </p>

      <h2>8. 跨境数据传输</h2>
      <p>
        您的信息可能会在您所在国家/地区以外的地方进行处理,
        包括我们的云服务提供商所在的区域。
        我们依据标准合同条款等通行机制保障跨境数据传输的合规与安全。
      </p>

      <h2>9. 政策更新</h2>
      <p>
        我们可能会更新本隐私政策。
        我们会同步更新"最近更新"日期,并就重大变更在应用内进行通知。
        变更生效后您继续使用本服务即视为接受修订后的政策。
      </p>

      <h2>10. 联系我们</h2>
      <p>
        如有疑问或需提交隐私请求,请发送邮件至{' '}
        <a href={`mailto:${LEGAL_INFO.privacyEmail}`}>
          {LEGAL_INFO.privacyEmail}
        </a>
        。
      </p>
    </>
  );
}
