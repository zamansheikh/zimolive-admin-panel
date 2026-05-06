'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorAlert,
  Input,
  PageHeader,
  Pagination,
  Select,
  Table,
  Td,
  Th,
} from '@/components/ui';
import { api } from '@/lib/api';
import { authStorage, hasPermission } from '@/lib/auth';
import type {
  HonorAssetType,
  HonorCategory,
  HonorItem,
  HonorMetric,
  HonorTier,
  PaginatedList,
} from '@/types';

/// Auto-grant metric options shown in the per-tier dropdown.
/// "Manual only" is the default — admin grants by hand.
const METRIC_OPTIONS: { value: HonorMetric; label: string; hint: string }[] = [
  { value: 'none', label: 'Manual only', hint: 'No auto-grant — admin grants manually.' },
  { value: 'level', label: 'Account level', hint: 'User reaches level N.' },
  { value: 'xp', label: 'XP earned', hint: 'Total XP ≥ N.' },
  { value: 'followers', label: 'Followers count', hint: 'User has N followers.' },
  { value: 'following', label: 'Following count', hint: 'User follows N people.' },
  { value: 'coins_recharged', label: 'Coins recharged', hint: 'Lifetime coins purchased ≥ N.' },
  { value: 'coins_sent', label: 'Coins spent on gifts', hint: 'Lifetime coins spent on gifts ≥ N.' },
  { value: 'diamonds_received', label: 'Diamonds received', hint: 'Lifetime diamonds earned from gifts ≥ N.' },
  { value: 'svip_tier', label: 'SVIP tier', hint: 'Currently active SVIP level ≥ N.' },
];

const CATEGORY_TONE: Record<HonorCategory, 'green' | 'amber' | 'red' | 'brand' | 'slate'> = {
  // New canonical buckets — picked to match the mobile tab strip.
  fortune: 'amber',
  connection: 'brand',
  gift: 'red',
  experience: 'green',
  constellation: 'brand',
  special: 'slate',
  // Legacy fallbacks.
  medal: 'amber',
  charm: 'brand',
  wealth: 'green',
  event: 'red',
};

const CATEGORY_OPTIONS: { value: HonorCategory; label: string }[] = [
  { value: 'fortune', label: 'Fortune' },
  { value: 'connection', label: 'Connection' },
  { value: 'gift', label: 'Gift' },
  { value: 'experience', label: 'Experience' },
  { value: 'constellation', label: 'Constellation' },
  { value: 'special', label: 'Special' },
];

interface FormState {
  open: boolean;
  editing: HonorItem | null;
}

