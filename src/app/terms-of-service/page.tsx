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
      title={{ en: 'Terms of Service', zh: '服务条款' }}
      description={{
        en: `These Terms of Service (“Terms”) govern your use of ${LEGAL_INFO.appName} (the “Service”), operated by ${LEGAL_INFO.operator}. By creating an account or using the Service, you agree to these Terms.`,
        zh: `本服务条款(以下简称"本条款")适用于您对 ${LEGAL_INFO.appName}(以下简称"本服务")的使用,本服务由 ${LEGAL_INFO.operator} 运营。一旦您创建账号或使用本服务,即视为您同意本条款。`,
      }}
      enContent={<TermsEN />}
      zhContent={<TermsZH />}
    />
  );
}

function TermsEN() {
  return (
    <>
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
        These Terms are governed by the laws of the jurisdiction in which we
        operate, without regard to conflict-of-law principles. You agree to
        the exclusive jurisdiction of the competent courts in that
        jurisdiction, except where applicable consumer-protection law gives
        you the right to bring proceedings elsewhere.
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
    </>
  );
}

function TermsZH() {
  return (
    <>
      <h2>1. 资格要求</h2>
      <p>
        您必须年满 {LEGAL_INFO.minimumAge} 周岁方可使用本服务。
        使用 {LEGAL_INFO.appName} 即表示您确认符合此年龄要求,
        且您对本服务的使用未违反任何适用于您的法律。
      </p>

      <h2>2. 您的账号</h2>
      <ul>
        <li>
          您应对账号下发生的所有行为负责。请妥善保管您的登录凭据。
        </li>
        <li>您应提供真实准确的注册信息,并及时予以更新。</li>
        <li>每人仅限注册一个账号。禁止出售、转让或共享账号。</li>
      </ul>

      <h2>3. 使用规范</h2>
      <p>
        在使用 {LEGAL_INFO.appName} 期间,您同意<strong>不得</strong>:
      </p>
      <ul>
        <li>发布、直播或分享色情、裸露或任何形式涉及未成年人性化的内容。</li>
        <li>
          骚扰、威胁、人肉、冒充或伤害其他用户;实施仇恨言论、歧视或煽动暴力。
        </li>
        <li>推广、销售或协助交易非法商品、毒品、武器、赌博或欺诈活动。</li>
        <li>
          散布恶意软件、抓取本服务数据、试图绕过安全控制或干扰正常运行。
        </li>
        <li>
          使用机器人、自动化代理或任何自动化手段虚增数据、刷礼物或制造虚假互动。
        </li>
        <li>侵犯他人知识产权,包括上传您无权分享的内容。</li>
        <li>未经他人同意,索取或分享他人的个人信息。</li>
      </ul>
      <p>
        对于违反本条款或对社区造成风险的行为,
        我们有权移除内容、关闭直播间、限制功能或终止账号。
      </p>

      <h2>4. 用户生成内容</h2>
      <p>
        您保留所创建和上传内容的所有权(头像、动态、帖子、房间名称等)。
        您发布内容即授予 {LEGAL_INFO.operator} 一项非独占、全球性、
        免版税的许可,
        允许我们在本服务范围内托管、存储、复制、修改(出于压缩、缩略图等技术目的)、
        分发和展示该内容。该许可在您删除内容时终止,
        但出于法律或安全原因须保留的情形除外。
      </p>

      <h2>5. 金币、礼物与虚拟物品</h2>
      <ul>
        <li>
          {LEGAL_INFO.appName} 使用应用内虚拟货币
          (称为"金币"或"钻石"),
          可通过 Google Play 或 Apple App Store 购买。
        </li>
        <li>
          虚拟物品不具有货币价值,不可兑换为现金、
          不可在用户之间换取真实货币,
          也不可在本服务之外转移,我们明确提供的功能除外。
        </li>
        <li>我们可能随时调整虚拟物品的价格、稀有度或可用性。</li>
        <li>
          有关退款详情,请参阅<a href="/refund-policy">退款政策</a>。
        </li>
      </ul>

      <h2>6. 语音直播间</h2>
      <p>
        除非房主另行设置,直播间默认为公开。
        您在房间内的言行可能被其他参与者听到或看到,
        并可能被他们举报。房主负责对其房间进行管理;
        {LEGAL_INFO.operator} 也将在全平台层面执行本条款。
      </p>

      <h2>7. 暂停与终止</h2>
      <p>
        如果我们有合理理由认为您违反了本条款、滥用其他用户或对平台构成风险,
        我们可能临时或永久暂停或终止您的访问权限。
        您可以随时停止使用本服务并删除您的账号。
        详见<a href="/delete-account">删除账号</a>。
      </p>

      <h2>8. 免责声明</h2>
      <p>
        本服务按"现状"和"可获得"的状态提供。
        在法律允许的最大范围内,{LEGAL_INFO.operator}{' '}
        不作出任何明示、暗示或法定的保证,
        包括关于适销性、特定用途适用性和不侵权的保证。
        我们不保证本服务不会中断、无差错或绝对安全。
      </p>

      <h2>9. 责任限制</h2>
      <p>
        在法律允许的最大范围内,{LEGAL_INFO.operator}{' '}
        不对任何间接、附带、特殊、后果性或惩罚性损害负责,
        也不对利润、收入、数据或商誉的损失负责。
        对于与本服务相关的任何索赔,
        我们的累计责任以您在索赔事件发生前 12
        个月内向我们实际支付的金额或 50 美元(以较高者为准)为限。
      </p>

      <h2>10. 赔偿</h2>
      <p>
        您同意就以下事项造成的任何索赔、损害或费用,
        对 {LEGAL_INFO.operator} 及其管理人员、雇员和合作伙伴予以赔偿并使其免受损害:
        (a) 您对本服务的使用;
        (b) 您上传的内容;
        (c) 您违反本条款的行为。
      </p>

      <h2>11. 管辖法律</h2>
      <p>
        本条款受我们运营所在司法管辖区的法律管辖,不考虑法律冲突原则。
        您同意接受该司法管辖区主管法院的专属管辖,
        但适用的消费者保护法赋予您在其他法院提起诉讼的权利除外。
      </p>

      <h2>12. 条款更新</h2>
      <p>
        我们可能会更新本条款。
        我们会同步更新"最近更新"日期,并就重大变更在应用内进行通知。
        变更生效后您继续使用本服务即视为接受修订后的条款。
      </p>

      <h2>13. 联系我们</h2>
      <p>
        如对本条款有任何疑问,请发送邮件至{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        。
      </p>
    </>
  );
}
