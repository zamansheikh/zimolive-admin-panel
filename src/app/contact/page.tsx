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
      title={{ en: 'Contact', zh: '联系我们' }}
      description={{
        en: `Reach the ${LEGAL_INFO.appName} team. We aim to respond to most messages within a few business days.`,
        zh: `联系 ${LEGAL_INFO.appName} 团队。我们通常会在数个工作日内回复您的来信。`,
      }}
      enContent={<ContactEN />}
      zhContent={<ContactZH />}
    />
  );
}

function ContactEN() {
  return (
    <>
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
        question about our <a href="/privacy-policy">Privacy Policy</a>:
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
    </>
  );
}

function ContactZH() {
  return (
    <>
      <h2>常规支持</h2>
      <p>
        漏洞反馈、账号问题、金币未到账、充值问题或其他使用相关的咨询:
      </p>
      <ul>
        <li>
          邮箱:{' '}
          <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
            {LEGAL_INFO.supportEmail}
          </a>
        </li>
      </ul>
      <p>
        发送账号相关邮件时,请附上您的用户名以及注册时使用的邮箱或手机号 ——
        这有助于我们更快地为您处理。
      </p>

      <h2>隐私与数据请求</h2>
      <p>
        如需访问、更正、导出或删除您的数据,或对我们的
        <a href="/privacy-policy">隐私政策</a>有疑问:
      </p>
      <ul>
        <li>
          邮箱:{' '}
          <a
            href={`mailto:${LEGAL_INFO.privacyEmail}?subject=Privacy%20Request`}
          >
            {LEGAL_INFO.privacyEmail}
          </a>
          ,主题请填写 <em>"Privacy Request"</em>。
        </li>
      </ul>

      <h2>删除账号</h2>
      <p>
        请参阅<a href="/delete-account">删除账号</a>专页,
        了解应用内删除及邮件删除的详细步骤。
      </p>

      <h2>儿童安全举报</h2>
      <p>
        如需举报危害未成年人的内容或行为,请参阅
        <a href="/child-safety">儿童安全标准</a>页面。
        紧急举报请发送邮件至{' '}
        <a
          href={`mailto:${LEGAL_INFO.supportEmail}?subject=Child%20Safety%20Report`}
        >
          {LEGAL_INFO.supportEmail}
        </a>
        ,主题请填写 <em>"Child Safety Report"</em>。
      </p>

      <h2>媒体与合作</h2>
      <p>
        媒体采访、商务合作或业务开发咨询,请发送邮件至{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}?subject=Partnership`}>
          {LEGAL_INFO.supportEmail}
        </a>
        。
      </p>
    </>
  );
}
