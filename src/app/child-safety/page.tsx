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
      title={{ en: 'Child Safety Standards', zh: '儿童安全标准' }}
      description={{
        en: `${LEGAL_INFO.appName} has zero tolerance for child sexual abuse and exploitation (CSAE). This page describes our standards and the steps we take to enforce them — required by Google Play's Child Safety Standards Policy.`,
        zh: `${LEGAL_INFO.appName} 对儿童性虐待和性剥削 (CSAE) 采取零容忍政策。本页面说明我们的标准以及为执行这些标准所采取的措施 —— 此为 Google Play 儿童安全标准政策的要求。`,
      }}
      enContent={<ChildSafetyEN />}
      zhContent={<ChildSafetyZH />}
    />
  );
}

function ChildSafetyEN() {
  return (
    <>
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
          <a
            href={`mailto:${LEGAL_INFO.supportEmail}?subject=Child%20Safety%20Report`}
          >
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
    </>
  );
}

function ChildSafetyZH() {
  return (
    <>
      <h2>1. 我们的承诺</h2>
      <p>
        {LEGAL_INFO.operator} 在 {LEGAL_INFO.appName}{' '}
        平台上禁止任何儿童性虐待材料 (CSAM)
        以及任何将未成年人性化、置于危险或加以剥削的内容。
        我们致力于阻止未成年人使用本平台,
        并对违规内容或行为的举报予以迅速响应。
      </p>

      <h2>2. 最低年龄</h2>
      <p>
        {LEGAL_INFO.appName} 并非面向儿童的产品。
        用户必须年满<strong> {LEGAL_INFO.minimumAge} 周岁</strong>
        方可注册账号或使用本服务的任何功能。
        我们不会刻意收集未达最低年龄者的个人信息。
        一经发现用户低于最低年龄,我们将停用该账号并删除相关数据。
      </p>

      <h2>3. 禁止的内容与行为</h2>
      <p>在 {LEGAL_INFO.appName} 上,以下行为被严格禁止:</p>
      <ul>
        <li>
          任何形式的儿童性虐待材料 (CSAM),
          包括 AI 生成、绘制、动画或合成形式的内容。
        </li>
        <li>
          涉及未成年人的性化内容,
          包括暗示性姿势、着装、言语或评论。
        </li>
        <li>
          诱骗 (Grooming) —— 成年人出于性目的或剥削目的与未成年人建立联系。
        </li>
        <li>
          性勒索、向未成年人索取色情内容,
          以及通过本服务协调实施的任何线下剥削行为。
        </li>
        <li>任何形式的人口贩运、拐骗或危害未成年人的行为。</li>
        <li>对上述任何行为的推广、正常化或教唆。</li>
      </ul>

      <h2>4. 如何执行</h2>
      <ul>
        <li>
          <strong>检测。</strong>
          我们结合自动化滥用检测、第三方安全工具
          (Firebase、Google) 以及对举报内容的人工审核,
          以识别违规内容。
        </li>
        <li>
          <strong>移除。</strong>
          一经确认违反本政策的内容将被立即移除,
          涉及账号将被暂停或永久终止。
        </li>
        <li>
          <strong>向有关部门举报。</strong>
          经核实的 CSAM 内容将根据法律要求,
          上报至美国国家失踪及受剥削儿童中心 (NCMEC)
          或我们运营所在司法辖区的对应机构。
        </li>
        <li>
          <strong>数据留存。</strong>
          我们将留存相关数据,以便依据合法程序向执法机构提供。
        </li>
        <li>
          <strong>升级机制。</strong>
          所有 CSAE 举报将转交指定的儿童安全联络人优先处理。
        </li>
      </ul>

      <h2>5. 如何举报</h2>
      <p>
        如果您在 {LEGAL_INFO.appName} 上发现危害或剥削未成年人的内容或行为:
      </p>
      <ol>
        <li>使用房间、个人资料或消息上的应用内举报功能。</li>
        <li>
          发送邮件至我们指定的儿童安全联络邮箱{' '}
          <a
            href={`mailto:${LEGAL_INFO.supportEmail}?subject=Child%20Safety%20Report`}
          >
            {LEGAL_INFO.supportEmail}
          </a>
          ,主题请填写 <em>"Child Safety Report"</em>。
        </li>
        <li>
          如儿童正面临紧急危险,请优先联系当地紧急救助部门。
        </li>
      </ol>
      <p>
        我们将在 24 小时内确认收到儿童安全举报,并尽快展开调查。
      </p>

      <h2>6. 指定儿童安全联络方式</h2>
      <p>监管机构、非政府组织或执法机关的儿童安全相关咨询,请联系:</p>
      <ul>
        <li>
          <strong>邮箱:</strong>{' '}
          <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
            {LEGAL_INFO.supportEmail}
          </a>
        </li>
      </ul>

      <h2>7. 致家长与监护人</h2>
      <p>
        如果您认为您的孩子未达最低年龄却在使用 {LEGAL_INFO.appName},
        或希望申请删除某个账号,请发送邮件至{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        ,并附上该账号的用户名或注册邮箱。
      </p>

      <h2>8. 外部资源</h2>
      <ul>
        <li>
          美国国家失踪及受剥削儿童中心 (NCMEC):missingkids.org
        </li>
        <li>INHOPE(国际热线联盟):inhope.org</li>
        <li>互联网观察基金会:iwf.org.uk</li>
      </ul>
    </>
  );
}
