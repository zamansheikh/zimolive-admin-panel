import type { Metadata } from 'next';

import { LegalShell } from '@/components/legal-shell';
import { LEGAL_INFO } from '@/lib/legal-info';

export const metadata: Metadata = {
  title: `About — ${LEGAL_INFO.appName}`,
  description: `About ${LEGAL_INFO.appName}: a live audio social app for voice rooms, gifts, and community.`,
};

export default function AboutPage() {
  return (
    <LegalShell
      title={{
        en: `About ${LEGAL_INFO.appName}`,
        zh: `关于 ${LEGAL_INFO.appName}`,
      }}
      description={{
        en: 'Live audio rooms, real conversations, and a community built around fun.',
        zh: '语音直播间、真实对话,以及为快乐而生的社区。',
      }}
      enContent={<AboutEN />}
      zhContent={<AboutZH />}
    />
  );
}

function AboutEN() {
  return (
    <>
      <h2>What is {LEGAL_INFO.appName}?</h2>
      <p>
        {LEGAL_INFO.appName} is a live audio social platform. Users start or
        join voice rooms to talk, play games, listen to music, and meet new
        people. Hosts can decorate their rooms, moderate conversations, and
        receive virtual gifts from listeners. It’s designed for casual,
        fast-moving social interaction — short rooms, lots of voices, no
        pressure.
      </p>

      <h2>Core features</h2>
      <ul>
        <li>
          <strong>Live audio rooms</strong> — multi-mic voice rooms powered by
          real-time streaming, with host controls, mic management, and chat.
        </li>
        <li>
          <strong>Gifts &amp; cosmetics</strong> — send animated gifts to
          hosts and friends, and customise your profile with frames and
          badges.
        </li>
        <li>
          <strong>Family system</strong> — create or join families to hang
          out with the same group of people across rooms.
        </li>
        <li>
          <strong>Moments</strong> — share short text and media posts with
          your followers.
        </li>
        <li>
          <strong>Wallet &amp; recharges</strong> — buy in-app coins through
          Google Play or the App Store to send gifts and unlock features.
        </li>
        <li>
          <strong>Push notifications</strong> — never miss a friend going
          live or a room you care about.
        </li>
      </ul>

      <h2>Who builds it</h2>
      <p>
        {LEGAL_INFO.appName} is built and operated by the {LEGAL_INFO.appName}{' '}
        team. We work on real-time infrastructure, mobile, backend, and
        community safety — with a focus on keeping the platform fast,
        reliable, and friendly.
      </p>

      <h2>Safety and trust</h2>
      <p>
        We take community safety seriously. Live rooms are moderated by hosts
        and platform-wide enforcement, and we have a strict zero-tolerance
        policy on content that exploits or endangers minors. See our{' '}
        <a href="/child-safety">Child Safety</a>,{' '}
        <a href="/terms-of-service">Terms of Service</a>, and{' '}
        <a href="/privacy-policy">Privacy Policy</a> pages for the details.
      </p>

      <h2>Get in touch</h2>
      <p>
        Press, partnerships, or general questions: visit our{' '}
        <a href="/contact">Contact</a> page or email{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        .
      </p>
    </>
  );
}

function AboutZH() {
  return (
    <>
      <h2>什么是 {LEGAL_INFO.appName}?</h2>
      <p>
        {LEGAL_INFO.appName} 是一款实时语音社交平台。用户可以创建或加入语音房间,
        与他人聊天、玩游戏、听音乐、结识新朋友。房主可以装饰房间、管理对话,
        并接收听众送出的虚拟礼物。我们为轻松随性的社交而设计 ——
        节奏明快、声音多样、毫无压力。
      </p>

      <h2>核心功能</h2>
      <ul>
        <li>
          <strong>语音直播间</strong> —— 基于实时音频流的多麦语音房间,
          支持房主管理、麦位控制和实时聊天。
        </li>
        <li>
          <strong>礼物与装扮</strong> —— 向主播和好友送出动画礼物,
          用专属边框和徽章装饰个人资料。
        </li>
        <li>
          <strong>家族系统</strong> —— 创建或加入家族,
          与固定圈子的朋友一起在不同房间畅聊。
        </li>
        <li>
          <strong>动态</strong> —— 向粉丝分享短文、图片与媒体动态。
        </li>
        <li>
          <strong>钱包与充值</strong> —— 通过 Google Play 或 App Store
          购买金币,用于送礼及解锁高级功能。
        </li>
        <li>
          <strong>推送通知</strong> —— 第一时间获知好友开播或你关注的房间动态。
        </li>
      </ul>

      <h2>由谁打造</h2>
      <p>
        {LEGAL_INFO.appName} 由 {LEGAL_INFO.appName} 团队自主研发与运营。
        我们专注于实时通讯架构、移动客户端、后台服务与社区安全 ——
        致力于打造稳定、流畅、友好的社交平台。
      </p>

      <h2>安全与信任</h2>
      <p>
        我们高度重视社区安全。直播间由房主与平台共同审核管理,
        对任何剥削或危害未成年人的内容采取零容忍政策。
        详情请参阅<a href="/child-safety">儿童安全</a>、
        <a href="/terms-of-service">服务条款</a>及
        <a href="/privacy-policy">隐私政策</a>页面。
      </p>

      <h2>联系我们</h2>
      <p>
        媒体合作、商务咨询或其他问题,
        请访问<a href="/contact">联系我们</a>页面,或直接发送邮件至{' '}
        <a href={`mailto:${LEGAL_INFO.supportEmail}`}>
          {LEGAL_INFO.supportEmail}
        </a>
        。
      </p>
    </>
  );
}
