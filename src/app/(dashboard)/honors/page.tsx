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
  HonorCategory,
  HonorItem,
  PaginatedList,
} from '@/types';

const CATEGORY_TONE: Record<HonorCategory, 'green' | 'amber' | 'red' | 'brand' | 'slate'> = {
  medal: 'amber',
  charm: 'brand',
  wealth: 'green',
  event: 'red',
  special: 'slate',
};

const CATEGORY_OPTIONS: { value: HonorCategory; label: string }[] = [
  { value: 'medal', label: 'Medal' },
  { value: 'charm', label: 'Charm' },
  { value: 'wealth', label: 'Wealth' },
  { value: 'event', label: 'Event' },
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
    editing?.category ?? 'medal',
  );
  const [iconUrl, setIconUrl] = useState(editing?.iconUrl ?? '');
  const [maxTier, setMaxTier] = useState(String(editing?.maxTier ?? 5));
  const [sortOrder, setSortOrder] = useState(String(editing?.sortOrder ?? 0));
  const [active, setActive] = useState(editing?.active ?? true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const body = {
        // Key is immutable on edit (admins shouldn't break the
        // task-system's stable handle to a row).
        ...(editing ? {} : { key: key.trim() }),
        name: name.trim(),
        description: description.trim(),
        category,
        iconUrl: iconUrl.trim(),
        maxTier: Number(maxTier) || 5,
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
                Max tier (1–5)
              </label>
              <Input
                type="number"
                min={1}
                max={5}
                value={maxTier}
                onChange={(e) => setMaxTier(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Icon URL
            </label>
            <Input
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/…/charm_star.png"
            />
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
