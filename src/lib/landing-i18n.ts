'use client';

import { useEffect, useState } from 'react';

/**
 * Locale toggle for the public-facing surfaces of the admin app —
 * the marketing landing (`/`) and the staff login (`/login`).
 *
 * The legal pages (Privacy, Terms, Child Safety, etc.) stay English-
 * only because their content references the actual legal operator
 * and has to match what's filed in Play Console's Data Safety form.
 * The link *labels* in the footer are translated though, so a
 * Chinese visitor isn't staring at English nav.
 *
 * Persisted in localStorage so a returning visitor sees the same
 * language they picked last time. Default is English so first-time
 * visitors see the listing in the language Google indexes.
 */
export type Locale = 'en' | 'zh';

export const LANDING_LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

const STORAGE_KEY = 'zimolive.locale';

export interface LocalizedLink {
  href: string;
  label: string;
}

export interface LandingStrings {
  // Header
  navFeatures: string;
  navDownload: string;
  // Hero
  heroEyebrow: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSubtitle: string;
  heroFootnote: string;
  iosComingSoon: string;
  // Features section
  featuresHeading: string;
  featuresSubhead: string;
  feature1Title: string;
  feature1Body: string;
  feature2Title: string;
  feature2Body: string;
  feature3Title: string;
  feature3Body: string;
  feature4Title: string;
  feature4Body: string;
  feature5Title: string;
  feature5Body: string;
  feature6Title: string;
  feature6Body: string;
  // Bottom CTA
  ctaHeading: string;
  ctaBody: string;
  // Footer
  footerTagline: string;
  footerLegal: string;
  footerCompany: string;
  footerStaffSignedOut: string;
  footerStaffSignedIn: string;
  footerCopyright: (year: number) => string;
  footerMadeIn: string;
  // Footer link labels — hrefs stay canonical (legal-info.ts), labels
  // are translated. Keeping them inside the dictionary lets the
  // landing page render a single source of truth per locale.
  legalLinks: LocalizedLink[];
  companyLinks: LocalizedLink[];
  // Login page
  loginTitle: string;
  loginSubtitle: string;
  loginEmailLabel: string;
  loginPasswordLabel: string;
  loginSubmit: string;
  loginSubmitting: string;
  loginBackToHome: string;
  loginDefaultCreds: string;
  loginGenericError: string;
  // Legal shell chrome (used on every /privacy-policy, /terms-of-service,
  // etc. page so the header + footer match the active locale).
  legalBackHome: string;
  legalLastUpdated: string;
}

const EN: LandingStrings = {
  navFeatures: 'Features',
  navDownload: 'Download',

  heroEyebrow: 'Now on Google Play',
  heroTitleA: 'Live the party.',
  heroTitleB: 'Anywhere.',
  heroSubtitle:
    'Zimo Live is a live audio social app — voice rooms, gifts, families, and real-time chat. Join hosts from your country or jump into a room halfway across the world.',
  heroFootnote: 'Free to download · 18+ · No ads',
  iosComingSoon: 'iOS coming soon',

  featuresHeading: 'What you can do',
  featuresSubhead:
    'Designed for fast triage on the phone and quick moves between rooms. Everything below is in the app today.',

  feature1Title: 'Live audio rooms',
  feature1Body:
    'Drop into a voice room, take a seat, and talk in real time with hosts and friends. No video pressure — just voice.',

  feature2Title: 'Send and receive gifts',
  feature2Body:
    'Animated gifts that pop on screen, frames that follow you around, and a wall that shows off what you have received.',

  feature3Title: 'Families and SVIP',
  feature3Body:
    'Join a family, climb the SVIP ladder, and unlock cosmetic perks: room themes, vehicles, mic effects, badges.',

  feature4Title: 'Direct chat',
  feature4Body:
    'One-tap private threads with anyone you meet in a room. Real-time, with full media support.',

  feature5Title: 'Safe and moderated',
  feature5Body:
    'Block and report anyone in a tap. Built-in word filter on every room chat. 18+ age gate enforced.',

  feature6Title: 'Made for everyone',
  feature6Body:
    'Chinese, English, and Bengali in the app today; more languages coming. Optimised for mid-range Android phones.',

  ctaHeading: 'Ready to drop in?',
  ctaBody: 'Free on Google Play. Sign-up takes a single Google tap.',

  footerTagline:
    'Live audio rooms, gifts, and community — built for fast, fun social interaction.',
  footerLegal: 'Legal',
  footerCompany: 'Company',
  footerStaffSignedOut: 'Staff sign in',
  footerStaffSignedIn: 'Open console',
  footerCopyright: (year) => `© ${year} Zimo Live. All rights reserved.`,
  footerMadeIn: 'Engineered in China · Available worldwide',

  legalLinks: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/child-safety', label: 'Child Safety' },
    { href: '/refund-policy', label: 'Refund Policy' },
    { href: '/delete-account', label: 'Delete Account' },
  ],
  companyLinks: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],

  loginTitle: 'Zimo Live Admin',
  loginSubtitle: 'Sign in to the admin console',
  loginEmailLabel: 'Email or Username',
  loginPasswordLabel: 'Password',
  loginSubmit: 'Sign in',
  loginSubmitting: 'Signing in…',
  loginBackToHome: '← Back to home',
  loginDefaultCreds: 'Default creds seeded from backend .env',
  loginGenericError:
    'Unable to reach the server. Check your connection or contact an administrator.',

  legalBackHome: '← Back home',
  legalLastUpdated: 'Last updated',
};

