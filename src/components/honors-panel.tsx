'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorAlert,
  Input,
  Select,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type { HonorItem, PaginatedList } from '@/types';

interface UserHonorRow {
  id: string;
  honorItemId: string;
  key: string;
  name: string;
  category: string;
  iconUrl: string;
  tier: number;
  maxTier: number;
  source: string;
  note: string;
  awardedAt: string;
}

/// Honors panel rendered on the admin user detail page. Shows the
/// user's existing honors plus a "Grant honor" form. Hides itself
/// completely from admins without `honors.view`.
export default function HonorsPanel({ userId }: { userId: string }) {
  const permissions = useMemo(
    () => authStorage.getRole()?.permissions ?? [],
    [],
  );
  const canView = hasPermission(permissions, 'honors.view');
  const canGrant = hasPermission(permissions, 'honors.grant');

  const [items, setItems] = useState<UserHonorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!canView) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ items: UserHonorRow[] }>(
        `/admin/users/${userId}/honors`,
      );
      setItems(res.items);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId, canView]);

  useEffect(() => {
    load();
  }, [load]);

  if (!canView) return null;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Honors</h3>
        {canGrant && <_GrantHonorForm userId={userId} onGranted={load} />}
      </div>

      {error && <div className="mb-3"><ErrorAlert message={error} /></div>}

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState message="No honors granted yet." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((h) => (
            <_HonorCell
              key={h.id}
              honor={h}
              canRevoke={canGrant}
              onRevoked={load}
              userId={userId}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function _HonorCell({
  honor,
  canRevoke,
  onRevoked,
  userId,
}: {
  honor: UserHonorRow;
  canRevoke: boolean;
  onRevoked: () => void;
  userId: string;
}) {
  const [busy, setBusy] = useState(false);

  async function revoke() {
    if (!confirm(`Revoke "${honor.name}" from this user?`)) return;
    setBusy(true);
    try {
      await api(`/admin/users/${userId}/honors/${honor.honorItemId}`, {
        method: 'DELETE',
      });
      onRevoked();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-3 text-center">
      {honor.iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={honor.iconUrl}
          alt=""
          className="h-10 w-10 object-contain"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-50 text-amber-600">
          ✦
        </div>
      )}
      <div className="mt-1 text-xs font-semibold text-slate-900">
        {honor.name}
      </div>
      <div className="text-[10px] text-slate-500">
        {'★'.repeat(honor.tier)}
        <span className="text-slate-300">
          {'★'.repeat(Math.max(0, honor.maxTier - honor.tier))}
        </span>
      </div>
      <Badge tone="slate">{honor.source}</Badge>
      {canRevoke && (
        <button
          onClick={revoke}
          disabled={busy}
          className="mt-2 text-[10px] text-red-600 hover:underline disabled:opacity-50"
        >
          {busy ? 'Revoking…' : 'Revoke'}
        </button>
      )}
    </div>
  );
}

/// Inline "Grant honor" trigger + modal. Loads the active catalog
/// once and lets the admin pick by key + tier + optional note.
function _GrantHonorForm({
  userId,
  onGranted,
}: {
  userId: string;
  onGranted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [catalog, setCatalog] = useState<HonorItem[]>([]);
  const [honorRef, setHonorRef] = useState('');
  const [tier, setTier] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function openModal() {
    setErr(null);
    setOpen(true);
    if (catalog.length === 0) {
      try {
        // High limit because honor catalogs are typically small (≤200).
        const res = await api<PaginatedList<HonorItem>>(
          `/admin/honors?limit=200`,
        );
        setCatalog(res.items.filter((i) => i.active));
        if (res.items.length > 0 && !honorRef) {
          setHonorRef(res.items[0].key);
        }
      } catch (e: any) {
        setErr(e.message);
      }
    }
  }

  async function submit() {
    if (!honorRef.trim()) {
      setErr('Pick an honor first');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const body: Record<string, unknown> = { honorRef: honorRef.trim() };
      const tierNum = Number(tier);
      if (Number.isFinite(tierNum) && tierNum > 0) body.tier = tierNum;
      if (note.trim()) body.note = note.trim();
      await api(`/admin/users/${userId}/honors`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setOpen(false);
      setNote('');
      onGranted();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={openModal}>
        + Grant honor
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Grant honor
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Honor
                </label>
                <Select
                  value={honorRef}
                  onChange={(e) => setHonorRef(e.target.value)}
                >
                  <option value="">— Select —</option>
                  {catalog.map((h) => (
                    <option key={h.id} value={h.key}>
                      {h.name} ({h.key}) · max {h.maxTier}★
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Tier (blank = max)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Note (audit only)
                </label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional reason for the grant"
                />
              </div>
            </div>
            {err && <div className="mt-3"><ErrorAlert message={err} /></div>}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={submit} disabled={busy}>
                {busy ? 'Granting…' : 'Grant'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
