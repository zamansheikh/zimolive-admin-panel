// ---------------- Admin (staff + partners) ----------------

export interface Admin {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  roleId: string;
  scopeType: 'agency' | 'reseller' | null;
  scopeId: string | null;
  status: 'active' | 'disabled' | 'locked';
  mustChangePassword: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  linkedUserId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  scopeType: 'agency' | 'reseller' | null;
  priority: number;
  active: boolean;
}

export interface AdminTokens {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
}

export interface MeResponse {
  admin: Admin;
  role: AdminRole;
  permissions: string[];
  scope: { type: 'agency' | 'reseller'; id: string | null } | null;
}

// ---------------- App users ----------------

export type HostTier = 'trainee' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface HostProfile {
  tier: HostTier;
  approvedAt: string;
  approvedBy?: string | null;
  agencyId?: string | null;
  totalDiamondsEarned: number;
  streamHours: number;
}

export interface AppUser {
  id: string;
  /** 7-digit public ID (e.g. 1234567). Backfilled on existing users. */
  numericId?: number;
  email?: string;
  phone?: string;
  username?: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  language: string;
  country: string;
  status: 'active' | 'suspended' | 'banned' | 'deleted';
  banReason?: string;
  bannedAt?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  level: number;
  xp: number;
  isHost: boolean;
  hostProfile?: HostProfile | null;
  linkedAdminId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Agencies ----------------

export interface Agency {
  id: string;
  numericId?: number;
  name: string;
  code: string;
  description: string;
  country: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number;
  status: 'active' | 'suspended' | 'terminated';
  hostCount: number;
  totalDiamondsEarned: number;
  ownerAdminId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Families ----------------

export type FamilyStatus = 'active' | 'frozen' | 'disbanded';
export type FamilyJoinMode = 'review' | 'open' | 'invite_only';
export type FamilyMemberRole = 'leader' | 'co_leader' | 'member';
export type FamilyMemberStatusKind = 'active' | 'pending';

export interface Family {
  id: string;
  numericId?: number;
  name: string;
  coverUrl: string;
  coverPublicId: string;
  notification: string;
  joinMode: FamilyJoinMode;
  joinLevelRequirement: number;
  level: number;
  leaderId: string;
  coLeaderIds: string[];
  memberCount: number;
  status: FamilyStatus;
  soloSince?: string | null;
  lastNameChangedAt?: string | null;
  lastCoverChangedAt?: string | null;
  createdBy: string;
  creationFeePaid: number;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  /** Backend admin endpoint populates with display fields. */
  userId:
    | string
    | {
        id: string;
        username?: string;
        displayName?: string;
        numericId?: number;
        avatarUrl?: string;
      };
  role: FamilyMemberRole;
  status: FamilyMemberStatusKind;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Magic Ball ----------------

export type MagicBallTaskKind =
  | 'mic_minutes'
  | 'invites_completed'
  | 'gifts_sent'
  | 'gifts_received'
  | 'chat_messages'
  | 'room_visitors';

export interface MagicBallTask {
  id: string;
  label: string;
  kind: MagicBallTaskKind;
  goal: number;
  rewardCoins: number;
  sortOrder: number;
  active: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Rocket / Fighter config ----------------

export interface RocketLevel {
  level: number;
  energyRequired: number;
  top1Coins: number;
  top2Coins: number;
  top3Coins: number;
  randomPoolCoins: number;
  randomBeneficiaries: number;
  assetUrl: string;
  iconUrl: string;
}

export interface RocketConfig {
  id: string;
  key: 'singleton';
  enabled: boolean;
  timezone: string;
  /** Min energy a top-3 contributor must hit to qualify for the fixed reward. */
  topContributionThreshold: number;
  /** Seconds between threshold-cross and the actual launch — long enough for
   *  users in other rooms to see the global banner and hop in. */
  launchCountdownSeconds: number;
  /** Seconds between two cascading launches when a single big gift fills
   *  multiple levels at once. */
  cascadeDelaySeconds: number;
  levels: RocketLevel[];
  createdAt: string;
  updatedAt: string;
}

// ---------------- Lucky Bag config ----------------

export interface LuckyBagTier {
  slotCount: number;
  /** Length === slotCount; sum === 1.0. */
  percentages: number[];
}

export type LuckyBagDistributionMode = 'random' | 'fixed_tier';

export interface LuckyBagConfig {
  id: string;
  key: 'singleton';
  enabled: boolean;
  /** 0..1 — platform's cut taken off the top before distribution. */
  commissionRate: number;
  applyCommissionByDefault: boolean;
  coinPresets: number[];
  tiers: LuckyBagTier[];
  /** When true, mobile shows the distribution-mode picker and the user
   *  chooses random vs fixed-tier. When false, the picker is hidden and
   *  the server forces `composerDefaultDistributionMode`. */
  composerShowDistributionMode: boolean;
  /** The mode the server uses when the picker is hidden, AND the
   *  pre-selected mode shown when it's visible. */
  composerDefaultDistributionMode: LuckyBagDistributionMode;
  /** Seconds until the open button appears on a freshly-dropped bag. */
  openCountdownSeconds: number;
  /** Seconds the bag stays claimable AFTER the open button appears. */
  claimWindowSeconds: number;
  /** Hard cap on simultaneous active bags per room. Default 1. */
  maxConcurrentPerRoom: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------- System config ----------------

export interface AppConfig {
  id: string;
  key: 'singleton';
  familiesEnabled: boolean;
  agenciesEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Resellers ----------------

export interface Reseller {
  id: string;
  numericId?: number;
  name: string;
  code: string;
  description: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  coinPool: number;
  creditLimit: number;
  commissionRate: number;
  lifetimeCoinsReceived: number;
  lifetimeCoinsAssigned: number;
  status: 'active' | 'suspended' | 'terminated';
  ownerAdminId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ResellerLedgerType =
  | 'pool_topup'
  | 'pool_clawback'
  | 'assignment'
  | 'adjustment';

export interface ResellerLedgerEntry {
  id: string;
  idempotencyKey: string;
  resellerId: string;
  direction: 'credit' | 'debit';
  type: ResellerLedgerType;
  amount: number;
  reason: string;
  poolBalanceAfter: number;
  performedBy: string;
  recipientUserId?:
    | string
    | { id: string; username?: string; displayName?: string }
    | null;
  userTxnId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Gifts ----------------

export type GiftCategory = 'basic' | 'premium' | 'legendary' | 'limited';

/// Mirrors the backend GiftAssetType — the upload endpoint returns this so
/// the form can persist + the mobile overlay knows which player to use.
export type GiftAssetType = 'image' | 'svga' | 'lottie' | 'mp4' | 'none';

export interface LocalizedString {
  en: string;
  bn: string;
}

export interface Gift {
  id: string;
  name: LocalizedString;
  code: string;
  description: LocalizedString;
  category: GiftCategory;
  priceCoins: number;
  diamondReward: number;
  thumbnailUrl: string;
  thumbnailPublicId?: string;
  animationUrl: string;
  animationPublicId?: string;
  assetType?: GiftAssetType;
  soundUrl: string;
  durationMs: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  vipOnly: boolean;
  svipOnly: boolean;
  countries: string[];
  comboMultipliers: number[];
  sortOrder: number;
  featured: boolean;
  totalSent: number;
  totalCoinsCollected: number;
  createdAt: string;
  updatedAt: string;
}

export interface GiftEvent {
  id: string;
  giftId: { id: string; code: string; name: LocalizedString } | string;
  senderId: { id: string; username: string; displayName: string; avatarUrl: string } | string;
  receiverId: { id: string; username: string; displayName: string; avatarUrl: string } | string;
  count: number;
  totalCoinAmount: number;
  totalDiamondReward: number;
  contextType: string;
  message: string;
  status: 'completed' | 'reversed';
  createdAt: string;
}

// ---------------- Wallet ----------------

export interface Wallet {
  id: string;
  userId: string;
  coins: number;
  diamonds: number;
  lifetimeCoinsRecharged: number;
  lifetimeCoinsSpent: number;
  lifetimeDiamondsEarned: number;
  lifetimeDiamondsWithdrawn: number;
  frozen: boolean;
  frozenReason: string;
  frozenAt?: string | null;
  frozenBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Currency = 'coins' | 'diamonds';
export type TxnDirection = 'credit' | 'debit';
export type TxnType =
  | 'recharge'
  | 'recharge_bonus'
  | 'gift_send'
  | 'gift_receive'
  | 'withdrawal'
  | 'withdrawal_reversal'
  | 'admin_credit'
  | 'admin_debit'
  | 'event_reward'
  | 'referral_bonus'
  | 'task_reward'
  | 'refund'
  | 'conversion';

export interface Transaction {
  id: string;
  idempotencyKey: string;
  correlationId: string;
  walletId: string;
  userId: string;
  currency: Currency;
  direction: TxnDirection;
  amount: number;
  type: TxnType;
  description: string;
  refType?: string | null;
  refId?: string | null;
  balanceAfter: number;
  performedBy?: string | null;
  status: 'completed' | 'reversed';
  createdAt: string;
}

// ---------------- Cosmetics ----------------

export type CosmeticType =
  | 'frame'
  | 'vehicle'
  | 'theme'
  | 'ring'
  | 'medal'
  | 'title'
  | 'room_card'
  | 'room_chat_bubble'
  | 'room_list_border'
  | 'mic_wave'
  | 'mic_skin'
  | 'special_gift_notification'
  | 'profile_background'
  | 'ludo_dice_skin'
  | 'dynamic_avatar';

export type CosmeticAssetType = 'image' | 'svga' | 'lottie' | 'mp4' | 'none';

export interface CosmeticItem {
  id: string;
  name: LocalizedString;
  code: string;
  description: LocalizedString;
  type: CosmeticType;
  previewUrl: string;
  previewPublicId: string;
  assetUrl: string;
  assetPublicId: string;
  assetType: CosmeticAssetType;
  rarity: number;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------- SVIP ----------------

export interface SvipPrivilegeDef {
  key: string;
  label: string;
  description: string;
  category: 'visibility' | 'chat' | 'profile' | 'gameplay' | 'identity' | 'protection';
}

export interface SvipTier {
  id: string;
  level: number;
  name: string;
  monthlyPointsRequired: number;
  coinReward: number;
  /** Coins required to buy this tier outright. Required (>0). */
  coinPrice: number;
  /** Days the directly-purchased tier lasts. 0 = permanent. */
  durationDays: number;
  iconUrl: string;
  iconPublicId: string;
  bannerUrl: string;
  bannerPublicId: string;
  grantedItemIds: string[];
  privileges: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Store ----------------

export type StoreCategory = 'frame' | 'vehicle' | 'theme' | 'ring';

export interface StoreListing {
  id: string;
  /** Populated when fetched from admin endpoints; may be the bare ID. */
  cosmeticItemId: CosmeticItem | string;
  category: StoreCategory;
  priceCoins: number;
  durationDays: number;
  sortOrder: number;
  featured: boolean;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  giftable: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Banners ----------------

export type BannerLinkKind = 'none' | 'route' | 'room' | 'user' | 'web' | 'event';

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imagePublicId: string;
  linkKind: BannerLinkKind;
  linkValue: string;
  sortOrder: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  countries: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SplashBanner {
  id: string;
  title: string;
  imageUrl: string;
  imagePublicId: string;
  priority: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

/// Mirrors HomeBanner field-for-field except for `slot` (1 = top in-room
/// stack, 2 = bottom). Mobile groups results into two stacked PageView
/// strips client-side.
export interface RoomBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imagePublicId: string;
  linkKind: BannerLinkKind;
  linkValue: string;
  slot: number;
  sortOrder: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  countries: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------- Room Emojis ----------------

/**
 * One catalog entry for the seat-emoji picker. Three render types:
 *   • `char`  — raw unicode (no asset upload).
 *   • `image` — static image URL (PNG / WEBP / GIF).
 *   • `svga`  — animated SVGA URL (uses raw resource type on
 *                Cloudinary, played through SVGAEasyPlayer on mobile).
 *
 * `durationMs` controls how long the reaction stays on the seat
 * overlay; admins tune visibility centrally so we don't have to ship
 * an app update to slow / speed reactions across the board.
 */
export type RoomEmojiType = 'char' | 'image' | 'svga';

export interface RoomEmoji {
  id: string;
  name: string;
  category: string;
  type: RoomEmojiType;
  /** URL when type is 'image' or 'svga'. Empty for 'char'. */
  assetUrl: string;
  assetPublicId: string;
  /** Raw unicode character(s) for 'char' type. Empty otherwise. */
  char: string;
  durationMs: number;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Daily Reward ----------------

export type RewardKind = 'coin' | 'cosmetic';

export interface DailyRewardItemConfig {
  kind: RewardKind;
  coinAmount?: number | null;
  /** Server stores ObjectId string; admin form keeps it as a string. */
  cosmeticItemId?: string | null;
  cosmeticDurationDays: number;
}

export interface DailyRewardDayConfig {
  day: number;
  rewards: DailyRewardItemConfig[];
  isBigReward: boolean;
}

export interface DailyRewardConfig {
  id: string;
  version: number;
  active: boolean;
  days: DailyRewardDayConfig[];
  createdAt: string;
  updatedAt: string;
}

// ---------------- Wallet — admin-managed lists ----------------

export interface RechargePackage {
  id: string;
  coins: number;
  bonusCoins: number;
  priceAmount: number;
  priceCurrency: string;
  badgeText: string;
  sortOrder: number;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeOption {
  id: string;
  diamondsRequired: number;
  coinsAwarded: number;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Moments ----------------

export type MomentStatus = 'active' | 'removed' | 'deleted';

export interface MomentMedia {
  url: string;
  publicId: string;
  kind: 'image' | 'video';
  width: number;
  height: number;
}

export interface Moment {
  id: string;
  /** Populated subdoc when listed via the admin endpoint. */
  authorId:
    | string
    | {
        id: string;
        username?: string;
        displayName?: string;
        numericId?: number;
        avatarUrl?: string;
      };
  text: string;
  media: MomentMedia[];
  likeCount: number;
  commentCount: number;
  status: MomentStatus;
  removedReason: string;
  removedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------- Agora ----------------

export interface AgoraConfigView {
  id: string;
  appId: string;
  /** Masked except last 4 chars. Empty string when not set. */
  appCertificateMasked: string;
  hasAppCertificate: boolean;
  defaultExpireSeconds: number;
  enabled: boolean;
  updatedAt?: string;
}

// ---------------- Permissions ----------------

export interface PermissionItem {
  value: string;
  label: string;
  description?: string;
}

export interface PermissionCategory {
  resource: string;
  label: string;
  permissions: PermissionItem[];
}

// ---------------- API envelopes ----------------

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  meta: {
    traceId?: string;
    timestamp: string;
  };
}

export interface PaginatedList<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

// ---------------- Honors / Achievements ----------------

export type HonorCategory =
  | 'medal'
  | 'charm'
  | 'wealth'
  | 'event'
  | 'special';

export type HonorSource =
  | 'admin_grant'
  | 'task'
  | 'event'
  | 'purchase';

export type HonorAssetType = 'image' | 'svga';

/// Catalog row — one badge admins can grant to users.
export interface HonorItem {
  id: string;
  /** Stable machine key — `charm_star`, `lv8`, etc. Used by the
   *  task system to award without coupling to display names. */
  key: string;
  name: string;
  description: string;
  category: HonorCategory;
  iconUrl: string;
  iconPublicId: string;
  /** Whether the icon is a static image or an SVGA animation —
   *  drives the mobile renderer (CachedNetworkImage vs SVGAEasyPlayer). */
  iconAssetType: HonorAssetType;
  /** Max upgrade tier — 1..5 stars in the UI. */
  maxTier: number;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/// Per-user inventory row, returned by the admin "list user honors"
/// endpoint. The catalog row is partially hydrated for display.
export interface UserHonor {
  id: string;
  userId: string;
  honorItemId: string;
  tier: number;
  source: HonorSource;
  awardedBy?: string | null;
  note: string;
  awardedAt: string;
}

// ---------------- Rooms ----------------

export type RoomStatus = 'active' | 'closed' | 'removed';
export type RoomKind = 'audio' | 'video';
export type RoomMemberRole = 'owner' | 'admin' | 'member';

/// Lightweight summary used by the admin rooms-list table. The list
/// endpoint populates `ownerId` with a small subset of user fields so
/// the row can render the owner's name + flag without a second hop.
export interface AdminRoomSummary {
  id: string;
  numericId?: number;
  name: string;
  coverUrl: string;
  ownerCountry: string;
  status: RoomStatus;
  kind: RoomKind;
  micCount: number;
  viewerCount: number;
  liveAt: string | null;
  createdAt: string;
  updatedAt: string;
  removedReason?: string;
  removedBy?: string | null;
  ownerId:
    | string
    | {
        id?: string;
        _id?: string;
        username?: string;
        displayName?: string;
        avatarUrl?: string;
        numericId?: number;
        country?: string;
      };
}

/// Lightweight populated-user shape that the snapshot endpoint embeds
/// on seat / member rows via Mongoose populate. `id` lands via the
/// User toJSON transform; the other fields are the explicit populate
/// projection. Use the helper `resolvePopulatedUser` below to get a
/// safe display object — `userId` may also arrive as a raw string id
/// (populate failed / user deleted) so callers must defend against it.
export interface PopulatedRoomUser {
  id: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  numericId?: number;
  level?: number;
  isHost?: boolean;
  /** Set on the snapshot's `owner` field (admins want to see the
   *  owner's country at a glance). Not always populated on seat /
   *  member rows — those use a leaner projection. Treat as optional. */
  country?: string;
}

/// Full snapshot returned by `GET /admin/rooms/:id`. Seats and members
/// each carry a `userId` field — Mongoose populates it inline with a
/// `PopulatedRoomUser` when the user record exists, but a deleted /
/// missing user falls back to the raw ObjectId string. Frontend code
/// must handle both, OR the populated user being `null` for empty
/// seats. The detail page does this via the helper below.
export interface AdminRoomSnapshot {
  room: AdminRoomSummary & {
    announcement?: string;
    blockedUserIds?: string[];
    adminUserIds?: string[];
    kickHistory?: Array<{
      userId: string;
      byUserId: string;
      reason: string;
      at: string;
    }>;
  };
  owner: PopulatedRoomUser | null;
  seats: Array<{
    id: string;
    seatIndex: number;
    locked: boolean;
    muted: boolean;
    /** null = empty seat. Populated user when occupied. May fall back
     *  to a raw id string if populate failed (user deleted). */
    userId: PopulatedRoomUser | string | null;
    joinedAt: string | null;
  }>;
  members: Array<{
    id: string;
    role: RoomMemberRole;
    joinedAt: string;
    /** Populated user when the referenced user still exists. May be a
     *  raw id string (populate skipped) or `null` (referenced user was
     *  deleted, leaving an orphan presence row). The detail page
     *  handles all three via `resolvePopulatedUser`. */
    userId: PopulatedRoomUser | string | null;
  }>;
  channelName: string;
  seatDiamonds?: Record<string, number>;
}

/// Coerce the polymorphic `userId` field into a stable display shape.
/// Returns `null` for empty seats; for raw-string fallbacks (populate
/// failed) returns a minimal shape so the UI shows the id rather than
/// crashing. Use everywhere a snapshot row is rendered.
export function resolvePopulatedUser(
  raw: PopulatedRoomUser | string | null | undefined,
): { label: string; numericId: string | null; avatarUrl: string; id: string } | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    return { label: raw, numericId: null, avatarUrl: '', id: raw };
  }
  return {
    label: raw.displayName || raw.username || raw.id,
    numericId: raw.numericId != null ? String(raw.numericId) : null,
    avatarUrl: raw.avatarUrl ?? '',
    id: raw.id,
  };
}