const ZH: LandingStrings = {
  navFeatures: '功能',
  navDownload: '下载',

  heroEyebrow: '现已上架 Google Play',
  heroTitleA: '随时随地',
  heroTitleB: '畅享派对',
  heroSubtitle:
    'Zimo Live 是一款实时语音社交应用 —— 语音房间、礼物、家族与实时聊天。加入身边的主播,或瞬间畅游世界另一端的直播间。',
  heroFootnote: '免费下载 · 18 岁以上 · 无广告',
  iosComingSoon: 'iOS 版本即将推出',

  featuresHeading: '应用功能',
  featuresSubhead:
    '专为手机端打造,房间之间一秒切换。下方所有功能均已在应用中上线。',

  feature1Title: '语音直播间',
  feature1Body:
    '加入语音房间,登台与主播和朋友实时交流。无需露脸 —— 只用声音相会。',

  feature2Title: '送礼与收礼',
  feature2Body:
    '炫彩绽放的动画礼物、伴随你的专属边框,以及展示战利品的礼物墙。',

  feature3Title: '家族与 SVIP',
  feature3Body:
    '加入家族,晋级 SVIP 等级,解锁专属装扮:房间主题、座驾、麦克风特效、徽章。',

  feature4Title: '私信聊天',
  feature4Body: '与房间里遇到的任何人一键开启私聊。实时通讯,支持图片与媒体。',

  feature5Title: '安全可靠',
  feature5Body:
    '一键拉黑或举报任何用户。所有房间聊天内置敏感词过滤。严格执行 18 岁以上年龄限制。',

  feature6Title: '服务全球用户',
  feature6Body:
    '现已支持中文、英文与孟加拉语,更多语言即将推出。针对中端 Android 手机深度优化。',

  ctaHeading: '准备好加入了吗?',
  ctaBody: 'Google Play 免费下载。一键 Google 登录即可开始。',

  footerTagline: '语音直播、礼物与社区 —— 为快乐社交而生。',
  footerLegal: '法律条款',
  footerCompany: '公司',
  footerStaffSignedOut: '员工登录',
  footerStaffSignedIn: '进入控制台',
  footerCopyright: (year) => `© ${year} Zimo Live. 版权所有。`,
  footerMadeIn: '中国团队打造 · 服务全球用户',

  legalLinks: [
    { href: '/privacy-policy', label: '隐私政策' },
    { href: '/terms-of-service', label: '服务条款' },
    { href: '/child-safety', label: '儿童安全' },
    { href: '/refund-policy', label: '退款政策' },
    { href: '/delete-account', label: '删除账户' },
  ],
  companyLinks: [
    { href: '/about', label: '关于我们' },
    { href: '/contact', label: '联系我们' },
  ],

  loginTitle: 'Zimo Live 管理后台',
  loginSubtitle: '登录管理控制台',
  loginEmailLabel: '邮箱或用户名',
  loginPasswordLabel: '密码',
  loginSubmit: '登录',
  loginSubmitting: '正在登录…',
  loginBackToHome: '← 返回首页',
  loginDefaultCreds: '默认凭证从后端 .env 加载',
  loginGenericError: '无法连接服务器,请检查网络或联系管理员。',

  legalBackHome: '← 返回首页',
  legalLastUpdated: '最近更新',
};

const DICTIONARY: Record<Locale, LandingStrings> = { en: EN, zh: ZH };

/**
 * Locale state + persistence. Returns the current locale, a setter
 * that writes through to localStorage, and the strings object for
 * the current locale.
 *
 * SSR-safe: the first render is always English (no localStorage on
 * the server / first client paint). After hydration, useEffect reads
 * the saved value and re-renders if it differs. No hydration warning
 * because the first render is deterministic.
 */
export function useLandingLocale(): {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: LandingStrings;
} {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') {
        setLocaleState(saved);
      }
    } catch {
      // localStorage blocked (incognito with strict cookie settings) —
      // fall through with the English default. No-op.
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Same blocked-storage case as above. The in-memory state still
      // updates so the current session looks right; only persistence
      // across reloads is lost.
    }
  };

  return { locale, setLocale, t: DICTIONARY[locale] };
}