export default function HonorsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<HonorCategory | ''>('');

  const [data, setData] = useState<PaginatedList<HonorItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ open: false, editing: null });

  const permissions = useMemo(
    () => authStorage.getRole()?.permissions ?? [],
    [],
  );
  const canManage = hasPermission(permissions, 'honors.manage');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const res = await api<PaginatedList<HonorItem>>(
        `/admin/honors?${params.toString()}`,
      );
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setForm({ open: true, editing: null });
  }

  function startEdit(item: HonorItem) {
    setForm({ open: true, editing: item });
  }

  function closeForm(refresh: boolean) {
    setForm({ open: false, editing: null });
    if (refresh) load();
  }

  return (
    <div>
      <PageHeader
        title="Honors"
        subtitle="Achievement badges. Catalog rows here become the Medal grid on user profiles. Grants happen from a user's admin profile."
        actions={
          canManage && (
            <Button variant="primary" onClick={startCreate}>
              + New honor
            </Button>
          )
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput);
          }}
          className="sm:col-span-2"
        >
          <Input
            placeholder="Search by name or key…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as HonorCategory | '');
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading…
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState message="No honors yet. Create one to get started." />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Icon</Th>
                <Th>Key</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Max Tier</Th>
                <Th>Sort</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((h) => (
                <tr key={h.id}>
                  <Td>
                    {h.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={h.iconUrl}
                        alt=""
                        className="h-9 w-9 rounded object-contain ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-amber-50 text-amber-600">
                        ✦
                      </div>
                    )}
                  </Td>
                  <Td>
                    <code className="text-xs text-brand">{h.key}</code>
                  </Td>
                  <Td>
                    <div className="font-medium text-slate-900">{h.name}</div>
                    {h.description && (
                      <div className="line-clamp-1 text-xs text-slate-500">
                        {h.description}
                      </div>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={CATEGORY_TONE[h.category]}>
                      {h.category}
                    </Badge>
                  </Td>
                  <Td className="text-xs">{h.maxTier}★</Td>
                  <Td className="text-xs">{h.sortOrder}</Td>
                  <Td>
                    <Badge tone={h.active ? 'green' : 'slate'}>
                      {h.active ? 'active' : 'hidden'}
                    </Badge>
                  </Td>
                  <Td>
                    {canManage && (
                      <Button
                        variant="secondary"
                        onClick={() => startEdit(h)}
                      >
                        Edit
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={data.page}
            limit={data.limit}
            total={data.total}
            onPage={setPage}
          />
        </>
      )}

      {form.open && (
        <_HonorFormModal
          editing={form.editing}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

interface FormProps {
  editing: HonorItem | null;
  onClose: (refresh: boolean) => void;
}

/// Modal form for both create + edit. Close happens via the backdrop
/// or Cancel; on Save we POST or PATCH and ask the parent to refresh.
function _HonorFormModal({ editing, onClose }: FormProps) {
  const [key, setKey] = useState(editing?.key ?? '');
  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [category, setCategory] = useState<HonorCategory>(
    editing?.category ?? 'fortune',
  );
  // Static image — required, shown on the Honor Wall grid.
  const [iconUrl, setIconUrl] = useState(editing?.iconUrl ?? '');
  const [iconPublicId, setIconPublicId] = useState(
    editing?.iconPublicId ?? '',
  );
  // Optional SVGA — shown on the medal detail sheet on mobile.
  const [svgaUrl, setSvgaUrl] = useState(editing?.svgaUrl ?? '');
  const [svgaPublicId, setSvgaPublicId] = useState(
    editing?.svgaPublicId ?? '',
  );
  // Kept for backwards compat with rows created before the dual-
  // asset pair shipped. Always 'image' going forward.
  const [iconAssetType, setIconAssetType] = useState<HonorAssetType>(
    editing?.iconAssetType ?? 'image',
  );
  // Per-tier rows — each carries its own art + target + reward
  // text. Order = tier order: index 0 is Lv.1, index 1 is Lv.2, etc.
  // `maxTier` is derived from this array's length on save.
  const [tiers, setTiers] = useState<HonorTier[]>(
    () => editing?.tiers ?? [],
  );
  const [sortOrder, setSortOrder] = useState(String(editing?.sortOrder ?? 0));
  const [active, setActive] = useState(editing?.active ?? true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Auto-suggest the code from the display name on create. Stops the
  // moment the admin types in the code field manually (or on edit,
  // since the row already has a code that's immutable).
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(!!editing);

  function slugifyForCode(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
  }

  function onNameChange(next: string) {
    setName(next);
    if (!codeManuallyEdited) {
      setKey(slugifyForCode(next));
    }
  }

  function onCodeChange(next: string) {
    setCodeManuallyEdited(true);
    setKey(next.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  }

  /// Generic upload helper. The backend has two endpoints — image
  /// vs. SVGA — because Cloudinary needs different `resource_type`
  /// values for each. Image uploads write to `iconUrl`; SVGA uploads
  /// write to `svgaUrl`. Both can coexist on the same medal.
  async function uploadIcon(file: File, kind: 'image' | 'svga') {
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const path =
        kind === 'svga'
          ? '/admin/honors/upload/svga'
          : '/admin/honors/upload/icon';
      const res = await api<{
        url: string;
        publicId: string;
        assetType: HonorAssetType;
      }>(path, {
        method: 'POST',
        body: fd,
      });
      if (kind === 'svga') {
        setSvgaUrl(res.url);
        setSvgaPublicId(res.publicId);
      } else {
        setIconUrl(res.url);
        setIconPublicId(res.publicId);
        setIconAssetType('image');
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      // Sanitise tier rows — drop any with an empty name (admins
      // sometimes click "+ Add tier" and don't fill it in).
      const cleanTiers = tiers
        .map((t) => ({
          name: t.name.trim(),
          iconUrl: t.iconUrl.trim(),
          svgaUrl: t.svgaUrl.trim(),
          metric: t.metric ?? 'none',
          target: Number(t.target) || 0,
          rewardText: t.rewardText.trim(),
        }))
        .filter((t) => t.name.length > 0);
      const body = {
        // Key is immutable on edit (admins shouldn't break the
        // task-system's stable handle to a row).
        ...(editing ? {} : { key: key.trim() }),
        name: name.trim(),
        description: description.trim(),
        category,
        iconUrl: iconUrl.trim(),
        iconPublicId: iconPublicId.trim(),
        svgaUrl: svgaUrl.trim(),
        svgaPublicId: svgaPublicId.trim(),
        iconAssetType,
        // Backend derives maxTier from tiers.length when tiers
        // are supplied; keep maxTier ≥ 1 for legacy rows that
        // never set tiers.
        maxTier: cleanTiers.length > 0 ? cleanTiers.length : 5,
        tiers: cleanTiers,
        sortOrder: Number(sortOrder) || 0,
        active,
      };
      if (editing) {
        await api(`/admin/honors/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await api('/admin/honors', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      onClose(true);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      {/*
        Modal shell: capped at 90vh so the form never grows past the
        viewport, with a flex column so the title + footer stay put
        while only the middle body scrolls. We use a plain styled
        div instead of <Card> because Card hardcodes `p-5` which
        would leak into the scroll surface and prevent the title /
        footer from sitting flush.
      */}
      <div className="flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        <h2 className="border-b border-slate-100 px-5 pt-5 pb-3 text-lg font-semibold text-slate-900">
          {editing ? `Edit ${editing.name}` : 'New honor'}
        </h2>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Charm Star"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Code
            </label>
            <Input
              value={key}
              onChange={(e) => onCodeChange(e.target.value)}
              disabled={!!editing}
              placeholder="charm_star"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Auto-filled from the name. Lowercase letters, numbers,
              and underscores only. Used internally to identify this
              medal in code (e.g. for auto-grant rules) — leave it
              alone unless you need a specific value. Cannot be
              changed once saved.
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Awarded to monthly charm-track top earners"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Category
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as HonorCategory)}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Sort order
              </label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center pb-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Active
            </label>
          </div>

          {/* Per-tier editor. Each row is one level (Lv.1, Lv.2, …) */}
          <_TiersEditor tiers={tiers} onChange={setTiers} />

          <div className="rounded-lg border border-slate-200 p-3">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Assets
            </h3>
            <p className="mb-3 text-[11px] text-slate-500">
              The image is the static thumbnail shown in the Honor Wall
              grid. The SVGA is optional and shown on the medal detail
              sheet for an animated showcase. You can upload either or
              both.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Static image */}
              <div className="rounded border border-slate-200 bg-slate-50/50 p-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Image (grid thumbnail)
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-white">
                    {iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={iconUrl}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-amber-500">✦</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className={`cursor-pointer rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
                        uploading ? 'pointer-events-none opacity-60' : ''
                      }`}
                    >
                      {iconUrl ? 'Replace' : 'Upload image'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadIcon(file, 'image');
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {iconUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setIconUrl('');
                          setIconPublicId('');
                        }}
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SVGA */}
              <div className="rounded border border-slate-200 bg-slate-50/50 p-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  SVGA (detail animation)
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-white">
                    {svgaUrl ? (
                      <a
                        href={svgaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-brand"
                      >
                        SVGA
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className={`cursor-pointer rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
                        uploading ? 'pointer-events-none opacity-60' : ''
                      }`}
                    >
                      {svgaUrl ? 'Replace' : 'Upload SVGA'}
                      <input
                        type="file"
                        accept=".svga"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadIcon(file, 'svga');
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {svgaUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSvgaUrl('');
                          setSvgaPublicId('');
                        }}
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
          Pinned footer — error + Cancel/Save stay visible while the
          body scrolls. Sits below the scrollable region inside the
          flex column so it never moves.
        */}
        <div className="border-t border-slate-100 px-5 py-3">
          {err && (
            <div className="mb-3">
              <ErrorAlert message={err} />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => onClose(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={save}
              disabled={busy || !name.trim() || (!editing && !key.trim())}
            >
              {busy ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TiersEditorProps {
  tiers: HonorTier[];
  onChange: (next: HonorTier[]) => void;
}

/// Dynamic per-tier editor. Admins build up the level ladder one row
/// at a time — each tier carries its own art (different visual at
/// Lv.1 vs Lv.5), the numeric target the user has to hit, and the
/// reward text shown on the medal detail sheet.
function _TiersEditor({ tiers, onChange }: TiersEditorProps) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  function add() {
    onChange([
      ...tiers,
      {
        name: `Lv.${tiers.length + 1}`,
        iconUrl: '',
        svgaUrl: '',
        metric: 'none',
        target: 0,
        rewardText: '',
      },
    ]);
  }

  function patch(idx: number, fields: Partial<HonorTier>) {
    onChange(tiers.map((t, i) => (i === idx ? { ...t, ...fields } : t)));
  }

  function remove(idx: number) {
    onChange(tiers.filter((_, i) => i !== idx));
  }

  /**
   * Upload either the per-tier static image or the per-tier SVGA.
   * Hits the matching admin endpoint based on `kind`.
   */
  async function uploadIconFor(
    idx: number,
    file: File,
    kind: 'image' | 'svga',
  ) {
    setUploadingIdx(idx);
    setUploadErr(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const path =
        kind === 'svga'
          ? '/admin/honors/upload/svga'
          : '/admin/honors/upload/icon';
      const res = await api<{ url: string; publicId: string }>(path, {
        method: 'POST',
        body: fd,
      });
      if (kind === 'svga') {
        patch(idx, { svgaUrl: res.url });
      } else {
        patch(idx, { iconUrl: res.url });
      }
    } catch (e: any) {
      setUploadErr(e.message);
    } finally {
      setUploadingIdx(null);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tiers ({tiers.length})
          </h3>
          <p className="text-[11px] text-slate-500">
            Each tier is one level the user can climb to. Mobile renders
            the per-tier icon and target on the medal detail card.
          </p>
        </div>
        <Button variant="secondary" onClick={add}>
          + Add tier
        </Button>
      </div>
      {uploadErr && (
        <div className="mb-2">
          <ErrorAlert message={uploadErr} />
        </div>
      )}
      {tiers.length === 0 ? (
        <p className="py-3 text-center text-xs text-slate-400">
          No tiers yet — add one to define Lv.1.
        </p>
      ) : (
        <div className="space-y-2">
          {tiers.map((t, i) => (
            <div
              key={i}
              className="rounded border border-slate-200 bg-white p-3"
            >
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </label>
                  <Input
                    value={t.name}
                    onChange={(e) => patch(i, { name: e.target.value })}
                    placeholder={`Lv.${i + 1}`}
                  />
                </div>
                <div className="col-span-5">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Auto-grant rule
                  </label>
                  <Select
                    value={t.metric}
                    onChange={(e) =>
                      patch(i, { metric: e.target.value as HonorMetric })
                    }
                  >
                    {METRIC_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {METRIC_OPTIONS.find((o) => o.value === t.metric)?.hint}
                  </p>
                </div>
                <div className="col-span-5">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Target value
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={String(t.target)}
                    onChange={(e) =>
                      patch(i, { target: Number(e.target.value) || 0 })
                    }
                    placeholder={
                      t.metric === 'none' ? 'Ignored when manual' : 'e.g. 1000'
                    }
                    disabled={t.metric === 'none'}
                  />
                </div>
                <div className="col-span-12">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Reward text
                  </label>
                  <Input
                    value={t.rewardText}
                    onChange={(e) =>
                      patch(i, { rewardText: e.target.value })
                    }
                    placeholder="Receive gifts worth 5,000,000,000 coins"
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                {/* Per-tier static image */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                  {t.iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.iconUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-amber-500">✦</span>
                  )}
                </div>
                <label
                  className={`cursor-pointer rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
                    uploadingIdx === i ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  {uploadingIdx === i ? 'Uploading…' : 'Image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadIconFor(i, file, 'image');
                      e.target.value = '';
                    }}
                  />
                </label>
                {/* Per-tier SVGA — optional */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                  {t.svgaUrl ? (
                    <a
                      href={t.svgaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-brand"
                    >
                      SVGA
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
                <label
                  className={`cursor-pointer rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
                    uploadingIdx === i ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  {uploadingIdx === i ? 'Uploading…' : 'SVGA'}
                  <input
                    type="file"
                    accept=".svga"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadIconFor(i, file, 'svga');
                      e.target.value = '';
                    }}
                  />
                </label>
                <div className="ml-auto flex gap-1">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (i === 0) return;
                      const swapped = [...tiers];
                      [swapped[i - 1], swapped[i]] = [
                        swapped[i],
                        swapped[i - 1],
                      ];
                      onChange(swapped);
                    }}
                    disabled={i === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (i === tiers.length - 1) return;
                      const swapped = [...tiers];
                      [swapped[i], swapped[i + 1]] = [
                        swapped[i + 1],
                        swapped[i],
                      ];
                      onChange(swapped);
                    }}
                    disabled={i === tiers.length - 1}
                  >
                    ↓
                  </Button>
                  <Button variant="danger" onClick={() => remove(i)}>
                    ✕
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
