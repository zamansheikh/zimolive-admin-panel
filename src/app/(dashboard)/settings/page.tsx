'use client';

import { useEffect, useMemo, useState } from 'react';

import { Card, ErrorAlert, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type { AppConfig } from '@/types';

/**
 * System config — kill switches for whole-feature toggles. Saves
 * immediately on toggle, with optimistic UI; reverts if the request
 * fails. Backend gates `family.create / .join` and `agency.create /
 * .assignHost` on these flags, and the public `/api/v1/system-config`
 * endpoint lets mobile clients hide entry points.
 */
export default function SettingsPage() {
  const permissions = useMemo(() => authStorage.getRole()?.permissions ?? [], []);
  const canManage = hasPermission(permissions, 'system.config');

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ config: AppConfig }>('/admin/system-config')
      .then((res) => {
        if (!cancelled) setConfig(res.config);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(
    key:
      | 'familiesEnabled'
      | 'agenciesEnabled'
      | 'emailLoginEnabled'
      | 'phoneLoginEnabled'
      | 'liveRequiresAgency'
      | 'audioHostEndsLive',
  ) {
    if (!config || !canManage) return;
    const next = !config[key];
    // Optimistic — flip immediately, revert on error.
    setConfig({ ...config, [key]: next });
    setSaving(key);
    setError(null);
    try {
      const res = await api<{ config: AppConfig }>('/admin/system-config', {
        method: 'PATCH',
        body: JSON.stringify({ [key]: next }),
      });
      setConfig(res.config);
    } catch (e: any) {
      setConfig({ ...config }); // revert
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  /// Generic save for the numeric / select fields under the
  /// live-record section. Same optimistic + revert shape as
  /// `toggle`, but typed for arbitrary key/value pairs so the
  /// caller can ship a partial PATCH from an input commit.
  async function saveField<K extends keyof AppConfig>(
    key: K,
    value: AppConfig[K],
  ) {
    if (!config || !canManage) return;
    const prev = config[key];
    setConfig({ ...config, [key]: value });
    setSaving(key as string);
    setError(null);
    try {
      const res = await api<{ config: AppConfig }>('/admin/system-config', {
        method: 'PATCH',
        body: JSON.stringify({ [key]: value }),
      });
      setConfig(res.config);
    } catch (e: any) {
      setConfig({ ...config, [key]: prev }); // revert
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="System Settings"
        subtitle="Platform-wide kill switches. Disabling a feature blocks new creates and hides it on mobile; existing data is preserved and reads stay open."
      />

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading…
        </div>
      ) : !config ? (
        <ErrorAlert message="Couldn't load configuration." />
      ) : (
        <div className="space-y-4">
          <ToggleCard
            title="Family feature"
            body={
              <>
                When off, the mobile <em>Create Family</em> + <em>Join</em> flows are
                blocked at the API level. Existing families remain visible and
                their members keep their badges.
              </>
            }
            checked={config.familiesEnabled}
            disabled={!canManage || saving === 'familiesEnabled'}
            onToggle={() => toggle('familiesEnabled')}
          />
          <ToggleCard
            title="Agency feature"
            body={
              <>
                When off, no new agency can be created and no host can be
                assigned. Existing agencies and their hosts keep their
                contracts intact.
              </>
            }
            checked={config.agenciesEnabled}
            disabled={!canManage || saving === 'agenciesEnabled'}
            onToggle={() => toggle('agenciesEnabled')}
          />

          <ToggleCard
            title="Live requires agency"
            body={
              <>
                When on, only users with <code>isHost === true</code> can open
                audio / video rooms. The path to becoming a host is either an
                admin promoting them on the user record, or them joining an
                agency (joining auto-promotes). Active rooms aren't torn down
                — this only gates new room creates and re-opens.
              </>
            }
            checked={config.liveRequiresAgency}
            disabled={!canManage || saving === 'liveRequiresAgency'}
            onToggle={() => toggle('liveRequiresAgency')}
          />

          <ToggleCard
            title="Audio host ends the live"
            body={
              <>
                When on, an audio room becomes session-scoped to its host —
                the host leaving (or losing their heartbeat for ~2 minutes)
                closes the room and kicks every viewer with a "host ended
                the live" toast, same as video rooms. When off (the
                default), audio rooms remain a persistent venue: viewers
                stay inside even when the host steps away.
              </>
            }
            checked={config.audioHostEndsLive}
            disabled={!canManage || saving === 'audioHostEndsLive'}
            onToggle={() => toggle('audioHostEndsLive')}
          />

          <div className="pt-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Host live-record rewards
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Daily + monthly rewards that pay hosts for sustained live time.
              A "valid day" is any calendar day the host crossed the daily
              minute threshold on EITHER audio or video (tracked separately).
              Hit the monthly day threshold and the host can claim the
              monthly bonus + a PDF certificate from the mobile Live Record
              page. Set a reward amount to 0 to keep the tracking but
              disable the wallet credit.
            </p>
          </div>

          <NumberCard
            title="Daily minute threshold"
            unit="minutes"
            body={
              <>
                Minutes of live in a single day to count as one valid day.
                Audio + video are tracked separately — 45 min of either
                kind alone earns it. Server cap: ≥ 1.
              </>
            }
            value={config.liveValidDayMinutes}
            disabled={!canManage || saving === 'liveValidDayMinutes'}
            onSave={(v) => saveField('liveValidDayMinutes', v)}
          />

          <NumberCard
            title="Monthly valid-day threshold"
            unit="days"
            body={
              <>
                Valid days the host needs in a calendar month to unlock
                the monthly bonus + PDF certificate.
              </>
            }
            value={config.liveValidMonthDays}
            disabled={!canManage || saving === 'liveValidMonthDays'}
            onSave={(v) => saveField('liveValidMonthDays', v)}
          />

          <NumberCard
            title="Daily reward (per valid day)"
            unit={config.liveValidRewardCurrency}
            body={
              <>
                Credited automatically at Asia/Dhaka midnight for every
                day the host crossed the threshold. Set to 0 to disable
                the daily credit while still tracking valid days for the
                monthly accounting.
              </>
            }
            value={config.liveValidDayReward}
            disabled={!canManage || saving === 'liveValidDayReward'}
            onSave={(v) => saveField('liveValidDayReward', v)}
          />

          <NumberCard
            title="Monthly bonus (per claim)"
            unit={config.liveValidRewardCurrency}
            body={
              <>
                One-shot bonus claimed from the mobile Live Record page
                once the host hits the monthly valid-day threshold. The
                same claim generates the PDF certificate. Set to 0 to
                keep the PDF flow but skip the wallet credit.
              </>
            }
            value={config.liveValidMonthBonus}
            disabled={!canManage || saving === 'liveValidMonthBonus'}
            onSave={(v) => saveField('liveValidMonthBonus', v)}
          />

          <SelectCard
            title="Reward currency"
            body={
              <>
                Currency used for both the daily reward and the monthly
                bonus. <code>coins</code> is the in-app spending currency;
                <code>diamonds</code> is the host earning currency
                redeemable for withdrawals.
              </>
            }
            value={config.liveValidRewardCurrency}
            options={[
              { value: 'coins', label: 'Coins' },
              { value: 'diamonds', label: 'Diamonds' },
            ]}
            disabled={!canManage || saving === 'liveValidRewardCurrency'}
            onChange={(v) =>
              saveField('liveValidRewardCurrency', v as 'coins' | 'diamonds')
            }
          />

          <div className="pt-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Sign-in methods
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Toggle which alternative sign-in surfaces appear on the mobile
              login screen. Google (Android) and Apple (iOS) are the platform
              defaults and always shown — these flags only control the optional
              email + phone-OTP forms below the primary button. Backend
              endpoints stay alive when toggled off, so cached sessions keep
              working; only the UI exposure changes.
            </p>
          </div>

          <ToggleCard
            title="Phone (OTP) login"
            body={
              <>
                When on, mobile users can sign in with a phone number and
                one-time SMS code. Off by default — recommended for markets
                where SMS deliverability is unverified, or when you want to
                steer users to Google / Apple sign-in for the launch.
              </>
            }
            checked={config.phoneLoginEnabled}
            disabled={!canManage || saving === 'phoneLoginEnabled'}
            onToggle={() => toggle('phoneLoginEnabled')}
          />

          <ToggleCard
            title="Email + password login"
            body={
              <>
                When on, mobile users can register and sign in with an email
                + password. Off by default — keeps the launch surface limited
                to Google / Apple OAuth and avoids running an additional
                password-reset flow. Existing email accounts keep working
                regardless of this toggle.
              </>
            }
            checked={config.emailLoginEnabled}
            disabled={!canManage || saving === 'emailLoginEnabled'}
            onToggle={() => toggle('emailLoginEnabled')}
          />

          {!canManage && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You're viewing this page in read-only mode — toggling requires
              the <code>system.config</code> permission.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/// Number input bound to a numeric AppConfig field. Commits on
/// blur or Enter — typing doesn't fire a PATCH on every keystroke.
/// Local state lets the user delete digits without the input snapping
/// back; on commit, an empty / non-numeric value reverts to the
/// persisted value rather than persisting NaN.
function NumberCard({
  title,
  body,
  value,
  unit,
  disabled,
  onSave,
}: {
  title: string;
  body: React.ReactNode;
  value: number;
  unit: string;
  disabled: boolean;
  onSave: (next: number) => void;
}) {
  const [draft, setDraft] = useState<string>(String(value));
  useEffect(() => {
    setDraft(String(value));
  }, [value]);
  function commit() {
    const parsed = Number(draft);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setDraft(String(value));
      return;
    }
    if (parsed === value) return;
    onSave(parsed);
  }
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{body}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <input
            type="number"
            min={0}
            step={1}
            value={draft}
            disabled={disabled}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="h-9 w-24 rounded-md border border-slate-300 px-2 text-right text-sm disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
    </Card>
  );
}

/// Select bound to a string-enum AppConfig field. Commits on
/// change — no separate save button (matches the toggles).
function SelectCard({
  title,
  body,
  value,
  options,
  disabled,
  onChange,
}: {
  title: string;
  body: React.ReactNode;
  value: string;
  options: { value: string; label: string }[];
  disabled: boolean;
  onChange: (next: string) => void;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{body}</p>
        </div>
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-md border border-slate-300 px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
}

function ToggleCard({
  title,
  body,
  checked,
  disabled,
  onToggle,
}: {
  title: string;
  body: React.ReactNode;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <span
              className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                checked
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {checked ? 'enabled' : 'disabled'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{body}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? 'bg-brand-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              checked ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </Card>
  );
}
