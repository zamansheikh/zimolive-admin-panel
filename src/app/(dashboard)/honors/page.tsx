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
  HonorTier,
  PaginatedList,
} from '@/types';

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
  const [iconUrl, setIconUrl] = useState(editing?.iconUrl ?? '');
  const [iconPublicId, setIconPublicId] = useState(
    editing?.iconPublicId ?? '',
  );
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

  /// Generic upload helper. The backend has two endpoints — image
  /// vs. SVGA — because Cloudinary needs different `resource_type`
  /// values for each. We pick the endpoint by the `kind` arg and let
  /// the server validate the mime/extension.
  async function uploadIcon(file: File, kind: HonorAssetType) {
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
      setIconUrl(res.url);
      setIconPublicId(res.publicId);
      setIconAssetType(res.assetType);
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
      <Card className="w-full max-w-lg">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {editing ? `Edit ${editing.name}` : 'New honor'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Key (machine id)
            </label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase())}
              disabled={!!editing}
              placeholder="charm_star"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Charm Star"
            />
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

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Icon
            </label>
            <div className="mt-1 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                {iconUrl ? (
                  iconAssetType === 'svga' ? (
                    // Browsers can't preview .svga inline, so we
                    // surface the asset-type badge and a link.
                    <a
                      href={iconUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold text-brand"
                    >
                      SVGA
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={iconUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )
                ) : (
                  <span className="text-amber-500">✦</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <label
                    className={`cursor-pointer rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
                      uploading ? 'pointer-events-none opacity-60' : ''
                    }`}
                  >
                    {uploading ? 'Uploading…' : 'Upload image'}
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
                  <label
                    className={`cursor-pointer rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
                      uploading ? 'pointer-events-none opacity-60' : ''
                    }`}
                  >
                    {uploading ? 'Uploading…' : 'Upload SVGA'}
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
                </div>
                <div className="text-[10px] text-slate-500">
                  Type: <b>{iconAssetType}</b>
                  {iconUrl && ' · saved on Cloudinary'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {err && (
          <div className="mt-3">
            <ErrorAlert message={err} />
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
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
      </Card>
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

  async function uploadIconFor(idx: number, file: File) {
    setUploadingIdx(idx);
    setUploadErr(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      // Tier icons are static images (SVGA at the per-tier level
      // would explode payload size; admin can still set the
      // top-level honor icon to SVGA for the headline animation).
      const res = await api<{ url: string; publicId: string }>(
        '/admin/honors/upload/icon',
        { method: 'POST', body: fd },
      );
      patch(idx, { iconUrl: res.url });
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
                <div className="col-span-3">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Target
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={String(t.target)}
                    onChange={(e) =>
                      patch(i, { target: Number(e.target.value) || 0 })
                    }
                    placeholder="5000000000"
                  />
                </div>
                <div className="col-span-7">
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
                  {uploadingIdx === i ? 'Uploading…' : 'Upload icon'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadIconFor(i, file);
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
