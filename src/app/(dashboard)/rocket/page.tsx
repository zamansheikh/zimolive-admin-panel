'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Card,
  ErrorAlert,
  Field,
  Input,
  PageHeader,
  Select,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type { RocketConfig, RocketLevel } from '@/types';

/**
 * Single-page Rocket / Fighter config. Loads the singleton, lets the
 * admin manage the level ladder, and PATCHes back. Each level row
 * shows energy required + top-1/2/3 fixed coins + random pool +
 * beneficiary count + asset URLs.
 */
export default function RocketAdminPage() {
  const permissions = useMemo(() => authStorage.getRole()?.permissions ?? [], []);
  const canManage = hasPermission(permissions, 'rocket.manage');

  const [config, setConfig] = useState<RocketConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(true);
  const [timezone, setTimezone] = useState('Asia/Dhaka');
  const [thresholdRaw, setThresholdRaw] = useState('120000');
  const [countdownRaw, setCountdownRaw] = useState('20');
  const [cascadeRaw, setCascadeRaw] = useState('30');
  const [levels, setLevels] = useState<RocketLevel[]>([]);

  function hydrateForm(c: RocketConfig) {
    setEnabled(c.enabled);
    setTimezone(c.timezone);
    setThresholdRaw(String(c.topContributionThreshold));
    setCountdownRaw(String(c.launchCountdownSeconds));
    setCascadeRaw(String(c.cascadeDelaySeconds ?? 30));
    setLevels(c.levels.map((l) => ({ ...l })));
  }

  useEffect(() => {
    let cancelled = false;
    api<{ config: RocketConfig }>('/rocket/admin/config')
      .then((res) => {
        if (cancelled) return;
        setConfig(res.config);
        hydrateForm(res.config);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function addLevel() {
    const nextLevel = levels.length === 0 ? 1 : Math.max(...levels.map((l) => l.level)) + 1;
    setLevels([
      ...levels,
      {
        level: nextLevel,
        energyRequired: 100_000,
        top1Coins: 50_000,
        top2Coins: 20_000,
        top3Coins: 10_000,
        randomPoolCoins: 20_000,
        randomBeneficiaries: 10,
        assetUrl: '',
        iconUrl: '',
      },
    ]);
  }

  function removeLevel(idx: number) {
    setLevels(levels.filter((_, i) => i !== idx));
  }

  function patchLevel(idx: number, patch: Partial<RocketLevel>) {
    const copy = [...levels];
    copy[idx] = { ...copy[idx], ...patch };
    setLevels(copy);
  }

  async function save() {
    if (!canManage || saving) return;
    setError(null);
    setSavedMessage(null);

    const threshold = parseInt(thresholdRaw, 10);
    if (!Number.isFinite(threshold) || threshold < 0) {
      setError('Top-contribution threshold must be a non-negative integer.');
      return;
    }
    const countdown = parseInt(countdownRaw, 10);
    if (!Number.isFinite(countdown) || countdown < 1 || countdown > 120) {
      setError('Launch countdown must be 1–120 seconds.');
      return;
    }
    const cascade = parseInt(cascadeRaw, 10);
    if (!Number.isFinite(cascade) || cascade < 5 || cascade > 300) {
      setError('Cascade delay must be 5–300 seconds.');
      return;
    }
    const seen = new Set<number>();
    for (const lv of levels) {
      if (seen.has(lv.level)) {
        setError(`Level ${lv.level} listed twice.`);
        return;
      }
      seen.add(lv.level);
      if (lv.energyRequired < 1) {
        setError(`Level ${lv.level}: energyRequired must be ≥ 1.`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await api<{ config: RocketConfig }>(
        '/rocket/admin/config',
        {
          method: 'PATCH',
          body: JSON.stringify({
            enabled,
            timezone,
            topContributionThreshold: threshold,
            launchCountdownSeconds: countdown,
            cascadeDelaySeconds: cascade,
            levels,
          }),
        },
      );
      setConfig(res.config);
      hydrateForm(res.config);
      setSavedMessage('Saved.');
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }
  if (!config) {
    return <ErrorAlert message={error || 'Couldn\'t load Rocket config.'} />;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Rocket / Fighter — Config"
        subtitle="Per-level energy thresholds and reward ladder for the in-room fighter. Energy fills as users gift in the room (1 coin = 1 energy); when a level fills, a global banner plays and the rocket launches after the configured countdown. Single big gifts that cross multiple thresholds chain rockets back-to-back with the cascade delay between them."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => hydrateForm(config!)}
              disabled={saving}
            >
              Reset
            </Button>
            <Button onClick={save} disabled={!canManage || saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}
      {savedMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {savedMessage}
        </div>
      )}

      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Feature enabled">
            <Select
              value={enabled ? 'true' : 'false'}
              onChange={(e) => setEnabled(e.target.value === 'true')}
              disabled={!canManage}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </Select>
          </Field>
          <Field label="Timezone" hint="IANA name. Daily reset snaps to local 00:00.">
            <Input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={!canManage}
            />
          </Field>
          <Field
            label="Top-3 threshold"
            hint="Min energy a top-3 contributor must hit to win the fixed coins."
          >
            <Input
              type="number"
              min="0"
              value={thresholdRaw}
              onChange={(e) => setThresholdRaw(e.target.value)}
              disabled={!canManage}
            />
          </Field>
          <Field
            label="Launch countdown (s)"
            hint="Seconds between threshold-cross and launch. Long enough for the global banner to pull users in. 1–120."
          >
            <Input
              type="number"
              min="1"
              max="120"
              value={countdownRaw}
              onChange={(e) => setCountdownRaw(e.target.value)}
              disabled={!canManage}
            />
          </Field>
          <Field
            label="Cascade delay (s)"
            hint="Spacing between back-to-back launches when one big gift fills multiple levels. 5–300."
          >
            <Input
              type="number"
              min="5"
              max="300"
              value={cascadeRaw}
              onChange={(e) => setCascadeRaw(e.target.value)}
              disabled={!canManage}
            />
          </Field>
        </div>
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Levels ({levels.length})
        </h2>
        {canManage && (
          <Button variant="secondary" onClick={addLevel}>
            + Add level
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {levels.map((lv, idx) => (
          <Card key={idx}>
            <div className="mb-3 flex items-end justify-between gap-3">
              <Field label="Level">
                <Input
                  type="number"
                  min="1"
                  value={String(lv.level)}
                  onChange={(e) =>
                    patchLevel(idx, { level: parseInt(e.target.value, 10) || 1 })
                  }
                  disabled={!canManage}
                  className="w-24"
                />
              </Field>
              {canManage && (
                <Button variant="danger" onClick={() => removeLevel(idx)}>
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field
                label="Energy required"
                hint="Total gift coins that must accumulate to launch."
              >
                <Input
                  type="number"
                  min="1"
                  value={String(lv.energyRequired)}
                  onChange={(e) =>
                    patchLevel(idx, {
                      energyRequired: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  disabled={!canManage}
                />
              </Field>
              <Field label="Top-1 coins">
                <Input
                  type="number"
                  min="0"
                  value={String(lv.top1Coins)}
                  onChange={(e) =>
                    patchLevel(idx, {
                      top1Coins: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  disabled={!canManage}
                />
              </Field>
              <Field label="Top-2 coins">
                <Input
                  type="number"
                  min="0"
                  value={String(lv.top2Coins)}
                  onChange={(e) =>
                    patchLevel(idx, {
                      top2Coins: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  disabled={!canManage}
                />
              </Field>
              <Field label="Top-3 coins">
                <Input
                  type="number"
                  min="0"
                  value={String(lv.top3Coins)}
                  onChange={(e) =>
                    patchLevel(idx, {
                      top3Coins: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  disabled={!canManage}
                />
              </Field>
              <Field
                label="Random pool"
                hint="Total coins shared across N random in-room beneficiaries."
              >
                <Input
                  type="number"
                  min="0"
                  value={String(lv.randomPoolCoins)}
                  onChange={(e) =>
                    patchLevel(idx, {
                      randomPoolCoins: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  disabled={!canManage}
                />
              </Field>
              <Field
                label="Random beneficiaries"
                hint="How many room members split the pool."
              >
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={String(lv.randomBeneficiaries)}
                  onChange={(e) =>
                    patchLevel(idx, {
                      randomBeneficiaries: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  disabled={!canManage}
                />
              </Field>
              <Field
                label="Animation URL"
                hint="Cloudinary URL for this level's launch animation."
              >
                <Input
                  value={lv.assetUrl}
                  onChange={(e) => patchLevel(idx, { assetUrl: e.target.value })}
                  disabled={!canManage}
                />
              </Field>
              <Field
                label="Icon URL"
                hint="Small thumbnail for the side level-strip."
              >
                <Input
                  value={lv.iconUrl}
                  onChange={(e) => patchLevel(idx, { iconUrl: e.target.value })}
                  disabled={!canManage}
                />
              </Field>
            </div>
          </Card>
        ))}
        {levels.length === 0 && (
          <Card>
            <div className="text-center text-sm text-slate-500">
              No levels configured. The rocket feature won't trigger until at
              least one level is defined.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
